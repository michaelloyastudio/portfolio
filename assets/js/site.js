/* ══════════════════════════════════════════════════════════════
   michaelloya.studio — shared behaviour
   Loaded on every page. Each block no-ops if its markup is absent,
   so index / work / about can share this one file.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  /* Scroll lock — see the html.locked note in site.css. Reference-counted so
     closing a project overlay doesn't unlock a still-open menu.
     No width compensation needed: scrollbar-gutter keeps the gutter reserved
     through overflow:hidden, so layout width is unchanged. (documentElement
     .clientWidth does report the wider value while locked — that's a quirk of
     the metric, not an actual reflow. Measure a real element to confirm.) */
  var locks = 0;
  function lockScroll(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.documentElement.classList.toggle('locked', locks > 0);
  }

  /* ── Menu ────────────────────────────────────────────────────────*/
  /* ── A reload lands at the top ──────────────────────────────────
     Every page, so the load-in plays from the start instead of the
     browser restoring a spot halfway down. Back/forward still restore:
     the mode goes back to auto as the page is left. */
  var navEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  if (navEntry && navEntry.type === 'reload' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.addEventListener('load', function () { window.scrollTo(0, 0); });
    window.addEventListener('pagehide', function () {
      if (!document.querySelector('.hero--studio')) history.scrollRestoration = 'auto';
    });
  }

  var burger = $('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      /* Clicked while the bars are still drawing on (Studio page load): hand
         each bar's current clip over to its transition, so the middle bar
         trims out from wherever it got to instead of finishing the draw
         first and then snapping. */
      burger.querySelectorAll('span').forEach(function (s) {
        var a = s.getAnimations ? s.getAnimations().filter(function (x) { return x.animationName; }) : [];
        if (!a.length) return;
        s.style.clipPath = getComputedStyle(s).clipPath;
        a.forEach(function (x) { x.cancel(); });
        void s.offsetWidth;
        s.style.clipPath = '';
      });
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      lockScroll(open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        lockScroll(false);
      }
    });
  }



  /* ── Hero sound / overlay toggle ─────────────────────────────────
     One control: clears the scrim and copy, and unmutes. The click is
     also the user gesture browsers demand before audio may play, so the
     unmute has to happen inside this handler. */
  var hero = document.querySelector('.hero');
  var heroVideo = $('heroVideo');
  var heroToggle = $('heroToggle');
  if (hero && heroVideo && heroToggle) {
    var label = heroToggle.querySelector('.hero-toggle-label');
    heroToggle.addEventListener('click', function () {
      var clean = hero.classList.toggle('clean');
      heroVideo.muted = !clean;
      heroToggle.setAttribute('aria-pressed', clean ? 'true' : 'false');
      if (label) label.textContent = clean ? 'Mute' : 'Play with sound';
      if (clean) {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
  }

  /* ── Leaving a page ────────────────────────────────────────────────
     Any internal link fades the page out quickly (a short lift, the
     reverse of the load-in) before it navigates. The header stays put
     between pages, except going back to the Studio page (the logo, or
     Studio in the menu): then the logo and burger fade too, so the Studio
     page can draw them in again. Delegated, so tiles built later count.
     New tabs, downloads, files, other sites and same-page anchors are left
     alone. */
  var LEAVE_MS = 200;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (a.origin !== location.origin || !/^https?:$/.test(a.protocol)) return;
    if (/\.(?!html$)[a-z0-9]+$/i.test(a.pathname)) return;           // a file, not a page
    if (a.pathname === location.pathname && a.hash) return;           // same-page anchor
    if (calm.matches) return;
    e.preventDefault();
    document.body.classList.add('page-leaving');
    if (a.pathname === '/' || a.pathname === '/index.html') document.body.classList.add('nav-leaving');
    setTimeout(function () { window.location.href = a.href; }, LEAVE_MS);
  });
  // Back/forward can restore this page from the cache mid-leave: undo it.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.body.classList.remove('page-leaving', 'nav-leaving', 'menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    lockScroll(false);
  });

  /* ── Logo draw-on (Studio page) ───────────────────────────────────
     Same move as the brand's logo animation (04_Admin/07_Brand.../
     Logo_Animation): the stroke draws left to right, driven by HORIZONTAL
     position rather than length so the tall spike doesn't stall it, and
     eased out (fast, then slowing into the end) rather than linear. The path is clipped at a moving x and rebuilt each frame,
     which keeps the round cap on the leading edge; a dash offset would
     draw by arc length instead. */
  var markPath = document.querySelector('.nav-logo path');
  if (markPath && document.querySelector('.hero--studio') &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var full = markPath.getAttribute('d');
    var P = (full.match(/-?[\d.]+,-?[\d.]+/g) || []).map(function (xy) {
      return xy.split(',').map(Number);
    });
    var X0 = P[0][0], X1 = P[P.length - 1][0];
    var DELAY = 350, DRAW = 1268;   // ms; the draw length is the animation's
    var cut = function (xt) {
      var out = [P[0]];
      for (var k = 1; k < P.length; k++) {
        var a = P[k - 1], b = P[k];
        if (b[0] <= xt) { out.push(b); continue; }
        if (xt > a[0]) {
          var t = (xt - a[0]) / (b[0] - a[0]);
          out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
        }
        break;
      }
      return 'M' + out.map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join(' L');
    };
    markPath.style.visibility = 'hidden';
    var t0 = null;
    var drawStep = function (now) {
      if (t0 === null) t0 = now;
      var p = (now - t0 - DELAY) / DRAW;
      if (p > 0) {
        markPath.style.visibility = 'visible';
        if (p >= 1) { markPath.setAttribute('d', full); return; }
        // ease-out: the sweep starts fast and slows into the end
        var e = 1 - Math.pow(1 - p, 3);
        markPath.setAttribute('d', cut(X0 + e * (X1 - X0)));
      }
      requestAnimationFrame(drawStep);
    };
    requestAnimationFrame(drawStep);
  }

  /* ── Letter jump ─────────────────────────────────────────────────
     Split each label into per-letter spans and hop them 50ms apart, so the
     word ripples rather than moving as a block. Anything with data-wave
     opts in, which is how the buttons get the same interaction as the menu.
     The hop scales with the label's font size: LIFT for the small button
     labels, a lower MENU_LIFT for the 5rem menu titles, where the same
     ratio reads as far too much.
     Web Animations, not a restarted CSS animation: restarting meant
     animation:none + a forced reflow per letter, which is part of what
     made the solid buttons flash mid-wiggle. */
  var LIFT = 0.36, MENU_LIFT = 0.13;
  document.querySelectorAll('.menu-links a, [data-wave]').forEach(function (link) {
    var text = link.textContent;
    link.innerHTML = text.split('').map(function (ch) {
      return ch === ' ' ? ' ' : '<span class="ltr">' + ch + '</span>';
    }).join('');

    var letters = link.querySelectorAll('.ltr');
    var timer = null;

    link.addEventListener('mouseenter', function () {
      var i = 0;
      var k = link.closest('.menu-links') ? MENU_LIFT : LIFT;
      var y = -k * (parseFloat(getComputedStyle(link).fontSize) || 16);
      clearInterval(timer);
      timer = setInterval(function () {
        if (i >= letters.length) { clearInterval(timer); return; }
        if (letters[i].animate) {
          letters[i].animate([
            { transform: 'translateY(0)', easing: 'ease' },
            { transform: 'translateY(' + y + 'px)', offset: 0.4, easing: 'ease' },
            { transform: 'translateY(0)' }
          ], { duration: 400 });
        }
        i++;
      }, 50);
    });
    link.addEventListener('mouseleave', function () { clearInterval(timer); });
  });

  /* ── Nav background on scroll ────────────────────────────────────*/
  var cue = document.querySelector('.scroll-cue');
  if (cue) {
    var onScroll = function () {
      if (cue) cue.classList.toggle('gone', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal ───────────────────────────────────────────────*/
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  /* The Studio page's project bands wait until they're well into the
     window (about a seventh of the way up from the bottom) before revealing, so
     each one gets a beat of scroll to itself. */
  var bandIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); bandIo.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      (el.classList.contains('band') ? bandIo : io).observe(el);
    });
  }

  /* ── Layered thumbnails ────────────────────────────────────────────
     A project with heroLayers gets its layers stacked inside the thumbnail
     instead of the flat cover. At rest they are the cover exactly; on
     hover the stack zooms in like the old scale-up, but each layer by a
     different amount (the back least, the front most), so the zoom has a
     little depth to it. The cover <img> stays underneath until every layer
     has loaded, and stays as the only thing for flat projects. */
  // zoom = the flat cover's own hover scale there: 4.5% on Work, 3.5% on the Studio bands
  function layeredThumb(p, media, hoverEl, zoom) {
    var layers = p.heroLayers;
    if (!layers || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!Array.isArray(layers)) layers = [{ src: layers.bg, k: 0.006, edge: true }, { src: layers.fg, k: 0.024 }];
    var box = document.createElement('div');
    box.className = 'thumb-stack';
    box.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('div');
    inner.className = 'thumb-stack-inner';
    box.appendChild(inner);
    var n = layers.length, loaded = 0, ar = 0;
    var els = layers.map(function (l, i) {
      var im = new Image();
      im.alt = ''; im.draggable = false;
      if (l.pad) {
        var o = (-l.pad * 100) + '%', sz = ((1 + 2 * l.pad) * 100) + '%';
        im.style.left = im.style.top = o; im.style.width = im.style.height = sz;
      }
      im.onload = function () {
        if (!ar) ar = im.naturalWidth / im.naturalHeight;   // padding is symmetric, so this is the hero's aspect
        if (++loaded === n) { media.appendChild(box); fit(); set(false); }
      };
      im.src = l.src;
      inner.appendChild(im);
      return im;
    });
    // the inner box is the hero, cover-fitted to the thumbnail like object-fit
    function fit() {
      var w = media.clientWidth, h = media.clientHeight;
      if (!w || !h || !ar) return;
      var bw = w, bh = w / ar;
      if (bh < h) { bh = h; bw = h * ar; }
      inner.style.width = bw + 'px'; inner.style.height = bh + 'px';
      inner.style.left = ((w - bw) / 2) + 'px'; inner.style.top = ((h - bh) / 2) + 'px';
    }
    function set(on) {
      var bar = ar || 16 / 9;
      els.forEach(function (el, i) {
        var depth = n > 1 ? 0.5 + i / (n - 1) : 1;      // 0.5 at the back to 1.5 at the front
        var z = layerRestScale(layers[i], bar) * (on ? 1 + zoom * depth : 1);
        el.style.transform = 'scale(' + z.toFixed(4) + ')';
      });
    }
    hoverEl.addEventListener('mouseenter', function () { set(true); });
    hoverEl.addEventListener('mouseleave', function () { set(false); });
    window.addEventListener('resize', fit);
  }

  /* ── Video thumbnails ──────────────────────────────────────────────
     A project whose hero is a looping video (heroLoop) has nothing to
     parallax, so hovering its thumbnail plays the loop over the still
     instead: it appears at once (the still is its own first frame) and
     plays. Leaving pauses it where it is; hovering again resumes. */
  function videoThumb(p, media, hoverEl) {
    if (!p.heroLoop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var v = document.createElement('video');
    v.className = 'thumb-video';
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    v.src = p.hero;
    media.appendChild(v);
    // no fade in: the still is the loop's first frame, so the video can
    // simply appear on top of it and start moving
    hoverEl.addEventListener('mouseenter', function () {
      if (v.readyState >= 2) v.classList.add('is-on');
      else v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
      var q = v.play(); if (q && q.catch) q.catch(function () {});
    });
    // leaving just pauses: the frame it stopped on stays up, and the next
    // hover carries on from there
    hoverEl.addEventListener('mouseleave', function () { v.pause(); });
  }

  /* ── Work grid (work page) ───────────────────────────────────────
     Static covers only — no hover video. */
  var grid = $('workGrid');
  var grid_i = 0;
  if (grid) {
    projects.forEach(function (p) {
      var tile = document.createElement('a');
      // No scroll-reveal here: on the Work page the grid IS the content, and
      // fading tiles in made it look like only the first four existed.
      tile.className = 'tile';
      tile.style.setProperty('--i', Math.min(grid_i++, 7));
      tile.href = '/' + p.slug;
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.title + '" loading="lazy" draggable="false">' +
        '</div>' +
        '<div class="tile-meta">' +
          '<div>' +
            '<p class="tile-cat">' + p.category + '</p>' +
            '<h2 class="tile-title">' + p.title + '</h2>' +
          '</div>' +
          '<span class="tile-arrow">&rarr;</span>' +
        '</div>';
      grid.appendChild(tile);
      layeredThumb(p, tile.querySelector('.tile-media'), tile, 0.045);
      videoThumb(p, tile.querySelector('.tile-media'), tile);
    });
  }

  /* ── Plugin grid (plugins page) ──────────────────────────────────
     Same .tile markup as the Work grid so the two pages read as one
     system. The only addition is a badge for anything not shipped —
     a plugin with no download still gets a page, it just says so on
     the tile instead of promising a button that isn't there.
     Title and host only under the shot; the tagline lives on the
     product page. */
  var pgrid = $('pluginGrid');
  /* `const plugins` in plugins.js is a lexical global, not a window
     property, so this has to be a typeof check rather than window.plugins. */
  if (pgrid && typeof plugins !== 'undefined') {
    grid_i = 0;
    plugins.forEach(function (p) {
      var tile = document.createElement('a');
      tile.className = 'tile';
      tile.style.setProperty('--i', Math.min(grid_i++, 7));
      tile.href = '/' + p.slug;
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.name + '" loading="lazy" draggable="false">' +
          ((p.downloads && p.downloads.length) || p.download
            ? '<span class="tile-badge">Free</span>'
            : '<span class="tile-badge tile-badge--soon">In development</span>') +
        '</div>' +
        '<div class="tile-meta">' +
          '<div>' +
            '<p class="tile-cat">' + p.host + '</p>' +
            '<h2 class="tile-title">' + p.name + '</h2>' +
          '</div>' +
          '<span class="tile-arrow">&rarr;</span>' +
        '</div>';
      pgrid.appendChild(tile);
    });
  }

  /* ── Featured bands (studio page) ────────────────────────────────
     Edit data-featured on #bands to change which projects appear. */
  var bands = $('bands');
  if (bands) {
    var featured = (bands.dataset.featured || '').split(',').map(function (s) { return s.trim(); });
    featured.forEach(function (slug) {
      var p = null;
      projects.forEach(function (q) { if (q.slug === slug) p = q; });
      if (!p) return;
      var el = document.createElement('a');
      el.className = 'band reveal';
      el.href = '/' + p.slug;
      el.innerHTML =
        '<div class="band-media"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy"></div>' +
        '<div class="band-meta">' +
          '<div>' +
            '<p class="band-cat">' + p.category + '</p>' +
            '<h3 class="band-title">' + p.title + '</h3>' +
          '</div>' +
          '<span class="band-arrow">→</span>' +
        '</div>';
      bands.appendChild(el);
      layeredThumb(p, el.querySelector('.band-media'), el, 0.035);
      videoThumb(p, el.querySelector('.band-media'), el);
    });
  }

  observeReveals();

  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
