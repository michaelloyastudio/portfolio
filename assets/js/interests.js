/* ══════════════════════════════════════════════════════════════
   Interests — circles drifting in a shallow 3D field.
   Each has a simulated depth that drives its scale, blur, opacity and
   z-index, so they pass in front of and behind one another. They move
   on their own; the cursor only nudges them gently.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var box = document.getElementById('interests');
  if (!box) return;

  var items;
  try { items = JSON.parse(box.dataset.items); } catch (e) { return; }
  if (!items || !items.length) return;

  var W = box.clientWidth, H = box.clientHeight;
  var balls = [];

  items.forEach(function (it) {
    var el = document.createElement('span');
    el.className = 'bubble';
    el.dataset.kind = it.k;
    el.title = it.k + ' — ' + it.v;

    // Depth: 0 = far, 1 = near. Drives size, blur, opacity, stacking.
    var z = Math.random();
    var base = 46 + z * 46;                 // radius before scale

    if (it.img) {
      var img = document.createElement('img');
      img.src = 'assets/interests/' + it.img;
      img.alt = it.v;
      // No image on disk yet? Fall back to the label rather than a blank disc.
      img.addEventListener('error', function () {
        img.remove();
        el.textContent = it.v;
      });
      el.appendChild(img);
    } else {
      el.textContent = it.v;
    }

    el.style.width = el.style.height = (base * 2) + 'px';
    el.style.fontSize = (base < 60 ? 0.6 : 0.7) + 'rem';
    el.style.zIndex = Math.round(z * 100);
    el.style.opacity = (0.45 + z * 0.55).toFixed(2);
    el.style.filter = z < 0.5 ? 'blur(' + ((0.5 - z) * 3).toFixed(1) + 'px)' : 'none';
    box.appendChild(el);

    var ball = {
      el: el, r: base, z: z,
      x: base + Math.random() * Math.max(1, W - base * 2),
      y: base + Math.random() * Math.max(1, H - base * 2),
      // Nearer circles drift a little faster — cheap parallax.
      vx: (Math.random() - 0.5) * (0.25 + z * 0.35),
      vy: (Math.random() - 0.5) * (0.25 + z * 0.35)
    };
    el.style.transform = 'translate(' + (ball.x - base) + 'px,' + (ball.y - base) + 'px)';
    balls.push(ball);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var mx = -9999, my = -9999;
  box.addEventListener('mousemove', function (e) {
    var b = box.getBoundingClientRect();
    mx = e.clientX - b.left; my = e.clientY - b.top;
  });
  box.addEventListener('mouseleave', function () { mx = my = -9999; });

  function step() {
    var i, a;
    for (i = 0; i < balls.length; i++) {
      a = balls[i];

      // Gentle cursor nudge — deliberately weak and short-range.
      var dx = a.x - mx, dy = a.y - my;
      var d = Math.sqrt(dx * dx + dy * dy);
      var reach = a.r + 40;
      if (d < reach && d > 0.01) {
        var push = (1 - d / reach) * 0.28 * a.z;   // nearer ones react more
        a.vx += (dx / d) * push;
        a.vy += (dy / d) * push;
      }

      // Self-directed wander so the field never goes still.
      a.vx += (Math.random() - 0.5) * 0.03;
      a.vy += (Math.random() - 0.5) * 0.03;

      // Light damping, with a floor so drift persists.
      a.vx *= 0.985; a.vy *= 0.985;
      var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      var min = 0.08 + a.z * 0.12;
      if (sp < min && sp > 0.0001) { a.vx = a.vx / sp * min; a.vy = a.vy / sp * min; }

      a.x += a.vx; a.y += a.vy;

      // Wrap around the edges — they're floating, not boxed in.
      if (a.x < -a.r) a.x = W + a.r;
      if (a.x > W + a.r) a.x = -a.r;
      if (a.y < -a.r) a.y = H + a.r;
      if (a.y > H + a.r) a.y = -a.r;
    }

    // Only separate circles at similar depths; different planes pass through.
    for (var p = 0; p < balls.length; p++) {
      for (var q = p + 1; q < balls.length; q++) {
        var A = balls[p], B = balls[q];
        if (Math.abs(A.z - B.z) > 0.22) continue;
        var ox = B.x - A.x, oy = B.y - A.y;
        var dist = Math.sqrt(ox * ox + oy * oy) || 0.01;
        var minD = (A.r + B.r) * 0.8;
        if (dist < minD) {
          var push2 = (minD - dist) / 2 * 0.35;
          var ux = ox / dist, uy = oy / dist;
          A.x -= ux * push2; A.y -= uy * push2;
          B.x += ux * push2; B.y += uy * push2;
        }
      }
    }

    for (i = 0; i < balls.length; i++) {
      a = balls[i];
      a.el.style.transform =
        'translate(' + (a.x - a.r).toFixed(1) + 'px,' + (a.y - a.r).toFixed(1) + 'px)';
    }
    raf = requestAnimationFrame(step);
  }

  var raf = null;
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
