# P3-P6 Portfolio Variants Plan

## Architecture
- All variants live in `index.html` inside `#p2Wrap`-style wrappers
- Die face routing: 1→P1, 2→P2, 3→P3, 4→P4, 5→P5, 6→P6
- Each variant is fully self-contained (CSS + HTML + JS)
- P1 and P2 are FROZEN — do not touch

---

## ✅ FINAL SELECTIONS

### P3 — 🌀 PSYCHEDELIC / ACID GRAPHICS
**Why P3:** Maximum "wow" factor. The most visually arresting style in the entire set. Demonstrates advanced SVG filter + Canvas mastery. Dark-on-neon palette is distinct from P1's warm dark and P2's clean light.

**Aesthetic:** Liquid, morphing, hallucinatory. 1960s concert poster meets modern acid graphics (Tame Impala era). Warping text, kaleidoscope patterns, organic flowing shapes, rainbow everything.

**Palette:**
- Background: `#0D0221` (deep cosmic purple-black)
- Rainbow cycling: `#FF0080` → `#FF8C00` → `#FFD700` → `#00FF80` → `#0080FF` → `#8000FF`
- Neon accents: `#39FF14`, `#FF073A`, `#00FFFF`

**Key Technical Features:**
- SVG `<feTurbulence>` + `<feDisplacementMap>` for liquid text distortion
- Canvas 2D kaleidoscope/warp effects reactive to mouse
- CSS `hue-rotate()` cycling on entire sections
- Organic SVG blob morphing (path interpolation)
- Rainbow gradient text that flows continuously
- Moiré optical illusion patterns via overlapping CSS grids
- Scroll-triggered color wave across page

**Typography:** Warped, flowing display font + clean body text for readability contrast

**Emotional Register:** Trippy, artistic, bold, creative confidence

---

### P4 — 🕹️ PIXEL ART / RETRO GAMING
**Why P4:** Nostalgic but completely different era than psychedelic (8-bit 80s/90s vs 60s psychedelia). Shows CSS mastery through pixel art via `box-shadow`. Fun, interactive, gamified. Immediately memorable.

**Aesthetic:** 8-bit/16-bit game console UI. The portfolio IS a retro game: RPG dialog boxes, level-select map for projects, sprite animations, scanline overlay. Game Boy / NES / SNES inspired.

**Palette:**
- Primary: Game Boy inspired — `#0f380f`, `#306230`, `#8bac0f`, `#9bbc0f`
- Alt mode: NES expanded — `#000000`, `#FCE4EC`, `#FF0000`, `#0000FF`, `#FFFF00`
- UI chrome: `#333333`, `#666666`, `#999999`

**Key Technical Features:**
- CSS pixel art via `box-shadow` on single elements (NO images!)
- `steps()` timing function for sprite-sheet-style animations
- Typewriter text rendering (character-by-character like RPG dialog)
- Parallax scrolling pixel landscape background
- Interactive "world map" for project navigation
- Scanline CRT overlay via `repeating-linear-gradient`
- 8-bit custom cursor
- Canvas background with animated pixel stars/clouds

**Typography:** Pixel/bitmap font (rendered via CSS or @font-face pixel font)

**Emotional Register:** Fun, nostalgic, playful, technically impressive

---

### P5 — 🏗️ NEO-BRUTALISM
**Why P5:** The philosophical opposite of everything else. Where others add polish, this strips it away. Proves Mike understands design rules well enough to deliberately break them. Bold, raw, confident. The only style with thick borders and flat colors.

**Aesthetic:** Raw, bold, "ugly-beautiful." Heavy black borders, bright clashing color blocks, oversized typography, exposed grid structure, hard shadows with zero blur. Like a Bauhaus poster designed by a punk designer.

**Palette:**
- Background: `#F5F0E8` (warm cream/off-white)
- Hard borders: `#000000` (3-4px solid)
- Color blocks: `#FF5733` (red-orange), `#C3FF00` (acid green), `#5733FF` (electric purple), `#FFD700` (yellow), `#00D4FF` (cyan)
- Text: `#1A1A1A` on light, `#FFFFFF` on color blocks

**Key Technical Features:**
- Hard drop shadows: `4px 4px 0px #000` (NO blur, always)
- Draggable project cards (JS Drag API)
- Glitch effects on hover via `clip-path` + `transform` jitter
- Exposed "source code" toggle showing raw HTML
- Marquee scrolling text elements (CSS animation)
- Harsh snap transitions: `steps(1)` — no smooth easing anywhere
- Monospace body text + massive bold sans-serif headers
- Visible grid lines and structural elements

**Typography:** Oversized bold sans-serif (800+ weight) headers, monospace body

**Emotional Register:** Confident, raw, intellectual, anti-establishment, statement-making

---

### P6 — 🌿 FRUTIGER AERO
**Why P6:** The trendy wildcard. Massively popular right now (Gen Z nostalgia wave 2023-2026). Optimistic and lush — the emotional opposite of brutalism. Showcases `backdrop-filter`, particle systems, and layered parallax. The "nature meets technology" theme is unique in the entire set.

**Aesthetic:** Windows Vista/7 era utopian tech. Glossy glass surfaces, aurora borealis skies, nature imagery (leaves, water, light), bokeh particles, lens flares, gel buttons. Technology and nature in harmony.

**Palette:**
- Sky gradient: `#87CEEB` → `#1E90FF` → `#4169E1`
- Nature: `#32CD32`, `#228B22`, `#90EE90`
- Glass: `rgba(255,255,255,0.25)` with blur
- Aurora: `#9370DB`, `#00CED1`, `#7FFFD4`
- Warm glow: `#FFD700`, `#FFA500`

**Key Technical Features:**
- Animated aurora borealis (Canvas gradient animation)
- `backdrop-filter: blur(20px)` glass panels with subtle borders
- Floating nature particles (leaves, light orbs, bubbles)
- Lens flare effect following cursor (Canvas or CSS radial-gradient)
- Glossy "gel button" hover states with reflection gradients
- Layered parallax: clouds → mountains → content → foreground particles
- Water ripple effect on click (Canvas)
- Bokeh particle system in background (Canvas)

**Typography:** Rounded, friendly sans-serif (like Segoe UI / system UI fonts)

**Emotional Register:** Optimistic, warm, nostalgic (2000s), lush, harmonious

---

## The Complete Set — Maximum Contrast

| Slot | Style | Era | Light/Dark | Chaotic/Clean | Emotion | Primary Tech |
|------|-------|-----|------------|---------------|---------|-------------|
| P1 | Vinyl Records | 70s analog | Dark | Organized | Warm, cozy | CSS + audio |
| P2 | Floating Items | Modern | Light | Clean | Whimsical | Physics JS |
| **P3** | **Psychedelic** | **60s/modern** | **Dark + Neon** | **Chaotic** | **Trippy, bold** | **SVG filters + Canvas** |
| **P4** | **Pixel Art** | **80s/90s gaming** | **Mid (CRT)** | **Structured** | **Fun, playful** | **CSS box-shadow art** |
| **P5** | **Neo-Brutalism** | **Contemporary** | **Light (cream)** | **Bold chaos** | **Raw, confident** | **CSS + Drag API** |
| **P6** | **Frutiger Aero** | **2000s** | **Light (sky)** | **Lush** | **Optimistic** | **Canvas particles + backdrop-filter** |

**Why these 4 win:**
1. **No two share the same decade of influence** (60s, 80s, 2000s, 2020s)
2. **No two share the same color temperature** (neon, CRT green, cream/bold, sky blue)
3. **No two use the same primary technique** (SVG filters, CSS pixel art, Drag API, Canvas particles)
4. **No two share the same emotional register** (trippy, playful, raw, optimistic)
5. **Combined with P1+P2, the 6 variants span the entire design spectrum**

---

## Build Order (recommended)
1. **P5 (Neo-Brutalism)** — Fastest to build, simplest CSS, strong impact
2. **P4 (Pixel Art)** — Medium complexity, mostly CSS-driven
3. **P6 (Frutiger Aero)** — Canvas particle system takes time but straightforward
4. **P3 (Psychedelic)** — Most complex, SVG filters + Canvas warping

## Status
- [x] Research complete ✅
- [ ] P3 style chosen & built (Psychedelic)
- [ ] P4 style chosen & built (Pixel Art)
- [ ] P5 style chosen & built (Neo-Brutalism)
- [ ] P6 style chosen & built (Frutiger Aero)
