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
    host: 'Standalone \u00b7 VST3',
    tagline: 'Guitar controller to MIDI',
    cover: 'projects/plugins/gh-midi-cover.jpg',
    hero: 'projects/plugins/gh-midi-ui.jpg',
    shots: [
      { src: 'projects/plugins/gh-midi-ui.jpg',       alt: 'The GH MIDI note highway' },
      { src: 'projects/plugins/gh-midi-settings.jpg', alt: 'Settings: device picker and the LEARN mapping table' },
      { src: 'projects/plugins/gh-midi-help.jpg',     alt: 'The built-in How to Play card' }
    ],
    intro: `<p>Plug in a plastic Guitar Hero controller and play it like an instrument. GH MIDI reads the frets, strum bar, whammy and joystick straight off the device and turns them into MIDI, so the guitar drives whatever you have loaded instead of a game.</p>
<p>Three modes, from one where you cannot play a wrong note to one you actually have to learn. A note highway on screen while you play. It ships as a standalone app and as a VST3, so you can play it without opening a DAW at all.</p>`,
    facts: [
      ['Platform', 'macOS \u2014 Apple silicon and Intel'],
      ['Format', 'Standalone app + VST3'],
      ['Hosts', 'FL Studio, Ableton, Logic, Reaper, any VST3 host'],
      ['Controller', 'Wii Guitar Hero on a raphnet WUSBMote, or remap any USB HID']
    ],
    status: 'live',
    version: 'v1.1',
    download: 'assets/downloads/GH-MIDI-v1.1-macOS.zip',
    size: '15.2 MB',
    body: `
<section class="plugin-section">
  <h2>Install</h2>
  <p>The zip has both builds. Run <strong>one at a time</strong> \u2014 whichever opens first grabs the guitar, and the other will say it can't find a controller.</p>
  <ol class="plugin-steps">
    <li><strong>Standalone.</strong> Drag <code>GH MIDI.app</code> anywhere. First launch, right-click it &rarr; Open &rarr; Open. While it runs, a MIDI input called <strong>GH MIDI</strong> appears in every DAW and synth on your Mac \u2014 point an instrument at it and play. The app makes no sound itself; it's a controller.</li>
    <li><strong>Plugin.</strong> Drop <code>GH MIDI.vst3</code> into <code>~/Library/Audio/Plug-Ins/VST3</code>, rescan in your DAW, add it as an instrument.</li>
    <li>If macOS refuses to open either one, paste this once:
      <pre class="plugin-code"><code>xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins/VST3/"GH MIDI.vst3"</code></pre>
    </li>
  </ol>
  <p class="plugin-note">Step three exists because the build isn't notarized, and notarizing costs $99 a year. Until that's worth paying for, one paste is the price of free.</p>
</section>

<section class="plugin-section">
  <h2>Your controller</h2>
  <img class="step-shot" src="projects/plugins/gh-midi-settings-raw.jpg" alt="The settings panel, with the device picker and the LEARN mapping table" loading="lazy">
  <p>Pre-mapped for a Wii Guitar Hero guitar on a raphnet WUSBMote adapter. For anything else, open <strong>SETTINGS</strong>, pick your device, then hit <strong>LEARN</strong> on a row and press that control on the guitar. Every row can be re-learned or cleared on its own, and each controller keeps its own setup \u2014 switch devices and your mappings follow.</p>
</section>

<section class="plugin-section">
  <h2>How to play</h2>
  <dl class="plugin-keys">
    <div><dt>Frets + strum</dt><dd>Play. Up and down strums feel different.</dd></div>
    <div><dt>Whammy</dt><dd>Bends the note, and/or CC20 you can link to any knob.</dd></div>
    <div><dt>Minus</dt><dd>Switch mode \u2014 CHORDS, NOTES, SOLO.</dd></div>
    <div><dt>Plus</dt><dd>Tap through strum speeds, 0 to 50ms.</dd></div>
    <div><dt>Joystick</dt><dd>Left and right change key, up and down change octave, across the whole piano.</dd></div>
    <div><dt>On screen</dt><dd>The arrows along the bottom do all of it too. The gold tag under each one names the guitar control that does the same thing, and lights up when you use it.</dd></div>
  </dl>
</section>

<section class="plugin-section">
  <h2>Modes</h2>
  <dl class="plugin-keys">
    <div><dt>Chords</dt><dd>Every fret is a chord in the current key \u2014 green I, red V, yellow vi, blue IV, orange ii. You cannot play a wrong note.</dd></div>
    <div><dt>Solo</dt><dd>Each fret is one note of the key's pentatonic scale. Hold several and strum to sound them together, like strings; releasing a fret stops just that note. Every combination fits.</dd></div>
    <div><dt>Notes</dt><dd>The frets are a binary number \u2014 G&nbsp;1, R&nbsp;2, Y&nbsp;4, B&nbsp;8, O&nbsp;16 \u2014 choosing chromatic notes. 32 per octave position. A real instrument you have to learn.</dd></div>
  </dl>
  <p>In every mode a note sounds for as long as you hold the fret and stops when you let go.</p>
</section>

<section class="plugin-section">
  <h2>Recording in FL Studio</h2>
  <p>To record notes, enable the <strong>GH MIDI</strong> device under Options &rarr; MIDI Settings &rarr; Input. Your playing lands in the piano roll like a MIDI keyboard. To route audio live, put GH MIDI inside Patcher and wire its green MIDI out to any instrument's green MIDI in, then that instrument's audio to <em>To FL Studio</em>.</p>
</section>

<section class="plugin-section">
  <h2>If something is wrong</h2>
  <dl class="plugin-keys">
    <div><dt>Controller not found</dt><dd>Plug it in, or open SETTINGS and pick the device by hand. If it still won't appear, allow your DAW under System Settings &rarr; Privacy &amp; Security &rarr; Input Monitoring.</dd></div>
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
