/* Plugin data for michaelloya.studio
 *
 * Same shape as projects.js so the two grids render from one pattern:
 *   slug      — URL: /<slug>  (the file is <slug>.html; Pages drops the extension)
 *   name      — display name
 *   host      — shown where a project shows its category
 *   tagline   — one line under the name on the detail page
 *   cover     — 16:9 grid tile
 *   hero      — the product shot. Falls back to this when `shots` is absent.
 *   shots     — [{src, alt}] gallery. More than one renders a thumbnail
 *               strip under the main shot; one or none renders no strip.
 *   intro     — the pitch. Two short paragraphs at most.
 *   facts     — array of [label, value] rows, rendered as the facts list
 *   status    — 'live' | 'beta' | 'building'
 *   version   — shown on the download button
 *   download  — path to the file, with ?v=<first 8 of the zip's md5>. The
 *               filename never changes between cuts and Cloudflare caches by
 *               URL for four hours, so without the hash a re-cut zip keeps
 *               serving the OLD bytes live. NULL means no button: the page
 *               shows the status instead of a link that 404s.
 *   size      — human-readable, shown next to the button
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
    tagline: 'Play a plastic guitar like a real instrument',
    cover: 'projects/plugins/gh-midi-cover.jpg',
    hero: 'projects/plugins/gh-midi-ui.jpg',
    shots: [
      { src: 'projects/plugins/gh-midi-ui.jpg',       alt: 'Chord struck on the note highway' },
      { src: 'projects/plugins/gh-midi-settings.jpg', alt: 'Settings: device picker and mapping table' },
      { src: 'projects/plugins/gh-midi-help.jpg',     alt: 'The built-in How to Play card' }
    ],
    intro: `<p>Plug in a Guitar Hero controller and play it for real. It reads the frets, strum bar, whammy and joystick straight off the device and turns them into MIDI, so it drives whatever you have loaded instead of a game.</p>
<p>Three modes, from one where you cannot play a wrong note to one you actually have to learn. Runs as a plugin or on its own, so you don't need a DAW open to play.</p>`,
    facts: [
      ['Platform', 'macOS \u2014 Apple silicon and Intel'],
      ['Format', 'Standalone app + VST3'],
      ['Controller', 'Any USB controller']
    ],
    status: 'live',
    version: 'v1.1',
    download: 'assets/downloads/GH-MIDI-v1.1-macOS.zip?v=d2d83ae4',
    size: '16.5 MB',
    /* No setup on the page. It ships as README.txt in the zip, where it's
       next to the files it talks about. The page sells; the README installs. */
    body: ''
  },
  {
    slug: 'lookout',
    name: 'Lookout',
    host: 'After Effects',
    tagline: 'Detection HUD',
    cover: 'projects/plugins/lookout-cover.jpg',
    hero: 'projects/plugins/lookout-ui.jpg',
    intro: `<p>An effect that finds things in your footage and draws them. Point it at a shot and it detects objects frame by frame, then renders a HUD over them — boxes, labels, tracking lines. Styled to look designed rather than like debug output.</p>`,
    facts: [
      ['Platform', 'macOS, Apple silicon'],
      ['Format', 'After Effects effect plugin']
    ],
    status: 'building',
    version: null,
    download: null,
    size: null,
    body: `
<section class="plugin-section">
  <h2>Where it's at</h2>
  <p>The detection engine works and renders the HUD you see above. What's left is packaging it as an After Effects plugin.</p>
</section>`
  }
];
