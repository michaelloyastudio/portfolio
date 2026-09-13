# CLAUDE.md — michaelloya.studio

## Tone
Direct. No filler, no forced enthusiasm, no "great question."

## What this is
Michael Loya's portfolio. Static, multi-page, no build step and no dependencies. Open any HTML file and it runs.

## Pages
- **`index.html`** — Studio. The main page: video hero, three featured project bands, statement, closing CTA.
- **`work.html`** — Work. All projects in a two-column grid; clicking one opens the detail overlay.
- **`about.html`** — About. Bio, education, experience, skills, achievements, interests, resume.
- **`plugins.html`** — Plugins. Same two-column `.tile` grid as Work, rendered from `plugins.js`; each tile opens `/<slug>.html` (`gh-midi.html`, `lookout.html`), which `plugin-page.js` fills in the same way `project-page.js` fills a project.

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
| Red | `#d91c28` |

Parchment replaces white. Black is `#0a0a0a`, never pure `#000`. Red is for links, hover, and active states only — it works because it's rationed.

Type: **Inter** (Google Fonts, variable 300-700 with a true italic axis) for everything outside the hero — UI and body copy both. The hero keeps its own faces: **Nimbus Sans** self-hosted, **Warbler Deck** (Typekit) for the serif italic, **DIN 2014 Rounded** (Typekit) for the loading wordmark.

Inter is on trial, swapped in from Space Grotesk + IBM Plex on 2026-09-13. Note it contradicts the anti-slop rule below; Mike asked to see it. Both faces are set by `--font-display` / `--font-body` in one place, so reverting is a token edit.

## Plugins and downloads
Binaries live in **`assets/downloads/`**, in this repo. GitHub's 100MB limit is **per file**, and the GH MIDI zip is 7.2MB, so shipping it with the site costs nothing and needs no second repo. Point a plugin's `download` field at the path and the button appears; leave it `null` and the page shows its status instead of a link that 404s. If a build ever gets near 100MB (Lookout will, it carries a model), cut a GitHub Release on that plugin's own repo and point `download` at the release asset.

The plugin is **ad-hoc signed, not notarised**, so macOS quarantines it on download and the user has to run one `xattr` command. Skipping that needs an Apple Developer ID at $99/year. The install steps on the page say so plainly rather than hiding it.

`gh-midi.html` is linked from inside the plugin itself — the JUCE editor's help overlay and the bundled README both point at `michaelloya.studio/gh-midi`. **That URL cannot move** without shipping a new build.

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

## Deployment
GitHub Pages from `michaelloyastudio/portfolio`, branch `main`, root. Cloudflare fronts it and terminates TLS. **Push to `main` = live.**

## Rules
- Anti-slop: no generic AI aesthetics, no purple gradients, no rounded-corner-Inter-font look.
- No em dashes in formal writing.
- Confirm before pushing. Committing locally is fine.
