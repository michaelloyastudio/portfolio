/* Plugin data for michaelloya.studio/plugins.html
 *
 * Each entry:
 *   slug      — anchor id
 *   name      — display name
 *   host      — the app it runs inside
 *   tagline   — one line, shown next to the name
 *   body      — the pitch. Two short paragraphs at most.
 *   specs     — array of [label, value] rows
 *   status    — 'live' | 'beta' | 'building'   (drives the button)
 *   version   — shown on the button when there's a download
 *   download  — URL of the file. NULL means no button: the page shows the
 *               status instead of a link that 404s. Fill this in and the
 *               button appears; nothing else has to change.
 *   source    — repo URL, or null
 *
 * Hosting note: don't put binaries in this repo. It is already ~900MB of
 * git history and GitHub hard-blocks files over 100MB, which Lookout is
 * well past. Cut a GitHub Release on the plugin's own repo and point
 * `download` at the release asset — 2GB per file, no cost to this repo.
 */
const plugins = [
  {
    slug: 'lookout',
    name: 'Lookout',
    host: 'After Effects',
    tagline: 'Detection HUD',
    body: `<p>An effect that finds things in your footage and draws them. Point it at a shot and it detects objects frame by frame, then renders a HUD over them: boxes, labels, tracking points. Styled to look designed rather than like debug output.</p>
<p>It runs an open-vocabulary detector, so it isn't limited to a fixed list of classes. You type what to look for and it looks for that.</p>`,
    specs: [
      ['Platform', 'macOS, Apple silicon'],
      ['Host', 'After Effects'],
      ['Format', 'AE effect plugin']
    ],
    status: 'building',
    version: null,
    download: null,
    source: null
  },
  {
    slug: 'gh-midi',
    name: 'GH MIDI',
    host: 'FL Studio',
    tagline: 'Guitar controller to MIDI',
    body: `<p>Turns a plastic Guitar Hero controller into a real instrument. It reads the frets, strum bar, whammy and tilt straight off the device and maps them to notes, so the guitar drives whatever you've got loaded instead of a game.</p>
<p>Ships as a plugin and as a standalone app, with a note highway on screen so you can see what you're playing.</p>`,
    specs: [
      ['Platform', 'macOS'],
      ['Host', 'FL Studio, or any VST3 / AU host'],
      ['Format', 'VST3, AU, standalone']
    ],
    status: 'building',
    version: null,
    download: null,
    source: null
  }
];
