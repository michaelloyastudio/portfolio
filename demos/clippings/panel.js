// Clippings panel — browser side. The letters ship inside the panel (letters/,
// indexed by letters/letters.js). Previews your text with them, and on Add
// copies the previewed pieces (plus a few spares per character) next to the
// project and asks jsx/clippings.jsx (RS.*) to build them in the comp.
// Outside AE the preview and controls work as is; Add and Boil just toast.
(function () {
  var cep = window.__adobe_cep__;
  var $ = function (id) { return document.getElementById(id); };
  var toast = $('toast'), toastTimer = null;
  var KEY = 'clippings.opts.v5';
  var SAMPLE = 'Sample Text';
  var VARIANTS = 5;         // pieces per character folder, for Piece swaps and boil in AE
  var SMALL = 0.8;          // lowercase height
  var BOIL = 3;             // frames per boil step when Boil is on
  // same folder names as PUNCT in jsx/clippings.jsx
  var PUNCT = {
    '!': 'exclaim', '?': 'question', '&': 'amp', '.': 'period', ',': 'comma',
    "'": 'apos', '’': 'apos', '‘': 'apos', '-': 'dash', '–': 'dash', '—': 'dash',
    '"': 'quote', '“': 'quote', '”': 'quote', '$': 'dollar', '#': 'hash',
    ':': 'colon', '@': 'at', '/': 'slash', '*': 'star', '%': 'percent', '+': 'plus'
  };
  // pack keys are the plain characters
  var PACKKEY = { '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-' };
  var ALIGNS = ['left', 'center', 'right'];
  var opts = { text: '', align: 'center', mix: true, boil: false, seed: 1, pins: {} };
  var pack = null;          // {name, base, chars: {ch: [file]}, info: {file: {char, w, h}}, count}
  var busy = false;

  // ---------- basics ----------

  function say(msg, cls, ms) {
    toast.textContent = msg;
    toast.className = 'show ' + (cls || '');
    clearTimeout(toastTimer);
    if (ms !== 0) toastTimer = setTimeout(function () { toast.className = ''; }, ms || 2600);
  }

  function load() {
    var s = null, k;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!s) return;
    for (k in opts) if (s[k] !== undefined && typeof s[k] === typeof opts[k]) opts[k] = s[k];
    if (ALIGNS.indexOf(opts.align) < 0) opts.align = 'center';
    opts.mix = true;   // always mixed case now; the button is gone (v2.1)
  }
  function store() { try { localStorage.setItem(KEY, JSON.stringify(opts)); } catch (e) {} }

  function host(code, cb) {
    if (!cep) { say('Open this panel in After Effects', 'err'); return; }
    cep.evalScript(code, function (r) { cb(String(r === undefined || r === null ? '' : r)); });
  }

  function report(r) {
    if (r === 'EvalScript error.') say('Host script error (see jsx/clippings.jsx)', 'err');
    else if (r.indexOf('err:') === 0) say(r.slice(4), 'err', 4000);
    else if (r.indexOf('ok:') === 0 && r.length > 3) say(r.slice(3), 'ok', 3500);
  }

  function run(name, arg, cb) {
    var call = 'RS.run(' + [JSON.stringify(name), 'false', 'false', JSON.stringify(JSON.stringify(arg || {}))].join(',') + ')';
    host(call, function (r) { report(r); if (cb) cb(r); });
  }

  function hash(s) {
    var h = 2166136261, i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  // small seeded generator (mulberry32)
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function isUpper(c) { return c >= 'A' && c <= 'Z'; }
  function isLower(c) { return c >= 'a' && c <= 'z'; }
  function isDigit(c) { return c >= '0' && c <= '9'; }
  function other(c) { return isUpper(c) ? c.toLowerCase() : c.toUpperCase(); }

  // ---------- letters ----------
  // letters/letters.js (made by tools/bundle_letters.py) sets window.CLIPPINGS_LETTERS.
  // Previews load the PNGs by relative URL; Add reads them from the extension
  // folder on disk (base).

  function extDir() {
    var p = '';
    try { p = cep && cep.getSystemPath ? String(cep.getSystemPath('extension') || '') : ''; } catch (e) {}
    if (!p) p = location.pathname.replace(/\/[^\/]*$/, '');
    p = p.replace(/^file:\/\//, '');
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/^\/([A-Za-z]:)/, '$1').replace(/\/+$/, '');       // Windows: /C:/… → C:/…
  }

  function letters() {
    var L = window.CLIPPINGS_LETTERS, info = {}, f;
    if (!L || !L.chars) return null;
    for (f in L.info) info[f] = { w: L.info[f][0], h: L.info[f][1], char: L.info[f][2] };
    return { name: L.name, chars: L.chars, info: info, count: L.count, base: extDir() + '/letters' };
  }

  function packKey(ch) { return PACKKEY[ch] || ch; }

  // the pack file one position shows; a letter missing in its case falls back to the other case
  function packFile(ch, seed) {
    if (!pack) return null;
    var list = pack.chars[packKey(ch)] || [];
    if (!list.length && (isUpper(ch) || isLower(ch))) list = pack.chars[other(ch)] || [];
    return list.length ? list[seed % list.length] : null;
  }

  var imgs = {};
  function packImage(file) {
    if (imgs[file]) return imgs[file];
    var img = new Image();
    img.onload = function () { redraw(); };
    img.src = 'letters/' + file.split('/').map(encodeURIComponent).join('/');
    return (imgs[file] = img);
  }

  // ---------- what each position shows ----------

  function lines() {
    var t = opts.text.replace(/\r\n|\r/g, '\n'), out = [];
    if (!t.replace(/\s/g, '')) t = SAMPLE;
    t.split('\n').forEach(function (l) { l = l.replace(/^\s+|\s+$/g, ''); if (l) out.push(l); });
    return out;
  }

  // {ch, seed} for one position: pinned seed after a click, else from the shuffle seed.
  // Mixed case (always on): letters flip case at random.
  function slot(li, ci, ch) {
    var pin = opts.pins[li + ':' + ci], seed = pin || hash(opts.seed + '|' + li + '|' + ci + '|' + ch);
    if (opts.mix && (isUpper(ch) || isLower(ch)) && rng(seed ^ 0x5bd1e995)() < 0.5) ch = other(ch);
    return { ch: ch, seed: seed };
  }

  function piece(ch, seed) {
    var file = packFile(ch, seed);
    if (!file) return null;
    var inf = pack.info[file] || { w: 1, h: 1.3 }, img = packImage(file);
    return { img: img.complete && img.naturalWidth ? img : null, w: inf.w, h: inf.h, file: file };
  }

  // ---------- preview ----------

  var stage = $('stage'), sctx = stage.getContext('2d'), boxes = [], drawTimer = null;

  function draw() {
    var dpr = window.devicePixelRatio || 1, W = stage.clientWidth, H = stage.clientHeight;
    stage.width = Math.round(W * dpr); stage.height = Math.round(H * dpr);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.clearRect(0, 0, W, H);
    boxes = [];
    if (!pack) return;
    // same spacing as a fresh build in AE: 4% letter gap, 18% line gap, spaces 42%
    var L = lines(), rowH = 100, gap = rowH * 0.04, space = rowH * 0.42, step = rowH * 1.18, rows = [], maxW = 0;
    L.forEach(function (line, li) {
      var items = [], w = 0, k = 0;
      for (var ci = 0; ci < line.length; ci++) {
        var ch = line.charAt(ci);
        if (ch === ' ' || ch === '\t') { items.push(null); continue; }
        var s = slot(li, ci, ch), p = piece(s.ch, s.seed);
        if (!p) continue;                         // not in the pack: AE skips it too
        var h = rowH * (isLower(s.ch) ? SMALL : 1);
        items.push({ li: li, ci: ci, s: s, p: p, h: h, w: p.w / p.h * h });
      }
      items.forEach(function (it) { if (k++) w += gap; w += it ? it.w : space; });
      rows.push({ items: items, w: w });
      maxW = Math.max(maxW, w);
    });
    var totalH = rowH + step * (rows.length - 1), k = Math.min((W - 16) / Math.max(maxW, 1), (H - 16) / totalH);
    var a = ALIGNS.indexOf(opts.align) / 2;
    rows.forEach(function (row, li) {
      var x = W / 2 - maxW * k / 2 + (maxW - row.w) * k * a, y = H / 2 + (li - (rows.length - 1) / 2) * step * k, n = 0;
      row.items.forEach(function (it) {
        if (n++) x += gap * k;
        if (!it) { x += space * k; return; }
        var w = it.w * k, h = it.h * k, r = rng(it.s.seed ^ 0x2545f491), tilt = (r() * 2 - 1) * 6 * Math.PI / 180;
        sctx.save();
        sctx.translate(x + w / 2, y + (r() * 2 - 1) * 0.06 * rowH * k);
        sctx.rotate(tilt);
        sctx.shadowColor = 'rgba(0,0,0,0.35)'; sctx.shadowBlur = 3; sctx.shadowOffsetX = 1.5; sctx.shadowOffsetY = 1.5;
        if (it.p.img) sctx.drawImage(it.p.img, -w / 2, -h / 2, w, h);
        sctx.restore();
        boxes.push({ x: x, y: y - rowH * k / 2, w: w, h: rowH * k, li: it.li, ci: it.ci });
        x += w;
      });
    });
  }

  function redraw(now) {
    clearTimeout(drawTimer);
    if (now) draw(); else drawTimer = setTimeout(draw, 60);
  }

  // click a letter: pin a new seed that shows a different piece
  stage.onclick = function (ev) {
    var r = stage.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top, i, b;
    for (i = boxes.length - 1; i >= 0; i--) {
      b = boxes[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        var key = b.li + ':' + b.ci, ch = lines()[b.li].charAt(b.ci), cell = b;
        var now = function () { var s = slot(cell.li, cell.ci, ch); return packFile(s.ch, s.seed); }, was = now(), n = 0;
        do { opts.pins[key] = 1 + Math.floor(Math.random() * 4e9); } while (n++ < 12 && now() === was);
        store(); redraw(true);
        return;
      }
    }
  };
  $('shuffle').onclick = function () { opts.seed = 1 + Math.floor(Math.random() * 1e9); opts.pins = {}; store(); redraw(true); };
  window.addEventListener('resize', function () { redraw(); });

  // ---------- controls ----------

  function syncUI() {
    if (document.activeElement !== $('text')) $('text').value = opts.text;
    $('boil').classList.toggle('on', opts.boil);
    [].forEach.call($('align').children, function (b) { b.classList.toggle('on', b.getAttribute('data-a') === opts.align); });
  }

  $('text').oninput = function () { opts.text = this.value; opts.pins = {}; store(); redraw(); };
  $('text').onkeydown = function (ev) {
    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); $('add').click(); }
  };
  [].forEach.call($('align').children, function (b) {
    b.onclick = function () { opts.align = b.getAttribute('data-a'); store(); syncUI(); redraw(true); };
  });
  // Boil: new builds boil; a selected group in the comp switches too
  $('boil').onclick = function () {
    opts.boil = !opts.boil; store(); syncUI();
    if (cep) run('boil', { boil: opts.boil ? BOIL : 0 });
  };

  // ---------- Add ----------

  function folderOf(ch) {
    if (isUpper(ch)) return 'Upper/' + ch;
    if (isLower(ch)) return 'Lower/' + ch;
    if (isDigit(ch)) return 'Digits/' + ch;
    if (PUNCT[ch]) return 'Punct/' + PUNCT[ch];
    var h = ch.charCodeAt(0).toString(16).toUpperCase();
    while (h.length < 4) h = '0' + h;
    return 'Other/u' + h;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Every pack file to copy: the previewed ones first (pinned to their positions),
  // then spares so each character folder has up to VARIANTS pieces. With Mixed
  // case the other case gets a few too, since AE mixes both.
  function plan(L) {
    var jobs = [], fixed = {}, per = {}, seen = {}, add = function (ch, src) {
      var f = folderOf(ch);
      per[f] = per[f] || [];
      if (seen[f + src]) return seen[f + src];
      per[f].push(src);
      var file = f.split('/').pop() + '_' + pad(per[f].length) + '.png';
      jobs.push({ ch: ch, path: f + '/' + file, src: src });
      return (seen[f + src] = ch + '/' + file);
    };
    // the pack file for (ch, seed), filed under the character it really is
    var take = function (ch, seed) {
      var src = packFile(ch, seed);
      return src ? add((pack.info[src] || {}).char || ch, src) : null;
    };
    L.forEach(function (line, li) {
      for (var ci = 0; ci < line.length; ci++) {
        var ch = line.charAt(ci);
        if (ch === ' ' || ch === '\t') continue;
        var s = slot(li, ci, ch), got = take(s.ch, s.seed);
        if (got) fixed[li + ':' + ci] = got;
      }
    });
    Object.keys(per).forEach(function (f) {
      var ch = jobs.filter(function (j) { return folderOf(j.ch) === f; })[0].ch, k = 0;
      var cap = Math.min(VARIANTS, (pack.chars[packKey(ch)] || []).length);
      while (per[f].length < cap && k < 60) take(ch, hash(opts.seed + '|x|' + ch + '|' + k++));
      if (opts.mix && (isUpper(ch) || isLower(ch)) && !per[folderOf(other(ch))]) {
        for (k = 0; k < Math.ceil(VARIANTS / 2); k++) take(other(ch), hash(opts.seed + '|o|' + ch + '|' + k));
      }
    });
    return { jobs: jobs, fixed: fixed };
  }

  function mkdirs(base, rel) {
    var parts = rel.split('/'), p = base, i;
    for (i = 0; i < parts.length - 1; i++) { p += '/' + parts[i]; window.cep.fs.makedir(p); }
  }

  $('add').onclick = function () {
    if (busy) return;
    var L = lines();
    if (!opts.text.replace(/\s/g, '')) { say('Type something first', 'err'); return; }
    if (!pack) { say('The letters are missing: reinstall Clippings', 'err', 5000); return; }
    if (!cep) { say('Open this panel in After Effects', 'err'); return; }
    var P = plan(L), i = 0, done = function () { busy = false; $('add').disabled = false; };
    busy = true; $('add').disabled = true;
    host('RS.outDir()', function (r) {
      if (r.indexOf('ok:') !== 0) { done(); report(r); return; }
      var dir = r.slice(3);
      (function next() {
        if (i >= P.jobs.length) {
          say('Building…', '', 0);
          run('build', { lib: dir, text: L.join('\n'), fixed: P.fixed, align: opts.align, mix: opts.mix, small: true,
                         boil: opts.boil ? BOIL : 0 }, done);
          return;
        }
        var j = P.jobs[i++];
        say('Copying letters ' + i + ' / ' + P.jobs.length, '', 0);
        var rd = window.cep.fs.readFile(pack.base + '/' + j.src, window.cep.encoding.Base64);
        if (!rd || rd.err || !rd.data) { done(); say('Couldn’t read ' + j.src, 'err', 5000); return; }
        mkdirs(dir, j.path);
        var w = window.cep.fs.writeFile(dir + '/' + j.path, rd.data, window.cep.encoding.Base64);
        if (w && w.err) { done(); say('Couldn’t write ' + j.path, 'err', 5000); return; }
        setTimeout(next, 0);
      })();
    });
  };

  // ---------- start ----------

  load();
  pack = letters();
  syncUI();
  redraw(true);

  window.ClippingsPanel = { plan: function () { return plan(lines()); }, opts: opts, draw: draw, boxes: function () { return boxes; },
                         pack: function () { return pack; } };
})();
