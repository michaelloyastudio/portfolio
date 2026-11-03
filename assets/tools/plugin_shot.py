#!/usr/bin/env python3
"""Compose a plugin window screenshot into a product thumbnail.

    python3 assets/tools/plugin_shot.py shot.png out.jpg [--size 1400]

NOT a build step — the site still has none. This is an asset-prep utility you
run by hand when a new screenshot comes in, so every plugin image on the site
gets the identical treatment instead of being eyeballed each time.

The treatment, decided against alternatives and worth keeping consistent:

  * The macOS TITLE BAR STAYS. It is what makes the image read as a real
    application rather than a render, and it costs almost nothing vertically.
  * Light ground (#f3f3f3). These plugin UIs are dark, so a dark card gives
    almost no separation and the window dissolves into the page. White is the
    loudest thing on a black site, which is exactly what a shop tile wants.
  * SQUARE output. App windows are near-square; at 16:9 about a third of the
    tile was empty padding, which is why the frames looked small and lost.
  * Rounded corners and the drop shadow both derive from the window's own
    alpha, so they follow the rounding instead of being drawn separately.
"""
import argparse, io
from PIL import Image, ImageDraw, ImageFilter, ImageCms

GROUND   = (232, 224, 212)   # Parchment, the brand pale (was #f3f3f3 grey, Mike Nov 3 '26)
RADIUS   = 26      # on the 2x screenshot, so ~13pt
FILL     = 0.86    # how much of the frame the window takes
BLUR     = 26
DROP     = 18      # shadow offset, px
SHADOW   = 0.62    # shadow opacity (was 0.42, before that 0.30 / blur 40: both too faint to read, Mike Nov 2 + 3 '26)
CONTACT  = 0.22    # a tight second shadow right under the edge, so the window sits ON the card
CONTACT_BLUR = 5

def _to_srgb(im):
    """Convert a screenshot into real sRGB.

    macOS `screencapture` tags its output Display P3 on these displays. Just
    dropping the profile leaves P3 numbers in an untagged file, which every
    browser then reads as sRGB — the saturated colours get pulled in toward
    grey and the whole shot looks washed out. This was actually happening.
    Convert through the embedded profile instead of discarding it.
    """
    prof = im.info.get('icc_profile')
    if not prof:
        return im.convert('RGB')
    src = ImageCms.ImageCmsProfile(io.BytesIO(prof))
    return ImageCms.profileToProfile(im.convert('RGB'), src,
                                     ImageCms.createProfile('sRGB'),
                                     outputMode='RGB')

def _rounded(im, r):
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.width - 1, im.height - 1], r, fill=255)
    out = im.convert('RGBA')
    out.putalpha(m)
    return out

def compose(shot, out, size=1400):
    win = _rounded(_to_srgb(Image.open(shot)), RADIUS)
    s = min(size / win.width, size / win.height) * FILL
    win = win.resize((max(1, int(win.width * s)), max(1, int(win.height * s))), Image.LANCZOS)
    return place(win, out, size)

def place(win, out, size=1400, xy=None):
    """Put an already-rounded RGBA window on the ground with the shadow
    (centred, or at xy). Also used to re-shadow shots whose raw screenshot is gone."""
    bg = Image.new('RGBA', (size, size), GROUND + (255,))
    x, y = xy or ((size - win.width) // 2, (size - win.height) // 2)

    # Shadow from the window's alpha, so it hugs the rounded corners.
    pad = BLUR * 3
    lay = Image.new('RGBA', (win.width + pad * 2, win.height + pad * 2), (0, 0, 0, 0))
    solid = Image.new('RGBA', win.size, (0, 0, 0, 255))
    solid.putalpha(win.getchannel('A').point(lambda a: int(a * SHADOW)))
    lay.paste(solid, (pad, pad + DROP), solid)
    bg.alpha_composite(lay.filter(ImageFilter.GaussianBlur(BLUR)), (x - pad, y - pad))
    lay = Image.new('RGBA', (win.width + pad * 2, win.height + pad * 2), (0, 0, 0, 0))
    solid = Image.new('RGBA', win.size, (0, 0, 0, 255))
    solid.putalpha(win.getchannel('A').point(lambda a: int(a * CONTACT)))
    lay.paste(solid, (pad, pad + 2), solid)
    bg.alpha_composite(lay.filter(ImageFilter.GaussianBlur(CONTACT_BLUR)), (x - pad, y - pad))

    bg.alpha_composite(win, (x, y))
    bg.convert('RGB').save(out, quality=93, subsampling=0)
    return out

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('shot'); ap.add_argument('out')
    ap.add_argument('--size', type=int, default=1400)
    a = ap.parse_args()
    print(compose(a.shot, a.out, a.size))
