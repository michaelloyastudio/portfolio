# CLAUDE.md — michaelloya.studio

## Tone
Direct. No filler, no forced enthusiasm, no "great question."

## What this is
Michael Loya's portfolio. Static, multi-page, no build step and no dependencies. Open any HTML file and it runs.

## Pages
- **`index.html`** — Studio. The main page: video hero, three featured project bands, statement, closing CTA.
- **`work.html`** — Work. All projects in a two-column grid; clicking one opens the detail overlay.
- **`about.html`** — About. Bio, education, experience, skills, achievements, interests, resume.

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

Type: **Space Grotesk** (Google Fonts) for UI, **IBM Plex Sans** for body copy, **DIN 2014 Rounded** (Typekit) for the hero wordmark only.

## Responsive
Two breakpoints, both in `site.css`:
- **`max-width: 900px`** — one-column grids (hero, work, about, CV). The hero grid must stay `minmax(0, 1fr)`, never plain `1fr`: the title is `white-space: nowrap`, so a plain `1fr` column can't shrink below the whole string and `fitTitle` then measures that oversized column and sizes off it.
- **`max-width: 640px`** — the phone layout. `--logo-h` drives the whole header (bar weight and the X offsets derive from it), `--pad` collapses onto `--frame-x` so one gutter runs the page, and `hero.js` stops fitting the title to one line and lets it wrap. The 640 figure is duplicated in `hero.js` as `PHONE`; change both together.

Project mosaics go to one tile per row below 520px (`project-page.js`).

## Known issues
- **The wordmark needs michaelloya.studio on the Typekit kit's allowed domains** (kit `vvj5gyy`, loaded on index.html). It resolves on localhost; if the live domain isn't listed it will silently fall back to Space Grotesk.

## Deployment
GitHub Pages from `michaelloyastudio/portfolio`, branch `main`, root. Cloudflare fronts it and terminates TLS. **Push to `main` = live.**

## Rules
- Anti-slop: no generic AI aesthetics, no purple gradients, no rounded-corner-Inter-font look.
- No em dashes in formal writing.
- Confirm before pushing. Committing locally is fine.
