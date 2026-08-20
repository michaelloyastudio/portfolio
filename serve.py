#!/usr/bin/env python3
"""
Local dev server WITH HTTP Range support.

python -m http.server ignores Range headers and always returns the whole
file, so video scrubbing silently fails — the timeline won't seek. Static
hosts (GitHub Pages included) do support Range, so this only matters
locally. Run this instead:

    python3 serve.py [port]
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        rng = self.headers.get("Range")
        if not rng:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        m = RANGE_RE.match(rng.strip())
        if not m:
            f.close()
            self.send_error(400, "Malformed Range header")
            return None

        start_s, end_s = m.groups()
        if start_s:
            start = int(start_s)
            end = int(end_s) if end_s else size - 1
        else:                                  # suffix form: bytes=-500
            start = max(0, size - int(end_s))
            end = size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()

        f.seek(start)
        self._range_remaining = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_remaining", None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        self._range_remaining = None
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)

    def end_headers(self):
        # Always advertise Range support, and keep the browser from caching
        # stale assets between edits.
        if "Accept-Ranges" not in self._headers_buffer_names():
            self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _headers_buffer_names(self):
        return b"".join(getattr(self, "_headers_buffer", [])).decode("latin-1", "replace")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print("serving %s on http://localhost:%d (Range enabled)" % (os.getcwd(), port))
    ThreadingHTTPServer(("", port), RangeHandler).serve_forever()
