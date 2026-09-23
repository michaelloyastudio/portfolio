/* Plugin data for michaelloya.studio
 *
 * Same shape as projects.js so the two grids render from one pattern:
 *   slug      — URL: /<slug>  (the file is <slug>.html; Pages drops the extension)
 *   name      — display name
 *   host      — shown where a project shows its category
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
    host: 'Standalone \u00b7 VST3',
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
      ['Platform', 'macOS (Apple silicon and Intel) and Windows (x64)'],
      ['Format', 'Standalone app + VST3'],
      ['Controller', 'Any USB controller'],
      ['Source', '<a href="https://github.com/michaelloyastudio/gh-midi" target="_blank" rel="noopener">github.com/michaelloyastudio/gh-midi</a>']
    ],
    status: 'live',
    version: 'v1.1',
    /* The Windows zip is built by GitHub Actions in the gh-midi repo (its
       `release` job attaches it to the GitHub release); the copy here is
       that exact asset. It was smoke-tested on GitHub's runners rather than
       played on a real PC, but Mike doesn't want it labelled beta (2026-09-22). */
    downloads: [
      { os: 'macOS',   file: 'assets/downloads/GH-MIDI-v1.1-macOS.zip?v=739e104109a8',   size: '16.7 MB' },
      { os: 'Windows', file: 'assets/downloads/GH-MIDI-v1.1-Windows.zip?v=e2d939ad9e74', size: '6.2 MB' }
    ],
    /* No setup on the page. It ships as README.txt in the zip, where it's
       next to the files it talks about. The page sells; the README installs.
       Below the fold, one quiet line: the source is open, here it is. */
    body: `<section class="plugin-section plugin-section--quiet">
<h2>Open source</h2>
<p>The code is on <a href="https://github.com/michaelloyastudio/gh-midi" target="_blank" rel="noopener">GitHub</a> under the AGPL. Build it, change it, port it. Pull requests are read.</p>
</section>`
  }

];
