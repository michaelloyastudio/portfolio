/* ══════════════════════════════════════════════════════════════
   Project page renderer.
   Each /<slug>.html sets window.PROJECT_SLUG, then this fills in the
   hero, title, copy, and media from projects.js. Content lives in one
   place; the per-project HTML files stay thin.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var slug = window.PROJECT_SLUG;
  var i = -1;
  projects.forEach(function (p, n) { if (p.slug === slug) i = n; });
  if (i < 0) return;

  var p = projects[i];
  var $ = function (id) { return document.getElementById(id); };
  var isVideo = /\.(mp4|mov|webm)$/i.test(p.hero || '');

  document.title = p.title + ' — Michael Loya Studio';

  // ── hero ──
  var hero = $('projectHero');
  if (hero) {
    hero.innerHTML = isVideo
      ? '<video src="' + p.hero + '" controls playsinline preload="metadata"' +
        (p.heroPoster ? ' poster="' + p.heroPoster + '"' : '') + '></video>'
      : '<img src="' + p.hero + '" alt="' + p.title + '">';
  }

  // ── title block ──
  $('projectTitle').textContent = p.title;
  $('projectCategory').textContent = p.category;
  $('projectIntro').innerHTML = p.intro;
  $('projectTools').textContent = p.tools;
  $('projectYear').textContent = p.year;

  // ── media ──
  $('projectWork').innerHTML = p.work;

  // ── prev / next ──
  var prev = projects[(i - 1 + projects.length) % projects.length];
  var next = projects[(i + 1) % projects.length];
  var prevEl = $('projectPrev'), nextEl = $('projectNext');
  if (prevEl) { prevEl.href = prev.slug + '.html'; prevEl.querySelector('span').textContent = prev.title; }
  if (nextEl) { nextEl.href = next.slug + '.html'; nextEl.querySelector('span').textContent = next.title; }

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
})();
