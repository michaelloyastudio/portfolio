// Receipts compositor — pure functions, no I/O. Used by the panel (CEP) and the
// Deno tests. Turns a capture session into ffmpeg arguments for a 4K video, 9:16 or 16:9.
(function (root) {
  // Output canvases. safe: where the render and viewer go; tlBottom: how far down the timeline
  // may run on. The rest is AE's viewer grey.
  var FORMATS = {
    // Reels / TikTok / Shorts. Measured off a real TikTok on an iPhone (1320×2868, Nov 2026):
    // the app scales 9:16 to COVER the screen above its bottom bar, so it shows only x 111–2047
    // of the 2160 (about 5% gone each side) and its top bar covers down to y ≈ 450. Panels sit
    // inside both with a margin. The timeline may run on into the bottom caption strip (a little
    // of it hidden there is fine).
    '9:16': { label: '9:16', w: 2160, h: 3840, safe: { x: 144, y: 460, w: 1872, h: 3140 }, tlBottom: 3780 },
    // YouTube / desktop: no app chrome on top of the video, just an even margin (about 3–4%,
    // inside the old TV action-safe area) so nothing touches the edge.
    '16:9': { label: '16:9', w: 3840, h: 2160, safe: { x: 144, y: 120, w: 3552, h: 1920 }, tlBottom: 2040 }
  };
  // bg false (Background: None): no grey frame. The panels get the whole canvas to grow into,
  // and the video is cropped to their edges afterwards (args), so its shape is the content's.
  function format(f, bg) {
    var F = FORMATS[f] || FORMATS['9:16'];
    if (bg !== false) return F;
    return { label: F.label, w: F.w, h: F.h, safe: { x: 0, y: 0, w: F.w, h: F.h }, tlBottom: F.h, crop: true };
  }
  var W = FORMATS['9:16'].w, H = FORMATS['9:16'].h;
  var SAFE = FORMATS['9:16'].safe;
  var TL_BOTTOM = FORMATS['9:16'].tlBottom;
  var GAP = 8;
  var BG = '0x1d1d1d';
  var PLAYHEAD = '0x4f8ff0';                 // AE's playhead blue

  // srcs top to bottom. Panels take the comp's own shape (nothing is cropped off);
  // render and viewer go side by side when that makes them bigger (tall comps, 16:9 output).
  // 'top' is whichever the Primary setting picks: the final render, or the viewer with guides.
  var LAYOUTS = {
    stack: { label: 'Stack', srcs: ['render', 'viewer', 'timeline'] },
    split: { label: 'Split', srcs: ['render', 'viewer'] },
    viewer: { label: 'Viewer', srcs: ['top', 'timeline'] },
    // the viewer with its handles and nothing else: no timeline, no render (Primary doesn't apply)
    handles: { label: 'Handles', srcs: ['viewer'] }
  };
  function layoutOf(l) { return typeof l === 'string' ? LAYOUTS[l] : l; }
  // swap: the viewer (guides) on top instead of the final render
  function srcsOf(layout, swap) {
    var srcs = layoutOf(layout).srcs.map(function (s) { return s === 'top' ? (swap ? 'viewer' : 'render') : s; });
    if (swap && srcs.indexOf('render') >= 0 && srcs.indexOf('viewer') >= 0)
      srcs = srcs.map(function (s) { return s === 'render' ? 'viewer' : s === 'viewer' ? 'render' : s; });
    return srcs;
  }
  function needsRender(layout, swap) { return srcsOf(layout, swap).indexOf('render') >= 0; }

  function pad5(n) { n = String(n); while (n.length < 5) n = '0' + n; return n; }
  function num(n) { return String(Math.round(n * 100000) / 100000); }
  function even(n) { return Math.round(n / 2) * 2; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- framing ----------

  // Part of the viewer capture to show: exactly the comp frame, so the guides sit at the
  // same size and spot as the render on every run (a margin would follow AE's zoom and
  // change from run to run). aspect: the comp's real shape; the detected rect is evened
  // out to it around its centre. comp: comp rect in the capture (0..1), size: capture pixels [w, h].
  function viewerCrop(comp, size, aspect) {
    if (!comp || !size) return null;
    var iw = size[0], ih = size[1];
    var cx = (comp.x + comp.w / 2) * iw, cy = (comp.y + comp.h / 2) * ih, w = comp.w * iw, h = comp.h * ih;
    if (aspect) { if (w / h > aspect) h = w / aspect; else w = h * aspect; }
    w = Math.min(w, iw); h = Math.min(h, ih);
    var x = clamp(cx - w / 2, 0, iw - w), y = clamp(cy - h / 2, 0, ih - h);
    return { x: x / iw, y: y / ih, w: w / iw, h: h / ih };
  }

  // How much of the timeline still's width to cut off the left: the layer-name columns
  // (everything before the time graph) when o.names is false.
  function namesCut(o) { return o.names === false && o.timelineShot ? o.timelineShot.gx0 || 0 : 0; }

  // Shapes (width / height) of what goes in each panel.
  function aspects(o) {
    var vs = o.viewerSize, vc = o.viewerComp;
    var compA = o.compAspect || (vc && vs ? (vc.w * vs[0]) / (vc.h * vs[1]) : null);
    var crop = viewerCrop(vc, vs, compA);
    var viewer = crop ? compA : vs ? vs[0] / vs[1] : 16 / 9;
    compA = compA || viewer;
    var sh = o.timelineShot, ts = sh ? [sh.w * (1 - namesCut(o)), sh.h] : o.timelineSize;
    return { render: compA, viewer: viewer, timeline: ts ? ts[0] / ts[1] : 4, crop: crop };
  }

  // Boxes in output pixels for a layout: [{src, x, y, w, h}].
  // have: which sources exist; a: aspects(). Render + viewer are sized inside the format's safe
  // area with the timeline at 0.2–0.32 × the width; then the timeline grows down into the space
  // left below (up to its own shape, at most 0.6 × the width). It's squished to fit, so every
  // layer stays in. swap: the viewer (guides) takes the render's place on top. fmt: '9:16' | '16:9'.
  // bg: false = no grey frame (see format).
  function plan(layout, have, a, swap, fmt, bg) {
    var F = format(fmt, bg), SAFE = F.safe, TL_BOTTOM = F.tlBottom;
    var srcs = srcsOf(layout, swap).filter(function (s) { return have[s]; });
    var pics = srcs.filter(function (s) { return s !== 'timeline'; });
    var tl = srcs.indexOf('timeline') >= 0;
    var k = { render: 1 / a.render, viewer: 1 / a.viewer, timeline: clamp(1 / a.timeline, 0.2, 0.32) };

    var options = [pics.map(function (s) { return [s]; })];
    if (pics.length === 2) options.push([pics]);
    var best = null;
    options.forEach(function (rows) {
      if (tl) rows = rows.concat([['timeline']]);
      // height = W * c1 + c0, so the widest W that fits is direct
      var c1 = 0, c0 = (rows.length - 1) * GAP;
      rows.forEach(function (r) {
        var kmax = Math.max.apply(null, r.map(function (s) { return k[s]; }));
        c1 += kmax / r.length; c0 -= kmax * (r.length - 1) * GAP / r.length;
      });
      var w = Math.min(SAFE.w, (SAFE.h - c0) / c1);
      var area = 0;
      rows.forEach(function (r) {
        var cw = (w - (r.length - 1) * GAP) / r.length;
        r.forEach(function (s) { if (s !== 'timeline') area += cw * cw * k[s]; });
      });
      if (!best || area > best.area + 1) best = { rows: rows, w: w, h: w * c1 + c0, area: area };
    });

    var grow = 0;
    if (tl) {
      var want = best.w * Math.min(0.6, 1 / a.timeline) - best.w * k.timeline;
      grow = clamp(want, 0, TL_BOTTOM - SAFE.y - best.h);
    }
    var space = TL_BOTTOM - SAFE.y, total = best.h + grow;
    var boxes = [], y = SAFE.y + Math.max(0, Math.min(SAFE.h - best.h, space - total) / 2), x0 = SAFE.x + (SAFE.w - best.w) / 2;
    best.rows.forEach(function (r) {
      var cw = (best.w - (r.length - 1) * GAP) / r.length;
      var rh = cw * Math.max.apply(null, r.map(function (s) { return k[s]; })) + (r[0] === 'timeline' ? grow : 0);
      r.forEach(function (s, i) {
        var h = cw * k[s] + (s === 'timeline' ? grow : 0);
        boxes.push({ src: s, x: even(x0 + i * (cw + GAP)), y: even(y + (rh - h) / 2), w: even(cw), h: even(h) });
      });
      y += rh + GAP;
    });
    return boxes;
  }

  // ---------- ffmpeg ----------

  function cropFilter(c) {
    return c ? 'crop=w=iw*' + num(c.w) + ':h=ih*' + num(c.h) + ':x=iw*' + num(c.x) + ':y=ih*' + num(c.y) + ',' : '';
  }
  // 'contain': the whole picture (shapes already match, the pad only soaks up rounding);
  // 'squish': stretch to the box (the timeline: every layer, any panel shape).
  function fitFilter(box, fit, crop) {
    if (fit === 'squish') return cropFilter(crop) + 'scale=' + box.w + ':' + box.h + ':flags=lanczos,setsar=1';
    return cropFilter(crop) + 'scale=' + box.w + ':' + box.h + ':force_original_aspect_ratio=decrease:flags=lanczos,pad=' + box.w + ':' + box.h + ':(ow-iw)/2:(oh-ih)/2:color=' + BG + ',setsar=1';
  }

  // o: {layout, format ('9:16' | '16:9'), bg (false = no grey frame, cropped to the panels), swap (viewer on top), names (false = timeline without the layer-name columns), dir, count, fps, render (path | 'placeholder' | null), out, preview (seconds) | undefined,
  //     audio (bool), encoder ('vt' = VideoToolbox H.264, 'mf' = Media Foundation H.264, else x264), regions:['viewer','timeline'] (what was captured),
  //     hw (mf only: false = Windows' software encoder instead of the GPU's), sideways (encode turned 90° clockwise, for rotateArgs),
  //     viewerComp + viewerSize (where the comp sits in the viewer capture), timelineSize, compAspect,
  //     timelineShot {file, w, h, t0, t1, gx0}: one still of the whole timeline panel, layer columns
  //     on the left, the time graph from gx0 (0..1 of the width, comp time t0) to the right edge (t1);
  //     the playhead is drawn on per frame. start: comp time of the first frame}
  function args(o) {
    var L = layoutOf(o.layout), F = format(o.format, o.bg);
    if (!L) throw new Error('unknown layout ' + o.layout);
    if (needsRender(L, o.swap) && !o.render) throw new Error(L.label + ' needs a clean render');
    var have = { render: !!o.render };
    (o.regions || ['viewer', 'timeline']).forEach(function (r) { have[r] = true; });
    var a = aspects(o);
    var boxes = plan(L, have, a, o.swap, o.format, o.bg);
    // the finished frame: the whole canvas, or (no background) just the panels' edges
    var out = { x: 0, y: 0, w: F.w, h: F.h };
    if (F.crop) {
      var x1 = 0, y1 = 0; out.x = F.w; out.y = F.h;
      boxes.forEach(function (b) { out.x = Math.min(out.x, b.x); out.y = Math.min(out.y, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); });
      out.w = x1 - out.x; out.h = y1 - out.y;
    }
    var fps = o.fps, dur = o.count / fps;

    var av = ['-hide_banner', '-y', '-loglevel', 'error'];
    var idx = {}, n = 0;
    // 'placeholder' = flat grey stand-in, so previews work before anything is rendered
    if (o.render === 'placeholder') { av.push('-f', 'lavfi', '-i', 'color=c=0x3a3a3a:s=1920x1080:r=' + num(fps) + ':d=' + num(dur)); idx.render = n++; }
    // a still (the preview's one rendered frame) is held for the whole run, like the timeline still
    else if (o.render && /\.(png|jpe?g|tiff?)$/i.test(o.render)) { av.push('-loop', '1', '-framerate', num(fps), '-t', num(dur), '-i', o.render); idx.render = n++; }
    else if (o.render) { av.push('-i', o.render); idx.render = n++; }
    var shot = have.timeline && o.timelineShot;
    ['viewer', 'timeline'].forEach(function (src) {
      if (!have[src]) return;
      if (src === 'timeline' && shot) av.push('-loop', '1', '-framerate', num(fps), '-t', num(dur), '-i', shot.file);
      else av.push('-framerate', num(fps), '-start_number', '1', '-i', o.dir + '/' + src + '_%05d.jpg');
      idx[src] = n++;
    });

    // how many times each source is read: once per box
    var uses = {};
    boxes.forEach(function (b) { uses[b.src] = (uses[b.src] || 0) + 1; });

    var f = [], taken = {};
    Object.keys(uses).forEach(function (src) {
      var base = '[' + idx[src] + ':v]settb=AVTB,fps=' + num(fps) + ',setpts=PTS-STARTPTS,format=yuv420p';
      if (uses[src] === 1) f.push(base + '[' + src + '0]');
      else {
        var labels = [];
        for (var i = 0; i < uses[src]; i++) labels.push('[' + src + i + ']');
        f.push(base + ',split=' + uses[src] + labels.join(''));
      }
      taken[src] = 0;
    });
    function take(src) { return '[' + src + (taken[src]++) + ']'; }

    f.push('color=c=' + BG + ':s=' + F.w + 'x' + F.h + ':r=' + num(fps) + ':d=' + num(dur) + ',format=yuv420p[bg]');
    var cur = '[bg]';
    boxes.forEach(function (b, i) {
      var fit = b.src === 'timeline' ? 'squish' : 'contain';
      var cut = namesCut(o), crop = b.src === 'viewer' ? a.crop : b.src === 'timeline' && cut ? { x: cut, y: 0, w: 1 - cut, h: 1 } : null;
      f.push(take(b.src) + fitFilter(b, fit, crop) + '[b' + i + ']');
      f.push(cur + '[b' + i + ']overlay=' + b.x + ':' + b.y + ':shortest=0:eof_action=repeat[s' + i + ']');
      cur = '[s' + i + ']';
      if (b.src === 'timeline' && shot) {
        // the playhead, where AE would draw it at this frame's comp time
        var lw = 4, gx = cut ? 0 : b.w * (shot.gx0 || 0), k = (b.w - gx) / (shot.t1 - shot.t0);
        f.push('color=c=' + PLAYHEAD + ':s=' + lw + 'x' + b.h + ':r=' + num(fps) + ':d=' + num(dur) + '[ph]');
        f.push(cur + "[ph]overlay=x='" + num(b.x + gx - lw / 2) + '+clip((' + num(o.start || 0) + '+t-' + num(shot.t0) + ')*' + num(k) + ',0,' + num(b.w - gx) + ")':y=" + b.y +
          ':eval=frame:shortest=0:eof_action=repeat[p' + i + ']');
        cur = '[p' + i + ']';
      }
    });
    var isPreview = o.preview !== undefined && o.preview !== null;
    if (F.crop) { f.push(cur + 'crop=' + out.w + ':' + out.h + ':' + out.x + ':' + out.y + '[c]'); cur = '[c]'; }
    f.push(cur + (isPreview ? 'scale=' + even(out.w / 4) + ':' + even(out.h / 4) + ',' : '') + (o.sideways && !isPreview ? 'transpose=clock,' : '') + 'format=yuv420p[out]');

    av.push('-filter_complex', f.join(';'), '-map', '[out]');
    if (isPreview) {
      av.push('-ss', num(Math.max(0, Math.min(o.preview, dur - 1 / fps))), '-frames:v', '1', '-q:v', '3', o.out);
      return av;
    }
    if (o.render && o.render !== 'placeholder' && o.audio !== false) av.push('-map', idx.render + ':a?', '-c:a', 'aac', '-b:a', '192k');
    // 'vt': Apple's hardware H.264 (the ffmpeg Receipts ships has no x264)
    if (o.encoder === 'vt') av.push('-c:v', 'h264_videotoolbox', '-b:v', '40M', '-maxrate', '60M', '-bufsize', '80M', '-profile:v', 'high', '-allow_sw', '1', '-tag:v', 'avc1');
    // 'mf': Windows' Media Foundation H.264 (the Windows ffmpeg Receipts ships has no x264).
    // hw: the GPU's encoder (fast); false: Microsoft's software one. Profile 100 = High. NV12 is
    // the one input every Media Foundation encoder takes.
    else if (o.encoder === 'mf') av.push('-c:v', 'h264_mf', '-hw_encoding', o.hw === false ? '0' : '1', '-b:v', '40M', '-maxrate', '60M', '-bufsize', '80M',
      '-profile:v', '100', '-g', String(Math.max(1, Math.round(fps * 2))), '-tag:v', 'avc1');
    else av.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-level', '5.2');
    av.push('-pix_fmt', o.encoder === 'mf' ? 'nv12' : 'yuv420p', '-r', num(fps), '-t', num(dur), '-movflags', '+faststart', o.out);
    return av;
  }

  // ---------- encoders ----------

  // The H.264 encoder an ffmpeg has. platform: Node's os.platform(); bundled: it's the ffmpeg
  // Receipts ships (Mac: VideoToolbox, Windows: Media Foundation). Any other ffmpeg (a dev
  // machine's) is taken to have x264.
  function encoderFor(platform, bundled) {
    if (!bundled) return 'x264';
    return platform === 'win32' ? 'mf' : 'vt';
  }

  // What to try, in order, until ffmpeg takes it: extra args() options. Media Foundation: the
  // GPU's encoder, then Windows' software one. Many of them stop at 4096×2304 (AMD's at 4096×2160)
  // and refuse 2160×3840, so 9:16 also gets a sideways try: encoded as 3840×2160, then rotateArgs
  // stores it with a 90° display flag (like a phone's portrait video), so it plays upright.
  function encodeAttempts(encoder, fmt) {
    if (encoder !== 'mf') return [{}];
    var F = format(fmt);
    if (F.h <= F.w) return [{ hw: true }, { hw: false }];
    return [{ hw: true }, { hw: true, sideways: true }, { hw: false }, { hw: false, sideways: true }];
  }

  // A sideways encode → the finished file: same streams, flagged to display turned 90° back.
  function rotateArgs(src, out) {
    return ['-hide_banner', '-y', '-loglevel', 'error', '-display_rotation:v:0', '90', '-i', src, '-map', '0', '-c', 'copy', '-movflags', '+faststart', out];
  }

  // ---------- naming ----------

  function yymmdd(d) {
    d = d || new Date();
    function two(x) { return (x < 10 ? '0' : '') + x; }
    return two(d.getFullYear() % 100) + two(d.getMonth() + 1) + two(d.getDate());
  }

  function safe(s) { return String(s).replace(/[\/:*?"<>|\\]+/g, '').replace(/\s+/g, '').replace(/^\.+/, '') || 'Comp'; }

  // Next free ProjectName_BTS_vXX_YYMMDD.mp4 (16:9: ProjectName_BTS_16x9_vXX_…) given the files already in the folder.
  function outName(comp, existing, date, fmt) {
    var stem = safe(comp) + (fmt === '16:9' ? '_BTS_16x9_v' : '_BTS_v'), hi = 0;
    (existing || []).forEach(function (f) {
      if (f.indexOf(stem) !== 0) return;
      var v = parseInt(f.slice(stem.length, stem.length + 2), 10);
      if (v > hi) hi = v;
    });
    var v = hi + 1;
    return stem + (v < 10 ? '0' : '') + v + '_' + yymmdd(date) + '.mp4';
  }

  // The viewer zoom that shows the whole comp big: ~94% of the viewer panel.
  // det: bscap detect ({compPx, panelPx}); cw, ch: comp size (width × pixel aspect); zoom: the view's now.
  // AE draws one comp pixel per screen pixel at 100%, so a comp showing less than zoom × its size is
  // cut off by the panel, and on that axis what shows is the panel's full size.
  // → {ok:true} when the view is already right, else {zoom, cut} to set (and probe again).
  var FILL = 0.94;
  function fitZoom(det, cw, ch, zoom) {
    if (!det || !det.compPx || !det.panelPx || !zoom || !cw || !ch) return { ok: true };
    var c = det.compPx, p = det.panelPx, ex = cw * zoom, ey = ch * zoom;
    // a comp that shows whole, in its own shape, also tells the screen scale (1 unless AE changes)
    var s = Math.abs(c[2] / c[3] / (cw / ch) - 1) < 0.015 && c[2] / ex > 0.97 ? c[2] / ex : 1;
    var w = ex * s, h = ey * s, cutX = c[2] < w * 0.97, cutY = c[3] < h * 0.97;
    var pw = cutX ? c[2] : Math.max(p[2], c[2]), ph = cutY ? c[3] : Math.max(p[3], c[3]);
    var k = FILL * Math.min(pw / w, ph / h);
    if (!cutX && !cutY && k > 0.85 && k < 1.12) return { ok: true };
    return { zoom: Math.min(16, Math.max(0.01, zoom * k)), cut: cutX || cutY };
  }

  var api = {
    LAYOUTS: LAYOUTS, FORMATS: FORMATS, W: W, H: H, SAFE: SAFE, TL_BOTTOM: TL_BOTTOM, plan: plan, aspects: aspects,
    srcsOf: srcsOf, needsRender: needsRender,
    args: args, encoderFor: encoderFor, encodeAttempts: encodeAttempts, rotateArgs: rotateArgs, fitZoom: fitZoom, viewerCrop: viewerCrop, outName: outName, yymmdd: yymmdd, pad5: pad5, safe: safe
  };
  // CEP with Node on defines `module` in the page too, so always set the global.
  root.Compose = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
