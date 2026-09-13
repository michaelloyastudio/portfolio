/* ══════════════════════════════════════════════════════════════
   Plugin page renderer.
   Mirrors project-page.js: each /<slug>.html sets window.PLUGIN_SLUG
   and this fills in the hero, title, copy, facts, download and guide
   from plugins.js. Content lives in one place; the per-plugin HTML
   files stay thin.
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

  // ── hero ──
  var hero = $('pluginHero');
  if (hero) hero.innerHTML = '<img src="' + p.hero + '" alt="' + p.name + '">';

  // ── title block ──
  $('pluginTitle').textContent = p.name;
  $('pluginHost').textContent = p.host + ' — ' + p.tagline;
  $('pluginIntro').innerHTML = p.intro;
  noWidows($('pluginIntro'));

  // ── facts ──
  var facts = $('pluginFacts');
  if (facts) {
    facts.innerHTML = p.facts.map(function (row) {
      return '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
    }).join('');
  }

  /* ── download ──
     No `download` field means the build isn't out yet. Show the status
     rather than a button that 404s, so an unreleased plugin can sit on
     the site without anyone hitting a dead link. */
  var dl = $('pluginDownload');
  if (dl) {
    if (p.download) {
      dl.innerHTML =
        '<a class="btn btn-solid plugin-btn" href="' + p.download + '" download>' +
          'Download ' + p.version +
        '</a>' +
        '<span class="plugin-meta">macOS' + (p.size ? ' &middot; ' + p.size : '') + ' &middot; free</span>';
    } else {
      dl.innerHTML = '<span class="plugin-status">In development</span>';
    }
  }

  // ── guide ──
  var body = $('pluginBody');
  if (body) {
    body.innerHTML = p.body || '';
    [].forEach.call(body.querySelectorAll('p, dd'), function (el) { noWidows(el); });
  }

  /* ── prev / next, wrapping like the project pager ──
     With only two plugins both arrows would land on the same page, so
     below three the pager collapses to a single Next. Once a third one
     ships this reverts to the normal two-arrow behaviour on its own. */
  var prevEl = $('pluginPrev'), nextEl = $('pluginNext');
  if (prevEl) {
    prevEl.href = '/' + plugins[(i - 1 + plugins.length) % plugins.length].slug;
    prevEl.hidden = plugins.length < 3;
  }
  if (nextEl) nextEl.href = '/' + plugins[(i + 1) % plugins.length].slug;

  /* Shared with project-page.js but that file isn't loaded here, so the
     helper is duplicated. Pulls the last two words of every block together
     with a non-breaking space, which keeps a one-word orphan line from
     hanging under a paragraph. */
  function noWidows(el) {
    if (!el) return;
    [].forEach.call(el.querySelectorAll ? el.querySelectorAll('p') : [], function (n) {
      n.innerHTML = n.innerHTML.replace(/\s+([^\s<>]+)\s*$/, ' $1');
    });
    if (el.tagName === 'DD') el.innerHTML = el.innerHTML.replace(/\s+([^\s<>]+)\s*$/, ' $1');
  }
})();
