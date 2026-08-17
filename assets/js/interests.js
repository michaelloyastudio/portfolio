/* ══════════════════════════════════════════════════════════════
   Interests — floating bubbles you can shove around with the cursor.
   Light circle-packing physics: gentle drift, cursor repulsion,
   pairwise separation, walls. No dependencies, no canvas.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var box = document.getElementById('interests');
  if (!box) return;

  var items;
  try { items = JSON.parse(box.dataset.items); } catch (e) { return; }
  if (!items || !items.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = box.clientWidth, H = box.clientHeight;
  var balls = [];

  items.forEach(function (it) {
    var el = document.createElement('span');
    el.className = 'bubble';
    el.dataset.kind = it.k;
    el.textContent = it.v;
    // Longer names get bigger circles so the text always fits.
    var r = Math.max(34, Math.min(62, 20 + it.v.length * 2.6));
    el.style.width = el.style.height = (r * 2) + 'px';
    el.style.fontSize = (r < 42 ? 0.62 : 0.72) + 'rem';
    el.title = it.k;
    box.appendChild(el);
    var ball = {
      el: el, r: r,
      x: r + Math.random() * Math.max(1, W - r * 2),
      y: r + Math.random() * Math.max(1, H - r * 2),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    };
    // Place immediately; without this every bubble sits stacked at the
    // origin until the first animation frame lands.
    el.style.transform = 'translate(' + (ball.x - r) + 'px,' + (ball.y - r) + 'px)';
    balls.push(ball);
  });

  var mx = -9999, my = -9999;
  box.addEventListener('mousemove', function (e) {
    var b = box.getBoundingClientRect();
    mx = e.clientX - b.left; my = e.clientY - b.top;
  });
  box.addEventListener('mouseleave', function () { mx = my = -9999; });

  function step() {
    for (var i = 0; i < balls.length; i++) {
      var a = balls[i];

      // cursor push
      var dx = a.x - mx, dy = a.y - my;
      var d = Math.sqrt(dx * dx + dy * dy);
      var reach = a.r + 90;
      if (d < reach && d > 0.01) {
        var push = (1 - d / reach) * 1.5;
        a.vx += (dx / d) * push;
        a.vy += (dy / d) * push;
        a.el.classList.add('lit');
      } else {
        a.el.classList.remove('lit');
      }

      // keep a lazy drift so it never fully settles
      a.vx += (Math.random() - 0.5) * 0.02;
      a.vy += (Math.random() - 0.5) * 0.02;

      a.vx *= 0.94; a.vy *= 0.94;
      a.x += a.vx; a.y += a.vy;

      // walls
      if (a.x < a.r) { a.x = a.r; a.vx = Math.abs(a.vx) * 0.5; }
      if (a.x > W - a.r) { a.x = W - a.r; a.vx = -Math.abs(a.vx) * 0.5; }
      if (a.y < a.r) { a.y = a.r; a.vy = Math.abs(a.vy) * 0.5; }
      if (a.y > H - a.r) { a.y = H - a.r; a.vy = -Math.abs(a.vy) * 0.5; }
    }

    // pairwise separation
    for (var p = 0; p < balls.length; p++) {
      for (var q = p + 1; q < balls.length; q++) {
        var A = balls[p], B = balls[q];
        var ox = B.x - A.x, oy = B.y - A.y;
        var dist = Math.sqrt(ox * ox + oy * oy) || 0.01;
        var min = A.r + B.r + 4;
        if (dist < min) {
          var overlap = (min - dist) / 2;
          var ux = ox / dist, uy = oy / dist;
          A.x -= ux * overlap; A.y -= uy * overlap;
          B.x += ux * overlap; B.y += uy * overlap;
          A.vx -= ux * 0.12; A.vy -= uy * 0.12;
          B.vx += ux * 0.12; B.vy += uy * 0.12;
        }
      }
    }

    for (var k = 0; k < balls.length; k++) {
      var b2 = balls[k];
      b2.el.style.transform =
        'translate(' + (b2.x - b2.r).toFixed(1) + 'px,' + (b2.y - b2.r).toFixed(1) + 'px)';
    }
    raf = requestAnimationFrame(step);
  }

  var raf = null;
  // Reduced motion: leave them where they were placed, no animation.
  if (reduce) return;

  // Only animate while the section is actually on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !raf) raf = requestAnimationFrame(step);
        else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { rootMargin: '100px' }).observe(box);
  } else { raf = requestAnimationFrame(step); }

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { W = box.clientWidth; H = box.clientHeight; }, 150);
  });
})();
