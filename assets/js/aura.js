// Gooey cursor aura — carried over from the original Playground.
// Particles spawn along the cursor path and merge via an SVG goo filter.
// Only runs while <body> has the .playground class.
(function () {
  var mount = document.body;
  if (!mount) return;
  if (window.matchMedia('(hover: none)').matches) return; // touch: skip entirely

  // ─ goo filter ─
  var defs = document.createElement('div');
  defs.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  defs.innerHTML = ''
    + '<svg width="0" height="0" style="position:absolute">'
    +   '<defs>'
    +     '<filter id="aura-goo" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">'
    +       '<feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur"/>'
    +       '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 36 -14" result="goo"/>'
    +     '</filter>'
    +   '</defs>'
    + '</svg>';
  document.body.appendChild(defs);

  // ─ shared gradient stylesheet ─
  // All particles reference ONE radial gradient anchored to the cursor, so new
  // spawns can't recolor the merged mass. The gradient is ~3x typical drift
  // radius so tail particles never fall outside it and render transparent.
  var GRAD_SIZE = 1400;
  var gradStyle = document.createElement('style');
  gradStyle.textContent = ''
    + '.aura-particle {'
    + '  position:absolute; top:0; left:0;'
    + '  border-radius:50%;'
    + '  background-color: rgb(228,82,38);'
    + '  background-image: radial-gradient(circle,'
    + '    rgb(255,190,110) 0%,'
    + '    rgb(255,142,61) 28%,'
    + '    rgb(235,85,40) 65%,'
    + '    rgb(228,82,38) 100%);'
    + '  background-repeat:no-repeat;'
    + '  background-size:' + GRAD_SIZE + 'px ' + GRAD_SIZE + 'px;'
    + '  opacity:0; pointer-events:none;'
    + '  will-change:transform,opacity;'
    + '}';
  document.head.appendChild(gradStyle);

  var container = document.createElement('div');
  container.style.cssText = [
    'position:fixed', 'inset:0', 'pointer-events:none', 'z-index:5',
    'opacity:1', 'filter:url(#aura-goo)', 'will-change:contents'
  ].join(';');
  mount.appendChild(container);

  // ─ particle pool ─
  var POOL_SIZE = 100;
  var pool = [];
  for (var i = 0; i < POOL_SIZE; i++) {
    var el = document.createElement('div');
    el.className = 'aura-particle';
    container.appendChild(el);
    pool.push({ el: el, active: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 0 });
  }

  // ─ head particle ─
  var HEAD_SIZE = 90;
  var HEAD_BG = (HEAD_SIZE / 2 - GRAD_SIZE / 2);
  var head = document.createElement('div');
  head.className = 'aura-particle';
  head.style.width = HEAD_SIZE + 'px';
  head.style.height = HEAD_SIZE + 'px';
  head.style.backgroundPosition = HEAD_BG + 'px ' + HEAD_BG + 'px';
  container.appendChild(head);
  var headOp = 0;
  var HEAD_FADE_DELAY = 220;

  // ─ cursor tracking ─
  var lastX = 0, lastY = 0;
  var cursorX = window.innerWidth / 2;
  var cursorY = window.innerHeight / 2;
  var hasFirst = false;

  function active() {
    return document.body.classList.contains('playground');
  }

  function spawnAt(x, y, vx, vy) {
    var p = null;
    for (var i = 0; i < pool.length; i++) {
      if (!pool[i].active) { p = pool[i]; break; }
    }
    if (!p) return;
    p.active = true;
    p.x = x; p.y = y;
    // Tight velocity inheritance + minimal jitter so particles follow a clean
    // cursor path rather than puffing out radially.
    var jitterAng = Math.random() * Math.PI * 2;
    var jitter = Math.random() * 0.4;
    p.vx = vx * 0.32 + Math.cos(jitterAng) * jitter;
    p.vy = vy * 0.32 + Math.sin(jitterAng) * jitter;
    p.age = 0;
    p.life = 60 + Math.random() * 30;
    p.size = 65 + Math.random() * 25;
    p.el.style.width = p.size + 'px';
    p.el.style.height = p.size + 'px';
  }

  // Throttle spawns so slow movement doesn't flood a tiny area (which made the
  // merged shape visibly pulse as individuals aged).
  var lastSpawnT = 0;
  var MIN_SPAWN_DIST = 6;      // px since last spawn
  var MIN_SPAWN_INTERVAL = 28; // ms since last spawn

  document.addEventListener('mousemove', function (e) {
    var prevX = cursorX, prevY = cursorY;
    cursorX = e.clientX;
    cursorY = e.clientY;
    var predictedX = cursorX + (cursorX - prevX) * 0.5;
    var predictedY = cursorY + (cursorY - prevY) * 0.5;
    head.style.transform =
      'translate(' + (predictedX - HEAD_SIZE / 2) + 'px, ' + (predictedY - HEAD_SIZE / 2) + 'px)';

    if (!active()) { hasFirst = false; return; }
    if (!hasFirst) { lastX = e.clientX; lastY = e.clientY; hasFirst = true; return; }

    var now = performance.now();
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MIN_SPAWN_DIST && now - lastSpawnT < MIN_SPAWN_INTERVAL) return;

    // One particle per ~SPAWN_SPACING px of travel, last one landing exactly at
    // the cursor so the head never visibly detaches at speed.
    var SPAWN_SPACING = 18;
    var n = Math.min(14, Math.max(1, Math.ceil(dist / SPAWN_SPACING)));
    for (var s = 1; s <= n; s++) {
      var t = s / n;
      spawnAt(lastX + dx * t, lastY + dy * t, dx, dy);
    }
    lastX = e.clientX;
    lastY = e.clientY;
    lastSpawnT = now;
  });

  document.addEventListener('mouseleave', function () { hasFirst = false; });

  // ─ simulate ─
  var DRAG = 0.97;
  function tick() {
    var idleFor = performance.now() - lastSpawnT;
    var headTarget = (active() && idleFor < HEAD_FADE_DELAY) ? 1 : 0;
    headOp += (headTarget - headOp) * (headTarget > headOp ? 0.30 : 0.10);
    head.style.opacity = headOp.toFixed(3);

    for (var i = 0; i < pool.length; i++) {
      var p = pool[i];
      if (!p.active) continue;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.age += 1;
      var lifeRatio = p.age / p.life;
      if (lifeRatio >= 1) { p.active = false; p.el.style.opacity = '0'; continue; }

      var scale, op;
      if (lifeRatio < 0.30) {
        var t = lifeRatio / 0.30;
        var eased = t * (2 - t);
        scale = eased; op = eased;
      } else {
        var t2 = (lifeRatio - 0.30) / 0.70;
        scale = 1 - t2 * t2 * 0.5 - t2 * 0.5;
        op = 1;
      }
      p.el.style.opacity = op.toFixed(3);
      p.el.style.transform =
        'translate(' + (p.x - p.size / 2) + 'px, ' + (p.y - p.size / 2) + 'px)' +
        ' scale(' + scale.toFixed(3) + ')';
      p.el.style.backgroundPosition =
        (cursorX - (p.x - p.size / 2) - GRAD_SIZE / 2).toFixed(1) + 'px ' +
        (cursorY - (p.y - p.size / 2) - GRAD_SIZE / 2).toFixed(1) + 'px';
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
