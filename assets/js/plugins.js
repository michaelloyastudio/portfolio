/* Plugin data for michaelloya.studio
 *
 * Same shape as projects.js so the two grids render from one pattern:
 *   slug      — URL: /<slug>.html  (must match the filename)
 *   name      — display name
 *   host      — shown where a project shows its category
 *   tagline   — one line under the name on the detail page
 *   cover     — 16:9 grid tile
 *   hero      — big media at the top of the plugin page
 *   intro     — the pitch. Two short paragraphs at most.
 *   facts     — array of [label, value] rows, rendered as the facts list
 *   status    — 'live' | 'beta' | 'building'
 *   version   — shown on the download button
 *   download  — path to the file. NULL means no button: the page shows the
 *               status instead of a link that 404s. Fill this in and the
 *               button appears; nothing else has to change.
 *   size      — human-readable, shown next to the button
 *   body      — the guide below the download. Plain HTML.
 *
 * Hosting: the file lives in this repo under assets/downloads/. GitHub's
 * hard limit is 100MB PER FILE and the zip is 7.2MB, so it ships with the
 * site — no second repo, no release plumbing, and Cloudflare caches it.
 * If a build ever approaches 100MB (Lookout will), cut a GitHub Release on
 * that plugin's own repo and point `download` at the release asset instead.
 */
const plugins = [
  {
    slug: 'gh-midi',
    name: 'GH MIDI',
    host: 'VST3 · Standalone',
    tagline: 'Guitar controller to MIDI',
    cover: 'projects/plugins/gh-midi-cover.jpg',
    hero: 'projects/plugins/gh-midi-hero.jpg',
    intro: `<p>Turns a plastic Guitar Hero controller into a real instrument. It reads the frets, strum bar, whammy and tilt straight off the device and maps them to notes, so the guitar drives whatever you have loaded instead of a game.</p>
<p>There is a note highway on screen while you play, and three modes that go from <em>you cannot play a wrong note</em> to a real instrument you have to learn. Free, no account, no upsell.</p>`,
    facts: [
      ['Platform', 'macOS — Apple silicon and Intel'],
      ['Format', 'VST3, standalone'],
      ['Hosts', 'FL Studio, Ableton, Reaper, any VST3 host']
    ],
    status: 'live',
    version: 'v1.1',
    download: 'assets/downloads/GH-MIDI-v1.1-macOS.zip',
    size: '7.2 MB',
    body: `
<section class="plugin-section">
  <h2>Install</h2>
  <ol class="plugin-steps">
    <li>Unzip, and drag <code>GH MIDI.vst3</code> into <code>~/Library/Audio/Plug-Ins/VST3</code>.</li>
    <li>macOS quarantines anything downloaded from the web. Open Terminal and paste this once:
      <pre class="plugin-code"><code>xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins/VST3/"GH MIDI.vst3"</code></pre>
    </li>
    <li>Rescan plugins in your DAW, then add <strong>GH MIDI</strong> as an instrument.</li>
  </ol>
  <p class="plugin-note">Step two is not optional and it is not me being lazy — Apple charges $99 a year for the certificate that skips it. Until that is worth paying for, the one-line paste is the price of free.</p>
</section>

<section class="plugin-section">
  <h2>Your controller</h2>
  <p>Ships pre-mapped for a Wii Guitar Hero guitar on a raphnet WUSBMote adapter. For any other USB controller, open <strong>SETTINGS</strong>, pick your device, then hit <strong>LEARN</strong> on a row and press that control on the guitar. Every row can be re-learned or cleared on its own, and the mapping is saved permanently.</p>
</section>

<section class="plugin-section">
  <h2>How to play</h2>
  <dl class="plugin-keys">
    <div><dt>Frets + strum</dt><dd>Play. Down and up strums are different voicings in CHORDS.</dd></div>
    <div><dt>Whammy</dt><dd>Pitch bend, or CC20 you can link to any knob.</dd></div>
    <div><dt>Minus</dt><dd>Switch mode — CHORDS, PRO, SOLO.</dd></div>
    <div><dt>Plus</dt><dd>Octave.</dd></div>
    <div><dt>Stick left / right</dt><dd>Change key.</dd></div>
  </dl>
</section>

<section class="plugin-section">
  <h2>Modes</h2>
  <dl class="plugin-keys">
    <div><dt>Chords</dt><dd>Every fret is a chord in the current key — green I, red V, yellow vi, blue IV, orange ii. You cannot play a wrong note.</dd></div>
    <div><dt>Solo</dt><dd>Each fret is one note of the key's pentatonic scale, so every note fits over every chord. Hammer-ons always on.</dd></div>
    <div><dt>Pro</dt><dd>The frets are a binary number — G&nbsp;1, R&nbsp;2, Y&nbsp;4, B&nbsp;8, O&nbsp;16 — choosing chromatic notes. 32 notes per octave position. A real instrument you have to learn.</dd></div>
  </dl>
</section>

<section class="plugin-section">
  <h2>Recording in FL Studio</h2>
  <p>To record notes, enable the <strong>GH MIDI</strong> device under Options → MIDI Settings → Input. Your playing lands in the piano roll like a MIDI keyboard. To route audio live, put GH MIDI inside Patcher and wire its green MIDI out to any instrument's green MIDI in, then that instrument's audio to <em>To FL Studio</em>.</p>
</section>

<section class="plugin-section">
  <h2>If something is wrong</h2>
  <dl class="plugin-keys">
    <div><dt>Controller not found</dt><dd>Plug it in, or open SETTINGS and pick the device by hand.</dd></div>
    <div><dt>Adapter can't see the guitar</dt><dd>On a WUSBMote: unplug the adapter's USB, reseat the guitar plug, plug the USB back in.</dd></div>
    <div><dt>No pitch bend from the whammy</dt><dd>Some presets ignore bend. Set whammy to CC20 in SETTINGS and right-click a pitch or filter knob to link it.</dd></div>
  </dl>
</section>`
  },
  {
    slug: 'lookout',
    name: 'Lookout',
    host: 'After Effects',
    tagline: 'Detection HUD',
    cover: 'projects/plugins/lookout-cover.jpg',
    hero: 'projects/plugins/lookout-hero.jpg',
    intro: `<p>An effect that finds things in your footage and draws them. Point it at a shot and it detects objects frame by frame, then renders a HUD over them — boxes, labels, tracking lines. Styled to look designed rather than like debug output.</p>
<p>It runs an open-vocabulary detector, so it is not limited to a fixed list of classes. You type what to look for and it looks for that.</p>`,
    facts: [
      ['Platform', 'macOS, Apple silicon'],
      ['Format', 'After Effects effect plugin'],
      ['Engine', 'Open-vocabulary detector']
    ],
    status: 'building',
    version: null,
    download: null,
    size: null,
    body: `
<section class="plugin-section">
  <h2>Where it's at</h2>
  <p>The detection engine works and renders the HUD you see above. What's left is the part that makes it a plugin anyone can install: the After Effects SDK wrapper, and shrinking a model that currently ships at a quarter of a gigabyte down to something worth downloading.</p>
</section>`
  }
];
