# CLAUDE.md — michaelloya.studio

## Tone
Direct. No filler, no forced enthusiasm, no "great question."

## What this is
Michael Loya's portfolio. Static site, no build step, no dependencies — open `index.html` and it runs.

## Structure
- **`index.html`** — the entire site. ~5,000 lines: inline CSS (top), markup (~1900–2300), JS (~2300+). Splash, Studio, Playground, About, and project detail are all views inside this one file.
  - `const projects = [...]` at ~line 2164 — project data. Each entry has `title`, `overlayTitle`, `category`, `tools`, `year`, `cover`, `images`, and `content` (an inline HTML string).
  - Scatter coordinates for the floating layout live in a separate array (~line 3946), index-matched to `projects`.
- **`mobile.html`** — placeholder stub. `index.html` redirects here on mobile UA + width < 768.
- **`studio-editor.html`** — internal tool for positioning the floating scatter. Not linked publicly.
- **`interactive/`** — playground apps: `theblob`, `thegrid`, `therotation`, `theshop`. (`tycoon.html` is gitignored.)
- **`projects/`** — per-project media, one folder per project.
- **`assets/`** — `brand/`, `cursors/`, `site/`, `about-icons/`.
- **`BRAND.md`** — colors and voice. Read it before any visual change.

## Brand (source: BRAND.md)
| Role | Hex |
|---|---|
| Black | `#0a0a0a` |
| Espresso | `#3d2b1f` |
| Warm Gray | `#8a8580` |
| Parchment | `#E8E0D4` |
| Orange | `#ff8e3d` |

Parchment replaces white everywhere. Black is `#0a0a0a`, never pure `#000`. Orange is for links, hover, and active states only — it works because it's rationed.

Type: **Space Grotesk** (Google Fonts).

## Deployment
GitHub Pages from `michaelloyastudio/portfolio`, branch `main`, root. Cloudflare sits in front and terminates TLS. **Push to `main` = live.**

## Rules
- Anti-slop: no generic AI aesthetics, no purple gradients, no rounded-corner-Inter-font look.
- No em dashes in formal writing.
- Confirm before pushing. Committing locally is fine.
