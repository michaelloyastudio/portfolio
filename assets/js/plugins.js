/* Plugin data for michaelloya.studio
 *
 * Same shape as projects.js so the two grids render from one pattern:
 *   slug      — URL: /<slug>  (the file is <slug>.html; Pages drops the extension)
 *   name      — display name
 *   host      — optional small red line above the name on the product
 *               page. GH MIDI has none: "Standalone · VST3" meant little on
 *               its own. The Tools tile shows the price in that spot.
 *   tagline   — one line under the name on the product page only; the
 *               Tools grid shows title and host, nothing under them
 *   was       — optional regular price, shown struck through before `price` (a sale)
 *   price     — paid plugins only ('$39'). Replaces "Free" on the tile and
 *               the page. With `buy` (the checkout URL) the page shows one
 *               solid Buy button; without it, "Coming soon" and no button.
 *               A Gumroad `buy` link (https://michaelloyastudio.gumroad.com/l/<slug>)
 *               opens Gumroad's checkout as an overlay on the page.
 *   coverVideo — optional square loop the Tools tile plays on hover
 *   coverScale — optional: shrink a cover that fills more of its card than the others
 *   coverAt    — optional: the still IS this second of coverVideo, so a hover plays on from
 *                the frozen frame and leaving pauses where it got to (no return to the still)
 *   cover     — 16:9 grid tile
 *   hero      — the product shot. Falls back to this when `shots` is absent.
 *   shots     — [{src, alt}] gallery; {video, src, alt} is a silent loop
 *               (overlay: an image laid over it on hover / tap, e.g. a social app's UI)
 *               with src as its poster and thumbnail. More than one renders a thumbnail
 *               strip under the main shot; one or none renders no strip.
 *   intro     — the pitch. Two short paragraphs at most.
 *   facts     — array of [label, value] rows, rendered as the facts list
 *   status    — 'live' | 'beta' | 'building'
 *   version   — shown on the download button
 *   downloads — one entry per platform: {os, file, size, note?}. `file` is
 *               the path with ?v=<first 12 of the zip's md5>. The filename
 *               never changes between cuts and Cloudflare caches by URL for
 *               four hours, so without the hash a re-cut zip keeps serving
 *               the OLD bytes live. The page lists the visitor's own OS
 *               first with the solid button; the rest are outlines. An
 *               empty list means no button: the page shows the status
 *               instead of a link that 404s. (The older single `download`
 *               + `size` pair still renders as one macOS button.)
 *   note      — optional word after the size on the meta line ('beta')
 *   video     — optional {youtube: id, title}: embedded in "The Video"
 *               section above What's New. Or {src, poster, heading?}: a
 *               silent 16:9 loop from this repo, played full width.
 *   features  — optional [html] list under "What it does", same bullets as
 *               What's New.
 *   stats     — optional {items: [[figure, label]], note}: big numbers in that
 *               same section, under the video (reach of the videos about the
 *               plugin). Round DOWN so the claim stays true. The note sits
 *               above the numbers as their heading.
 *   changelog — [{version, date, items: [html]}], newest first. The newest
 *               renders as "What's new", the rest as a collapsed version
 *               history. Rewrite it from the GitHub release notes per cut.
 *   body      — the guide below the download. Plain HTML.
 *
 * Hosting: the file lives in this repo under assets/downloads/. GitHub's
 * hard limit is 100MB PER FILE and the zip is ~16MB, so it ships with the
 * site — no second repo, no release plumbing, and Cloudflare caches it.
 * If a build ever approaches 100MB (Lookout will), cut a GitHub Release on
 * that plugin's own repo and point `download` at the release asset instead.
 */
const plugins = [
  {
    slug: 'gh-midi',
    name: 'Guitar Hero MIDI',
    coverScale: 0.86,
    tagline: 'Play a Guitar Hero controller like a real instrument',
    cover: 'projects/plugins/gh-midi-tile.jpg?v=7',
    coverVideo: 'projects/plugins/gh-midi-square.mp4?v=6',
    coverAt: 2.617,
    hero: 'projects/plugins/gh-midi-ui.jpg?v=7',
    /* v1.2 shots (Nov 2026): the standalone app's own demo mode, captured as a real window;
       the overlays are its HUD snapshots composited into that window frame. */
    shots: [
      // the loop leads: it autoplays where the others build themselves
      { video: 'projects/plugins/gh-midi-square.mp4?v=6', src: 'projects/plugins/gh-midi-square-poster.jpg?v=7', alt: 'GH MIDI playing its demo' },
      { src: 'projects/plugins/gh-midi-frets.jpg?v=7',    alt: 'FRETS: choose what every fret plays' },
      { src: 'projects/plugins/gh-midi-settings.jpg?v=7', alt: 'Settings: controller mapping, lefty flip, whammy as bend or palm mute' },
      { src: 'projects/plugins/gh-midi-help.jpg?v=7',     alt: 'The built-in How to Play card' }
    ],
    intro: `<p>Turns the controller into a MIDI instrument. It reads the frets, strum bar, whammy and joystick directly from the hardware and sends them as MIDI to whatever instrument you have loaded.</p>
<p>Four modes cover everything from chords in a key, where a wrong note is not possible, to a fully chromatic layout. It runs as a VST3 in your DAW, or as a standalone app that appears as a MIDI input in GarageBand, Logic, or any synth.</p>`,
    facts: [
      ['Platform', 'macOS 11+ and Windows 10/11'],
      ['Format', 'Standalone app + VST3'],
      ['Controller', 'Any USB controller'],
      ['Source', '<a href="https://github.com/michaelloyastudio/gh-midi" target="_blank" rel="noopener">github.com/michaelloyastudio/gh-midi</a>']
    ],
    status: 'live',
    version: 'v1.2',
    updateBadge: { text: 'New update', until: '2026-11-20' },   // v1.2 shipped 2026-10-20
    /* Mike's totals for 10 posts (2026-10-22): Instagram 442,589 views /
       14,325 likes, TikTok 264,083 / 6,517 (two TikTok counts app-rounded),
       total 706,672 views / 20,842 likes / 293 comments. Shown rounded down. */
    stats: { items: [['700K+', 'views'], ['20K+', 'likes']], note: 'On GH MIDI videos across Instagram and TikTok' },
    video: { youtube: '8DL_x7Ll75Y', title: 'Making GH MIDI', heading: '' },   // no section title (Mike, Nov 4 '26; was 'The Process')
    changelog: [
      { version: '1.2', date: 'October 20, 2026', items: [
        '<strong>Change what any fret plays.</strong> The new FRETS editor swaps the chord or note on any fret and on all ten two-fret pairs. Your key\'s chords are listed first, and a switch sets whether a change applies to every key or just the one you\'re in.',
        '<strong>Lower lag.</strong> The guitar is read every millisecond instead of every four, strums settle faster, and notes reach your DAW a full audio block sooner.',
        '<strong>Lefty flip.</strong> Mirrors the highway and reverses the strum bar and joystick.',
        '<strong>Palm mute.</strong> Hold the whammy and strum for short, chunky power-chord chugs.',
        '<strong>Reset to defaults</strong> in SETTINGS, for the controller mapping, lefty and whammy mode.',
        '<strong>SOLO range.</strong> The joystick slides the five frets up or down the scale, one note at a time.',
        'Your settings and mappings from 1.1 carry over.'
      ] },
      { version: '1.1', date: 'September 13, 2026', items: [
        '<strong>Standalone app.</strong> Play without a DAW. It shows up as a MIDI input in any DAW or synth app.',
        '<strong>On-screen controls</strong> for mode, strum spread, key and octave, with octaves from \u22123 to +3.',
        '<strong>Polyphonic SOLO</strong>, and chord combos in CHORDS.',
        '<strong>CHART mode.</strong> Record a rough Clone Hero chart in your DAW and finish it in Moonscraper.',
        '<strong>User guide</strong> in the download.',
        '<strong>Windows</strong> build added September 20.'
      ] },
      { version: '1.0', date: 'September 13, 2026', items: [
        '<strong>First release.</strong> A VST3 plugin for macOS, Apple Silicon and Intel.',
        '<strong>Three modes:</strong> chords in a key, a chromatic layout, and a pentatonic scale.',
        '<strong>3D note highway</strong> that lights up as you play.',
        '<strong>Any USB controller,</strong> set up by pressing each control once.',
        '<strong>Whammy</strong> bends the pitch.',
        '<strong>GH MIDI input</strong> so your DAW can record what you play.'
      ] }
    ],
    /* The Windows zip is built by GitHub Actions in the gh-midi repo (its
       `release` job attaches it to the GitHub release); the copy here is
       that exact asset. It was smoke-tested on GitHub's runners rather than
       played on a real PC, but Mike doesn't want it labelled beta (2026-09-22). */
    downloads: [
      { os: 'macOS',   file: 'assets/downloads/GH-MIDI-v1.2-macOS.zip?v=52ef575b8da1',   size: '17.0 MB' },
      { os: 'Windows', file: 'assets/downloads/GH-MIDI-v1.2-Windows.zip?v=cf56385a6fa5', size: '6.2 MB' }
    ],
    /* No setup on the page. It ships as README.txt in the zip, where it's
       next to the files it talks about. The page sells; the README installs.
       The source link lives in the specs list; Mike cut the open-source
       blurb below the changelog (2026-10-20). */
    body: ''
  },

  /* Paid AE tools. Set `buy` to the Gumroad link and the Buy button appears.
     Receipts' loops are cut from a real Receipts video (Control Me). */
  {
    slug: 'receipts',
    name: 'Receipts for After Effects',
    tagline: 'Social-ready process videos in one click',
    price: '$19.99',
    was: '$29.99',
    buy: 'https://michaelloyastudio.gumroad.com/l/receipts',
    cover: 'projects/plugins/receipts-tile.jpg?v=7',   // the panel behind, the TikTok phone in front (receipts repo tools/promo/cover/thumbnail.html)
    // coverVideo: off while Mike makes a new one (was receipts-square.mp4?v=3)
    shots: [
      // the hero, live (panel-demos.js): the real panel behind, the TikTok phone in front; a look card
      // clicked on the panel plays that look on the phone. Its thumbnail is the Tools tile's picture.
      { demo: 'receipts', src: 'projects/plugins/receipts-tile.jpg?v=7', alt: 'The Receipts panel: click a look to see it on the phone' },
      { video: 'projects/plugins/receipts-pair.mp4?v=1', src: 'projects/plugins/receipts-pair.jpg?v=1', overlay: 'projects/plugins/receipts-social.svg?v=10', alt: 'A Receipts process video, and the same video in the TikTok feed' },
      { src: 'projects/plugins/receipts-ui-options.jpg?v=7', alt: 'The Receipts panel with its options open: primary, background, range, render and timeline' }
    ],
    intro: `<p>Hit Generate and Receipts steps through your comp one frame at a time, screenshots the real viewer with every handle, path and gizmo After Effects draws, shoots the whole timeline, renders the comp, and builds a finished 4K 9:16 process video. No screen recording, no cropping in Premiere.</p>
<p>It finds the viewer and the timeline on its own and fits the comp in the viewer, then puts your zoom, playhead and selection back when it's done. Preview shows one frame in every look before you commit.</p>`,
    features: [
      '<strong>The real viewer.</strong> Everything After Effects draws: handles, motion paths, 3D gizmos, effect points.',
      '<strong>The whole timeline.</strong> Every layer in one shot, with or without the layer names, and the playhead moving across it.',
      '<strong>Four looks.</strong> Stack, Split or Viewer, with the handles or the final render as the main picture. Or Handles: the viewer on its own, no timeline.',
      '<strong>Grey or no background.</strong> A 9:16 frame in After Effects\' grey that stays clear of the Reels, TikTok and Shorts app bars, or none: the video cropped right to the edges.',
      '<strong>Any comp size.</strong> 16:9, 9:16, square, ultra-wide. Tall comps go side by side.',
      '<strong>One button.</strong> No layers to pick and no regions to draw.'
    ],
    facts: [
      ['Host', 'After Effects 2022 or later'],
      ['Platform', 'macOS 14+ and Windows 10/11'],
      ['Format', 'Panel (Window › Extensions)'],
      ['Output', '4K 9:16 MP4, or cropped to fit']
    ],
    status: 'building',
    version: 'v1.0',
    body: ''
  },

  /* Clippings' loops are rendered from the panel's own letters with Typeset's
     motion (~/Developer/promo/clippings). Price is a placeholder until Mike sets it. */
  {
    slug: 'clippings',
    name: 'Clippings for After Effects',
    tagline: 'Ransom-note text in one click',
    price: '$14.99',
    buy: 'https://michaelloyastudio.gumroad.com/l/clippings',
    cover: 'projects/plugins/clippings-ui.jpg?v=2',
    // coverVideo: off for now, the tile just zooms (was clippings-square.mp4)
    shots: [
      // the real panel, live (panel-demos.js): shuffle, align, boil; the text is fixed
      { demo: 'clippings', src: 'projects/plugins/clippings-ui.jpg?v=2', alt: 'The Clippings panel: shuffle the letters' },
      // a still, not the loop: the 1,140 LETTERS card (promo/clippings at 16.2 s, no piece twice in a note, the wall blurred)
      { src: 'projects/plugins/clippings-1140.jpg?v=2', alt: '1,140 cutout letters' }
    ],
    intro: `<p>Type your text and Clippings builds it from real cutout letters: magazine scraps, newsprint, comics, record sleeves, band tees, embroidered patches, stickers, tickets and tin signs. The preview shows the exact letters you'll get. Click one to swap it, or shuffle them all, then hit Add.</p>
<p>The note lands in your comp as one layer, sized to fit, and nothing is baked. Tilt, spacing, boil and the paper shadow are sliders right on that layer, and every letter inside is its own layer you can animate.</p>`,
    video: { src: 'projects/plugins/clippings-loop.mp4?v=2', poster: 'projects/plugins/clippings-loop-start.jpg?v=1', title: 'Clippings in motion' },   // poster = its first frame: it waits there until the page has loaded in
    features: [
      '<strong>1,140 letters inside.</strong> A–Z, a–z, 0–9 and punctuation, at least 12 looks per character. Nothing to download separately.',
      '<strong>What you see is what you get.</strong> Click any letter in the preview to swap its cutout before you add it.',
      '<strong>Live in the comp.</strong> Tilt, size variation, up and down, letter and line spacing, all on the note layer.',
      '<strong>Boil.</strong> A stop-motion twitch, with letters that swap cutouts as they boil.',
      '<strong>Lines and alignment.</strong> One line or several, left, center or right, in mixed case like a real ransom note.',
      '<strong>Travels with the project.</strong> The letters you use are copied next to your project file.'
    ],
    facts: [
      ['Host', 'After Effects 2022 or later'],
      ['Platform', 'macOS'],
      ['Format', 'Panel (Window › Extensions)'],
      ['Letters', '1,140 cutouts, included']
    ],
    status: 'building',
    version: 'v1.0',
    body: ''
  },

];
