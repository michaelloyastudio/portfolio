GH MIDI v1.1
============
Turn a Guitar Hero controller into a real MIDI instrument.
by Loya  ·  full guide: https://michaelloya.studio/gh-midi


WHAT'S IN THE ZIP
-----------------
GH MIDI.app    standalone app - no DAW required to run it
GH MIDI.vst3   plugin for VST3 hosts (FL Studio, Ableton, Reaper, ...)

Both work on Apple Silicon and Intel. Run ONE of them at a time: whichever
opens first grabs the guitar, and the other will say "controller not found".


STANDALONE APP (no DAW needed)
------------------------------
1. Drag "GH MIDI.app" to Applications (or anywhere).
2. First launch: right-click the app > Open > Open (it isn't notarized).
   If macOS still refuses, open Terminal and run:
       xattr -dr com.apple.quarantine /Applications/"GH MIDI.app"
3. While the app is running, a MIDI input called "GH MIDI" shows up in every
   DAW and synth app on your Mac (Logic, GarageBand, Ableton, FL, Reaper,
   any software instrument). Pick an instrument, set its MIDI input to
   "GH MIDI", play. The app itself makes no sound - it is a controller.


PLUGIN (VST3)
-------------
1. Copy "GH MIDI.vst3" to:   ~/Library/Audio/Plug-Ins/VST3
2. macOS quarantines downloaded plugins. Open Terminal and run:
       xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins/VST3/"GH MIDI.vst3"
3. Rescan plugins in your DAW. Add "GH MIDI" as an instrument/generator.


YOUR CONTROLLER
---------------
Ships pre-mapped for a Wii Guitar Hero guitar on a raphnet WUSBMote adapter.
Other USB HID controllers: SETTINGS -> pick your device -> use the MAPPING
table: hit LEARN on a row, press that control on your guitar, done. Each row
can be re-learned or cleared (X) on its own. Every controller keeps its
own remembered setup - switch devices and your mappings follow.


HOW TO PLAY  (also in the "?" help inside the plugin)
-----------------------------------------------------
FRETS + STRUM     play (down and up strums are different voicings in CHORDS)
WHAMMY            pitch bend, and/or CC20 you can link to any knob (SETTINGS)
MINUS             switch mode:  CHORDS -> NOTES -> SOLO
PLUS              tap through strum speeds (0-50ms)
JOYSTICK          left/right = key, up/down = octave
ON SCREEN         arrows along the bottom change mode, strum speed, key and
                  octave too;
                  the gold tag under each setting names the guitar control
                  that does the same, and lights up when you use it
OCTAVE            -3 to +3 in every mode (the whole piano)

MODES
  CHORDS  every fret is a chord in the current key (green I, red V,
          yellow vi, blue IV, orange ii). You cannot play a wrong note.
  SOLO    each fret is one note of the key's pentatonic scale - hold
          several and strum to sound them together, like strings. Releasing
          a fret stops just that note. Every combination fits.
  NOTES   frets are a binary number (G=1 R=2 Y=4 B=8 O=16) choosing
          chromatic notes. 32 notes per octave position - a real instrument
          you have to learn.


RECORDING & ROUTING (FL Studio)
-------------------------------
Record NOTES: enable the "GH MIDI" device under Options > MIDI Settings >
Input - your playing records into the piano roll like a MIDI keyboard.
Route audio live: add GH MIDI inside Patcher, wire its green MIDI-out to any
instrument's green MIDI-in, instrument audio to "To FL Studio".


TROUBLESHOOTING
---------------
"CONTROLLER NOT FOUND" - plug it in, or SETTINGS > pick the device. If it
still won't appear, check System Settings > Privacy & Security > Input
Monitoring and allow your DAW.
"ADAPTER CAN'T SEE THE GUITAR" (WUSBMote) - unplug the adapter's USB, reseat
the guitar plug, plug USB back in.
No pitch bend from the whammy - some presets ignore bend; set whammy to CC20
in SETTINGS and link it to a pitch or filter knob (right-click the knob).

Every mode: strum to sound a note or chord. It sounds for as long as you
hold the fret (or the strum bar, for open notes) and stops when you let go.
