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

  /* ── Letter jump ─────────────────────────────────────────────────
     Split each label into per-letter spans and run navWave across them
     50ms apart, so the word ripples rather than moving as a block.
     Same timing as the old nav. Anything with data-wave opts in, which
     is how the hero button gets the same interaction as the menu. */
  document.querySelectorAll('.menu-links a, [data-wave]').forEach(function (link) {
    var text = link.textContent;
    link.innerHTML = text.split('').map(function (ch) {
      return ch === ' ' ? ' ' : '<span class="ltr">' + ch + '</span>';
    }).join('');

    var letters = link.querySelectorAll('.ltr');
    var timer = null;

    link.addEventListener('mouseenter', function () {
      var i = 0;
      clearInterval(timer);
      timer = setInterval(function () {
        if (i >= letters.length) { clearInterval(timer); return; }
        var l = letters[i];
        l.style.animation = 'none';
        void l.offsetHeight;          // reflow so the animation can replay
        l.style.animation = 'navWave 0.4s ease forwards';
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
      tile.href = p.slug + '.html';
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.title + '" loading="lazy">' +
        '</div>' +
        '<div class="tile-meta">' +
          '<h2 class="tile-title">' + p.title + '</h2>' +
          '<span class="tile-cat">' + p.category + '</span>' +
        '</div>';
      grid.appendChild(tile);
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
      el.href = p.slug + '.html';
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
