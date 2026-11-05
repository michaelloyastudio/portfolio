/* ══════════════════════════════════════════════════════════════
   Plugin PRODUCT page renderer.

   Deliberately NOT shaped like project-page.js. A project page is a case
   study — here is a thing I made, here is how. This is a product page:
   the shot, the name, the price, the button, in that order and above the
   fold. Everything else lives below it.

   Each /<slug>.html sets window.PLUGIN_SLUG and this fills it in from
   plugins.js.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var slug = window.PLUGIN_SLUG;
  var i = -1;
  plugins.forEach(function (p, n) { if (p.slug === slug) i = n; });
  if (i < 0) return;

  var p = plugins[i];
  var $ = function (id) { return document.getElementById(id); };

  document.title = p.name + ' — Michael Loya Studio';

  /* ── the shot ──
     Extra shots become thumbnails under the main one and swap it on click.
     With only one shot the strip doesn't render at all, so a plugin with a
     single screenshot doesn't get a stray lone thumbnail. */
  var shots = (p.shots && p.shots.length) ? p.shots : [{ src: p.hero, alt: p.name }];
  var shot = $('pluginShot');
  if (shot) {
    /* A shot is a still ({src}) or a silent loop ({video, src}), where src
       is the loop's poster and doubles as its thumbnail. */
    /* {demo, src}: a live panel (panel-demos.js) in place of the still; src is
       its thumbnail */
    var media = function (s) {
      if (s.demo && window.PANEL_DEMOS && window.PANEL_DEMOS[s.demo])
        return '<div id="pluginShotMain" class="shot-demo" role="group" aria-label="' + s.alt + '"></div>';
      return s.video
        ? '<video id="pluginShotMain" src="' + s.video + '" poster="' + s.src + '" muted autoplay loop playsinline aria-label="' + s.alt + '"></video>'
        : '<img id="pluginShotMain" src="' + s.src + '" alt="' + s.alt + '">';
    };
    // a shot's `overlay`: a social app's UI drawn over the phone half of a
    // side-by-side video, always on, with the phone you can like
    var overlay = function (s) {
      var o = $('pluginShotOverlay');
      o.hidden = !s.overlay;
      $('pluginShotPhone').hidden = !s.overlay;
      if (s.overlay) o.src = s.overlay;
      o.parentNode.classList.toggle('has-overlay', !!s.overlay);
    };
    // the overlay's like heart, in its screen px (receipts-social.svg)
    var HEART = 'M1228 1738c-41-30-50-43-50-61 0-17 13-29 27-29 10 0 19 6 23 14 4-8 13-14 23-14 14 0 27 12 27 29 0 18-9 31-50 61z';
    shot.innerHTML =
      '<div class="product-shot-main">' + media(shots[0]) +
      '<img id="pluginShotOverlay" class="shot-overlay" alt="" aria-hidden="true" hidden>' +
      // the overlay's phone: a red heart over its white one, plus a hit area to toggle it
      '<div id="pluginShotPhone" class="shot-phone" hidden>' +
        '<svg class="shot-like-heart" viewBox="1178 1648 100 90" aria-hidden="true"><path d="' + HEART + '"/></svg>' +
        '<button class="shot-like-hit" aria-label="Like" aria-pressed="false"></button></div>' +
      // the same "New Update" chip as the Tools tile, until its date
      (p.updateBadge && new Date() < new Date(p.updateBadge.until)
        ? '<div class="tile-badges"><span class="tile-badge tile-badge--new"><svg class="tile-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z"/></svg>' + p.updateBadge.text + '</span></div>'
        : '') + '</div>' +
      (shots.length > 1
        ? '<div class="product-thumbs">' + shots.map(function (s, n) {
            return '<button class="product-thumb' + (n ? '' : ' is-on') +
                   '" data-n="' + n + '" aria-label="' + s.alt + '">' +
                   '<img src="' + s.src + '" alt="" loading="lazy"></button>';
          }).join('') + '</div>'
        : '');

    overlay(shots[0]);
    var demoOff = null;
    var startDemo = function (s) {
      if (demoOff) { demoOff(); demoOff = null; }
      var el = $('pluginShotMain');
      if (s.demo && el.classList.contains('shot-demo')) demoOff = window.PANEL_DEMOS[s.demo](el) || null;
    };
    startDemo(shots[0]);

    /* shots[0].build: the first shot puts itself together on load. Over the
       still (held invisible, so the box keeps its size) sits the empty
       panel on its card, then each control drops in after the one before.
       When the last one lands the build is removed and the still shows, the
       same pixels. A thumbnail click mid-build just ends it. (A pointer
       parallax on the pieces was tried and dropped, Nov 3 '26.) */
    var build = shots[0].build;
    if (build && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var still = $('pluginShotMain'), kit = document.createElement('div');
      kit.className = 'shot-build';
      kit.innerHTML = '<img class="shot-build-base" src="' + build.base + '" alt="">' +
        build.layers.map(function (l, i) {
          return '<img class="shot-build-piece" src="' + l.src + '" alt="" style="left:' + l.x + '%;top:' + l.y + '%;width:' + l.w + '%;--k:' + i + '">';
        }).join('');
      still.classList.add('is-building');
      still.parentNode.insertBefore(kit, still.nextSibling);
      var pieces = kit.querySelectorAll('img');
      var done = function () {
        if (!kit.parentNode) return;
        still.classList.remove('is-building');
        kit.remove();
      };
      // start only once every piece is decoded, so none pops in late
      Promise.all([].map.call(pieces, function (im) {
        return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
      })).then(function () {
        kit.classList.add('go');
        pieces[pieces.length - 1].addEventListener('animationend', function () { setTimeout(done, 60); }, { once: true });
      });
      shot.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.product-thumb')) done(); }, true);
    }

    /* Like it the way the app does, on the phone only: the heart toggles,
       a double tap (double click) anywhere on the phone likes and drops a
       big heart where you tapped. */
    var like = function (ph, on) {   // ph: the gallery's phone or the Receipts hero's
      ph.classList.toggle('is-liked', on);
      ph.querySelector('.shot-like-hit').setAttribute('aria-pressed', on);
    };
    var burst = function (ph, e) {
      var r = ph.getBoundingClientRect(), h = document.createElement('div');
      h.className = 'shot-like-burst';
      h.style.left = (e.clientX - r.left) + 'px';
      h.style.top = (e.clientY - r.top) + 'px';
      h.style.setProperty('--tilt', (Math.random() * 40 - 20).toFixed(1) + 'deg');
      h.innerHTML = '<svg viewBox="1178 1648 100 90" aria-hidden="true"><path d="' + HEART + '"/></svg>';
      ph.appendChild(h);
      h.addEventListener('animationend', function () { h.remove(); });
    };
    var lastTap = null;
    shot.addEventListener('click', function (e) {
      var ph = e.target.closest && e.target.closest('.shot-phone');
      if (ph) {
        if (e.target.closest('.shot-like-hit')) { like(ph, !ph.classList.contains('is-liked')); lastTap = null; return; }
        var t = { at: e.timeStamp, x: e.clientX, y: e.clientY };
        if (lastTap && t.at - lastTap.at < 320 && Math.abs(t.x - lastTap.x) < 40 && Math.abs(t.y - lastTap.y) < 40) {
          like(ph, true); burst(ph, e);
        }
        lastTap = t;
        return;
      }
      var b = e.target.closest && e.target.closest('.product-thumb');
      if (!b) return;
      var s = shots[+b.getAttribute('data-n')], main = $('pluginShotMain');
      overlay(s);
      if (s.video || s.demo || main.tagName !== 'IMG') {
        // swap the element: a loop, a still and a demo can't share one tag
        var tmp = document.createElement('div');
        tmp.innerHTML = media(s);
        main.parentNode.replaceChild(tmp.firstChild, main);
        startDemo(s);
      } else {
        main.src = s.src; main.alt = s.alt;
      }
      [].forEach.call(shot.querySelectorAll('.product-thumb'), function (t) {
        t.classList.toggle('is-on', t === b);
      });
    });
  }

  // ── the buy column ──
  $('pluginTitle').textContent = p.name;
  var host = $('pluginHost');
  if (host) { if (p.host) host.textContent = p.host; else host.remove(); }
  $('pluginTagline').textContent = p.tagline;
  /* One button per platform. The visitor's own OS is listed first and is
     the only solid button; the other platform is an outline, so the page
     still has exactly one loud action. The older single `download` + `size`
     shape still renders as one macOS button. */
  var downloads = p.downloads || (p.download ? [{ os: 'macOS', file: p.download, size: p.size }] : []);
  var ua = navigator.userAgent || '';
  var mine = /Windows/i.test(ua) ? 'Windows' : /Mac|iPhone|iPad/i.test(ua) ? 'macOS' : '';
  downloads = downloads.slice().sort(function (a, b) {
    return (b.os === mine ? 1 : 0) - (a.os === mine ? 1 : 0);
  });
  /* Paid plugins carry `price`. With a `buy` link that's the one solid
     button; without one the page shows the price and says it's coming. */
  $('pluginPrice').textContent = p.price || (downloads.length ? 'Free' : 'Not released yet');
  // a sale: the regular price struck through in front of it
  if (p.price && p.was) $('pluginPrice').innerHTML = '<s class="price-was">' + p.was + '</s> ' + p.price;

  var dl = $('pluginDownload');
  if (dl && p.price) {
    dl.innerHTML = p.buy
      ? '<div class="product-dl"><a class="btn btn-solid product-btn" href="' + p.buy + '">Buy for ' + p.price + '</a>' +
        '<p class="product-meta">' + [p.version, p.buyNote].filter(Boolean).join(' &nbsp;·&nbsp; ') + '</p></div>'
      : '<p class="product-meta product-meta--soon">Coming soon</p>';
    /* Gumroad links open Gumroad's checkout as an overlay on this page (its
       Modal Overlay widget) instead of leaving the site. The button keeps the
       site's own style: no `gumroad-button` class, which would restyle it. */
    if (p.buy && /gumroad\.com\//.test(p.buy) && !document.querySelector('script[src*="gumroad.com/js/gumroad.js"]')) {
      var gr = document.createElement('script');
      gr.src = 'https://gumroad.com/js/gumroad.js';
      gr.async = true;
      document.body.appendChild(gr);
    }
  } else if (dl) {
    if (downloads.length) {
      dl.innerHTML = downloads.map(function (d, n) {
        return '<div class="product-dl">' +
          '<a class="btn ' + (n ? '' : 'btn-solid ') + 'product-btn" href="' + d.file +
            '" download data-os="' + d.os + '">Download for ' + d.os + '</a>' +
          '<p class="product-meta">' +
            [p.version, d.size, d.note].filter(Boolean).join(' &nbsp;·&nbsp; ') +
          '</p>' +
        '</div>';
      }).join('');
      /* Count the download as a GoatCounter event, one line per plugin,
         version and OS. count.js loads async and skips localhost on its
         own, so the guard is for the click that lands before it has arrived. */
      [].forEach.call(dl.querySelectorAll('.product-btn'), function (a) {
        a.addEventListener('click', function () {
          if (window.goatcounter && goatcounter.count) {
            var os = a.getAttribute('data-os').toLowerCase();
            goatcounter.count({ path: 'download/' + p.slug + '/' + p.version + '/' + os,
                                title: p.name + ' ' + p.version + ' ' + os + ' download',
                                event: true });
          }
        });
      });
    } else {
      /* Nothing at all rather than a dead button. The price line above
         already reads "Not released yet"; saying it twice is filler. */
      dl.innerHTML = '';
    }
  }

  var facts = $('pluginFacts');
  if (facts) {
    facts.innerHTML = p.facts.map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('');
  }

  // ── copy ──
  $('pluginIntro').innerHTML = p.intro;
  /* What's new (the newest version) and the version history (the rest,
     collapsed), above the open-source note. */
  var CHEV = '<svg viewBox="0 0 20 36" aria-hidden="true"><path d="M4 3 L16 18 L4 33"/></svg>';
  var list = function (items) { return '<ul class="changelog-list">' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'; };
  /* The Video: the YouTube embed, then the reach numbers under it. Same
     heading style as What's New, so the two read as the page's sections. */
  var videoHtml = '';
  // the cover's click: the real player in its place, playing (autoplay is
  // allowed because the click handed it the permission via allow="autoplay")
  document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('.video-facade');
    if (!f) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + f.getAttribute('data-yt') + '?autoplay=1&rel=0';
    frame.title = f.getAttribute('data-title');
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    f.replaceWith(frame);
  });

  /* `video` is a YouTube id ({youtube}) or a silent loop shipped with the
     site ({src, poster}), which plays full width like a project clip.
     `heading: ''` drops the section title. */
  /* `wide`: a 16:9 still in the same full-width spot ({src, alt}) */
  if (p.wide && p.wide.src) {
    videoHtml = '<section class="plugin-section plugin-video plugin-loop plugin-wide"><img src="' + p.wide.src + '" alt="' + (p.wide.alt || '') + '" loading="lazy"></section>';
  } else if (p.video && p.video.src) {
    videoHtml = '<section class="plugin-section plugin-video plugin-loop">' +
      (p.video.heading ? '<h2 class="changelog-title">' + p.video.heading + '</h2>' : '') +
      '<video src="' + p.video.src + '" poster="' + (p.video.poster || '') + '" muted loop playsinline preload="auto" aria-label="' +
      (p.video.title || p.name) + '"></video></section>';
  } else if (p.video || (p.stats && p.stats.items && p.stats.items.length)) {
    var vh = p.video && p.video.heading !== undefined ? p.video.heading : 'The Video';
    videoHtml = '<section class="plugin-section plugin-video">' + (vh ? '<h2 class="changelog-title">' + vh + '</h2>' : '') +
      /* A cover, not the player: YouTube's player is another page, and this
         one gets no mouse events over it, so the site's cursor stuck at its
         edge. The thumbnail and play button are this page's own; a click
         swaps in the player, already playing (playVideo, below). */
      (p.video ? '<div class="video-embed"><button class="video-facade" data-yt="' + p.video.youtube + '" data-title="' + (p.video.title || p.name) +
        '" aria-label="Play ' + (p.video.title || p.name) + '" style="background-image:url(https://i.ytimg.com/vi/' + p.video.youtube + '/maxresdefault.jpg)">' +
        '<span class="video-play"><svg viewBox="0 0 68 48" aria-hidden="true"><path class="yt-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>' +
        '<path d="M45 24 27 14v20z" fill="#fff"/></svg></span></button></div>' : '') +
      (p.stats && p.stats.items ? '<div class="product-stats">' +
        // the source of the numbers heads them, tying them to the video above
        (p.stats.note ? '<p class="product-stats-head">' + p.stats.note + '</p>' : '') +
        '<div class="product-stats-row">' + p.stats.items.map(function (s) {
          return '<div class="product-stat"><span class="product-stat-fig">' + s[0] + '</span>' +
                 '<span class="product-stat-label">' + s[1] + '</span></div>';
        }).join('') +
        '</div></div>' : '') +
      '</section>';
  }
  /* What's New: every version as a row that slides open, all closed to
     start. The newest carries a red star. */
  var STAR = '<svg class="changelog-star" viewBox="0 0 24 24" aria-label="Latest"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z"/></svg>';
  var log = p.changelog || [], logHtml = '';
  if (log.length) {
    logHtml = '<section class="plugin-section plugin-changelog"><h2 class="changelog-title">What\'s New</h2>' +
      log.map(function (v, n) {
        return '<details class="changelog-version"><summary>' +
          '<span class="changelog-v">' + v.version + (n ? '' : STAR) + '</span>' +
          '<span class="changelog-date">' + v.date + '</span>' +
          '<span class="changelog-chev">' + CHEV + '</span></summary>' +
          '<div class="changelog-body">' + list(v.items) + '</div></details>';
      }).join('') + '</section>';
  }
  var featHtml = p.features && p.features.length
    ? '<section class="plugin-section plugin-features"><h2 class="changelog-title">What It Does</h2>' + list(p.features) + '</section>'
    : '';
  var body = $('pluginBody');
  if (body) body.innerHTML = videoHtml + featHtml + logHtml + (p.body || '');

  /* The loop holds on its first frame until the page has finished loading
     in and the video is on screen, then plays from the top, so its own
     opening (Clippings' letters landing) is seen rather than missed. */
  var loopVid = document.querySelector('.plugin-loop video');
  if (loopVid) {
    var guide = loopVid.closest('.plugin-guide') || loopVid.parentNode;
    var landed = Promise.all((guide.getAnimations ? guide.getAnimations() : []).map(function (a) { return a.finished; }))
      .catch(function () {});
    var seen = new Promise(function (res) {
      if (!window.IntersectionObserver) return res();
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); res(); }
      }, { threshold: 0.6 });
      io.observe(loopVid);
    });
    Promise.all([landed, seen]).then(function () {
      try { loopVid.currentTime = 0; } catch (e) {}
      var q = loopVid.play(); if (q && q.catch) q.catch(function () {});
    });
  }

  /* The stats fill the text column: the figures are sized so that, with the
     row's ordinary gap between them, the first starts at its left edge and
     the last ends at its right (Mike, Nov 4 '26). Measured at 100px, then
     scaled; again whenever the column changes width. */
  var statRow = document.querySelector('.product-stats-row');
  if (statRow) {
    var fitStats = function () {
      var figs = statRow.querySelectorAll('.product-stat-fig');
      statRow.style.setProperty('--stat-fs', '100px');
      var sum = 0;
      [].forEach.call(figs, function (f) { sum += f.getBoundingClientRect().width; });
      var gap = parseFloat(getComputedStyle(statRow).columnGap) || 0;
      var room = statRow.clientWidth - gap * (figs.length - 1);
      if (sum > 0 && room > 0) statRow.style.setProperty('--stat-fs', (100 * room / sum - 0.5) + 'px');
    };
    fitStats();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStats);
    if (window.ResizeObserver) new ResizeObserver(fitStats).observe(statRow);
    else window.addEventListener('resize', fitStats);
  }

  /* The version rows open and close with a slide: <details> on its own
     snaps, so the summary click is taken over and the body's height is
     animated, open set before opening and cleared after closing. */
  [].forEach.call(document.querySelectorAll('.changelog-version'), function (d) {
    var sum = d.querySelector('summary'), bodyEl = d.querySelector('.changelog-body');
    var anim = null;
    sum.addEventListener('click', function (e) {
      if (!bodyEl.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      var opening = !d.open || d.classList.contains('is-closing');
      // a closed row still reports its full height in Chrome, so start from 0
      var from = d.open ? bodyEl.getBoundingClientRect().height : 0;
      if (anim) anim.cancel();
      if (opening) { d.open = true; d.classList.remove('is-closing'); d.classList.add('is-opening'); }
      else { d.classList.add('is-closing'); d.classList.remove('is-opening'); }
      var to = opening ? bodyEl.scrollHeight : 0;
      anim = bodyEl.animate([
        { height: from + 'px', opacity: opening ? 0 : 1 },
        { height: to + 'px', opacity: opening ? 1 : 0 }
      ], { duration: opening ? 380 : 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      anim.onfinish = function () {
        anim = null;
        d.classList.remove('is-opening', 'is-closing');
        if (!opening) d.open = false;
      };
    });
  });
  [].forEach.call(document.querySelectorAll('#pluginIntro p, #pluginBody p, #pluginBody dd, #pluginBody li'),
    function (el) { el.innerHTML = el.innerHTML.replace(/\s+([^\s<>]+)\s*$/, ' $1'); });

  /* ── prev / next ──
     One plugin: no pager, there's nowhere to go. Two: a single Next, since
     both arrows would land on the same page. Three or more: the normal
     pair. All of it keys off plugins.length, so nothing here changes when
     a plugin is added or pulled. */
  var prevEl = $('pluginPrev'), nextEl = $('pluginNext');
  var pager = document.querySelector('.arrow-pager');
  /* Removed, not hidden: .project-pager carries its own display rule in
     the stylesheet, and an author `display` beats the UA rule behind the
     hidden attribute — so pager.hidden = true set the attribute and the
     bar rendered anyway. Nothing can restyle an element that isn't there. */
  if (pager && plugins.length < 2) { pager.remove(); return; }
  if (prevEl) {
    prevEl.href = '/' + plugins[(i - 1 + plugins.length) % plugins.length].slug;
    prevEl.hidden = plugins.length < 3;
  }
  if (nextEl) nextEl.href = '/' + plugins[(i + 1) % plugins.length].slug;
})();
