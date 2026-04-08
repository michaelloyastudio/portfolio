# CLAUDE.md — Portfolio Project Context

## Owner
**Michael Loya** (Mike) — designer, Syracuse senior, graduating Spring 2026.
Site: michaelloya.studio (GitHub Pages, Cloudflare DNS)

## Don't Be
Corny. No filler, no "Great question!", no forced enthusiasm. Just be direct and helpful.

## Project Structure
- **`index.html`** — THE main portfolio (P2 floating style). All edits go here.
- **`p1.html`–`p6.html`** — Old draft variants. Don't touch unless asked.
- **`die.html`** — 3D Three.js die landing page (draft, not in use)
- **`interactive/`** — 30+ standalone interactive web apps (mPod, Cash Machine, The Grid, etc.)
- **`img/`** — Project images and assets
- **`BRAND.md`** — Brand system (READ THIS for colors/typography)
- **Fonts** — Loaded via Google Fonts or local files depending on page

## Brand System (from BRAND.md)
| Role | Hex | Name |
|------|-----|------|
| Primary Dark | `#0a0a0a` | Black |
| Supporting | `#3d2b1f` | Espresso |
| Neutral | `#8a8580` | Warm Gray |
| Primary Light | `#E8E0D4` | Parchment |
| Accent | `#ff8e3d` | Brand Orange |

- Parchment replaces white everywhere
- Orange is for links, hover states, accents — intentional, not overwhelming
- Espresso for body text on light backgrounds
- Black is `#0a0a0a` not pure `#000`

## P2 (Main Portfolio) Key Details
- Light parchment theme, projects float in 3D space with depth-of-field blur
- Hover: image scales 10% in container
- Nav links under title
- Custom cursors: ML logo SVG = regular, Play button SVG = clickable
- Custom audio player for AI Song (circle play btn, thin progress bar)
- Lightbox: arrow keys cycle ALL images/videos per project. Cover image is wrap point.
- Hero + info side by side (280px hero, 320px max-height)
- Project overlay uses `visibility` not `opacity`, z-index 100
- `.p2-project-hero` (NOT `.project-img`) for hover effects — this naming distinction matters
- Open animation: bob-freeze. Close function was BROKEN as of Feb — verify status.
- `staggerOrder = [8,1,2,3,4,5,6,7,0]` (S&V ↔ Miscellaneous swapped)

## Interactive Apps (in `interactive/`)
- **mPod** (`mp3-player.html`) — Skeuomorphic iPod player, 10 tracks, click wheel, 7 colors, lyrics animation
- **Cash Machine** (`cashmachine.html`) — Click/grab flying bills game
- **The Grid** (`thegrid.html`) — Beat lab
- **The Archive** (`thearchive.html`) — Lookbook/shop, 15+ products
- Plus 25+ more: thesynth, thefeed, therotation, theshop, thelabel, theblob, etc.

## P5 Specifics (if working on it)
- Crosshair cursor: `crosshair.svg` (plus sign, round endcaps, black outline, cream fill)
- About page: Logic quote between experience and footer
- Contact page: Color band + 3px black line above footer
- Work page: 1px black line replaces color band
- Hover animations: "Studio" (black+green+red shadow+glitch), "Mike" (black+cyan+bounce)
- Song player: Cream bg with dark text
- Detail images: No shadow default, shadow + lift on hover
- Card images: 104% scale to prevent jitter edge-reveal

## Deployment
- **GitHub Pages** — repo: `michaelloyastudio/michaelloyastudio.github.io`
- **Cloudflare DNS** — NS: coleman/kate.ns.cloudflare.com
- **A records**: 185.199.108-111.153
- **CNAME www**: michaelloyastudio.github.io
- Push to main = deploy

## VIS 487 Context (Senior Projects)
This portfolio is part of Mike's Brand Ecosystem project for VIS 487 (Prof. Renée Stevens).
- **May 1**: Portfolio + Rationale final due
- **May 8**: Senior Show Reception, NH1 Gallery 3-5 PM
- Supplemental materials: business card, letterhead, thank you card, envelope

## Preferences
- No markdown tables on Telegram/WhatsApp (use bullet lists)
- Mike is a picky eater (if food stuff comes up)
- No em dashes in formal writing
- Anti-slop design: no generic AI aesthetics, no purple gradients, no rounded-corner-Inter-font syndrome
