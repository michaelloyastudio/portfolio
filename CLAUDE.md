# CLAUDE.md — michaelloya.studio

## Tone
Direct. No filler, no forced enthusiasm, no "great question."

## What this is
Michael Loya's portfolio. Static, multi-page, no build step and no dependencies. Open any HTML file and it runs.

## Pages
- **`index.html`** — Studio. The main page: video hero, three featured project bands, statement, closing CTA.
- **`work.html`** — Work. All projects in a two-column grid; clicking one opens the detail overlay.
- **`about.html`** — About. Bio, education, experience, skills, achievements, interests, resume.
- **`tools.html`** — Tools (was Plugins). Same two-column `.tile` grid as Work, rendered from `plugins.js` — title and host under the shot, no description line; each tile opens `/<slug>.html` (`gh-midi.html`; Lookout is pulled for now, one revert away), which `plugin-page.js` fills in the same way `project-page.js` fills a project.

## Shared files
- **`assets/css/site.css`** — every style on the site. Tokens at the top; the semantic block (`--bg`, `--fg`, `--accent`…) is the only thing a light mode would need to change.
- **`assets/js/site.js`** — all behaviour. Each block no-ops if its markup is absent, so all three pages load the same file.
- **`assets/js/projects.js`** — project content only. `const projects = [...]`, each entry with `title`, `category`, `tools`, `year`, `cover`, `images`, `content` (an inline HTML string).

Project slugs live in `SLUGS` in `site.js`, not in the data file. They keep `#project/<slug>` anchors stable — About links into `work.html#project/<slug>`.

Featured projects on the Studio page are set by `data-featured` on `#bands` in `index.html`. Comma-separated slugs, in order.

## Other directories
- **`projects/`** — per-project media, one folder each.
- **`assets/brand/`** — logo. **Use `logo-cream.svg`** on dark. `logo-parchment.svg` is a different, outline-only mark with a different viewBox; it is not the primary logo.
- **`interactive/`** — four standalone apps (theblob, thegrid, therotation, theshop). Still on disk and reachable by direct URL, but unlinked from the site since the Playground was removed.

## Brand (source: BRAND.md)
| Role | Hex |
|---|---|
| Black | `#0a0a0a` |
| Espresso | `#3d2b1f` |
| Warm Gray | `#8a8580` |
| Parchment | `#E8E0D4` |
| Red | `#de0000` |

Parchment replaces white. Black is `#0a0a0a`, never pure `#000`. Red is for links, hover, and active states only — it works because it's rationed.

Type: **Inter** (Google Fonts, variable 300-700 with a true italic axis) for everything outside the hero — UI and body copy both. The hero keeps its own faces: **Nimbus Sans** self-hosted, **Warbler Deck** (Typekit) for the serif italic, **DIN 2014 Rounded** (Typekit) for the loading wordmark.

Inter is on trial, swapped in from Space Grotesk + IBM Plex on 2026-09-13. Note it contradicts the anti-slop rule below; Mike asked to see it. Both faces are set by `--font-display` / `--font-body` in one place, so reverting is a token edit.

## Plugins and downloads
Binaries live in **`assets/downloads/`**, in this repo. GitHub's 100MB limit is **per file**, and the GH MIDI zip is ~16MB, so shipping it with the site costs nothing and needs no second repo. Point a plugin's `download` field at the path and the button appears; leave it `null` and the page shows its status instead of a link that 404s. If a build ever gets near 100MB (Lookout will, it carries a model), cut a GitHub Release on that plugin's own repo and point `download` at the release asset.

**Windows (since 2026-09-20):** the gh-midi repo's GitHub Actions workflow builds the Windows zip, smoke-tests the exe on the runner, and attaches `GH-MIDI-vX.Y-Windows.zip` to the GitHub release. The copy in `assets/downloads/` is that exact asset, hashed the same way. A plugin's `downloads` field is a list, one per platform; `plugin-page.js` puts the visitor's own OS first with the solid button and renders the other as an outline. Windows is labelled beta until someone has played it with a real guitar.

The plugin is **ad-hoc signed, not notarised**, so macOS blocks it on first open. On macOS 15+ the only way through is Done → System Settings → Privacy & Security → Open Anyway (right-click → Open no longer works for un-notarized apps). Skipping that needs an Apple Developer ID at $99/year. **Setup instructions live in `README.txt` inside the zip, not on the page** — the page sells, the README installs. The README is `release/README.txt` in the plugin repo; `make_release.py` there packages it with the current build, and the zip's URL on the site carries `?v=<first 8 of its md5>` so Cloudflare can't keep serving an older cut under the same filename.

`gh-midi.html` is linked from inside the plugin itself — the JUCE editor's help overlay and the bundled README both point at `michaelloya.studio/gh-midi`. **That URL cannot move** without shipping a new build.

## Contrast
Body copy is full parchment, `opacity: 1`. Labels, captions, subheads, tile
descriptions and small print stay on `--muted` or a lower opacity — the
hierarchy comes from those being grey, **not** from dimming the prose. Don't
reintroduce `opacity: 0.82` on a paragraph.

## Plugin product pages
`/gh-midi` is a **product page, not a case study**: shot left,
name / price / button right, download above the fold. `plugin-page.js` renders
that shape and it is deliberately not `project-page.js`.

The page copy has to be rewritten from `release/README.txt` in the plugin's
own repo whenever the plugin is rebuilt — they drifted once already (the
modes were renamed CHORDS/PRO/SOLO → CHORDS/NOTES/SOLO and the zip gained
the standalone app, while the site still described the older build). Re-copy
the zip at the same time; its size is quoted on the page.

## Plugin product images
Crop wide source images to roughly square BEFORE composing — the tool fits
to the shorter side, so a 16:9 plate in a square card leaves a band of white
top and bottom (that bit the Lookout plate, when it was on the site).

Action shots come from the plugin's own demo mode, not from someone playing:
`GHMIDI_DEMO=1 "…/GH MIDI.app/Contents/MacOS/GH MIDI"` runs a chord sequence
with whammy, and `/tmp/burst.py` ranks captured frames by how far they differ
from an idle baseline to find the liveliest one.

Run every plugin screenshot through `assets/tools/plugin_shot.py` — it is an
asset-prep utility, **not** a build step (the site still has none). One
treatment for all of them, decided against alternatives:

- **Keep the macOS title bar.** It is what makes the image read as a real app
  rather than a render.
- **Light ground (#f3f3f3).** These UIs are dark; on a dark card the window
  dissolves into the page. White is the loudest thing on a black site, which
  is what a shop tile wants.
- **Square.** Plugin tiles are `aspect-ratio: 1/1`, unlike the 16:9 work grid.
  App windows are near-square and at 16:9 a third of the tile was padding.

Gallery shots get the card. A screenshot used *inside* body copy (`.step-shot`)
stays a raw crop — a white card mid-copy is a glaring block.

Setup screenshots were tried on the page and pulled — the page is just the
product now. If they ever come back, the real flow was captured by walking it
with a quarantined copy (`xattr -w com.apple.quarantine "0083;…;Safari;…"` on
a fresh unzip; without the flag Gatekeeper never fires), and Finder / System
Settings had to be cropped to the content pane because the sidebars carry
Mike's name, folders and family photo. `.step-shot` needs `height: auto` or the
img's height attribute survives as a presentational hint and squashes it.

## Grids
**Every row is justified, including the last, so a grid always comes out rectangular.** `layoutMosaic` in `project-page.js` collects the rows before laying any out, then rebalances the tail: if the last row is left with one tile, or would justify to an absurd height, it borrows tiles from the row above until it can fill the width sensibly. Never revert this to flushing rows as they fill, and never leave the trailing row unjustified — that is what produced the ragged bottoms.

`data-exact` sets `target` to 0 (the column count, not the height, decides the break), so the rebalance falls back to `(W - gaps) / perRow` as its yardstick. Comparing against 0 strips a grid to a single row.

**Miscellaneous is ordered by importance, most to least** — Mike ranks the pieces and new work goes where he places it in that list, not where it fits. The order is written out in a comment above the `work` field in `projects.js`. It is one grid, not several: splitting reintroduces ragged edges between the pieces.

## Responsive
Two breakpoints, both in `site.css`:
- **`max-width: 900px`** — one-column grids (hero, work, about, CV). The hero grid must stay `minmax(0, 1fr)`, never plain `1fr`: the title is `white-space: nowrap`, so a plain `1fr` column can't shrink below the whole string and `fitTitle` then measures that oversized column and sizes off it.
- **`max-width: 640px`** — the phone layout. `--logo-h` drives the whole header (bar weight and the X offsets derive from it), `--pad` collapses onto `--frame-x` so one gutter runs the page, and `hero.js` stops fitting the title to one line and lets it wrap. The 640 figure is duplicated in `hero.js` as `PHONE`; change both together.

Project mosaics go to one tile per row below 520px (`project-page.js`).

## The two Warblers
The desktop Warbler Deck (Creative Cloud sync) and the Adobe web Warbler Deck (kit `oft2xxg`) have the **same outlines but different vertical metrics**: ascent/descent 0.97/0.24em against 1.32/0.38em. Anything derived from those numbers — the slot window's height, the star pip's placement — is correct under one and wrong under the other, and it fails silently: a clipped descender and a floating star, no error.

So `hero.js` measures the loaded font at runtime (`tuneToFont`) and writes `--slot-h`, `--slot-mt`, `--pip-top`, `--pip-top-strong`. The values in `site.css` are fallbacks for the first paint only. **Don't replace them with constants.**

The reel's window is sized against the deepest descender across *every* word on it, not the landing word: the `g` in "brand campaigns" drops further than the `p` in "video production."

## Known issues
- **The wordmark needs michaelloya.studio on the Typekit kit's allowed domains** (kit `vvj5gyy`, loaded on index.html). It resolves on localhost; if the live domain isn't listed it will silently fall back to Space Grotesk.

## URLs
**Links have no `.html`.** Files on disk are still `work.html`, `gh-midi.html` and so on — GitHub Pages resolves `/work` to `work.html` on its own. Verified live: `/work` is 200 with **no redirect**, and `/work/` is a 404, so Pages never appends a trailing slash. Internal links are root-relative (`/work`, `/` for home); asset paths stay relative and resolve correctly because there is never a trailing slash to change the base.

`serve.py` reproduces that resolution locally in `translate_path`. Without it every link 404s on the dev server while working in production, which is the worst way for this to break. Don't remove it.

Both `/work` and `/work.html` still resolve, so every page carries a `<link rel="canonical">` naming the extensionless form. Add one to any new page.

Extensionless links mean the site no longer works over `file://` — opening an HTML file directly gives a page whose links all fail. Use `serve.py`.

## Analytics
GoatCounter, site `michaelloya.goatcounter.com`, one script tag before `</body>`
on every page. No cookies, so no banner. `count.js` refuses to count on
localhost, which is why nothing shows up from the dev server.

**Never request a new zip URL before Pages reports the deploy built.** A fetch
that lands between push and deploy gets the previous bytes from origin, and
Cloudflare then caches that stale response under the brand-new `?v=` for four
hours — which is precisely what the hash exists to prevent. Poll the Pages
builds API for the new SHA first; only then fetch the zip, once. (Done it
once; the fix was a fresh `?v=` value.)

Downloads are counted as an **event** fired from the download button in
`plugin-page.js`, path `download/<slug>/<version>/<os>` (macos or windows) —
so each version and platform is its own line on the dashboard. Clicks before
2026-09-20 sit on the older `download/<slug>/<version>` line. It counts
clicks, not completed downloads.

## Deployment
GitHub Pages from `michaelloyastudio/portfolio`, branch `main`, root. Cloudflare fronts it and terminates TLS. **Push to `main` = live.**

## Rules
- Anti-slop: no generic AI aesthetics, no purple gradients, no rounded-corner-Inter-font look.
- No em dashes in formal writing.
- Confirm before pushing. Committing locally is fine.
