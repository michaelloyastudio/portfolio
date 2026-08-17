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

    // A hero narrower than ~4:3 would be enormous at full width, so mark it
    // and let CSS cap the height instead (Album Covers is square).
    var hm = hero.firstElementChild;
    var flag = function () {
      var w = hm.naturalWidth || hm.videoWidth, h = hm.naturalHeight || hm.videoHeight;
      if (w && h) hero.classList.toggle('is-tall', (w / h) < 1.3);
    };
    hm.addEventListener(hm.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', flag);
    flag();
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
  if (prevEl) prevEl.href = prev.slug + '.html';
  if (nextEl) nextEl.href = next.slug + '.html';

  /* ── mosaic: justified rows ──────────────────────────────────────
     Greedily fill a row with tiles until scaling them to fit the
     container width brings the row height down to about the target,
     then lock that row in. Every tile in a row shares a height and each
     keeps its own aspect ratio, so gaps stay uniform and nothing is
     cropped or left as a hole. */
  function ratioOf(tile) {
    var m = tile.querySelector('img, video');
    if (!m) return 0;
    var w = m.naturalWidth || m.videoWidth;
    var h = m.naturalHeight || m.videoHeight;
    return (w && h) ? w / h : 0;
  }

  var pending = false;
  function layoutMosaic() {
    pending = false;
    document.querySelectorAll('#projectWork [class^="img-grid"]').forEach(function (grid) {
      var tiles = Array.prototype.slice.call(grid.children);
      if (!tiles.length) return;

      var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      var W = grid.clientWidth;
      if (!W) return;

      // Column count in the class name sets the target row height.
      var m = (grid.className.match(/img-grid-(\d)/) || [])[1];
      var perRow = Math.max(1, parseInt(m || '3', 10));
      if (W < 700) perRow = Math.min(perRow, 2);
      var target = (W - gap * (perRow - 1)) / perRow;

      var ratios = tiles.map(ratioOf);
      if (ratios.some(function (r) { return !r; })) { pending = true; return; }

      // justified = row spans the full width, so the last tile absorbs
      // rounding. A trailing row is NOT justified: stretching a lone tile
      // to full width would distort it.
      function flush(row, idx, height, justified) {
        var used = 0;
        row.forEach(function (t, n) {
          var w = (justified && n === row.length - 1)
            ? (W - gap * (row.length - 1)) - used
            : Math.round(height * ratios[idx + n]);
          used += w;
          t.style.width = w + 'px';
          t.style.height = Math.round(height) + 'px';
        });
      }

      var row = [], sum = 0, start = 0;
      tiles.forEach(function (t, i) {
        row.push(t); sum += ratios[i];
        var h = (W - gap * (row.length - 1)) / sum;
        // Break on the target height OR the column count. The count matters:
        // three portrait tiles are still short of the target, so without it
        // they'd keep collecting neighbours and end up small. Breaking at the
        // column count lets a row of verticals fill the width and stand tall.
        if (h <= target || row.length >= perRow) {
          flush(row, start, h, true); row = []; sum = 0; start = i + 1;
        }
      });
      if (row.length) {
        // Trailing row: cap at the target so a lone tile isn't blown up.
        flush(row, start, Math.min(target, (W - gap * (row.length - 1)) / sum), false);
      }
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
