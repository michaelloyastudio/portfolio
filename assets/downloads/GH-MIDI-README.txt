GH MIDI v1.1
============
Play a Guitar Hero controller like a real instrument.


WHAT'S IN HERE

  GH MIDI.app         the app. No DAW needed.
  GH MIDI.vst3        the plugin. FL Studio, Ableton, Reaper, any VST3 host.
  GH MIDI Guide.pdf   everything else.


SETUP

  1.  App:     drag GH MIDI.app anywhere.
      Plugin:  put GH MIDI.vst3 in   ~/Library/Audio/Plug-Ins/VST3
               (in Finder press Shift+Cmd+G, paste that path, hit Return)
               then rescan plugins in your DAW.

  2.  The first time you open it, macOS says it "could not verify" the app.
      Click Done. Then:
          System Settings > Privacy & Security > scroll down > Open Anyway
      Once. It opens normally after that.

  3.  Plug in the guitar. Play.
      Run the app OR the plugin, not both. Whichever opens first gets the guitar.


  If the plugin still won't load in your DAW, open Terminal and paste:

      xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins/VST3/"GH MIDI.vst3"


HELP

  The ? button inside the app, or GH MIDI Guide.pdf.
  michaelloya.studio/gh-midi
