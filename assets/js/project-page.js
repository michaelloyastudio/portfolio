/* ══════════════════════════════════════════════════════════════
   Project page renderer.
   Each /<slug>.html sets window.PROJECT_SLUG, then this fills in the
   hero, title, copy, and media from projects.js. Content lives in one
   place; the per-project HTML files stay thin.

   Moving between projects doesn't load a new page: render() builds a
   project into the page already open, and the teardown it returns stops
   everything the last one started (listeners, timers, observers, the
   parallax loop) before the next is built. The header and the side
   arrows are never replaced, so they stay perfectly still and the cursor
   on an arrow keeps its hand. Each project keeps its own URL (pushState),
   and back/forward swap the same way.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function render(slug) {
  var pageStart = performance.now();   // ~ when the CSS load-in starts

  // what this render starts, so its teardown can stop all of it
  var alive = true;
  var life = 'AbortController' in window ? new AbortController() : null;
  var sig = life ? { signal: life.signal } : false;
  var timers = [], observers = [], settle = null;
  function later(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timers.push(id); return id; }
  function watch(o) { observers.push(o); return o; }

  /* The hero loads first. The work below holds its images and videos
     (Misc alone is tens of MB of loops) until the hero is in, or 3s,
     so they don't crowd the hero's layers off the connection. */
  var heroDone = false, onHeroDone = [];
  function heroReady() {
    if (heroDone || !alive) return;
    heroDone = true;
    onHeroDone.forEach(function (f) { f(); });
  }
  later(heroReady, 3000);
  var i = -1;
  projects.forEach(function (p, n) { if (p.slug === slug) i = n; });
  if (i < 0) return function () {};

  var p = projects[i];
  var isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(p.hero || '');

  document.title = p.title + ' — Michael Loya Studio';
  var canon = document.querySelector('link[rel="canonical"]');
  if (canon) canon.href = 'https://michaelloya.studio/' + p.slug;

  // ── hero ──
  var hero = $('projectHero');
  if (hero) {
    hero.classList.remove('is-content', 'is-tall', 'is-fit');
    if (p.heroFit === 'content') hero.classList.add('is-content');
    hero.innerHTML = isVideo
      ? '<video src="' + p.hero + '" playsinline ' +
        (p.heroLoop ? 'autoplay loop muted preload="auto"' : 'controls preload="metadata"') +
        (p.heroPoster ? ' poster="' + p.heroPoster + '"' : '') + '></video>'
      : '<img src="' + p.hero + '" alt="' + p.title + '">';
    // heroSize (projects.js) lets the hero, the title above it and the
    // side arrows all lay out at once, before the file arrives
    var size = p.heroSize || [0, 0];
    if (size[0]) { hero.firstElementChild.setAttribute('width', size[0]); hero.firstElementChild.setAttribute('height', size[1]); }
    var dimsOf = function (m) {
      return [m.naturalWidth || m.videoWidth || size[0], m.naturalHeight || m.videoHeight || size[1]];
    };

    // A hero narrower than ~4:3 would be enormous at full width, so mark it
    // and let CSS cap the height instead (Album Covers is square).
    var hm = hero.firstElementChild;
    var flag = function () {
      var d = dimsOf(hm), w = d[0], h = d[1];
      if (w && h) hero.classList.toggle('is-tall', (w / h) < 1.3);
    };
    hm.addEventListener(hm.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', flag);
    flag();

    /* Fit to the first screen: the hero's height is whatever the window has
       left under the title, less a small gap that scales with the screen,
       so every screen shows the whole hero the same way. Its width follows
       from its own aspect. Phones keep full width. */
    var fitHero = function () {
      var d = dimsOf(hm), w = d[0], h = d[1];
      if (!w || !h) return;
      if (window.innerWidth <= 640) { hm.style.maxHeight = hm.style.width = ''; alignHead(); return; }
      var top = hero.getBoundingClientRect().top + window.scrollY;
      var gap = Math.max(16, Math.min(32, window.innerHeight * 0.025));
      var avail = Math.max(window.innerHeight - top - gap, 240);
      if (hero.classList.contains('is-tall')) avail = Math.min(avail, window.innerHeight * 0.78);
      hm.style.maxHeight = avail.toFixed(0) + 'px';
      /* the width is set outright, from the file's aspect, so it's right
         before the file has loaded (an unloaded img has no size of its own) */
      var cs = getComputedStyle(hero);
      var inner = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      hm.style.width = Math.min(inner, avail * w / h).toFixed(1) + 'px';
      hero.classList.add('is-fit');
      alignHead();
    };
    /* The title and category run to the hero's edges: the head takes the
       hero's rendered width (plus the same side padding both carry). */
    var head = document.querySelector('.project-head');
    var alignHead = function () {
      if (!head) return;
      var mw = hm.getBoundingClientRect().width;
      if (window.innerWidth <= 640 || !mw) { head.style.maxWidth = ''; return; }
      var pad = parseFloat(getComputedStyle(head).paddingLeft) || 0;
      head.style.maxWidth = (mw + 2 * pad).toFixed(1) + 'px';
    };
    hm.addEventListener(hm.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', fitHero);
    // a layered hero is ready when its layers are (layeredHero says so)
    if (!(p.heroLayers && !isVideo)) {
      if (isVideo ? hm.readyState >= 2 : hm.complete) heroReady();
      else hm.addEventListener(isVideo ? 'loadeddata' : 'load', heroReady, { once: true });
    }
    fitHero();
    window.addEventListener('resize', fitHero, sig);
    // the title's real font can change its height, and so the room left
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (alive) fitHero(); });

    if (!isVideo && p.heroLayers) layeredHero(hero, hm, p.heroLayers);
    /* A looping video hero has no layers, but builds in the same way a
       layer does: once its first frame is ready it fades up, sharpens and
       floats to size (heroBuild in site.css matches layeredHero's 650ms). */
    if (isVideo && p.heroLoop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hm.classList.add('hero-pre');
      var go = function () { hm.classList.remove('hero-pre'); hm.classList.add('hero-build'); };
      if (hm.readyState >= 2) go(); else hm.addEventListener('loadeddata', go, { once: true });
      later(go, 2500);
    }
  }

  /* ── Layered hero ────────────────────────────────────────────────
     The hero split into stacked layers, back to front, each with its own
     depth k: how far it travels at the extremes, as a fraction of the
     hero's width. Stacked at rest they are the hero image exactly. As the
     hero scrolls through the window and the pointer moves over it, near
     layers slide further than far ones, so the scene separates.
     heroLayers is either [{ src, k }, ...] back to front, or the two-layer
     shorthand { bg, fg }. A layer whose content is cut off at the frame edge
     (the corner planets) can take its own scale s, so that edge stays out of
     view when the layer slides in.
     The <img> stays for layout, alt text and as the fallback; the stack
     only appears once every layer has loaded. Reduced motion: no stack. */
  function layeredHero(wrap, img, layers) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (img.complete) heroReady(); else img.addEventListener('load', heroReady, { once: true });
      return;
    }
    if (!Array.isArray(layers)) layers = [{ src: layers.bg, k: 0.006, edge: true }, { src: layers.fg, k: 0.024 }];

    var stack = document.createElement('div');
    stack.className = 'hero-layers';
    stack.setAttribute('aria-hidden', 'true');
    var els = layers.map(function (l) {
      var im = new Image();
      im.alt = ''; im.className = 'hero-layer';
      if (l.pad) {
        // the file carries pad (a fraction of each side) of extra picture
        // beyond the frame, so the layer can sit 1:1 at rest and still
        // never show an edge when it travels
        var o = (-l.pad * 100) + '%', sz = ((1 + 2 * l.pad) * 100) + '%';
        im.style.left = im.style.top = o; im.style.width = im.style.height = sz;
      }
      stack.appendChild(im);
      return im;
    });

    /* Build-in: the flat hero stays hidden while the layers load, then they
       arrive one by one from the back, each floating up to full size as it
       fades in and sharpens. If the layers are slow (or one fails), the
       flat image comes back after a moment so the slot is never empty. */
    var STAGGER = 95, INTRO = 480;          // ms between layers, ms per layer
    // build order is depth, back to front: the layer that travels least first
    var order = layers.map(function (l, i) { return i; })
      .sort(function (a, b) { return (layers[a].k - layers[b].k) || (a - b); })
      .reduce(function (o, li, rank) { o[li] = rank; return o; }, []);
    var introStart = null;
    img.style.visibility = 'hidden';
    var fallback = later(function () { img.style.visibility = ''; }, 2500);
    var loaded = 0;
    function onLoad() {
      if (++loaded < els.length) return;
      // the flat img sets the stack's box, so it has to have loaded (and
      // been fitted) first; the layers often win that race
      if (!(img.complete && img.naturalWidth)) {
        img.addEventListener('load', function () { loaded--; onLoad(); }, { once: true });
        return;
      }
      clearTimeout(fallback);
      heroReady();
      els.forEach(function (el) { el.style.opacity = '0'; });
      wrap.appendChild(stack);
      place();
      // the title goes first; the build starts a beat after it (see the
      // project load-in in site.css), or straight away if loading was slow
      introStart = Math.max(performance.now(), pageStart + 120);
      start();
      // once the last layer is in, the flat image underneath can come back
      later(function () { img.style.visibility = ''; }, STAGGER * els.length + INTRO);
    }
    els.forEach(function (im, n) {
      im.onload = onLoad;
      im.onerror = function () { clearTimeout(fallback); img.style.visibility = ''; heroReady(); };
      im.fetchPriority = 'high';
      im.src = layers[n].src;
    });

    // the stack covers the img exactly, wherever CSS has put it
    function place() {
      stack.style.left = img.offsetLeft + 'px';
      stack.style.top = img.offsetTop + 'px';
      stack.style.width = img.offsetWidth + 'px';
      stack.style.height = img.offsetHeight + 'px';
    }
    window.addEventListener('resize', place, sig);
    /* and follows it whenever its box changes for any other reason: fitHero
       or is-tall landing after the stack was placed, fonts settling the
       title above. Without this the stack could keep a stale full-width
       square and spill over the copy below. */
    if ('ResizeObserver' in window) watch(new ResizeObserver(place)).observe(img);

    /* Pointer target in -1..1 across the picture. Three things keep it calm:
       the pointer's pull (on) fades in over about half a second after it
       arrives and out after it leaves, so landing on the very edge doesn't
       fling the layers to full travel; and the motion is smoothed twice
       (target -> m -> c), so it starts gently and settles gently rather than
       jumping off at full speed. Time-based, so it feels the same at any
       frame rate. */
    var px = 0, py = 0, mx = 0, my = 0, cx = 0, cy = 0, on = 0, inside = 0, last = 0;
    // only over the picture itself: a square hero sits in a wide slot, and
    // reading the pointer across the whole slot pushed layers past their
    // edges
    wrap.addEventListener('pointermove', function (e) {
      var r = stack.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 2 - 1;
      var y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (Math.abs(x) > 1 || Math.abs(y) > 1) { inside = 0; return; }
      inside = 1; px = x; py = y;
    });
    wrap.addEventListener('pointerleave', function () { inside = 0; });

    var visible = true, running = false;
    if ('IntersectionObserver' in window) {
      watch(new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) start();
      })).observe(wrap);
    }
    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    /* scroll position the page loaded at: the resting state, with no
       pointer over it, is the hero exactly as composed */
    var t0 = null;
    function frame() {
      if (!visible || !alive) { running = false; return; }
      var now = performance.now(), dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      var ease = function (tau) { return 1 - Math.exp(-dt / tau); };
      on += (inside - on) * ease(0.35);
      mx += (px * on - mx) * ease(0.22);
      my += (py * on - my) * ease(0.22);
      cx += (mx - cx) * ease(0.22);
      cy += (my - cy) * ease(0.22);
      // -1 when the hero's centre is at the bottom of the window, +1 at the top
      var r = stack.getBoundingClientRect(), vh = window.innerHeight;
      var raw = (vh / 2 - (r.top + r.height / 2)) / vh;
      if (t0 === null) t0 = raw;
      var t = Math.max(-1, Math.min(1, raw - t0));
      els.forEach(function (el, n) {
        // build-in progress for this layer, 0..1, eased out
        var q = introStart === null ? 1 : Math.max(0, Math.min(1, (now - introStart - order[n] * STAGGER) / INTRO));
        q = 1 - Math.pow(1 - q, 3);
        if (q < 1 || el.style.opacity !== '') {
          el.style.opacity = q < 1 ? q.toFixed(3) : '';
          el.style.filter = q < 1 ? 'blur(' + ((1 - q) * 10).toFixed(2) + 'px)' : '';
        }
        var k = layers[n].k * r.width;
        // pointer and scroll share the vertical budget, so no layer ever
        // travels more than k x width in either direction. The layers move
        // WITH the pointer (near ones furthest), so the scene follows the
        // mouse rather than the camera dodging it.
        var x = cx * k, y = Math.max(-1, Math.min(1, cy * 0.6 + t * 0.4)) * k;
        var sc = layerRestScale(layers[n], r.width / r.height) * (0.94 + 0.06 * q);
        el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + sc + ')';
      });
      requestAnimationFrame(frame);
    }
  }

  // ── title block ──
  $('projectTitle').textContent = p.title;
  $('projectCategory').textContent = p.category;
  $('projectIntro').innerHTML = p.intro;
  noWidows($('projectIntro'));
  $('projectTools').textContent = p.tools;
  $('projectYear').textContent = p.year;

  // ── media ──
  $('projectWork').innerHTML = '';
  var tpl = document.createElement('template');
  tpl.innerHTML = p.work;                      // parsed inert: nothing fetches yet
  if (!heroDone) {
    tpl.content.querySelectorAll('img, video, source').forEach(function (m) {
      ['src', 'poster'].forEach(function (a) {
        if (m.hasAttribute(a)) { m.setAttribute('data-held-' + a, m.getAttribute(a)); m.removeAttribute(a); }
      });
    });
    onHeroDone.push(function () {
      document.querySelectorAll('#projectWork [data-held-src], #projectWork [data-held-poster]').forEach(function (m) {
        ['poster', 'src'].forEach(function (a) {
          var v = m.getAttribute('data-held-' + a);
          if (v !== null) { m.setAttribute(a, v); m.removeAttribute('data-held-' + a); }
        });
      });
    });
  }
  $('projectWork').appendChild(tpl.content);

  // ── prev / next ──
  var prev = projects[(i - 1 + projects.length) % projects.length];
  var next = projects[(i + 1) % projects.length];
  var prevEl = $('projectPrev'), nextEl = $('projectNext');
  if (prevEl) prevEl.href = '/' + prev.slug;
  if (nextEl) nextEl.href = '/' + next.slug;

  /* ── mosaic: justified rows ──────────────────────────────────────
     Greedily fill a row with tiles until scaling them to fit the
     container width brings the row height down to about the target,
     then lock that row in. Every tile in a row shares a height and each
     keeps its own aspect ratio, so gaps stay uniform and nothing is
     cropped or left as a hole. */
  /* Prefer the width/height baked into the markup: those are known at
     parse time, so the mosaic lays out correctly on first paint instead
     of waiting for every lazy image below the fold to download. Falls
     back to the decoded size if an attribute is ever missing. */
  function ratioOf(tile) {
    var m = tile.querySelector('img, video');
    if (!m) return 0;
    var w = parseFloat(m.getAttribute('width'))  || m.naturalWidth  || m.videoWidth;
    var h = parseFloat(m.getAttribute('height')) || m.naturalHeight || m.videoHeight;
    return (w && h) ? w / h : 0;
  }

  var pending = false;
  function layoutMosaic() {
    pending = false;
    document.querySelectorAll('#projectWork [class^="img-grid"]').forEach(function (grid) {
      var tiles = Array.prototype.slice.call(grid.children);
      if (!tiles.length) return;

      /* Round the gap to a whole pixel and pin it inline. The token is a
         clamp() with a vw term, so it resolves to something like 15.18px —
         and a row whose widths sum to exactly the container then overflows
         by a fraction and wraps. Integer gap + integer width = exact fit. */
      var gap = Math.round(parseFloat(getComputedStyle(grid).columnGap) || 0);
      grid.style.gap = gap + 'px';
      /* floor the FRACTIONAL width: clientWidth rounds up (999 for a real
         998.81), so a row summing to clientWidth overflows and wraps. */
      var W = Math.floor(grid.getBoundingClientRect().width);
      if (!W) return;

      // Column count in the class name sets the target row height.
      var m = (grid.className.match(/img-grid-(\d)/) || [])[1];
      var perRow = Math.max(1, parseInt(m || '3', 10));
      /* Two portrait tiles side by side on a phone are about 140px wide
         each — too small to read as work. One per row below 520. */
      if (W < 520) perRow = 1;
      else if (W < 700) perRow = Math.min(perRow, 2);
      // data-exact: always this many per row, whatever height that gives.
      var exact = grid.hasAttribute('data-exact');
      var target = exact ? 0 : (W - gap * (perRow - 1)) / perRow;

      var ratios = tiles.map(ratioOf);
      if (ratios.some(function (r) { return !r; })) { pending = true; return; }

      /* Every row spans the full width; the last tile in a row absorbs the
         rounding so the edges stay flush. */
      function flush(idxs, height) {
        var used = 0;
        idxs.forEach(function (ti, n) {
          var w = (n === idxs.length - 1)
            ? (W - gap * (idxs.length - 1)) - used
            : Math.round(height * ratios[ti]);
          used += w;
          tiles[ti].style.width = w + 'px';
          tiles[ti].style.height = Math.round(height) + 'px';
        });
      }

      /* Collect the rows before laying any of them out. The last row needs
         to be able to borrow from the one above it, which isn't possible
         once a row has already been committed. */
      var rows = [], row = [], sum = 0;
      tiles.forEach(function (t, i) {
        row.push(i); sum += ratios[i];
        var h = (W - gap * (row.length - 1)) / sum;
        // Break on the target height OR the column count. The count matters:
        // three portrait tiles are still short of the target, so without it
        // they'd keep collecting neighbours and end up small. Breaking at the
        // column count lets a row of verticals fill the width and stand tall.
        if ((!exact && h <= target) || row.length >= perRow) {
          rows.push(row); row = []; sum = 0;
        }
      });
      if (row.length) rows.push(row);
      if (!rows.length) return;

      function heightOf(r) {
        var s = 0;
        for (var i = 0; i < r.length; i++) s += ratios[r[i]];
        return (W - gap * (r.length - 1)) / s;
      }

      // A grid holding a single tile has nothing to balance against, and
      // justifying it would blow it up to the full width.
      if (rows.length === 1 && rows[0].length === 1) {
        flush(rows[0], Math.min(target, heightOf(rows[0])));
        return;
      }

      /* THE BLOCK MUST COME OUT RECTANGULAR. Every row is justified,
         including the last — a short trailing row is exactly what leaves
         the bottom edge jagged. But a row left holding one tile would
         justify to the full width and tower over everything above it, so
         pull tiles down from the row above until the last row can fill the
         width at a height in the same league as the rest. */
      /* data-exact sets target to 0 (the row count, not the height, decides
         the break), so it can't be the yardstick here — comparing against
         zero makes every row look too tall and the loop strips the grid
         down to one row. Fall back to the height a full row would have. */
      var balanceTarget = target || (W - gap * (perRow - 1)) / perRow;
      var guard = 0;
      while (rows.length > 1 && guard++ < 30) {
        var last = rows[rows.length - 1], prev = rows[rows.length - 2];
        if (last.length > 1 && heightOf(last) <= balanceTarget * 1.6) break;
        if (prev.length < 2) break;
        last.unshift(prev.pop());
      }
      rows.forEach(function (r) { flush(r, heightOf(r)); });
    });
  }

  /* Media loads asynchronously and lazily, so one pass isn't enough: the
     last image to fire may still race the others, and a pass that finds any
     tile unmeasured bails. Re-run on every load event, and poll briefly
     until a pass completes with every tile measured. */
  document.querySelectorAll('#projectWork img').forEach(function (img) {
    img.addEventListener('load', layoutMosaic);
  });
  document.querySelectorAll('#projectWork video').forEach(function (v) {
    v.addEventListener('loadedmetadata', layoutMosaic);
    v.addEventListener('loadeddata', layoutMosaic);
  });
  layoutMosaic();
  window.addEventListener('load', layoutMosaic, sig);

  var tries = 0;
  settle = setInterval(function () {
    layoutMosaic();
    if (!pending || ++tries > 40) clearInterval(settle);
  }, 200);

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt); rt = later(layoutMosaic, 120);
  }, sig);

  // Autoplay loops only once they're on screen — a project page can hold a
  // lot of video, and decoding them all at once stutters the scroll.
  var loops = document.querySelectorAll('#projectWork video[autoplay]');
  if (loops.length && 'IntersectionObserver' in window) {
    loops.forEach(function (v) { v.pause(); });
    var vio = watch(new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var q = e.target.play(); if (q && q.catch) q.catch(function () {}); }
        else e.target.pause();
      });
    }, { rootMargin: '150px 0px' }));
    loops.forEach(function (v) { vio.observe(v); });
  }

  return function teardown() {
    alive = false;
    if (life) life.abort();
    timers.forEach(clearTimeout);
    clearInterval(settle);
    observers.forEach(function (o) { o.disconnect(); });
    // stop every clip and its download before the DOM goes
    document.querySelectorAll('#projectHero video, #projectWork video').forEach(function (v) {
      v.pause(); v.removeAttribute('src'); v.load();
    });
  };
  }   // render

  /* ── No widows ─────────────────────────────────────────────────────
     Binds the last two words of every paragraph with a non-breaking
     space, so a paragraph can never break with one word stranded on its
     own final line. Runs on the text nodes only — the <a> and <em> inside
     the copy are left alone. */
  function noWidows(root) {
    if (!root) return;
    root.querySelectorAll('p').forEach(function (para) {
      var walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT, null);
      var last = null, node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.trim()) last = node;
      }
      if (!last) return;
      // \u00a0 between the final two words. Only bind if the tail actually
      // has two words to bind; a one-word tail is already unbreakable.
      last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, '\u00a0$1');
    });
  }

  /* ── Lightbox ─────────────────────────────────────────────────────
     Click a work image or clip (not a player with its own controls, not
     anything inside a link) and it opens over the page. A clip restarts
     from the top, muted, in the lightbox; the red speaker gives it sound.
     The chevrons and the arrow keys step through the project's work,
     Esc / the X / a click anywhere closes it. Grid clips pause while it's
     open and pick up again after. Built once; it outlives project swaps,
     which close it first. */
  var CHEV_L = '<svg viewBox="0 0 20 36" aria-hidden="true"><path d="M16 3 L4 18 L16 33"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 20 36" aria-hidden="true"><path d="M4 3 L16 18 L4 33"/></svg>';
  var X_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 2 L18 18 M18 2 L2 18"/></svg>';
  var SPEAKER = 'M2 7 L6.5 7 L12 2.5 L12 17.5 L6.5 13 L2 13 Z';
  var SOUND_ON  = '<svg viewBox="0 0 26 20" aria-hidden="true"><path d="' + SPEAKER + ' M16 7 Q18 10 16 13 M19.5 4 Q24 10 19.5 16"/></svg>';
  var SOUND_OFF = '<svg viewBox="0 0 26 20" aria-hidden="true"><path d="' + SPEAKER + ' M17 7 L23 13 M23 7 L17 13"/></svg>';

  var lb = null, lbClose, lbPrev, lbNext, lbSound, lbMedia = null;
  var lbList = [], lbIdx = -1, lbResume = [], lbReturn = null, lbOpen = false;

  function srcOf(m, a) { return m.getAttribute(a) || m.getAttribute('data-held-' + a); }
  function lbItems() {
    return Array.prototype.filter.call(document.querySelectorAll('#projectWork img, #projectWork video'), function (m) {
      return !(m.tagName === 'VIDEO' && m.hasAttribute('controls')) && !m.closest('a') && srcOf(m, 'src');
    });
  }
  function dropMedia() {
    if (!lbMedia) return;
    if (lbMedia.tagName === 'VIDEO') { lbMedia.pause(); lbMedia.removeAttribute('src'); lbMedia.load(); }
    lbMedia.remove();
    lbMedia = null;
  }
  function paintSound() {
    var live = lbMedia && lbMedia.tagName === 'VIDEO' && !lbMedia.muted;
    lbSound.innerHTML = live ? SOUND_ON : SOUND_OFF;
    lbSound.setAttribute('aria-label', live ? 'Mute' : 'Unmute');
    lbSound.setAttribute('aria-pressed', live ? 'true' : 'false');
  }
  function buildLb() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Work viewer');
    lb.tabIndex = -1;
    lb.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">' + X_ICON + '</button>' +
      '<button type="button" class="side-arrow side-arrow--prev" aria-label="Previous piece">' + CHEV_L + '</button>' +
      '<button type="button" class="side-arrow side-arrow--next" aria-label="Next piece">' + CHEV_R + '</button>' +
      '<button type="button" class="lightbox-sound" hidden></button>';
    document.body.appendChild(lb);
    lbClose = lb.querySelector('.lightbox-close');
    lbPrev = lb.querySelector('.side-arrow--prev');
    lbNext = lb.querySelector('.side-arrow--next');
    lbSound = lb.querySelector('.lightbox-sound');
    // the controls keep their clicks to themselves: the speaker repaints
    // its icon mid-click, which would otherwise read as a backdrop click
    lbClose.addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); showLb(lbIdx - 1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); showLb(lbIdx + 1); });
    lbSound.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!lbMedia || lbMedia.tagName !== 'VIDEO') return;
      lbMedia.muted = !lbMedia.muted;
      var q = lbMedia.play(); if (q && q.catch) q.catch(function () {});
      paintSound();
    });
    // anywhere that isn't a control closes it, the piece itself included
    lb.addEventListener('click', function () { closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lbOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowLeft' && lbList.length > 1) { e.preventDefault(); showLb(lbIdx - 1); }
      else if (e.key === 'ArrowRight' && lbList.length > 1) { e.preventDefault(); showLb(lbIdx + 1); }
    });
  }
  function showLb(n) {
    lbIdx = (n + lbList.length) % lbList.length;
    var m = lbList[lbIdx], el;
    dropMedia();
    if (m.tagName === 'VIDEO') {
      // a fresh element, so it always starts from the top, muted
      el = document.createElement('video');
      el.muted = true; el.loop = true; el.playsInline = true; el.autoplay = true;
      el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
      el.src = srcOf(m, 'src');
      var q = el.play(); if (q && q.catch) q.catch(function () {});
    } else {
      el = new Image();
      el.alt = m.alt || '';
      el.src = srcOf(m, 'src');
    }
    if (m.getAttribute('width')) { el.setAttribute('width', m.getAttribute('width')); el.setAttribute('height', m.getAttribute('height')); }
    el.className = 'lightbox-media is-in';
    lb.insertBefore(el, lbClose);
    lbMedia = el;
    lbSound.hidden = !(m.tagName === 'VIDEO' && !m.hasAttribute('data-silent'));
    paintSound();
    lbPrev.hidden = lbNext.hidden = lbList.length < 2;
  }
  function openLb(m) {
    if (!lb) buildLb();
    lbList = lbItems();
    var n = lbList.indexOf(m);
    if (n < 0) return;
    lbReturn = document.activeElement;
    lbResume = Array.prototype.filter.call(document.querySelectorAll('#projectWork video'), function (v) { return !v.paused; });
    lbResume.forEach(function (v) { v.pause(); });
    document.documentElement.classList.add('locked');
    lbOpen = true;
    showLb(n);
    lb.classList.add('is-open');
    lb.focus({ preventScroll: true });   // the dialog, not the X, so no ring shows on a tap
  }
  function closeLb(now) {
    if (!lbOpen) return;
    lbOpen = false;
    lb.classList.remove('is-open');
    document.documentElement.classList.remove('locked');
    if (now) dropMedia(); else setTimeout(function () { if (!lbOpen) dropMedia(); }, 260);
    lbResume.forEach(function (v) { if (v.isConnected) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } });
    lbResume = [];
    if (lbReturn && lbReturn.focus && lbReturn.isConnected) lbReturn.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var m = e.target.closest && e.target.closest('#projectWork img, #projectWork video');
    if (!m || (m.tagName === 'VIDEO' && m.hasAttribute('controls')) || m.closest('a')) return;
    e.preventDefault();
    openLb(m);
  });

  var teardown = render(window.PROJECT_SLUG);
  if (history.replaceState) history.replaceState({ slug: window.PROJECT_SLUG }, '');
  // each swap starts at the top; the browser restoring an old scroll
  // position on back/forward would fight it
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ── Project to project, in place ─────────────────────────────────
     site.js hands project links here. The page fades out as on any
     leave (page-leaving; the header and side arrows are left out of it),
     the next project is built behind it, then the same top-down load-in
     plays again. */
  var LEAVE_MS = 200, swapping = false;
  function isProject(slug) { return projects.some(function (q) { return q.slug === slug; }); }
  function replay(el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }

  window.projectSwap = function (slug, push) {
    if (swapping || !isProject(slug) || !history.pushState) return false;
    swapping = true;
    closeLb(true);
    document.body.classList.add('page-leaving');
    setTimeout(function () {
      teardown();
      if (push) history.pushState({ slug: slug }, '', '/' + slug);
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.PROJECT_SLUG = slug;
      teardown = render(slug);
      document.querySelectorAll('main.project > .project-head, main.project > .project-body, main.project > .project-work')
        .forEach(replay);
      document.body.classList.remove('page-leaving');
      // GoatCounter counts the first page itself; swaps are counted here
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: '/' + slug });
      swapping = false;
    }, LEAVE_MS);
    return true;
  };

  // back / forward between projects swaps the same way
  window.addEventListener('popstate', function () {
    var slug = location.pathname.replace(/^\//, '').replace(/\.html$/, '');
    if (isProject(slug) && slug !== window.PROJECT_SLUG) window.projectSwap(slug, false);
  });
})();
