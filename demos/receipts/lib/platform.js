// Receipts per-OS bits — pure functions of the platform (Node's os.platform(): 'darwin' |
// 'win32'), so the Deno tests can check both systems on either one. Used by panel.js.
(function (root) {
  function win(p) { return p === 'win32'; }

  // CEP gives the extension folder as a file: URL; on Windows that's file:///C:/… (no leading
  // slash wanted before the drive letter).
  function extensionPath(uri, p) {
    var s = decodeURI(uri).replace(/^file:\/\//, '');
    return win(p) ? s.replace(/^\/([A-Za-z]:)/, '$1') : s;
  }

  // The capture helper and the ffmpeg Receipts ships (Mac: a Homebrew one works too on dev machines).
  function bins(ext, p) {
    if (win(p)) return { helper: ext + '/helper/bin/bscap.exe', bundled: ext + '/bin/ffmpeg.exe', ffmpegs: [ext + '/bin/ffmpeg.exe'] };
    return { helper: ext + '/helper/bin/bscap', bundled: ext + '/bin/ffmpeg', ffmpegs: [ext + '/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'] };
  }

  // For <img>/CSS: a local file as a URL (C:\a b\x.jpg → file:///C:/a%20b/x.jpg)
  function fileUrl(f, p) {
    return win(p) ? 'file:///' + encodeURI(f.replace(/\\/g, '/')) : 'file://' + encodeURI(f);
  }

  // Show a file in Finder / Explorer: [command, args, execFile options]
  function reveal(f, p) {
    if (win(p)) return ['explorer.exe', ['/select,"' + f.replace(/\//g, '\\') + '"'], { windowsVerbatimArguments: true }];
    return ['open', ['-R', f], {}];
  }

  // Unsaved projects: the video goes in the user's movies folder
  function videosFolder(p) { return win(p) ? 'Videos' : 'Movies'; }

  // What to say when the helper can't take screenshots / is missing
  function texts(p) {
    if (win(p)) return {
      reveal: 'Show in File Explorer',
      permission: 'Windows blocked the screenshot. Make sure the screen is unlocked and After Effects is on screen, then try again.',
      missing: 'The capture helper (helper\\bin\\bscap.exe) is missing. Reinstall Receipts; if it keeps vanishing, your antivirus may be removing it.'
    };
    return {
      reveal: 'Show in Finder',
      permission: 'Allow After Effects in System Settings › Privacy & Security › Screen & System Audio Recording, then restart AE.',
      missing: 'Capture helper missing: run helper/build.sh'
    };
  }

  var api = { extensionPath: extensionPath, bins: bins, fileUrl: fileUrl, reveal: reveal, videosFolder: videosFolder, texts: texts };
  root.Platform = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
