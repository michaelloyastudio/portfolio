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
 *   cover     — 16:9 grid tile
 *   hero      — the product shot. Falls back to this when `shots` is absent.
 *   shots     — [{src, alt}] gallery. More than one renders a thumbnail
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
 *               section above What's New.
 *   stats     — optional {items: [[figure, label]], note}: big numbers in that
 *               same section, under the video (reach of the videos about the
 *               plugin). Round DOWN so the claim stays true.
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
    tagline: 'Play a Guitar Hero controller like a real instrument',
    cover: 'projects/plugins/gh-midi-cover.jpg?v=2',
    hero: 'projects/plugins/gh-midi-ui.jpg?v=2',
    shots: [
      { src: 'projects/plugins/gh-midi-ui.jpg?v=2',       alt: 'Chord struck on the note highway' },
      { src: 'projects/plugins/gh-midi-settings.jpg?v=2', alt: 'Settings: device picker and mapping table' },
      { src: 'projects/plugins/gh-midi-help.jpg?v=2',     alt: 'The built-in How to Play card' }
    ],
    intro: `<p>Turns the controller into a MIDI instrument. It reads the frets, strum bar, whammy and joystick directly from the hardware and sends them as MIDI to whatever instrument you have loaded.</p>
<p>Four modes cover everything from chords in a key, where a wrong note is not possible, to a fully chromatic layout. It runs as a VST3 in your DAW, or as a standalone app that appears as a MIDI input in GarageBand, Logic, or any synth.</p>`,
    facts: [
      ['Platform', 'macOS and Windows'],
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
    stats: { items: [['700K+', 'views'], ['20K+', 'likes']], note: 'Across Instagram and YouTube' },
    video: { youtube: '8DL_x7Ll75Y', title: 'Making GH MIDI' },
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
  }

];
