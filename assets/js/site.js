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
  var burger = $('burger');
  if (burger) {
    burger.addEventListener('click', function () {
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

  /* ── Logo draw-on (Studio page) ───────────────────────────────────
     Same move as the brand's logo animation (04_Admin/07_Brand.../
     Logo_Animation): the stroke draws left to right at a constant
     HORIZONTAL rate, not along its length, so the tall spike doesn't slow
     it down. The path is clipped at a moving x and rebuilt each frame,
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
        markPath.style.visibility = '';
        if (p >= 1) { markPath.setAttribute('d', full); return; }
        markPath.setAttribute('d', cut(X0 + p * (X1 - X0)));
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

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  }

  /* ── Work grid (work page) ───────────────────────────────────────
     Static covers only — no hover video. */
  var grid = $('workGrid');
  if (grid) {
    projects.forEach(function (p) {
      var tile = document.createElement('a');
      // No scroll-reveal here: on the Work page the grid IS the content, and
      // fading tiles in made it look like only the first four existed.
      tile.className = 'tile';
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
    plugins.forEach(function (p) {
      var tile = document.createElement('a');
      tile.className = 'tile';
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
    });
  }

  observeReveals();

  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
