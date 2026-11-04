/* Live panel demos for a product page's first shot (plugins.js: shots[0].demo).
   plugin-page.js calls PANEL_DEMOS[name](el) on an empty .shot-demo box; each
   draws its scene on a 1200px square stage that is scaled to the box, so it
   keeps the same composition as the still it stands in for.

   receipts: the real panel (demos/receipts/, in an iframe) behind, the TikTok
     phone in front. Clicking a look card on the panel plays that look on the
     phone, from the same moment (receipts-look-<look>.mp4, one per look).
   clippings: the real panel (demos/clippings/) centred, its text fixed:
     shuffle, align, boil, Add. */
(function () {
  var LOOKS = ['stack', 'split', 'viewer', 'handles'];
  var VID = function (l) { return 'projects/plugins/receipts-look-' + l + '.mp4?v=1'; };
  var POSTER = function (l) { return 'projects/plugins/receipts-look-' + l + '.jpg?v=1'; };
  // the overlay's like heart, in its screen px (receipts-social.svg; same as plugin-page.js)
  var HEART = 'M1228 1738c-41-30-50-43-50-61 0-17 13-29 27-29 10 0 19 6 23 14 4-8 13-14 23-14 14 0 27 12 27 29 0 18-9 31-50 61z';

  // keep a 1200px stage the width of its box
  function fit(el, stage) {
    var set = function () { stage.style.transform = 'scale(' + (el.clientWidth / 1200) + ')'; };
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(el);
    else window.addEventListener('resize', set);
  }

  function receipts(el) {
    el.innerHTML =
      '<div class="demo-stage">' +
        '<div class="demo-group">' +
          '<div class="demo-panel"><div class="demo-tab">Receipts <i></i></div>' +
            '<div class="demo-frame"><iframe src="demos/receipts/index.html?v=2" title="The Receipts panel: click a look" scrolling="no"></iframe></div></div>' +
          '<div class="demo-phone"><div class="demo-vid">' +
            '<video src="' + VID('stack') + '" poster="' + POSTER('stack') + '" muted autoplay loop playsinline aria-label="The Stack look, in the TikTok feed"></video></div>' +
            '<img class="demo-ui" src="projects/plugins/receipts-social.svg?v=10" alt="" aria-hidden="true">' +
            // likeable like the gallery's phone: plugin-page.js handles the heart and the double tap on any .shot-phone
            '<div class="shot-phone"><svg class="shot-like-heart" viewBox="1178 1648 100 90" aria-hidden="true"><path d="' + HEART + '"/></svg>' +
              '<button class="shot-like-hit" aria-label="Like" aria-pressed="false"></button></div></div>' +
        '</div>' +
      '</div>';
    var stage = el.querySelector('.demo-stage'), video = el.querySelector('video'), frame = el.querySelector('iframe');
    fit(el, stage);
    var current = 'stack';
    var onMsg = function (e) {
      if (e.source !== frame.contentWindow || !e.data || e.data.type !== 'receipts:look') return;
      var l = e.data.layout;
      if (LOOKS.indexOf(l) < 0 || l === current) return;
      current = l;
      // the same moment in the new look: the four videos share one timeline
      var t = video.currentTime;
      video.poster = POSTER(l);
      video.src = VID(l);
      video.setAttribute('aria-label', 'The ' + l.charAt(0).toUpperCase() + l.slice(1) + ' look, in the TikTok feed');
      video.addEventListener('loadedmetadata', function () {
        try { video.currentTime = t % (video.duration || 1); } catch (err) {}
        var q = video.play(); if (q && q.catch) q.catch(function () {});
      }, { once: true });
    };
    window.addEventListener('message', onMsg);
    // the box is replaced when another thumbnail is picked: stop listening then
    return function () { window.removeEventListener('message', onMsg); };
  }

  function clippings(el) {
    el.innerHTML =
      '<div class="demo-stage">' +
        '<div class="demo-panel demo-panel--solo"><div class="demo-tab">Clippings <i></i></div>' +
          '<div class="demo-frame"><iframe src="demos/clippings/index.html?v=4" title="The Clippings panel: shuffle the letters" scrolling="no"></iframe></div></div>' +
      '</div>';
    fit(el, el.querySelector('.demo-stage'));
  }

  window.PANEL_DEMOS = { receipts: receipts, clippings: clippings };
})();
