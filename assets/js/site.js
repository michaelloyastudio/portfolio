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

  /* ── Slugs ───────────────────────────────────────────────────────
     Keeps #project/<slug> anchors stable and lets pages cross-link
     into a specific project. Kept here rather than in projects.js so
     that file stays pure content. */
  var SLUGS = {
    'where it hurts.':      'where-it-hurts',
    'Loya':                 'loya',
    'BODYARMOR & Powerade': 'bodyarmor-powerade',
    'University Union':     'university-union',
    'Album Covers':         'album-covers',
    'Miscellaneous':        'miscellaneous'
  };
  function slugOf(p) { return SLUGS[p.title] || ''; }
  function indexOfSlug(slug) {
    for (var i = 0; i < projects.length; i++) {
      if (slugOf(projects[i]) === slug) return i;
    }
    return -1;
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

  /* ── Nav background on scroll ────────────────────────────────────*/
  var nav = $('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 40); };
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

  /* ── Project detail overlay ──────────────────────────────────────
     Rendered on any page that includes the #detail markup. */
  var detail = $('detail');
  var current = -1;

  function openDetail(i, pushHash) {
    if (!detail) return;
    var p = projects[i];
    if (!p) return;
    current = i;
    $('detailTitle').textContent = p.title;
    $('detailCat').textContent = p.category;
    $('detailTools').textContent = p.tools;
    $('detailYear').textContent = p.year;
    $('detailHero').src = p.cover;
    $('detailHero').alt = p.title;
    $('detailBody').innerHTML = p.content;
    $('detailCount').textContent = (i + 1) + ' / ' + projects.length;
    // Remember where they were in the grid so Back returns them to it.
    if (!document.body.classList.contains('project-open')) returnY = window.scrollY;
    if (document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      lockScroll(false);
    }
    document.body.classList.add('project-open');
    window.scrollTo(0, 0);
    if (pushHash && slugOf(p)) history.replaceState(null, '', '#project/' + slugOf(p));
  }

  var returnY = 0;

  function closeDetail() {
    if (!detail) return;
    document.body.classList.remove('project-open');
    detail.querySelectorAll('video').forEach(function (v) { v.pause(); });
    history.replaceState(null, '', location.pathname);
    current = -1;
    // Restore without the smooth-scroll animation, so it feels like going back.
    var prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, returnY);
    document.documentElement.style.scrollBehavior = prev;
  }

  if (detail) {
    $('detailBack').addEventListener('click', closeDetail);
    $('detailPrev').addEventListener('click', function () {
      openDetail((current - 1 + projects.length) % projects.length, true);
    });
    $('detailNext').addEventListener('click', function () {
      openDetail((current + 1) % projects.length, true);
    });
  }

  /* ── Work grid (work page) ───────────────────────────────────────
     Static covers only — no hover video. */
  var grid = $('workGrid');
  if (grid) {
    projects.forEach(function (p, i) {
      var tile = document.createElement('article');
      tile.className = 'tile reveal';
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.title + '" loading="lazy">' +
        '</div>' +
        '<div class="tile-meta">' +
          '<h2 class="tile-title">' + p.title + '</h2>' +
          '<span class="tile-cat">' + p.category + '</span>' +
        '</div>';
      tile.addEventListener('click', function () { openDetail(i, true); });
      grid.appendChild(tile);
    });
  }

  /* ── Featured bands (studio page) ────────────────────────────────
     Edit data-featured on #bands to change which projects appear. */
  var bands = $('bands');
  if (bands) {
    var featured = (bands.dataset.featured || '').split(',').map(function (s) { return s.trim(); });
    featured.forEach(function (slug) {
      var i = indexOfSlug(slug);
      if (i < 0) return;
      var p = projects[i];
      var el = document.createElement('article');
      el.className = 'band reveal';
      el.innerHTML =
        '<div class="band-media"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy"></div>' +
        '<div class="band-meta">' +
          '<div>' +
            '<p class="band-cat">' + p.category + '</p>' +
            '<h3 class="band-title">' + p.title + '</h3>' +
          '</div>' +
          '<span class="band-arrow">→</span>' +
        '</div>';
      el.addEventListener('click', function () { openDetail(i, true); });
      bands.appendChild(el);
    });
  }

  observeReveals();

  /* ── In-page project links (About experience, etc.) ──────────────*/
  document.querySelectorAll('a[href^="#project/"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var i = indexOfSlug(a.getAttribute('href').slice('#project/'.length));
      if (i < 0 || !detail) return;   // no overlay here: let the link fall through
      e.preventDefault();
      openDetail(i, true);
    });
  });

  /* ── Lightbox ────────────────────────────────────────────────────*/
  var lb = $('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.addEventListener('click', function (e) {
      var img = e.target.closest('[data-zoom], .detail-body .project-img img');
      if (img && img.tagName === 'IMG') {
        lbImg.src = img.src;
        lb.classList.add('open');
      }
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
  }

  /* ── Keyboard ────────────────────────────────────────────────────*/
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lb && lb.classList.contains('open')) { lb.classList.remove('open'); return; }
      if (detail && document.body.classList.contains('project-open')) closeDetail();
      return;
    }
    if (!detail || !document.body.classList.contains('project-open')) return;
    if (lb && lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  openDetail((current - 1 + projects.length) % projects.length, true);
    if (e.key === 'ArrowRight') openDetail((current + 1) % projects.length, true);
  });

  /* ── Cursor-following icon (About skill tags) ────────────────────*/
  var hovIcon = $('hovIcon');
  if (hovIcon) {
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('.hov[data-icon]');
      if (!t || !t.dataset.icon) return;
      hovIcon.src = t.dataset.icon;
      hovIcon.classList.toggle('lg', t.dataset.size === 'lg');
      hovIcon.classList.add('on');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('.hov[data-icon]')) hovIcon.classList.remove('on');
    });
    document.addEventListener('mousemove', function (e) {
      if (!hovIcon.classList.contains('on')) return;
      hovIcon.style.left = (e.clientX + 26) + 'px';
      hovIcon.style.top  = (e.clientY - 6) + 'px';
    });
  }

  /* ── Deep link on load ───────────────────────────────────────────*/
  if (detail && location.hash.indexOf('#project/') === 0) {
    var i = indexOfSlug(location.hash.slice('#project/'.length));
    if (i >= 0) openDetail(i, false);
  }

  /* ── TEMPORARY display-font toggle ───────────────────────────────
     Flips <html data-font> between the two candidates and remembers the
     choice across pages. Delete this block with the button and CSS. */
  var fontToggle = $('fontToggle');
  if (fontToggle) {
    var label = function () {
      var din = document.documentElement.getAttribute('data-font') === 'din';
      fontToggle.textContent = din ? 'DIN' : 'Aa';
      fontToggle.title = din
        ? 'Display font: DIN 2014 Rounded — click for Space Grotesk'
        : 'Display font: Space Grotesk — click for DIN 2014 Rounded';
    };
    label();
    fontToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-font') === 'din' ? 'grotesk' : 'din';
      document.documentElement.setAttribute('data-font', next);
      try { localStorage.setItem('ml-font', next); } catch (e) {}
      label();
    });
  }

  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
