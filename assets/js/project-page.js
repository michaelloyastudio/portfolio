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
  noWidows($('projectIntro'));
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
        if ((!exact && h <= target) || row.length >= perRow) {
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

  /* ── Sound, one clip at a time ────────────────────────────────────
     Autoplay only works muted, so every grid clip starts silent. This is
     the way back in: hover a tile, hit the button, that clip gets the
     audio. Unmuting one mutes whatever was playing before — two
     soundtracks over each other is never what you want, and the user
     shouldn't have to go hunting for the one they left on.
     The audio survives the scroll pause below: the clip is paused when it
     leaves the screen and resumes still unmuted, which keeps sound from
     playing for something nobody can see. */
  var ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.2-3.9v2.2l2.1 2.1c.06-.13.1-.26.1-.4zm2.5 0c0 .94-.2 1.83-.55 2.63l1.5 1.5A8.9 8.9 0 0 0 21 12a9 9 0 0 0-6.7-8.7v2.1A6.9 6.9 0 0 1 19 12zM2.3 2.3 1 3.6l4.4 4.4H3v8h4l5 5v-6.7l4.2 4.2c-.66.5-1.4.9-2.2 1.15v2.06a9 9 0 0 0 3.66-1.78L20.4 22l1.3-1.3L2.3 2.3zM12 4 9.9 6.1 12 8.2V4z"/></svg>';
  var ICON_ON  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a6.99 6.99 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/></svg>';

  var sounded = document.querySelectorAll('#projectWork [class^="img-grid"] video[autoplay]');
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
