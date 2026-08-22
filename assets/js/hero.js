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

  /* Reel order is LANDING FIRST, spin words after. The reel starts pushed
     to the bottom of the list and travels back to 0, so the words fall
     downward through the window and it settles on the first one — the way
     a real reel reads. Building it the other way scrolls upward. */
  var order = SPIN.concat(SPIN);
  var html = word(LAND, true);
  for (var i = 0; i < order.length; i++) html += word(order[i], false);
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
    reel.style.transform = 'translateY(0)';
    settle();
  } else {
    /* One continuous travel from the far end of the reel back to index 0,
       eased so it spins fast and then slows into the landing. Stepping the
       transform position by position is what made it jump-cut — each write
       snapped instead of scrolling. */
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(' + (-last * stepHeight()) + 'px)';
    void reel.offsetHeight;                      // commit the start position
    reel.style.transition = '';                  // hand back to the stylesheet

    requestAnimationFrame(function () {
      reel.style.transform = 'translateY(0)';
    });

    var landed = false;
    function onLanded() {
      if (landed) return;
      landed = true;
      settle();
    }
    reel.addEventListener('transitionend', onLanded, { once: true });
    // belt and braces: transitionend can be missed if the tab is throttled
    setTimeout(onLanded, 2600);
  }


  /* ── Fit the title to the margins ─────────────────────────────────
     A vw font-size can only be correct at one viewport; everywhere else
     the line falls short of the margin or overshoots it. Measure the
     string once and scale to the container instead. Runs after the fonts
     resolve, since the fallback's metrics differ. */
  function fitTitle() {
    var title = document.querySelector('.studio-title');
    if (!title) return;
    var avail = title.clientWidth;
    if (!avail) return;
    var probe = 100;
    title.style.fontSize = probe + 'px';
    var rng = document.createRange();
    rng.selectNodeContents(title);
    var w = rng.getBoundingClientRect().width;
    if (!w) { title.style.fontSize = ''; return; }
    title.style.fontSize = (probe * (avail / w)).toFixed(2) + 'px';
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  fitTitle();
  window.addEventListener('resize', fitTitle);

  /* ── Parallax ─────────────────────────────────────────────────────
     Layers drift at different rates as the hero leaves the viewport.
     Written straight from the scroll handler rather than gated behind
     requestAnimationFrame: browsers already coalesce scroll to a frame,
     and the rAF gate silently does nothing whenever frames are throttled
     (background tab, some embedded views), which looks like no parallax
     at all. Three transform-only writes are cheap.
     Rates are fractions of scroll distance — the work drifts against the
     text, which is what gives the depth. */
  if (!reduce) {
    var title = document.querySelector('.studio-title');
    var lede = document.querySelector('.hero-lede');
    var hero = document.querySelector('.hero--studio');

    function parallax() {
      var y = window.scrollY || window.pageYOffset || 0;
      // stop computing once the hero is well off screen
      if (hero && y > hero.offsetHeight + 200) return;
      if (title) title.style.transform = 'translate3d(0,' + (y * 0.34).toFixed(2) + 'px,0)';
      if (lede)  lede.style.transform  = 'translate3d(0,' + (y * 0.19).toFixed(2) + 'px,0)';
      if (work)  work.style.transform  = 'translate3d(0,' + (y * -0.16).toFixed(2) + 'px,0)';
    }

    window.addEventListener('scroll', parallax, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }
})();
