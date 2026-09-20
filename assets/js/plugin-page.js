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
  $('pluginHost').textContent = p.host;
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
  var body = $('pluginBody');
  if (body) body.innerHTML = p.body || '';
  [].forEach.call(document.querySelectorAll('#pluginIntro p, #pluginBody p, #pluginBody dd'),
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
