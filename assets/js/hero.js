/* ══════════════════════════════════════════════════════════════
   Studio hero: slot-machine category, work reveal, parallax.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reel = document.getElementById('slotReel');
  var work = document.getElementById('heroWork');
  if (!reel) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Categories the reel spins through before landing. The last entry is
     the one it settles on, so order matters. */
  var SPIN = [
    'brand campaigns',
    'music videos',
    'motion design',
    'cover art',
    'art direction',
    'event design',
    'title sequences',
    'creative direction'
  ];
  var LAND = 'video production.';

  /* Star pip on the "i", same treatment as the title: a dotless i with the
     star absolutely placed where the tittle would sit. */
  var STAR = '<svg class="pip" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 0c.6 6.3 5.1 10.8 12 12-6.9 1.2-11.4 5.7-12 12-.6-6.3-5.1-10.8-12-12C6.9 10.8 11.4 6.3 12 0z"/>' +
    '</svg>';

  function word(text, starOnI) {
    var html = text;
    if (starOnI) {
      // star goes on the i in "production"
      html = text.replace('production', 'product<span class="pip-i">ı' + STAR + '</span>on');
    }
    return '<span class="slot-word">' + html + '</span>';
  }

  // Two passes of the spin list give it enough travel to read as a spin.
  var order = SPIN.concat(SPIN);
  var html = '';
  for (var i = 0; i < order.length; i++) html += word(order[i], false);
  html += word(LAND, true);
  reel.innerHTML = html;

  var words = reel.querySelectorAll('.slot-word');
  var last = words.length - 1;

  function stepHeight() {
    return words[0].getBoundingClientRect().height || 0;
  }

  function settle() {
    if (!work) return;
    // Reveal the work once the reel has landed.
    work.classList.add('is-in');
  }

  if (reduce) {
    reel.style.transform = 'translateY(' + (-last * stepHeight()) + 'px)';
    settle();
  } else {
    /* Decelerating spin: each step waits a little longer than the last,
       so it reads as a slot losing momentum rather than a timed carousel.
       Total lands around 2.1s — long enough to register, short enough that
       the work isn't held back. */
    var delay = 55;
    var t = 0;
    for (var n = 1; n <= last; n++) {
      (function (index, at) {
        setTimeout(function () {
          reel.style.transform = 'translateY(' + (-index * stepHeight()) + 'px)';
          if (index === last) setTimeout(settle, 160);
        }, at);
      })(n, t);
      t += delay;
      delay *= 1.135;          // the deceleration curve
    }
  }

  /* ── Parallax ─────────────────────────────────────────────────────
     Layers drift at different rates as the hero leaves the viewport.
     translate3d only — no layout properties — and driven off rAF so it
     stays on the compositor. */
  if (!reduce) {
    var title = document.querySelector('.studio-title');
    var lede = document.querySelector('.hero-lede');
    var ticking = false;

    function parallax() {
      var y = window.scrollY;
      if (title) title.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
      if (lede)  lede.style.transform  = 'translate3d(0,' + (y * 0.06).toFixed(1) + 'px,0)';
      if (work && work.classList.contains('is-in')) {
        work.style.transform = 'translate3d(0,' + (y * -0.05).toFixed(1) + 'px,0)';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(parallax);
    }, { passive: true });
  }
})();
