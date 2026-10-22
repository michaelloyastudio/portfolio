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
    shot.innerHTML =
      '<img id="pluginShotMain" src="' + shots[0].src + '" alt="' + shots[0].alt + '">' +
      (shots.length > 1
        ? '<div class="product-thumbs">' + shots.map(function (s, n) {
            return '<button class="product-thumb' + (n ? '' : ' is-on') +
                   '" data-src="' + s.src + '" aria-label="' + s.alt + '">' +
                   '<img src="' + s.src + '" alt="" loading="lazy"></button>';
          }).join('') + '</div>'
        : '');

    var main = $('pluginShotMain');
    shot.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.product-thumb');
      if (!b) return;
      main.src = b.getAttribute('data-src');
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
  $('pluginPrice').textContent = downloads.length ? 'Free' : 'Not released yet';

  var dl = $('pluginDownload');
  if (dl) {
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
  if (p.video || (p.stats && p.stats.items && p.stats.items.length)) {
    videoHtml = '<section class="plugin-section plugin-video"><h2 class="changelog-title">The Video</h2>' +
      (p.video ? '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + p.video.youtube +
        '" title="' + (p.video.title || p.name) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' : '') +
      (p.stats && p.stats.items ? '<div class="product-stats"><div class="product-stats-row">' + p.stats.items.map(function (s) {
          return '<div class="product-stat"><span class="product-stat-fig">' + s[0] + '</span>' +
                 '<span class="product-stat-label">' + s[1] + '</span></div>';
        }).join('') + '</div>' + (p.stats.note ? '<p class="product-stats-note">' + p.stats.note + '</p>' : '') + '</div>' : '') +
      '</section>';
  }
  var log = p.changelog || [], logHtml = '';
  if (log.length) {
    logHtml += '<section class="plugin-section plugin-changelog">' +
      '<h2 class="changelog-title">What\'s New</h2>' +
      '<div class="changelog-row"><span class="changelog-v">' + log[0].version + '</span>' +
      '<span class="changelog-date">' + log[0].date + '</span></div>' + list(log[0].items) + '</section>';
    if (log.length > 1) {
      logHtml += '<section class="plugin-section plugin-history"><h2>Version history</h2>' +
        log.slice(1).map(function (v) {
          return '<details class="changelog-version"><summary>' +
            '<span class="changelog-v">' + v.version + '</span>' +
            '<span class="changelog-date">' + v.date + '</span>' +
            '<span class="changelog-chev">' + CHEV + '</span></summary>' +
            '<div class="changelog-body">' + list(v.items) + '</div></details>';
        }).join('') + '</section>';
    }
  }
  var body = $('pluginBody');
  if (body) body.innerHTML = videoHtml + logHtml + (p.body || '');

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
  var pager = document.querySelector('.project-pager');
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
