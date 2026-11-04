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

  /* ── Cursor ──────────────────────────────────────────────────────
     A red dot with a soft shadow in place of the arrow, on mice and
     trackpads only (touch keeps nothing, it has no cursor). Over anything
     clickable, project work that opens in the lightbox and the parallax
     heroes included, it swells into a disc of Parchment-tinted glass. Styles in
     site.css under CURSOR. */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) {
    // .shot-phone: the phone half of a side-by-side product video, which you can like
    // .lightbox-media: the piece open in a project's lightbox (a click steps on)
    var CLICKABLE = 'a[href], button, [role="button"], summary, label, select, .tile, .band, .product-thumb, .shot-phone, .lightbox-media';
    // the lightbox's own rule (project-page.js lbItems): work that isn't a
    // player with controls and isn't already a link. And a project's hero,
    // whose parallax layers answer the pointer.
    /* A project hero is glass over its PICTURE only, not the empty slot
       beside a square one: the pointer has to sit inside the box of its
       image, video or layer stack (whichever has laid out yet, so it works
       from the first frame of the build). */
    var overHero = function (x, y) {
      var hero = document.getElementById('projectHero');
      if (!hero) return false;
      // .hero-layer imgs are scaled past the frame (cropped by .hero-layers): skip them
      return Array.prototype.some.call(hero.querySelectorAll('img:not(.hero-layer), video, .hero-layers'), function (m) {
        var r = m.getBoundingClientRect();
        return r.width > 2 && r.height > 2 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
    };
    var clickable = function (el, x, y) {
      if (!el || !el.closest) return false;
      if (el.closest('#projectHero')) return overHero(x, y);
      if (el.closest(CLICKABLE)) return true;
      var m = el.closest('#projectWork img, #projectWork video');
      return !!m && !(m.tagName === 'VIDEO' && m.hasAttribute('controls'));
    };
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<i></i>';
    document.body.appendChild(cursor);
    /* A little chromatic aberration in the glass: what's under it splits red
       left, blue right. Chromium only, the one engine that runs an SVG filter
       in backdrop-filter; Safari and Firefox keep the plain glass. */
    if (window.chrome) {
      var ca = document.createElement('div');
      ca.setAttribute('aria-hidden', 'true');
      ca.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      ca.innerHTML = '<svg width="0" height="0"><filter id="cursorCA" color-interpolation-filters="sRGB">' +
        '<feColorMatrix in="SourceGraphic" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feOffset dx="-0.75" result="r"/>' +
        '<feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>' +
        '<feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/><feOffset dx="0.75" result="b"/>' +
        '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/></filter></svg>';
      document.body.appendChild(ca);
      cursor.classList.add('has-ca');
    }
    document.documentElement.classList.add('has-cursor');

    var place = function (x, y) {
      cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      cursor.classList.add('is-on');
    };
    /* A new page gets no mousemove until the mouse moves, so the dot would
       vanish on every link. Carry it over: where it was as the last page
       went, it is as this one comes in. */
    var was = null;
    try {
      was = JSON.parse(sessionStorage.getItem('cursorAt') || 'null');
      if (was) {
        cursor.style.transition = 'none';         // already showing: no fade back in
        place(was[0], was[1]);
        void cursor.offsetWidth;                  // settle it there before the fade comes back
        cursor.style.transition = '';
        var under = document.elementFromPoint(was[0], was[1]);
        cursor.classList.toggle('is-glass', clickable(under, was[0], was[1]));
      }
    } catch (_) {}
    var lastX = was ? was[0] : -1, lastY = was ? was[1] : -1, moved = false;
    /* Gumroad's checkout (the Buy button) is a full-window layer in a shadow
       root with the store in an iframe: the dot froze at the iframe's edge and
       the backdrop inherited cursor:none. While it's open the dot is off and
       the system pointer is back; closing it hides the layer (display:none). */
    var checkout = false;
    var checkoutOpen = function () {
      return Array.prototype.some.call(document.body.children, function (el) {
        var f = el.shadowRoot && el.shadowRoot.querySelector('iframe');
        return !!f && f.getClientRects().length > 0;
      });
    };
    var checkoutCheck = function () {
      var open = checkoutOpen();
      if (open === checkout) return;
      checkout = open;
      document.documentElement.classList.toggle('has-cursor', !open);
      if (open) cursor.classList.remove('is-on', 'is-glass');
    };
    if (window.MutationObserver) {
      var watchShadow = new MutationObserver(checkoutCheck);
      new MutationObserver(function (list) {
        list.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.shadowRoot) watchShadow.observe(n.shadowRoot, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class'] });
          });
        });
        checkoutCheck();
      }).observe(document.body, { childList: true });
    }
    document.addEventListener('mousemove', function (e) {
      if (checkout) return;
      if (e.target.tagName === 'IFRAME') return;   // see the iframe note below
      moved = true;
      lastX = e.clientX; lastY = e.clientY;
      // within a hero the picture's edge isn't an element boundary: check each move
      if (e.target.closest && e.target.closest('#projectHero')) cursor.classList.toggle('is-glass', overHero(lastX, lastY));
      place(lastX, lastY);
    }, { passive: true });
    window.addEventListener('pagehide', function () {
      try {
        if (lastX >= 0 && cursor.classList.contains('is-on')) sessionStorage.setItem('cursorAt', JSON.stringify([lastX, lastY]));
        else sessionStorage.removeItem('cursorAt');
      } catch (_) {}
    });
    /* Something opened or closed under a still pointer (the lightbox): no
       mouseover comes, so look again at what's there now. */
    window.cursorRecheck = function () {
      if (lastX < 0) return;
      cursor.classList.toggle('is-glass', clickable(document.elementFromPoint(lastX, lastY), lastX, lastY));
    };
    /* A page building itself under a pointer that hasn't moved (a hero
       mid-load, tiles arriving) sends no mouseover, so for the first few
       seconds look again every frame until the mouse does move. */
    var loadT0 = performance.now();
    (function watchLoad() {
      if (moved || performance.now() - loadT0 > 4000) return;
      window.cursorRecheck();
      requestAnimationFrame(watchLoad);
    })();
    document.addEventListener('mouseover', function (e) {
      /* An embedded player (YouTube) is another page: this one gets no
         mouse events over it, so the dot would sit stuck on its edge. Fade
         it out there and let the player's own pointer take over; the next
         mousemove back on the page brings it back. */
      if (e.target.tagName === 'IFRAME') { cursor.classList.remove('is-on', 'is-glass'); return; }
      cursor.classList.toggle('is-glass', clickable(e.target, e.clientX, e.clientY));
    });
    // gone when the pointer leaves the window
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget) cursor.classList.remove('is-on');
    });
    /* Chrome doesn't even send that much for a cross-origin frame (a
       playing YouTube video): the pointer just stops reporting. So if the
       moves stop with the dot at a frame's edge, it went in; hide it. A
       click that swaps a frame in under the pointer (the video cover) and
       the window losing focus to one count too. */
    var frameAt = function (x, y) {
      var hit = false;
      document.querySelectorAll('iframe').forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (x > r.left - 24 && x < r.right + 24 && y > r.top - 24 && y < r.bottom + 24) hit = true;
      });
      return hit;
    };
    var still = null;
    document.addEventListener('mousemove', function () {
      clearTimeout(still);
      still = setTimeout(function () {
        if (frameAt(lastX, lastY)) cursor.classList.remove('is-on', 'is-glass');
      }, 120);
    }, { passive: true });
    document.addEventListener('click', function () {
      setTimeout(function () {
        var el = document.elementFromPoint(lastX, lastY);
        if (el && el.tagName === 'IFRAME') cursor.classList.remove('is-on', 'is-glass');
      }, 0);
    });
    window.addEventListener('blur', function () { cursor.classList.remove('is-on', 'is-glass'); });
    document.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });
  }

  /* ── No dragging pictures off the page ──────────────────────────
     An image, a video, or a link built round one (every tile) would lift
     out as a ghost and drop as a file. CSS user-drag covers Chrome and
     Safari; this covers the rest. */
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t.nodeType !== 1) t = t.parentElement;
    if (t && (/^(IMG|VIDEO|PICTURE|svg)$/i.test(t.tagName) || (t.closest && t.closest('a') && t.closest('a').querySelector('img, video')))) e.preventDefault();
  });

  /* ── No video menu ─────────────────────────────────────────────────
     Right-clicking a video opened the browser's own menu (Loop, Save Video
     As, Picture in Picture, Cast), which reads as a stock player. Videos
     take no context menu, offer no picture-in-picture, and players with
     controls drop the download item. Images keep theirs. Videos added
     later (overlays, lightbox, plugin pages) are caught by the observer. */
  document.addEventListener('contextmenu', function (e) {
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    if (t && t.closest && t.closest('video')) e.preventDefault();
  });
  var quietVideo = function (v) {
    v.disablePictureInPicture = true;
    v.setAttribute('disablepictureinpicture', '');
    v.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
    v.disableRemotePlayback = true;
  };
  Array.prototype.forEach.call(document.getElementsByTagName('video'), quietVideo);
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'VIDEO') quietVideo(n);
        else Array.prototype.forEach.call(n.getElementsByTagName('video'), quietVideo);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* ── Menu ────────────────────────────────────────────────────────*/
  /* ── A reload lands at the top ──────────────────────────────────
     Every page, so the load-in plays from the start instead of the
     browser restoring a spot halfway down. Back/forward still restore:
     the mode goes back to auto as the page is left. */
  var navEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  if (navEntry && navEntry.type === 'reload' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.addEventListener('load', function () { window.scrollTo(0, 0); });
    window.addEventListener('pagehide', function () {
      if (!document.querySelector('.hero--studio')) history.scrollRestoration = 'auto';
    });
  }

  var burger = $('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      /* Clicked while the bars are still drawing on (Studio page load): hand
         each bar's current clip over to its transition, so the middle bar
         trims out from wherever it got to instead of finishing the draw
         first and then snapping. */
      burger.querySelectorAll('span').forEach(function (s) {
        var a = s.getAnimations ? s.getAnimations().filter(function (x) { return x.animationName; }) : [];
        if (!a.length) return;
        s.style.clipPath = getComputedStyle(s).clipPath;
        a.forEach(function (x) { x.cancel(); });
        void s.offsetWidth;
        s.style.clipPath = '';
      });
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



  /* ── Hero sound / overlay toggle ─────────────────────────────────
     One control: clears the scrim and copy, and unmutes. The click is
     also the user gesture browsers demand before audio may play, so the
     unmute has to happen inside this handler. */
  var hero = document.querySelector('.hero');
  var heroVideo = $('heroVideo');
  var heroToggle = $('heroToggle');
  if (hero && heroVideo && heroToggle) {
    var label = heroToggle.querySelector('.hero-toggle-label');
    heroToggle.addEventListener('click', function () {
      var clean = hero.classList.toggle('clean');
      heroVideo.muted = !clean;
      heroToggle.setAttribute('aria-pressed', clean ? 'true' : 'false');
      if (label) label.textContent = clean ? 'Mute' : 'Play with sound';
      if (clean) {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
  }

  /* ── Leaving a page ────────────────────────────────────────────────
     Any internal link fades the page out quickly (a short lift, the
     reverse of the load-in) before it navigates. The header stays put
     between pages, except going back to the Studio page (the logo, or
     Studio in the menu): then the logo and burger fade too, so the Studio
     page can draw them in again. Delegated, so tiles built later count.
     New tabs, downloads, files, other sites and same-page anchors are left
     alone. */
  /* The site's arrow: the same chevron as the side arrows on project
     pages, for the "go to" arrow on tiles and bands. */
  var CHEV = '<svg viewBox="0 0 20 36" aria-hidden="true"><path d="M4 3 L16 18 L4 33"/></svg>';

  /* Side arrows on project pages: a click bounces the chevron out the way
     it points and back, while the page fades behind it. Only the glyph
     moves; the link's box stays put. */
  document.querySelectorAll('.side-arrow').forEach(function (a) {
    a.addEventListener('click', function () {
      var g = a.querySelector('svg');
      if (!g || !g.animate || calmMotion()) return;
      var dx = a.classList.contains('side-arrow--prev') ? -6 : 6;
      // eased per leg (out, then back), so the peak lands at the offset
      g.animate([
        { transform: 'none', easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
        { transform: 'translateX(' + dx + 'px)', offset: 0.4, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        { transform: 'none' }
      ], { duration: 280 });
    });
  });

  var arriveAt = null;   // set by the /all block further down
  // the combined page's halves: path → the section it lands on (null = the top)
  var HALVES = { '/work': null, '/tools': 'tools' };
  var landed = false;    // the combined page has made its first landing (URL may follow scroll)
  var LEAVE_MS = 200;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function calmMotion() { return calm.matches; }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (a.origin !== location.origin || !/^https?:$/.test(a.protocol)) return;
    if (/\.(?!html$)[a-z0-9]+$/i.test(a.pathname)) return;           // a file, not a page
    /* Work (/work) and Tools (/tools) in the menu are the two halves of one
       page (all.html). Already on it, there's no page to load: shut the menu
       and arrive at the half the way a fresh load would (arriveAt, below). */
    var half = arriveAt && a.closest('.menu-links') ? HALVES[a.pathname] : undefined;
    if (half !== undefined) {
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) burger.click();
      // a frame later: in the same one the page is still scroll-locked and
      // the browser drops the scroll
      requestAnimationFrame(function () { arriveAt(half ? $(half) : null); });
      history.replaceState(null, '', a.pathname);
      return;
    }
    if (a.pathname === location.pathname && a.hash) return;           // same-page anchor
    if (calm.matches) return;
    var dest = a.pathname.replace(/\.html$/, '');
    var onProject = !!document.querySelector('.side-arrows');
    var toProject = typeof projects !== 'undefined' && projects.some(function (p) { return '/' + p.slug === dest; });
    // project to project: built in place by project-page.js, no page load
    if (onProject && toProject && window.projectSwap && window.projectSwap(dest.slice(1), true)) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    document.body.classList.add('page-leaving');
    // project to project (the fallback), the side arrows stay put; anywhere
    // else they go too
    if (onProject) {
      if (toProject) { try { sessionStorage.setItem('arrowsStay', '1'); } catch (_) {} }
      else document.body.classList.add('arrows-leaving');
    }
    if (a.pathname === '/' || a.pathname === '/index.html') document.body.classList.add('nav-leaving');
    /* Leaving from the open menu: the X turns back into the burger as the
       page goes (menu-leaving, site.css), and the next page arrives with
       the burger already there. Held a little longer so the turn lands. */
    var fromMenu = !!a.closest('.menu-links') && document.body.classList.contains('menu-open');
    var home = document.body.classList.contains('nav-leaving');   // logo + burger trim off first
    if (home && window.trimLogoOut) window.trimLogoOut(360);
    // going home, the X trims off as an X (no turn back first)
    if (fromMenu && !home) document.body.classList.add('menu-leaving');
    setTimeout(function () { window.location.href = a.href; }, home || fromMenu ? 400 : LEAVE_MS);
  });
  // Back/forward can restore this page from the cache mid-leave: undo it.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.body.classList.remove('page-leaving', 'nav-leaving', 'arrows-leaving', 'menu-open', 'menu-leaving');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    lockScroll(false);
  });

  /* ── Logo draw-on (Studio page) ───────────────────────────────────
     Same move as the brand's logo animation (04_Admin/07_Brand.../
     Logo_Animation): the stroke draws left to right, driven by HORIZONTAL
     position rather than length so the tall spike doesn't stall it, and
     eased out (fast, then slowing into the end) rather than linear. The path is clipped at a moving x and rebuilt each frame,
     which keeps the round cap on the leading edge; a dash offset would
     draw by arc length instead. */
  var markPath = document.querySelector('.nav-logo path');
  /* The draw-on's mirror, for heading home: the stroke is eaten from its
     START toward its end (Trim Paths' start running up), rebuilt each frame
     from a moving x so the trailing edge keeps its round cap, and easing in
     (slow, then gone). A CSS clip did this first and left a flat cut. */
  if (markPath) window.trimLogoOut = function (ms) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var d = markPath.getAttribute('d');
    var Q = (d.match(/-?[\d.]+,-?[\d.]+/g) || []).map(function (xy) { return xy.split(',').map(Number); });
    if (Q.length < 2) return;
    var A = Q[0][0], Z = Q[Q.length - 1][0], s0 = null;
    var from = function (xs) {
      var out = [];
      for (var k = 1; k < Q.length; k++) {
        var a = Q[k - 1], b = Q[k];
        if (b[0] <= xs) continue;
        if (!out.length) {
          var t = xs > a[0] ? (xs - a[0]) / (b[0] - a[0]) : 0;
          out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
        }
        out.push(b);
      }
      return out.length > 1 ? 'M' + out.map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join(' L') : '';
    };
    var step = function (now) {
      if (s0 === null) s0 = now;
      var p = Math.min(1, (now - s0) / ms), e = p * p * p;
      var nd = from(A + e * (Z - A));
      if (!nd || p >= 1) { markPath.style.visibility = 'hidden'; return; }
      markPath.setAttribute('d', nd);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (markPath && document.querySelector('.hero--studio') &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var full = markPath.getAttribute('d');
    var P = (full.match(/-?[\d.]+,-?[\d.]+/g) || []).map(function (xy) {
      return xy.split(',').map(Number);
    });
    var X0 = P[0][0], X1 = P[P.length - 1][0];
    var DELAY = 350, DRAW = 1268;   // ms; the draw length is the animation's
    var cut = function (xt) {
      var out = [P[0]];
      for (var k = 1; k < P.length; k++) {
        var a = P[k - 1], b = P[k];
        if (b[0] <= xt) { out.push(b); continue; }
        if (xt > a[0]) {
          var t = (xt - a[0]) / (b[0] - a[0]);
          out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
        }
        break;
      }
      return 'M' + out.map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join(' L');
    };
    markPath.style.visibility = 'hidden';
    var t0 = null;
    var drawStep = function (now) {
      if (t0 === null) t0 = now;
      var p = (now - t0 - DELAY) / DRAW;
      if (p > 0) {
        markPath.style.visibility = 'visible';
        if (p >= 1) { markPath.setAttribute('d', full); return; }
        // ease-out: the sweep starts fast and slows into the end
        var e = 1 - Math.pow(1 - p, 3);
        markPath.setAttribute('d', cut(X0 + e * (X1 - X0)));
      }
      requestAnimationFrame(drawStep);
    };
    requestAnimationFrame(drawStep);
  }

  /* ── Letter jump ─────────────────────────────────────────────────
     Split each label into per-letter spans and hop them 50ms apart, so the
     word ripples rather than moving as a block. Anything with data-wave
     opts in, which is how the buttons get the same interaction as the menu.
     The hop scales with the label's font size: LIFT for the small button
     labels, a lower MENU_LIFT for the 5rem menu titles, where the same
     ratio reads as far too much.
     Web Animations, not a restarted CSS animation: restarting meant
     animation:none + a forced reflow per letter, which is part of what
     made the solid buttons flash mid-wiggle. */
  var LIFT = 0.36, MENU_LIFT = 0.13;
  document.querySelectorAll('.menu-links a, [data-wave]').forEach(function (link) {
    var text = link.textContent;
    link.innerHTML = text.split('').map(function (ch) {
      return ch === ' ' ? ' ' : '<span class="ltr">' + ch + '</span>';
    }).join('');

    var letters = link.querySelectorAll('.ltr');
    var timer = null;

    link.addEventListener('mouseenter', function () {
      var i = 0;
      var k = link.closest('.menu-links') ? MENU_LIFT : LIFT;
      var y = -k * (parseFloat(getComputedStyle(link).fontSize) || 16);
      clearInterval(timer);
      timer = setInterval(function () {
        if (i >= letters.length) { clearInterval(timer); return; }
        if (letters[i].animate) {
          letters[i].animate([
            { transform: 'translateY(0)', easing: 'ease' },
            { transform: 'translateY(' + y + 'px)', offset: 0.4, easing: 'ease' },
            { transform: 'translateY(0)' }
          ], { duration: 400 });
        }
        i++;
      }, 50);
    });
    link.addEventListener('mouseleave', function () { clearInterval(timer); });
  });

  /* ── Nav background on scroll ────────────────────────────────────*/
  // the phone header's shadow shows only once the page is off the top
  var markScrolled = function () { document.documentElement.classList.toggle('is-scrolled', window.scrollY > 2); };
  window.addEventListener('scroll', markScrolled, { passive: true });
  markScrolled();
  var cue = document.querySelector('.scroll-cue');
  if (cue) {
    var onScroll = function () {
      if (cue) cue.classList.toggle('gone', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal ───────────────────────────────────────────────*/
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  /* The Studio page's project bands wait until they're well into the
     window (about a seventh of the way up from the bottom) before revealing, so
     each one gets a beat of scroll to itself. */
  var bandIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); bandIo.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      (el.classList.contains('band') ? bandIo : io).observe(el);
    });
  }

  /* ── Layered thumbnails ────────────────────────────────────────────
     A project with heroLayers gets its layers stacked inside the thumbnail
     instead of the flat cover. At rest they are the cover exactly; on
     hover the stack zooms in like the old scale-up, but each layer by a
     different amount (the back least, the front most), so the zoom has a
     little depth to it. The cover <img> stays underneath until every layer
     has loaded, and stays as the only thing for flat projects. */
  // zoom = the flat cover's own hover scale there: 4.5% on Work, 3.5% on the Studio bands
  function layeredThumb(p, media, hoverEl, zoom) {
    var layers = p.heroLayers;
    if (!layers || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!Array.isArray(layers)) layers = [{ src: layers.bg, k: 0.006, edge: true }, { src: layers.fg, k: 0.024 }];
    var box = document.createElement('div');
    box.className = 'thumb-stack';
    box.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('div');
    inner.className = 'thumb-stack-inner';
    box.appendChild(inner);
    var n = layers.length, loaded = 0, ar = 0;
    var els = layers.map(function (l, i) {
      var im = new Image();
      im.alt = ''; im.draggable = false;
      if (l.pad) {
        var o = (-l.pad * 100) + '%', sz = ((1 + 2 * l.pad) * 100) + '%';
        im.style.left = im.style.top = o; im.style.width = im.style.height = sz;
      }
      im.onload = function () {
        if (!ar) ar = im.naturalWidth / im.naturalHeight;   // padding is symmetric, so this is the hero's aspect
        if (++loaded === n) { media.appendChild(box); fit(); set(false); }
      };
      im.src = l.src;
      inner.appendChild(im);
      return im;
    });
    // the inner box is the hero, cover-fitted to the thumbnail like object-fit
    function fit() {
      var w = media.clientWidth, h = media.clientHeight;
      if (!w || !h || !ar) return;
      var bw = w, bh = w / ar;
      if (bh < h) { bh = h; bw = h * ar; }
      inner.style.width = bw + 'px'; inner.style.height = bh + 'px';
      inner.style.left = ((w - bw) / 2) + 'px'; inner.style.top = ((h - bh) / 2) + 'px';
    }
    function set(on) {
      var bar = ar || 16 / 9;
      els.forEach(function (el, i) {
        var depth = n > 1 ? 0.5 + i / (n - 1) : 1;      // 0.5 at the back to 1.5 at the front
        var z = layerRestScale(layers[i], bar) * (on ? 1 + zoom * depth : 1);
        el.style.transform = 'scale(' + z.toFixed(4) + ')';
      });
    }
    hoverEl.addEventListener('mouseenter', function () { set(true); });
    hoverEl.addEventListener('mouseleave', function () { set(false); });
    window.addEventListener('resize', fit);
  }

  /* ── Video thumbnails ──────────────────────────────────────────────
     A project whose hero is a looping video (heroLoop) has nothing to
     parallax, so hovering its thumbnail plays the loop over the still
     instead: it appears at once (the still is its own first frame) and
     plays. Leaving pauses it where it is; hovering again resumes. */
  // reset: on leave, back to the still image (Tools tiles); otherwise the frame it stopped on stays up
  function videoThumb(p, media, hoverEl, reset, start) {
    if (!p.heroLoop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var v = document.createElement('video');
    v.className = 'thumb-video';
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    v.src = p.hero;
    /* coverAt: no still at all. The video itself sits paused on that frame
       (shown once it has seeked there), so a hover just presses play: a
       still swapped for the video, however close, gave a visible blip. */
    if (start) {
      v.addEventListener('loadedmetadata', function () { v.currentTime = start; }, { once: true });
      v.addEventListener('seeked', function () { v.classList.add('is-on'); }, { once: true });
    }
    media.appendChild(v);
    // no fade in: the still is the loop's first frame, so the video can
    // simply appear on top of it and start moving
    hoverEl.addEventListener('mouseenter', function () {
      if (v.readyState >= 2) v.classList.add('is-on');
      else v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
      var q = v.play(); if (q && q.catch) q.catch(function () {});
    });
    // leaving pauses: work tiles and bands keep the frame it stopped on and carry on
    // next hover; Tools tiles (reset) go back to their still and start over
    hoverEl.addEventListener('mouseleave', function () {
      v.pause();
      if (reset) { v.classList.remove('is-on'); try { v.currentTime = 0; } catch (e) {} }
    });
  }

  /* ── Work grid (work page) ───────────────────────────────────────
     Static covers only — no hover video. */
  var grid = $('workGrid');
  var grid_i = 0;
  /* One project's tile, as the Work grid draws it (the prev / next pair at
     the foot of a project page uses it too). */
  var workTile = function (p) {
      var tile = document.createElement('a');
      tile.className = 'tile';
      tile.href = '/' + p.slug;
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.title + '" loading="lazy" draggable="false">' +
        '</div>' +
        '<div class="tile-meta">' +
          '<div class="tile-head"><h2 class="tile-title">' + p.title + '</h2><span class="tile-arrow">' + CHEV + '</span></div>' +
          '<p class="tile-cat">' + p.category + '</p>' +
        '</div>';
      return tile;
  };
  var workTileHooks = function (p, tile) {
    layeredThumb(p, tile.querySelector('.tile-media'), tile, 0.045);
    videoThumb(p, tile.querySelector('.tile-media'), tile);
  };
  if (grid) {
    projects.forEach(function (p) {
      // No scroll-reveal here: on the Work page the grid IS the content, and
      // fading tiles in made it look like only the first four existed.
      var tile = workTile(p);
      tile.style.setProperty('--i', Math.min(grid_i++, 7));
      grid.appendChild(tile);
      workTileHooks(p, tile);
    });
  }

  /* ── Plugin grid (plugins page) ──────────────────────────────────
     Same .tile markup as the Work grid so the two pages read as one
     system. The only addition is a badge for anything not shipped —
     a plugin with no download still gets a page, it just says so on
     the tile instead of promising a button that isn't there.
     Title and host only under the shot; the tagline lives on the
     product page. */
  /* On the combined page the menu marks whichever half is on screen: Work
     until the Tools head reaches the top third of the window, then Tools.
     The address bar follows (/work, /tools), so a copied link or a reload
     lands where the reader was. replaceState only on a change: Safari
     throttles it. */
  var toolsHead = $('tools');
  var menuWork = document.querySelector('.menu-links a[href="/work"]');
  var menuTools = document.querySelector('.menu-links a[href="/tools"]');
  if (toolsHead && menuWork && menuTools) {
    var markSection = function () {
      var inTools = toolsHead.getBoundingClientRect().top < window.innerHeight / 3;
      menuWork.toggleAttribute('aria-current', !inTools);
      menuTools.toggleAttribute('aria-current', inTools);
      if (inTools) menuTools.setAttribute('aria-current', 'page');
      else menuWork.setAttribute('aria-current', 'page');
      var path = inTools ? '/tools' : '/work';
      if (landed && location.pathname !== path) history.replaceState(null, '', path + location.search);
    };
    window.addEventListener('scroll', markSection, { passive: true });
    window.addEventListener('load', markSection);
    markSection();
  }

  var pgrid = $('pluginGrid');
  /* "New update" chip: shown until the plugin's updateBadge.until date, so
     it retires itself instead of going stale. */
  var STAR = '<svg class="tile-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z"/></svg>';
  /* `const plugins` in plugins.js is a lexical global, not a window
     property, so this has to be a typeof check rather than window.plugins. */
  /* One plugin's tile, as the Tools grid draws it (and the prev / next pair
     at the foot of a product page). */
  var toolTile = function (p) {
      var tile = document.createElement('a');
      tile.className = 'tile';
      tile.href = '/' + p.slug;
      tile.innerHTML =
        '<div class="tile-media">' +
          '<img src="' + p.cover + '" alt="' + p.name + '" loading="lazy" draggable="false">' +
          '<div class="tile-badges">' +
            (p.updateBadge && new Date() < new Date(p.updateBadge.until)
              ? '<span class="tile-badge tile-badge--new">' + STAR + p.updateBadge.text + '</span>'
              : '') +
          '</div>' +
        '</div>' +
        /* The price on the grey line, where a project shows its category,
           then the full name ("Receipts for After Effects"), set a size
           down from a project's title so it holds one line. (Tried: the
           price in the arrow's place, Nov 3 '26; names got too small.) */
        '<div class="tile-meta">' +
          '<div class="tile-head"><h2 class="tile-title">' + p.name + '</h2><span class="tile-arrow">' + CHEV + '</span></div>' +
          '<p class="tile-cat">' + (p.price ? (p.was ? '<s class="price-was">' + p.was + '</s> ' : '') + p.price : ((p.downloads && p.downloads.length) || p.download ? 'Free' : 'In development')) + '</p>' +
        '</div>';
      // coverScale: a cover that fills more of its card than the others sits back to match
      if (p.coverScale) tile.style.setProperty('--fit', p.coverScale);
      return tile;
  };
  var toolTileHooks = function (p, tile) {
    // a plugin with a square loop plays it on hover, like the project bands
    // coverAt: the still is a frame of the loop, so it plays on from there
    // and pauses where it is; otherwise back to the still and start over
    if (p.coverVideo) videoThumb({ heroLoop: true, hero: p.coverVideo }, tile.querySelector('.tile-media'), tile, !p.coverAt, p.coverAt);
  };
  if (pgrid && typeof plugins !== 'undefined') {
    grid_i = 0;
    /* Rectangles only: three across when the count divides by three,
       otherwise two (four plugins = 2 x 2). Phones are two across anyway. */
    if (plugins.length % 3 && !(plugins.length % 2)) pgrid.classList.add('plugin-grid--2');
    plugins.forEach(function (p) {
      var tile = toolTile(p);
      tile.style.setProperty('--i', Math.min(grid_i++, 7));
      pgrid.appendChild(tile);
      toolTileHooks(p, tile);
    });
  }

  /* ── Prev / next at the foot of a project or product page ─────────
     The page script (project-page.js, plugin-page.js) points the two
     arrow links at the neighbours; here they become the neighbours' own
     tiles, drawn exactly as the Work and Tools grids draw them (Mike, Nov
     4 '26: the red arrows out). A hidden arrow (two plugins: Next only)
     drops out. */
  var pagerNav = document.querySelector('.side-arrows, .arrow-pager');
  if (pagerNav) {
    var isTools = pagerNav.classList.contains('arrow-pager');
    var list = isTools ? (typeof plugins !== 'undefined' ? plugins : []) : (typeof projects !== 'undefined' ? projects : []);
    var bySlug = function (slug) {
      for (var k = 0; k < list.length; k++) if (list[k].slug === slug) return list[k];
      return null;
    };
    /* slugs: the neighbours, previous first. project-page.js calls this
       again on every in-place project swap. */
    window.tilePager = function (slugs) {
      pagerNav.textContent = '';
      // headed like Work and Tools on /all
      var related = document.createElement('h2');
      related.className = 'related-head';
      related.textContent = 'Related';
      pagerNav.appendChild(related);
      slugs.map(bySlug).filter(Boolean).forEach(function (p) {
        var tile = isTools ? toolTile(p) : workTile(p);
        pagerNav.appendChild(tile);
        (isTools ? toolTileHooks : workTileHooks)(p, tile);
      });
    };
    pagerNav.classList.add('tile-pager', 'work-grid');
    if (isTools) pagerNav.classList.add('plugin-grid', 'plugin-grid--2');
    window.tilePager([].slice.call(pagerNav.querySelectorAll('a'))
      .filter(function (a) { return !a.hidden; })
      .map(function (a) { return (a.getAttribute('href') || '').replace(/^.*\//, ''); }));
  }

  /* ── /all: each half loads in as it comes into view ───────────────
     The title, then its tiles one after another, the same move as every
     other page, but per piece as it reaches the window rather than all
     at once on load. Land on #tools and only Tools plays; Work waits up
     there until you scroll back to it, and scrolling up brings its rows in
     bottom-first, the way they arrive. Pieces that come in together are
     staggered by the order they sit on the page. */
  var sections = document.querySelectorAll('.all-section[data-in]');
  if (sections.length) {
    var pieces = Array.prototype.slice.call(
      document.querySelectorAll('.all-section > .page-head, .all-section .tile'));
    var before = function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING; };
    var show = function (els) {
      els.sort(function (a, b) { return before(a, b) ? -1 : 1; });
      var heads = els.filter(function (el) { return el.classList.contains('page-head'); });
      els.forEach(function (el) {
        // tiles wait for a title arriving with them; alone they start at once
        if (!el.classList.contains('page-head')) {
          el.style.setProperty('--i', els.indexOf(el) - heads.length);
          el.style.setProperty('--lead', heads.length ? '0.15s' : '0s');
        }
        el.classList.add('in');
      });
    };
    var pieceIO = null, release = null;
    /* Arrive at a section (null = the top) as if the page had just loaded
       there: cut to it with no scroll, everything hidden again, and play
       it in. On #tools, Work's last row peeks in above the title, so Work
       isn't even watched until the reader starts back up. Runs on load and
       again from the menu's Work / Tools while already on the page. */
    arriveAt = function (landing) {
      var html = document.documentElement;
      // 'instant', not the stylesheet's smooth: a cut, never a glide
      if (landing) landing.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      if (!('IntersectionObserver' in window) || calm.matches) { show(pieces.slice()); return; }
      if (pieceIO) pieceIO.disconnect();
      if (release) window.removeEventListener('scroll', release);
      pieces.forEach(function (el) {
        el.classList.remove('in');
        el.style.removeProperty('--i');
        el.style.removeProperty('--lead');
      });
      void html.offsetHeight;   // commit the reset so a replayed piece animates again
      pieceIO = new IntersectionObserver(function (entries) {
        var now = entries.filter(function (e) { return e.isIntersecting; })
                         .map(function (e) { pieceIO.unobserve(e.target); return e.target; });
        if (now.length) show(now);
      }, { rootMargin: '0px 0px -4% 0px' });
      var held = landing ? pieces.filter(function (el) { return !landing.contains(el) && before(el, landing); }) : [];
      pieces.forEach(function (el) { if (held.indexOf(el) < 0) pieceIO.observe(el); });
      if (held.length) {
        var from = window.scrollY;
        release = function () {
          if (window.scrollY >= from - 2) return;
          window.removeEventListener('scroll', release);
          held.forEach(function (el) { pieceIO.observe(el); });
        };
        window.addEventListener('scroll', release, { passive: true });
      }
    };
    /* Land on #tools before looking, not after: the browser's own jump
       comes a frame too late, and the first look would see Work at the
       top and play it. all.html turns smooth scrolling off for this. */
    arriveAt(location.hash ? document.querySelector('.all-section' + location.hash) : null);
    // the stubs land here as /all or /all#tools: show the half's own address
    history.replaceState(null, '', (location.hash === '#tools' ? '/tools' : '/work') + location.search);
    landed = true;
  }

  /* ── Featured bands (studio page) ────────────────────────────────
     Edit data-featured on #bands to change which projects appear. */
  var bands = $('bands');
  if (bands) {
    var featured = (bands.dataset.featured || '').split(',').map(function (s) { return s.trim(); });
    featured.forEach(function (slug) {
      var p = null;
      projects.forEach(function (q) { if (q.slug === slug) p = q; });
      if (!p) return;
      var el = document.createElement('a');
      el.className = 'band reveal';
      el.href = '/' + p.slug;
      el.innerHTML =
        '<div class="band-media"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy"></div>' +
        '<div class="band-meta">' +
          '<div class="band-head"><h3 class="band-title">' + p.title + '</h3><span class="band-arrow">' + CHEV + '</span></div>' +
          '<p class="band-cat">' + p.category + '</p>' +
        '</div>';
      bands.appendChild(el);
      layeredThumb(p, el.querySelector('.band-media'), el, 0.035);
      videoThumb(p, el.querySelector('.band-media'), el);
    });
  }

  observeReveals();

  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
