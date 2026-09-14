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
  $('pluginPrice').textContent = p.download ? 'Free' : 'Not released yet';

  var dl = $('pluginDownload');
  if (dl) {
    if (p.download) {
      dl.innerHTML =
        '<a class="btn btn-solid product-btn" href="' + p.download + '" download>' +
          'Download for macOS' +
        '</a>' +
        '<p class="product-meta">' +
          [p.version, p.size].filter(Boolean).join(' &nbsp;·&nbsp; ') +
        '</p>';
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
  if (pager && plugins.length < 2) pager.hidden = true;   // nowhere to go
  if (prevEl) {
    prevEl.href = '/' + plugins[(i - 1 + plugins.length) % plugins.length].slug;
    prevEl.hidden = plugins.length < 3;
  }
  if (nextEl) nextEl.href = '/' + plugins[(i + 1) % plugins.length].slug;
})();
