// Receipts panel — browser side. One button: find the viewer + timeline, step the
// comp through jsx/receipts.jsx while helper/bin/bscap screenshots it, render,
// and build the video with ffmpeg via lib/compose.js.
(function () {
  var cep = window.__adobe_cep__;
  var C = window.Compose, P = window.Platform;
  var $ = function (id) { return document.getElementById(id); };
  var hasNode = typeof require === 'function';
  var cp = hasNode && require('child_process'), fs = hasNode && require('fs');
  var path = hasNode && require('path'), os = hasNode && require('os');

  var PLAT = hasNode ? os.platform() : 'darwin';   // 'darwin' | 'win32' (lib/platform.js)
  var EXT = cep ? P.extensionPath(cep.getSystemPath('extension'), PLAT) : '';
  var BINS = P.bins(EXT, PLAT), HELPER = BINS.helper;
  // the ffmpeg shipped in bin/ (LGPL, hardware H.264), else a Homebrew one (dev machines)
  var FFMPEG = hasNode ? BINS.ffmpegs.filter(function (f) { return fs.existsSync(f); })[0] : null;
  var ENCODER = C.encoderFor(PLAT, FFMPEG === BINS.bundled);
  var TMP = hasNode ? path.join(os.tmpdir(), 'receipts') : '';
  var PERMISSION = P.texts(PLAT).permission, MISSING = P.texts(PLAT).missing;
  $('reveal').textContent = P.texts(PLAT).reveal;   // Finder / File Explorer
  var QUIET = { windowsHide: true };   // no console window flashing up on Windows

  var KEY = 'receipts.ui.v3';
  var SETTLE_MS = 160;   // the viewer has to sit still this long before a frame counts as drawn
  var ui = {
    layout: 'stack', swap: false, format: '9:16', range: 'work', renderMode: 'render',
    names: true, bg: true,
    last: ''
  };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) for (var k in ui) if (saved[k] !== undefined) ui[k] = saved[k];
  } catch (e) {}
  // A picked render lives only as long as the panel, so every opening starts
  // on AE renders it: "Use my file" with no file behind it was lit after a restart.
  ui.renderMode = 'render';
  ui.format = '9:16';   // 16:9 is out of the panel (Nov 2026); compose still knows it
  function store() { try { localStorage.setItem(KEY, JSON.stringify(ui)); } catch (e) {} }

  var sess = null, busy = false, stopFlag = false, lastOut = '', winId = 0;
  var outFile = '';   // where GENERATE's video goes (its Save dialog)

  // ---------- plumbing ----------

  var toastTimer = null;
  function say(msg, cls, ms) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'show ' + (cls || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ''; }, ms || 3200);
  }
  function oops(e) { say(e && e.message ? e.message : String(e), 'err', 7000); }

  function host(name, arg) {
    return new Promise(function (res, rej) {
      if (!cep) return rej(new Error('Not running inside After Effects'));
      var a = typeof arg === 'string' ? arg : JSON.stringify(arg || {});
      cep.evalScript('BS.run(' + JSON.stringify(name) + ',' + JSON.stringify(a) + ')', function (r) {
        var o;
        try { o = JSON.parse(r); } catch (e) { return rej(new Error(r === 'EvalScript error.' ? 'Host script error (jsx/receipts.jsx)' : 'Bad reply: ' + r)); }
        if (o.ok) res(o); else rej(new Error(o.err));
      });
    });
  }

  function helperErr(o) {
    var e = new Error(o.permission ? PERMISSION : o.err || 'capture helper failed');
    e.access = !!o.access;
    return e;
  }

  function helper(args) {
    return new Promise(function (res, rej) {
      cp.execFile(HELPER, args, { maxBuffer: 1 << 24, windowsHide: true }, function (e, stdout) {
        var line = String(stdout || '').trim().split('\n').pop(), o;
        try { o = JSON.parse(line); } catch (x) { return rej(e || new Error('helper: ' + stdout)); }
        if (!o.ok) return rej(helperErr(o));
        res(o);
      });
    });
  }

  // Long-running bscap serve: one JSON line out per JSON line in.
  function Serve() {
    var p = cp.spawn(HELPER, ['serve'], QUIET), buf = '', waiting = [];
    p.stdout.on('data', function (d) {
      buf += d;
      var i;
      while ((i = buf.indexOf('\n')) >= 0) {
        var line = buf.slice(0, i), w = waiting.shift();
        buf = buf.slice(i + 1);
        if (!w) continue;
        try { var o = JSON.parse(line); o.ok ? w.res(o) : w.rej(helperErr(o)); } catch (e) { w.rej(e); }
      }
    });
    p.on('exit', function () {
      waiting.forEach(function (w) { w.rej(new Error('Capture helper stopped')); });
      waiting = [];
    });
    this.send = function (obj) {
      return new Promise(function (res, rej) {
        waiting.push({ res: res, rej: rej });
        p.stdin.write(JSON.stringify(obj) + '\n');
      });
    };
    this.quit = function () { try { p.stdin.write('{"cmd":"quit"}\n'); p.stdin.end(); } catch (e) {} };
  }

  function ffmpeg(args, onProg, total) {
    return new Promise(function (res, rej) {
      if (!FFMPEG) return rej(new Error('ffmpeg is missing from the Receipts install. Reinstall Receipts.'));
      var a = onProg ? ['-progress', 'pipe:1', '-nostats'].concat(args) : args;
      var p = cp.spawn(FFMPEG, a, QUIET), err = '';
      p.stderr.on('data', function (d) { err += d; });
      if (onProg) p.stdout.on('data', function (d) {
        var m = String(d).match(/out_time_(?:us|ms)=(\d+)/g);
        if (m) onProg(Math.min(1, +m[m.length - 1].split('=')[1] / 1e6 / total));
      });
      p.on('error', rej);
      p.on('close', function (code) {
        code === 0 ? res() : rej(new Error('ffmpeg: ' + err.trim().split('\n').slice(-2).join(' ')));
      });
    });
  }

  function mkdirp(d) { fs.mkdirSync(d, { recursive: true }); }
  function fileUrl(p) { return P.fileUrl(p, PLAT) + '?' + Date.now(); }
  function clock(s) {
    var m = Math.floor(s / 60), r = s - m * 60;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1);
  }

  // Frames, the clean render and previews live in the temp folder; only the last capture is
  // kept (so REBUILD works) and the system clears it anyway. The finished video is the one
  // file that lands in the project.
  var SESSIONS = TMP && path.join(TMP, 'sessions');
  function freshSessionDir(name) {
    mkdirp(SESSIONS);
    fs.readdirSync(SESSIONS).forEach(function (d) { fs.rmSync(path.join(SESSIONS, d), { recursive: true, force: true }); });
    var dir = path.join(SESSIONS, name);
    mkdirp(dir);
    return dir;
  }

  // Mike's layout: <project>/01_Project_Files/x.aep → video in <project>/05_Exports.
  // Otherwise next to the .aep, or ~/Movies (Windows: Videos) for an unsaved project.
  function projectRoot(aep) {
    if (!aep) return null;
    var d = path.dirname(aep);
    return /^01_Project_Files$/i.test(path.basename(d)) ? path.dirname(d) : null;
  }
  function exportsDir(s) {
    var root = projectRoot(s.aep);
    if (root) return path.join(root, '05_Exports');
    return s.aep ? path.dirname(s.aep) : path.join(os.homedir(), P.videosFolder(PLAT));
  }

  // ---------- progress ----------

  var t0 = 0;
  function stage(text, frac, detail) {
    $('prog').hidden = false;
    $('stage').textContent = text;
    $('progBar').style.width = Math.round((frac || 0) * 100) + '%';
    $('progTx').textContent = detail || '';
  }
  function setBusy(b) {
    busy = b;
    $('make').disabled = b; $('peek').disabled = b;
    if (!b) { $('prog').hidden = true; $('stop').hidden = true; }
  }

  // ---------- options ----------

  // bool: the buttons hold "true" / "false" and the setting is stored as a boolean
  function seg(id, key, after, bool) {
    var bs = $(id).querySelectorAll('button');
    segPaint[key] = paint;
    function paint() { for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-v') === String(ui[key])); }
    for (var i = 0; i < bs.length; i++) bs[i].addEventListener('click', function () {
      if (busy) return;
      var v = this.getAttribute('data-v');
      ui[key] = bool ? v === 'true' : v;
      store(); paint(); this.blur();
      if (after) after(ui[key]);
    });
    paint();
  }
  var segPaint = {};
  seg('range', 'range', function () {
    poll();
    // your file starts at the range's start, so the preview's frame from it moves with Range
    if (ui.renderMode === 'file') lookRender().then(thumbs).catch(oops);
  });
  seg('names', 'names', function () { thumbs(); }, true);
  seg('top', 'swap', function () { drawLayoutBoxes(); thumbs(); }, true);
  seg('bg', 'bg', function () { paintBg(); thumbs(); }, true);
  function paintBg() { $('layouts').classList.toggle('nobg', !ui.bg); }
  // Render redraws the look cards too: the preview's frame from your file, or AE's own
  seg('renderMode', 'renderMode', function (v) {
    (v === 'file' ? pickRender() : Promise.resolve())
      .catch(function (e) { if (e.message !== 'cancelled') oops(e); })
      .then(lookRender).then(thumbs).catch(oops);
  });

  var pickedRender = '';
  async function pickRender() {
    var r;
    try { r = await host('pickFile'); } catch (e) {
      // cancelled with nothing picked before: back to AE renders it, rather
      // than leaving "Use my file" lit with no file behind it
      if (e.message === 'cancelled' && !pickedRender) { ui.renderMode = 'render'; store(); segPaint.renderMode(); }
      throw e;
    }
    pickedRender = r.file;
    say('Using ' + path.basename(r.file), 'ok');
    return r.file;
  }

  // ---------- layouts ----------

  var SRC_COLORS = { render: '#d9d9d9', viewer: 'var(--viewer)', timeline: 'var(--timeline)' };
  var layoutBtns = {};
  Object.keys(C.LAYOUTS).forEach(function (id) {
    var L = C.LAYOUTS[id], b = document.createElement('button'), th = document.createElement('div');
    th.className = 'th';
    b.appendChild(th);
    b.appendChild(document.createTextNode(L.label));
    b.title = { stack: 'Render, viewer, timeline: the classic process video', split: 'Render and viewer, half and half', viewer: 'One picture (whichever is Primary) and the timeline', handles: 'Just the viewer with its handles: no timeline, no render' }[id] || L.label;
    b.addEventListener('click', function () {
      if (busy) return;
      ui.layout = id; store(); paintLayouts();
    });
    layoutBtns[id] = { b: b, th: th };
    $('layouts').appendChild(b);
  });
  // stand-in boxes until a capture gives real thumbnails
  function drawLayoutBoxes() {
    for (var id in layoutBtns) {
      var th = layoutBtns[id].th;
      [].slice.call(th.querySelectorAll('b')).forEach(function (b) { b.remove(); });
      var F = C.FORMATS[ui.format] || C.FORMATS['9:16'];
      C.plan(id, { render: true, viewer: true, timeline: true }, { render: 16 / 9, viewer: 16 / 9, timeline: 4 }, ui.swap, ui.format).forEach(function (bx) {
        var i = document.createElement('b');
        i.style.left = bx.x / F.w * 100 + '%'; i.style.width = bx.w / F.w * 100 + '%';
        i.style.top = bx.y / F.h * 100 + '%'; i.style.height = bx.h / F.h * 100 + '%';
        i.style.setProperty('--c', SRC_COLORS[bx.src]);
        i.hidden = !!th.style.backgroundImage;
        th.appendChild(i);
      });
    }
  }
  if (!C.LAYOUTS[ui.layout]) ui.layout = 'stack';
  paintBg();
  drawLayoutBoxes();
  function paintLayouts() {
    for (var id in layoutBtns) layoutBtns[id].b.classList.toggle('on', ui.layout === id);
    // Primary only matters when the look shows the render or picks one picture (Handles shows neither)
    var s = C.LAYOUTS[ui.layout].srcs;
    $('top').parentNode.classList.toggle('off', s.indexOf('top') < 0 && s.indexOf('render') < 0);
  }

  // ---------- framing ----------

  async function aeWindow() {
    var r = await helper(['windows']);
    if (!r.windows.length) throw new Error('No After Effects window on screen');
    winId = r.windows[0].id;
    return winId;
  }

  // Times to move the playhead to for spotting the timeline: far first (more precise), nearer
  // when AE's timeline is zoomed in and the far one is off screen.
  function tBs(info) {
    var tA = info.time, d = info.dur, f = 1 / info.fps;
    return [0.3, 0.1, 0.03, 0.01].map(function (k) {
      var s = Math.max(d * k, 3 * f);
      return tA + s <= d - f ? tA + s : Math.max(0, tA - s);
    });
  }

  // Cover the comp with a magenta solid (finds the viewer), then nudge the playhead
  // (finds the timeline). If the comp is cut off, tiny or oversized in the viewer, zoom the
  // viewer to fit it and look again. Takes a second or two; AE's state is put back afterwards
  // (the zoom by unzoom(), once the capture's done).
  async function detectFraming(info) {
    mkdirp(TMP);
    var a = path.join(TMP, 'probe_a.jpg'), b = path.join(TMP, 'probe_b.jpg'), c = path.join(TMP, 'snap.jpg');
    var tA = info.time, d = info.dur, times = tBs(info), tB = times[0], r;
    var zoom = (await host('view', {}).catch(function () { return {}; })).zoom;
    var cw = info.w * (info.pa || 1), good = null, last = false;
    for (var pass = 0; pass < 5; pass++) {
      try {
        await host('probe', { phase: 'on', t: tA });
        await helper(['snap', String(winId), a, '250']);
        await host('probe', { phase: 'off' });
        await helper(['snap', String(winId), b, '250']);
        for (var i = 0; i < times.length; i++) {
          await host('probe', { phase: 'time', t: times[i] });
          await helper(['snap', String(winId), c, '250']);
          r = await helper(['detect', a, b, c, JSON.stringify({ tA: tA, tB: times[i], dur: d })]);
          if (r.moved || !r.viewer) { tB = times[i]; times = [tB]; break; }
        }
      } finally {
        await host('probe', { phase: 'restore' }).catch(function () {});
      }
      if (!r.viewer || !zoom || last) break;
      var fit = C.fitZoom(r, cw, info.h, zoom);
      if (fit.ok) break;
      if (!fit.cut) good = zoom;   // all of it showed, just not big
      else if (good) { fit.zoom = good; last = true; }   // bigger cut it off (viewer panned): go back
      if (pass === 4) {
        if (fit.cut) throw new Error("Couldn't get the whole comp in the viewer. Press Shift+/ over the viewer to fit it, then try again.");
        break;
      }
      zoom = (await host('view', { zoom: fit.zoom })).zoom || fit.zoom;
    }
    if (!r.viewer) throw new Error("Couldn't find the comp in the viewer. Show it in the Composition panel and try again.");
    r.tB = tB;
    return r;
  }
  function unzoom() { return host('view', { restore: true }).catch(function () {}); }

  // The whole timeline as one still: maximize the timeline panel (` with the pointer over it),
  // shoot it at two times (to map time to pixels and erase the playhead), scroll through every
  // layer, then put the panel, scroll and pointer back. Falls back to the visible timeline.
  async function grabTimeline(info, tl, dir, tB) {
    var out = path.join(dir, 'timeline_full.png');
    var tA = info.time, d = info.dur;
    var a = path.join(TMP, 'tl_a.png'), b = path.join(TMP, 'tl_b.png');
    var at = JSON.stringify({ x: tl.x + tl.w * 0.5, y: tl.y + tl.h * 0.6 }), geo = JSON.stringify({ tA: tA, tB: tB, dur: d });
    try {
      await host('probe', { phase: 'focus' });
      var m = await helper(['panel', String(winId), at]);
      var r;
      try {
        await host('probe', { phase: 'time', t: tA });
        await helper(['snap', String(winId), a, '250']);
        await host('probe', { phase: 'time', t: tB });
        await helper(['snap', String(winId), b, '250']);
        r = await helper(['tlstitch', String(winId), a, b, out, geo]);
      } finally {
        await helper(['panel', String(winId), JSON.stringify({ x: tl.x + tl.w * 0.5, y: tl.y + tl.h * 0.6, back: m.cursor })]).catch(function () {});
        await host('probe', { phase: 'restore' }).catch(function () {});
      }
      // AE's layout should look just like it did before
      var after = path.join(TMP, 'after.jpg');
      await helper(['snap', String(winId), after, '250']);
      var same = await helper(['diff', path.join(TMP, 'probe_b.jpg'), after]);
      if (same.diff > 6 || r.restored === false) say("AE's timeline may not be back exactly as it was (press ` over it if it's still full size)", 'err', 8000);
      return r;
    } catch (e) {
      say(e.access ? e.message + ' Using the layers on screen this time.' : 'Showing the layers on screen (' + e.message + ')', 'err', 8000);
      return await helper(['tlshot', path.join(TMP, 'probe_b.jpg'), path.join(TMP, 'snap.jpg'), out, geo]);
    }
  }

  // ---------- the one button ----------

  // Where the viewer and timeline are, plus the whole-timeline still (into dir).
  // → {regions (for the capture helper), viewerComp, shot}
  async function frame(info, dir, p) {
    stage('Finding the viewer and timeline…', p);
    var shot = null, d = await detectFraming(info);
    var regions = [{ name: 'viewer', r: d.viewer }];
    if (d.timeline) {
      stage('Shooting the whole timeline…', p + 0.02);
      shot = await grabTimeline(info, d.timeline, dir, d.tB).catch(function () { return null; });
      // still watched while capturing: its playhead moving says AE has started the next frame
      regions.push({ name: 'timeline', r: d.timeline, save: !shot });
    }
    else say("Couldn't spot the timeline; making the video without it", 'err', 5000);
    regions = regions.map(function (x) { return { name: x.name, x: x.r.x, y: x.r.y, w: x.r.w, h: x.r.h, save: x.save !== false }; });
    return { regions: regions, viewerComp: d.comp, shot: shot };
  }

  // ---------- preview ----------
  // One frame at the playhead, framed and laid out exactly like the video: the viewer with
  // every guide, the whole timeline and a rendered still of the comp. Lives in the temp folder.

  var PREVIEW = TMP && path.join(TMP, 'preview');
  var look = null;   // compose options for the last preview; the look cards are drawn from it

  function waitForFile(f, ms) {
    return new Promise(function (res) {
      var t = Date.now(), last = -1;
      (function check() {
        var size = fs.existsSync(f) ? fs.statSync(f).size : -1;
        if (size > 0 && size === last) return res(true);
        last = size;
        if (Date.now() - t > ms) return res(false);
        setTimeout(check, 150);
      })();
    });
  }

  // The rendered frame at comp time t: from your file (it starts at the range's start, ws = the
  // work area's) or AE's own, render_file.png / render.png in dir.
  async function renderStill(t, ws, dir) {
    if (ui.renderMode === 'file' && pickedRender) {
      var cut = path.join(dir, 'render_file.png'), start = ui.range === 'work' ? ws : 0;
      await ffmpeg(['-hide_banner', '-y', '-loglevel', 'error', '-ss', String(Math.max(0, t - start)), '-i', pickedRender, '-frames:v', '1', cut]);
      return cut;
    }
    var out = path.join(dir, 'render.png');
    await host('still', { t: t, file: out });
    return (await waitForFile(out, 20000)) ? out : null;
  }
  // Render changed after a preview: swap the preview's rendered frame to match (AE's is shot
  // once and kept; the file's is cut again, the file may have changed).
  async function lookRender() {
    if (!look || busy) return;
    var ae = path.join(PREVIEW, 'render.png'), still;
    if (ui.renderMode !== 'file' && fs.existsSync(ae)) still = ae;
    else still = await renderStill(look.start, look.ws || 0, PREVIEW).catch(function () { return null; });
    look.render = still || 'placeholder';
    fs.writeFileSync(path.join(PREVIEW, 'look.json'), JSON.stringify(look));
  }

  async function preview() {
    if (busy) return;
    if (!fs.existsSync(HELPER)) throw new Error(MISSING);
    setBusy(true); stopFlag = false; t0 = Date.now();
    try {
      var info = await host('info');
      await aeWindow();
      fs.rmSync(PREVIEW, { recursive: true, force: true });
      mkdirp(PREVIEW);
      var fr = await frame(info, PREVIEW, 0.1);

      stage('Shooting the viewer…', 0.6);
      var srv = new Serve(), r;
      try {
        await srv.send({ cmd: 'reset' });
        await host('begin');
        await host('go', String(info.time));
        r = await srv.send({ cmd: 'cap', window: winId, dir: PREVIEW, index: 1, regions: fr.regions, settleMs: SETTLE_MS, maxMs: 8000, minMs: 60 });
      } finally {
        await host('end').catch(function () {});
        await unzoom();
        srv.quit();
      }

      stage('Rendering one frame…', 0.8);
      var still = await renderStill(info.time, info.ws, PREVIEW).catch(function () { return null; });
      if (!still) say("Couldn't render a frame; the render box is a stand-in", 'err', 5000);

      var shot = fr.shot;
      look = {
        dir: PREVIEW, count: 1, fps: info.fps, start: info.time, ws: info.ws, render: still || 'placeholder',
        regions: fr.regions.map(function (x) { return x.name; }),
        viewerComp: fr.viewerComp, viewerSize: r.sizes && r.sizes.viewer, timelineSize: r.sizes && r.sizes.timeline,
        compAspect: info.w * (info.pa || 1) / info.h,
        timelineShot: shot && { file: path.join(PREVIEW, 'timeline_full.png'), w: shot.w, h: shot.h, t0: shot.t0, t1: shot.t1, gx0: shot.gx0 },
        created: Date.now()
      };
      fs.writeFileSync(path.join(PREVIEW, 'look.json'), JSON.stringify(look));
      await thumbs();
    } finally {
      await unzoom();
      setBusy(false);
    }
  }

  async function make() {
    if (busy) return;
    if (!fs.existsSync(HELPER)) throw new Error(MISSING);
    if (ui.renderMode === 'file' && C.needsRender(ui.layout, ui.swap) && !pickedRender) await pickRender();
    // where the video goes, asked up front so nobody waits through a capture to be asked
    var info0 = await host('info'), outDir = exportsDir({ aep: info0.aep });
    if (projectRoot(info0.aep)) mkdirp(outDir);
    var suggest = C.outName(info0.name, fs.existsSync(outDir) ? fs.readdirSync(outDir) : [], null, ui.format);
    var picked;
    try { picked = await host('pickOut', { path: path.join(fs.existsSync(outDir) ? outDir : os.homedir(), suggest) }); }
    catch (e) { if (e.message === 'cancelled') return; throw e; }
    outFile = picked.file;
    setBusy(true); stopFlag = false; t0 = Date.now();
    try {
      var info = await host('info');
      await aeWindow();
      var now = new Date(), stamp = C.yymmdd(now) + '_' + String(now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds() + 1000000).slice(1);
      var dir = freshSessionDir(C.safe(info.name) + '_' + stamp);

      var fr = await frame(info, dir, 0.02), regions = fr.regions, viewerComp = fr.viewerComp, shot = fr.shot;

      // capture
      var fps = info.fps;
      var startF = Math.round((ui.range === 'work' ? info.ws : 0) * fps);
      var count = Math.max(1, Math.round((ui.range === 'work' ? info.wd : info.dur) * fps));
      var srv = new Serve(), n = 0, sizes = null, tc = Date.now();
      $('stop').hidden = false;
      try {
        await srv.send({ cmd: 'reset' });
        await host('begin');
        for (var i = 0; i < count && !stopFlag; i++) {
          await host('go', String((startF + i) / fps));
          var r = await srv.send({ cmd: 'cap', window: winId, dir: dir, index: i + 1, regions: regions, settleMs: SETTLE_MS, maxMs: 8000, minMs: 60 });
          if (!sizes) sizes = r.sizes;
          n = i + 1;
          var left = (Date.now() - tc) / n * (count - n) / 1000;
          stage('Capturing', 0.05 + 0.7 * n / count, n + ' / ' + count + (n > 2 ? '  ·  ' + clock(left) + ' left' : ''));
        }
      } finally {
        await host('end').catch(function () {});
        await unzoom();
        srv.quit();
        $('stop').hidden = true;
      }
      if (n < 2) throw new Error('Nothing captured');

      sess = {
        dir: dir, comp: info.name, aep: info.aep, fps: fps, step: 1, start: startF / fps, count: n,
        compDur: info.dur, compAspect: info.w * (info.pa || 1) / info.h, regions: regions.map(function (x) { return x.name; }),
        viewerComp: viewerComp, viewerSize: sizes && sizes.viewer, timelineSize: sizes && sizes.timeline,
        timelineShot: shot && { file: 'timeline_full.png', w: shot.w, h: shot.h, t0: shot.t0, t1: shot.t1, gx0: shot.gx0, pages: shot.pages },
        render: null, created: Date.now()
      };
      saveSess();
      ui.last = dir; store();

      await build();
    } finally {
      await unzoom();
      setBusy(false);
    }
  }

  async function ensureRender() {
    if (renderReady()) return;
    if (ui.renderMode === 'file') {
      sess.render = pickedRender || await pickRender();
    } else {
      stage('Rendering in After Effects…', 0.85);
      var r = await host('render', { start: sess.start, dur: dur(), out: path.join(sess.dir, 'render') });
      sess.render = r.file;
    }
    saveSess();
  }

  async function build() {
    if (!sess) return;
    if (C.needsRender(ui.layout, ui.swap)) await ensureRender();
    stage('Building the video…', 0.9);
    var out = outFile;
    if (!out) {   // no Save dialog answer (shouldn't happen): the old default spot
      var dir = exportsDir(sess);
      mkdirp(dir);
      out = path.join(dir, C.outName(sess.comp, fs.readdirSync(dir), null, ui.format));
    }
    mkdirp(path.dirname(out));
    await encode(out);
    lastOut = out;
    $('reveal').hidden = false;
    say('Saved ' + path.basename(out) + ' in ' + clock((Date.now() - t0) / 1000), 'ok', 6000);
    thumbs();
  }

  // The video, with the first encoder setup ffmpeg takes (C.encodeAttempts: on Windows the GPU's
  // encoder, then Windows' own, upright or sideways; on a Mac there's just the one).
  async function encode(out) {
    var tries = C.encodeAttempts(ENCODER, ui.format), err = null;
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i], target = t.sideways ? path.join(sess.dir, 'sideways.mp4') : out;
      var opts = composeOpts(ui.layout, Object.assign({ out: target, encoder: ENCODER }, t));
      if (opts.render === 'placeholder') opts.render = null;
      try {
        await ffmpeg(C.args(opts), function (f) { stage('Building the video…', 0.9 + 0.1 * f, Math.round(f * 100) + '%'); }, dur());
        if (t.sideways) {
          await ffmpeg(C.rotateArgs(target, out));
          fs.rmSync(target, { force: true });
        }
        return;
      } catch (e) {
        err = e;
        if (i < tries.length - 1) try { fs.rmSync(target, { force: true }); } catch (x) {}
      }
    }
    throw err;
  }

  $('peek').addEventListener('click', function () { preview().catch(function (e) { setBusy(false); oops(e); }); });
  $('make').addEventListener('click', function () { make().catch(function (e) { setBusy(false); if (e.message !== 'cancelled') oops(e); }); });
  $('stop').addEventListener('click', function () { stopFlag = true; });
  window.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') stopFlag = true; });
  $('reveal').addEventListener('click', function () {
    if (!lastOut) return;
    var r = P.reveal(lastOut, PLAT);
    cp.execFile(r[0], r[1], r[2], function () {});
  });

  // ---------- session + result ----------

  function saveSess() { fs.writeFileSync(path.join(sess.dir, 'session.json'), JSON.stringify(sess, null, 1)); }
  function loadSess(dir) {
    try { sess = JSON.parse(fs.readFileSync(path.join(dir, 'session.json'), 'utf8')); sess.dir = dir; return true; }
    catch (e) { return false; }
  }
  function dur() { return sess.count * sess.step / sess.fps; }
  function renderReady() { return !!(sess && sess.render && fs.existsSync(sess.render)); }

  function composeOpts(layout, extra) {
    var o = {
      layout: layout, swap: ui.swap, names: ui.names, format: ui.format, bg: ui.bg, dir: sess.dir, count: sess.count, fps: sess.fps / (sess.step || 1),
      render: renderReady() ? sess.render : 'placeholder', regions: sess.regions,
      viewerComp: sess.viewerComp, viewerSize: sess.viewerSize, timelineSize: sess.timelineSize, compAspect: sess.compAspect,
      start: sess.start, timelineShot: sess.timelineShot && Object.assign({}, sess.timelineShot, { file: path.join(sess.dir, sess.timelineShot.file) })
    };
    for (var k in extra) o[k] = extra[k];
    return o;
  }

  // The three look cards show the newest capture (a preview or the last video) in each look.
  var thumbBusy = false, thumbAgain = false;
  function thumbSource(layout) {
    var useLook = look && (!sess || (look.created || 0) >= (sess.created || 0));
    if (useLook) {
      var o = Object.assign({}, look, { layout: layout, swap: ui.swap, names: ui.names, format: ui.format, bg: ui.bg, preview: 0 });
      if (!C.needsRender(layout, ui.swap) && o.render === 'placeholder') o.render = null;
      return o;
    }
    return sess ? composeOpts(layout, { preview: dur() * 0.4 }) : null;
  }
  async function thumbs() {
    if (!hasNode || (!look && !sess)) return;
    if (thumbBusy) { thumbAgain = true; return; }
    thumbBusy = true;
    var dir = path.join(TMP, 'thumbs'), ids = Object.keys(C.LAYOUTS);
    mkdirp(dir);
    for (var i = 0; i < ids.length; i++) {
      var out = path.join(dir, ids[i] + '.jpg'), o = thumbSource(ids[i]);
      try {
        o.out = out;
        await ffmpeg(C.args(o));
        var th = layoutBtns[ids[i]].th;
        th.style.backgroundImage = 'url("' + fileUrl(out) + '")';
        [].forEach.call(th.querySelectorAll('b'), function (b) { b.hidden = true; });
      } catch (e) {}
    }
    thumbBusy = false;
    if (thumbAgain) { thumbAgain = false; thumbs(); }
  }

  // ---------- comp readout ----------

  function poll() {
    if (busy || !cep) return;
    host('info').then(function (i) {
      var span = ui.range === 'work' ? i.wd : i.dur, n = Math.round(span * i.fps);
      $('comp').textContent = i.name + '  ·  ' + clock(span) + '  ·  ' + n + ' frames' + (n > 900 ? '  (long: set a work area?)' : '');
    }).catch(function () { $('comp').textContent = 'Open a comp'; });
  }

  // ---------- start ----------

  paintLayouts();
  if (!hasNode) say('Node is off for this panel (check the manifest)', 'err', 8000);
  else if (!fs.existsSync(HELPER)) say(MISSING, 'err', 8000);
  if (!(hasNode && ui.last && loadSess(ui.last))) sess = null;
  try { if (hasNode) look = JSON.parse(fs.readFileSync(path.join(PREVIEW, 'look.json'), 'utf8')); } catch (e) { look = null; }
  thumbs();
  poll();
  setInterval(poll, 2500);
})();
