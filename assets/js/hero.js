/* ══════════════════════════════════════════════════════════════
   Studio hero: slot-machine category, work reveal, parallax.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reel = document.getElementById('slotReel');
  var work = document.getElementById('heroWork');
  if (!reel) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Categories the reel spins through before landing on LAND.
     READ THIS LIST BACKWARDS to picture the spin. The reel is built with
     LAND first and travels from the far end back to index 0, so the DOM
     order plays in reverse: the LAST entry here is the first word you
     see, and SPIN[0] is the one that flicks past immediately before the
     reel settles. The four that matter are the four at the top. */
  var SPIN = [
    'motion design',        // last thing seen before it lands
    'creative direction',
    'music production',
    'event design',
    // the rest, seen earlier in the spin while it's still moving fast
    'brand campaigns',
    'music videos',
    'cover art',
    'art direction',
    'title sequences'
  ];
  var LAND = 'video production.';

  /* Star pip on the "i", same treatment as the title: a dotless i with the
     star absolutely placed where the tittle would sit. Every i on the reel
     gets one now, not just the landing word, so the motif holds through
     the whole spin instead of only showing up at the end. */
  var STAR = '<svg class="pip" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 0c.6 6.3 5.1 10.8 12 12-6.9 1.2-11.4 5.7-12 12-.6-6.3-5.1-10.8-12-12C6.9 10.8 11.4 6.3 12 0z"/>' +
    '</svg>';

  // Blind replace is safe here: the words are plain text, never markup.
  function starDots(text) {
    return text.replace(/i/g, '<span class="pip-i">ı' + STAR + '</span>');
  }

  /* Two boxes, not one. .slot-word is the reel's STEP (its height is the
     travel distance); .slot-ink carries the glyphs and is placed inside it
     by transform. Sizing the step off line-height instead would drag
     Warbler's line box along with it — see tuneToFont. */
  function word(text) {
    return '<span class="slot-word"><span class="slot-ink">' +
           starDots(text) + '</span></span>';
  }

  /* Reel order is LANDING FIRST, spin words after. The reel starts pushed
     to the bottom of the list and travels back to 0, so the words fall
     downward through the window and it settles on the first one — the way
     a real reel reads. Building it the other way scrolls upward. */
  var order = SPIN.concat(SPIN);
  var html = word(LAND);
  for (var i = 0; i < order.length; i++) html += word(order[i]);
  reel.innerHTML = html;

  var words = reel.querySelectorAll('.slot-word');
  var last = words.length - 1;

  function stepHeight() {
    return words[0].getBoundingClientRect().height || 0;
  }

  function settle() {
    if (!work) return;
    // Reveal the work once the reel has landed, and start the loop on the
    // same beat — it holds on its poster until then rather than playing
    // behind a blur nobody can see.
    work.classList.add('is-in');
    var v = work.querySelector('video');
    if (v) {
      var p = v.play();
      // If the element isn't ready yet the promise rejects; try once more
      // when it has enough data rather than leaving it on the poster.
      if (p && p.catch) p.catch(function () {
        v.addEventListener('canplay', function () {
          var q = v.play(); if (q && q.catch) q.catch(function () {});
        }, { once: true });
      });
    }
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


  /* ── Tune to the font that actually loaded ────────────────────────
     The slot's height and the star's placement both fall out of Warbler's
     VERTICAL metrics, and those are not a property of the design — they
     are a property of whichever Warbler is serving. Same outlines, two
     different sets of numbers:

       desktop (Creative Cloud sync)   ascent 0.97em  descent 0.24em
       Adobe web project               ascent 1.32em  descent 0.38em

     Every constant here was originally derived against the desktop font,
     because that was the only one that existed until the web project went
     live. The moment the kit started serving, the content box grew from
     1.21em to 1.70em: the slot clipped the p in "production" by 0.058em,
     and the dotless i's ink top moved 0.135em down, leaving the star
     floating above the stem it belongs to.

     So measure, don't assume. Runs once after fonts settle; everything is
     in em, so it holds at every size and viewport. The stylesheet keeps
     the old values as fallbacks for the paint before this runs. */
  function faceOf(el, px) {
    var cs = getComputedStyle(el);
    return cs.fontStyle + ' ' + cs.fontWeight + ' ' + px + 'px ' + cs.fontFamily;
  }

  function metricsOf(font, text) {
    var c = document.createElement('canvas').getContext('2d');
    c.font = font;
    var m = c.measureText(text);
    return {
      fA: m.fontBoundingBoxAscent / 100,   // the line box the font asks for
      fD: m.fontBoundingBoxDescent / 100,
      iA: m.actualBoundingBoxAscent / 100, // the ink actually drawn
      iD: m.actualBoundingBoxDescent / 100
    };
  }

  function tuneToFont() {
    var slotWord = document.querySelector('.slot-word');
    var ledeLine = document.querySelector('.lede-line');
    var titleSerif = document.querySelector('.st-serif');
    if (!slotWord) return;
    var root = document.documentElement.style;

    /* Across EVERY word on the reel, not just the landing one. The window
       has to clear the deepest descender it will ever show, and a g drops
       further than a p — "brand campaigns" is the real constraint here,
       not "video production.". */
    var W = { fA: 0, fD: 0, iA: 0, iD: 0 };
    var face = faceOf(slotWord, 100);
    [LAND].concat(SPIN).forEach(function (t) {
      var m = metricsOf(face, t);
      W.fA = Math.max(W.fA, m.fA); W.fD = Math.max(W.fD, m.fD);
      W.iA = Math.max(W.iA, m.iA); W.iD = Math.max(W.iD, m.iD);
    });

    /* Size the window to the INK, not to the font's line box.
       Warbler declares 1.70em of line box around 1.04em of actual ink, and
       that slack is not centred — it nearly all sits above the glyphs. Let
       line-height place the baseline and the window has to be 1.59em tall
       with half an em of dead space along its top edge, which is a mask
       hanging over the line above: mid-spin, words scrolled through that
       strip and painted on the descenders of "focusing on".
       So the window is the ink plus a small pad, and .slot-ink is shifted
       to sit inside it. PAD is the breathing room at each edge. */
    var PAD = 0.06;
    var H = W.iA + W.iD + 2 * PAD;
    root.setProperty('--slot-h', H.toFixed(4) + 'em');

    /* .slot-ink is line-height:1, so its baseline sits here, and its ink
       top is that minus the ascent. Shift it so the ink lands PAD below
       the window's top edge. */
    var inkBaseline = (1 - W.fA - W.fD) / 2 + W.fA;
    var shift = PAD - (inkBaseline - W.iA);
    root.setProperty('--slot-shift', shift.toFixed(4) + 'em');

    /* Pull the reel back up so the red line's BASELINE lands where a third
       line of the lede would, rather than wherever Warbler's line box
       happens to put it. Without this the taller box reads as a gap. */
    if (ledeLine) {
      var N = metricsOf(faceOf(ledeLine, 100), 'A multifaceted creative');
      var lh = parseFloat(getComputedStyle(ledeLine).lineHeight) /
               parseFloat(getComputedStyle(ledeLine).fontSize);
      var wantBaseline = (lh - N.fA - N.fD) / 2 + N.fA;
      var slotBaseline = inkBaseline + shift;      // where it lands in the window
      root.setProperty('--slot-mt', (wantBaseline - slotBaseline).toFixed(4) + 'em');
    }

    /* Star pip. .pip-i is line-height:1, so the baseline sits at
       (1 - fA - fD)/2 + fA and the dotless i's ink top is that minus its
       ink ascent. The star hangs a hair above it. Measured per weight:
       the reel is 400 and the title is 700, and their i's differ. */
    function pipTop(el) {
      var m = metricsOf(faceOf(el, 100), '\u0131');
      var baseline = (1 - m.fA - m.fD) / 2 + m.fA;
      return (baseline - m.iA - 0.2 - 0.035).toFixed(4) + 'em';   // 0.2 star + gap
    }
    root.setProperty('--pip-top', pipTop(slotWord));
    if (titleSerif) root.setProperty('--pip-top-strong', pipTop(titleSerif));
  }

  /* ── Fit the title to the margins ─────────────────────────────────
     A vw font-size can only be correct at one viewport, so the string is
     measured and scaled to the container instead.

     Fitting the ADVANCE box leaves a visible gap at each end, because the
     M and the o both carry side bearings — whitespace baked into the
     glyph. To make the ink itself land on the margins we measure those
     bearings on canvas, subtract them to get the true ink width, scale to
     that, and pull the line left by the leading bearing. */
  function bearings(probe) {
    var c = document.createElement('canvas').getContext('2d');
    c.textAlign = 'left';
    c.font = '700 ' + probe + 'px "Nimbus Sans", sans-serif';
    var first = c.measureText('M');
    c.font = 'italic 700 ' + probe + 'px "warbler-deck", "Warbler Deck", serif';
    var lastGlyph = c.measureText('o');
    return {
      left: -first.actualBoundingBoxLeft,                       // ink inset from origin
      right: lastGlyph.width - lastGlyph.actualBoundingBoxRight // trailing whitespace
    };
  }

  /* Same width the stylesheet switches the hero to one column at. */
  var PHONE = window.matchMedia('(max-width: 640px)');

  function fitTitle() {
    var title = document.querySelector('.studio-title');
    if (!title) return;
    /* The fit is a single-line trick — it needs white-space:nowrap, and one
       line of the full lockup on a phone sets at about 35px, which is a
       caption rather than a hero. Below 640 hand the size back to the
       stylesheet, which wraps the title onto two lines instead. Clearing
       both inline properties matters: they'd otherwise survive a rotate
       from landscape and pin a desktop size onto a portrait screen. */
    if (PHONE.matches) {
      title.style.fontSize = '';
      title.style.marginLeft = '';
      return;
    }
    title.style.marginLeft = '';
    var avail = title.clientWidth;
    if (!avail) return;

    var probe = 100;
    title.style.fontSize = probe + 'px';
    var rng = document.createRange();
    rng.selectNodeContents(title);
    var advance = rng.getBoundingClientRect().width;
    if (!advance) { title.style.fontSize = ''; return; }

    var b = bearings(probe);
    var ink = advance - b.left - b.right;
    var scale = avail / ink;

    title.style.fontSize = (probe * scale).toFixed(2) + 'px';
    title.style.marginLeft = (-b.left * scale).toFixed(2) + 'px';
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { tuneToFont(); fitTitle(); });
  }
  tuneToFont();
  fitTitle();
  window.addEventListener('resize', fitTitle);
  if (PHONE.addEventListener) PHONE.addEventListener('change', fitTitle);

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

      /* Written to `translate`, not `transform`. .hero h1 carries the
         load-in `rise` animation with fill-mode both, and a filling
         animation beats an inline style forever — so a transform written
         here was silently thrown away on the title, the layer with the
         strongest rate. translate is its own property: it composes with
         the animation's transform instead of fighting it. */
      if (title) title.style.translate = '0 ' + (y * 0.34).toFixed(2) + 'px';
      if (lede)  lede.style.translate  = '0 ' + (y * 0.19).toFixed(2) + 'px';
      if (work)  work.style.translate  = '0 ' + (y * -0.16).toFixed(2) + 'px';
    }

    window.addEventListener('scroll', parallax, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }
})();
