/* ══════════════════════════════════════════════════════════════
   Project page renderer.
   Each /<slug>.html sets window.PROJECT_SLUG, then this fills in the
   hero, title, copy, and media from projects.js. Content lives in one
   place; the per-project HTML files stay thin.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var pageStart = performance.now();   // ~ when the CSS load-in starts

  /* The hero loads first. The work below holds its images and videos
     (Misc alone is tens of MB of loops) until the hero is in, or 3s,
     so they don't crowd the hero's layers off the connection. */
  var heroDone = false, onHeroDone = [];
  function heroReady() {
    if (heroDone) return;
    heroDone = true;
    onHeroDone.forEach(function (f) { f(); });
  }
  setTimeout(heroReady, 3000);
  var slug = window.PROJECT_SLUG;
  var i = -1;
  projects.forEach(function (p, n) { if (p.slug === slug) i = n; });
  if (i < 0) return;

  var p = projects[i];
  var $ = function (id) { return document.getElementById(id); };
  var isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(p.hero || '');

  document.title = p.title + ' — Michael Loya Studio';

  // ── hero ──
  var hero = $('projectHero');
  if (hero) {
    if (p.heroFit === 'content') hero.classList.add('is-content');
    hero.innerHTML = isVideo
      ? '<video src="' + p.hero + '" playsinline ' +
        (p.heroLoop ? 'autoplay loop muted preload="auto"' : 'controls preload="metadata"') +
        (p.heroPoster ? ' poster="' + p.heroPoster + '"' : '') + '></video>'
      : '<img src="' + p.hero + '" alt="' + p.title + '">';

    // A hero narrower than ~4:3 would be enormous at full width, so mark it
    // and let CSS cap the height instead (Album Covers is square).
    var hm = hero.firstElementChild;
    var flag = function () {
      var w = hm.naturalWidth || hm.videoWidth, h = hm.naturalHeight || hm.videoHeight;
      if (w && h) hero.classList.toggle('is-tall', (w / h) < 1.3);
    };
    hm.addEventListener(hm.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', flag);
    flag();

    /* Fit to the first screen: the hero's height is whatever the window has
       left under the title, less a small gap that scales with the screen,
       so every screen shows the whole hero the same way. Its width follows
       from its own aspect. Phones keep full width. */
    var fitHero = function () {
      var w = hm.naturalWidth || hm.videoWidth, h = hm.naturalHeight || hm.videoHeight;
      if (!w || !h) return;
      if (window.innerWidth <= 640) { hm.style.maxHeight = ''; return; }
      var top = hero.getBoundingClientRect().top + window.scrollY;
      var gap = Math.max(16, Math.min(32, window.innerHeight * 0.025));
      var avail = window.innerHeight - top - gap;
      hm.style.maxHeight = Math.max(avail, 240).toFixed(0) + 'px';
      hero.classList.add('is-fit');
      alignHead();
    };
    /* The title and category run to the hero's edges: the head takes the
       hero's rendered width (plus the same side padding both carry). */
    var head = document.querySelector('.project-head');
    /* The head holds its load-in until it knows that width, so it never
       appears at one width and then jumps to another (fallback 700ms). */
    var release = function () { if (head) head.classList.remove('head-wait'); };
    if (head) { head.classList.add('head-wait'); setTimeout(release, 700); }
    var alignHead = function () {
      if (!head) return;
      var mw = hm.getBoundingClientRect().width;
      if (window.innerWidth <= 640 || !mw) { head.style.maxWidth = ''; release(); return; }
      var pad = parseFloat(getComputedStyle(head).paddingLeft) || 0;
      head.style.maxWidth = (mw + 2 * pad).toFixed(1) + 'px';
      release();
    };
    hm.addEventListener(hm.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', fitHero);
    // a layered hero is ready when its layers are (layeredHero says so)
    if (!(p.heroLayers && !isVideo)) {
      if (isVideo ? hm.readyState >= 2 : hm.complete) heroReady();
      else hm.addEventListener(isVideo ? 'loadeddata' : 'load', heroReady, { once: true });
    }
    fitHero();
    window.addEventListener('resize', fitHero);

    if (!isVideo && p.heroLayers) layeredHero(hero, hm, p.heroLayers);
    /* A looping video hero has no layers, but builds in the same way a
       layer does: once its first frame is ready it fades up, sharpens and
       floats to size (heroBuild in site.css matches layeredHero's 650ms). */
    if (isVideo && p.heroLoop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hm.classList.add('hero-pre');
      var go = function () { hm.classList.remove('hero-pre'); hm.classList.add('hero-build'); };
      if (hm.readyState >= 2) go(); else hm.addEventListener('loadeddata', go, { once: true });
      setTimeout(go, 2500);
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
    var fallback = setTimeout(function () { img.style.visibility = ''; }, 2500);
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
      setTimeout(function () { img.style.visibility = ''; }, STAGGER * els.length + INTRO);
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
    window.addEventListener('resize', place);
    /* and follows it whenever its box changes for any other reason: fitHero
       or is-tall landing after the stack was placed, fonts settling the
       title above. Without this the stack could keep a stale full-width
       square and spill over the copy below. */
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(img);

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
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) start();
      }).observe(wrap);
    }
    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    /* scroll position the page loaded at: the resting state, with no
       pointer over it, is the hero exactly as composed */
    var t0 = null;
    function frame() {
      if (!visible) { running = false; return; }
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
  window.addEventListener('load', layoutMosaic);

  var tries = 0;
  var settle = setInterval(function () {
    layoutMosaic();
    if (!pending || ++tries > 40) clearInterval(settle);
  }, 200);

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(layoutMosaic, 120);
  });

  /* ── Sound, one clip at a time ────────────────────────────────────
     Autoplay only works muted, so every looping clip starts silent. This
     is the way back in: hover it, hit the button, that clip gets the
     audio. Full-width blocks are included as well as grid tiles — a clip
     shouldn't lose its sound just because it isn't sharing a row. Unmuting one mutes whatever was playing before — two
     soundtracks over each other is never what you want, and the user
     shouldn't have to go hunting for the one they left on.
     The audio survives the scroll pause below: the clip is paused when it
     leaves the screen and resumes still unmuted, which keeps sound from
     playing for something nobody can see. */
  var ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.2-3.9v2.2l2.1 2.1c.06-.13.1-.26.1-.4zm2.5 0c0 .94-.2 1.83-.55 2.63l1.5 1.5A8.9 8.9 0 0 0 21 12a9 9 0 0 0-6.7-8.7v2.1A6.9 6.9 0 0 1 19 12zM2.3 2.3 1 3.6l4.4 4.4H3v8h4l5 5v-6.7l4.2 4.2c-.66.5-1.4.9-2.2 1.15v2.06a9 9 0 0 0 3.66-1.78L20.4 22l1.3-1.3L2.3 2.3zM12 4 9.9 6.1 12 8.2V4z"/></svg>';
  var ICON_ON  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a6.99 6.99 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/></svg>';

  /* data-silent marks a clip with no audio track at all. Giving one a
     button is worse than giving it nothing: it looks like the sound is
     broken rather than absent. The attribute is set from what ffprobe
     actually reports on the file, not from memory. */
  var sounded = document.querySelectorAll(
    '#projectWork video[autoplay]:not([data-silent])');
  if (sounded.length) {
    var buttons = [];
    var paint = function (v, btn) {
      var live = !v.muted;
      btn.innerHTML = live ? ICON_ON : ICON_OFF;
      btn.classList.toggle('is-live', live);
      btn.setAttribute('aria-pressed', live ? 'true' : 'false');
      btn.setAttribute('aria-label', live ? 'Mute this clip' : 'Unmute this clip');
    };
    Array.prototype.forEach.call(sounded, function (v) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sound-toggle';
      v.parentNode.appendChild(btn);
      buttons.push([v, btn]);
      paint(v, btn);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var turningOn = v.muted;
        buttons.forEach(function (pair) {      // solo: everything else goes quiet
          pair[0].muted = true;
          paint(pair[0], pair[1]);
        });
        if (turningOn) {
          v.muted = false;
          var q = v.play(); if (q && q.catch) q.catch(function () {});
        }
        paint(v, btn);
      });
    });
  }

  // Autoplay loops only once they're on screen — a project page can hold a
  // lot of video, and decoding them all at once stutters the scroll.
  var loops = document.querySelectorAll('#projectWork video[autoplay]');
  if (loops.length && 'IntersectionObserver' in window) {
    loops.forEach(function (v) { v.pause(); });
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var q = e.target.play(); if (q && q.catch) q.catch(function () {}); }
        else e.target.pause();
      });
    }, { rootMargin: '150px 0px' });
    loops.forEach(function (v) { vio.observe(v); });
  }

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
})();
