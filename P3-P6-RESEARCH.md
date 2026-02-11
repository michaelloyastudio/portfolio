# P3-P6 Portfolio Design Research

## Date: 2026-02-10
## Objective: Find 4 maximally distinct portfolio styles for P3-P6

---

## Existing Portfolio Styles (DO NOT DUPLICATE)

### P1 — Dark Vinyl Record Collection
- **Aesthetic:** Dark, moody, analog warmth
- **Palette:** Near-black backgrounds, warm amber/gold accents, muted tones
- **Vibe:** Record store, physical media, tactile nostalgia
- **Key features:** Record sleeve browsing, spinning vinyl, warm grain textures

### P2 — Light Floating Items
- **Aesthetic:** Clean, bright, airy, whimsical
- **Palette:** White/light backgrounds, soft pastels, gentle shadows
- **Vibe:** Floating objects, gentle physics, modern minimalism
- **Key features:** Floating item physics, soft drop shadows, clean typography

---

## Style Candidates Researched

### 1. 🕹️ PIXEL ART / RETRO GAMING
**Description:** 8-bit/16-bit pixel art aesthetic reminiscent of NES/SNES/Game Boy era. Low-resolution sprites, pixel fonts, chiptune vibes. The portfolio becomes a retro game interface — think RPG menu screen, platformer level select, or adventure game.

**Color Palette:**
- CRT-inspired: `#0f380f` (Game Boy green), `#306230`, `#8bac0f`, `#9bbc0f`
- OR NES-inspired: deep blacks, primary reds/blues, limited 8-color palettes
- Suggestion: Use a CGA/EGA inspired palette with `#000000`, `#aa0000`, `#00aa00`, `#0000aa`, `#aa5500`, `#aaaaaa`, `#ffff55`

**Key Interactions/Animations:**
- CSS pixel art rendered via `box-shadow` on single-pixel elements (no images needed!)
- Typewriter-style text rendering (character by character) like RPG dialog boxes
- Sprite sheet animations via CSS `steps()` timing function
- Parallax scrolling pixel backgrounds (clouds, stars, terrain layers)
- Interactive "level select" map for project navigation
- Scanline overlay effect via repeating CSS gradients
- 8-bit style cursor with pixel trail
- Canvas-based particle effects with pixelated constraint

**Reference Sites:**
- NES.css (bcrikko.github.io/NES.css) — Complete NES-themed CSS framework
- poolsuite.net — Retro computing aesthetic with modern flair
- MakePixelArt.com — Pixel art creation tool with great pixel UI
- PICO-8 fantasy console sites — Example of pixel-constrained design

**Why it works for a design portfolio:**
- Demonstrates mastery of CSS (pixel art via box-shadow is extremely impressive)
- Shows understanding of design constraints and creativity within limitations
- Nostalgic and fun — immediately memorable
- Highly shareable — people love pixel art
- Proves the designer can work in ANY style, not just modern clean
- Canvas/animation skills on display

**Technical approach:** Pure CSS pixel art using `box-shadow`, `steps()` animations, CSS custom properties for palette swapping, Canvas for background effects. No external assets needed.

---

### 2. 🌿 FRUTIGER AERO
**Description:** The optimistic, techno-utopian aesthetic of 2004-2013 (Windows Vista/7 era). Glossy surfaces, nature-meets-technology, aurora borealis backgrounds, glass transparency, water droplets, lens flares, lush green + sky blue gradients. Named after the Frutiger typeface and Windows Aero design language.

**Color Palette:**
- Sky gradient: `#87CEEB` → `#1E90FF` → `#4169E1`
- Nature greens: `#32CD32`, `#228B22`, `#90EE90`
- Glass/Water: `rgba(255,255,255,0.3)`, aurora purples `#9370DB`
- Accent glow: `#00CED1`, `#7FFFD4`
- Warm highlights: `#FFD700`, `#FFA500`

**Key Interactions/Animations:**
- Animated aurora borealis background (CSS gradients + keyframes or Canvas)
- Glossy glass cards with `backdrop-filter: blur()` and reflections
- Water droplet/ripple effects on hover (Canvas)
- Floating nature elements (leaves, bubbles, light particles)
- Lens flare following cursor position
- Smooth "gel button" hover states with glossy reflections
- Parallax depth with layered clouds and landscape
- Subtle bokeh particle system in background

**Reference Sites:**
- Windows Vista/7 UI design language (the canonical example)
- Apple's Aqua interface (Mac OS X Tiger era)
- Nintendo Wii system menu aesthetic
- r/FrutigerAero subreddit — active community with many examples
- Apple's Liquid Glass (2025) — modern revival of the style

**Why it works for a design portfolio:**
- Extremely trendy right now — massive Gen Z nostalgia wave (2023-2026)
- Shows awareness of design history and cultural trends
- Technically demanding: glass effects, particle systems, aurora animations
- Visually lush and optimistic — stands out against the minimalism trend
- Wikipedia notes it has "reemerged in 2023 as an Internet aesthetic"
- Directly contrasts P1's darkness and P2's minimalism

**Technical approach:** CSS `backdrop-filter` for glass, Canvas for aurora/particles/water effects, CSS gradients for sky, SVG filters for lens flare, layered parallax with CSS transforms.

---

### 3. 💿 Y2K / CYBERCORE
**Description:** Late 1990s–early 2000s internet aesthetic. Chrome/metallic textures, bubbly 3D forms, lens flares, translucent plastics, futuristic optimism. Think: early iMac, Winamp skins, 2000s-era futurism. NOT the same as Frutiger Aero — Y2K is more synthetic, metallic, and alien. Chrome blobs, tech-organic shapes, holographic gradients.

**Color Palette:**
- Chrome/Silver: `#C0C0C0`, `#E8E8E8`, `#808080`
- Holographic: cycling through `#FF69B4` → `#00FFFF` → `#FF00FF` → `#00FF00`
- Translucent: `rgba(200,200,255,0.4)` blues and purples
- Hot accents: `#FF1493`, `#00FF7F`, `#7B68EE`

**Key Interactions/Animations:**
- Chrome text effect (CSS gradient + animation cycling)
- Holographic card surfaces that shift color with mouse position
- 3D rotating chrome objects (CSS 3D transforms or Canvas)
- Bubble/blob morphing animations (CSS `border-radius` animation or SVG)
- Matrix-style falling characters in background
- Iridescent shimmer effects on hover
- "Loading bar" progress indicators styled as Y2K UI elements
- Animated starburst/lens flare decorations

**Reference Sites:**
- y2kaesthetics.com — Curated Y2K design archive
- silviarundo.com — Modern Y2K-inspired portfolio
- poolsuite.net — Retro computing with Y2K flair
- Early-2000s Winamp skins archive

**Why it works for a design portfolio:**
- Massively popular aesthetic among younger designers (TikTok Y2K revival)
- Shows versatility and cultural awareness
- Chrome/holographic effects are technically impressive in pure CSS
- Extremely distinct from everything else
- Playful and eye-catching — great conversation starter

**Technical approach:** CSS conic-gradient for holographic effects, CSS 3D transforms for chrome objects, Canvas for morphing blobs, CSS `mix-blend-mode` for iridescent overlays.

---

### 4. 🏗️ NEO-BRUTALISM / ANTI-DESIGN
**Description:** Raw, bold, intentionally "ugly-beautiful" design. Heavy black borders, bright clashing colors, exposed structure, oversized typography, visible grid lines, no curves. Inspired by brutalist architecture — honest, undecorated, powerful. The portfolio as a statement: "I don't need polish to be impressive."

**Color Palette:**
- Background: `#F5F0E8` (warm off-white/cream) or `#E8E4DD`
- Borders: `#000000` (thick, 3-4px)
- Accent blocks: `#FF5733` (red-orange), `#33FF57` (neon green), `#5733FF` (purple), `#FFD700` (yellow)
- Text: `#1A1A1A`

**Key Interactions/Animations:**
- Hard drop shadows (no blur: `5px 5px 0px #000`)
- Drag-to-rearrange project cards
- Brutalist marquee scrolling text
- Glitch effects on hover (CSS clip-path + transform jitter)
- Exposed "code view" toggle showing the HTML
- Click-to-stamp interaction leaving marks on page
- Harsh snap animations (no easing — `steps(1)` or linear)
- Monospace typewriter for all body text, oversized sans-serif headers

**Reference Sites:**
- brutalistwebsites.com — Curated collection (hundreds of examples)
- Craigslist — Unintentional brutalism pioneer
- Bloomberg Businessweek special editions — Editorial brutalism
- hfrfrk.com — Bold brutalist portfolio
- NN/g notes: "intentionally attempts to look raw, haphazard, or unadorned"

**Why it works for a design portfolio:**
- Bold statement — shows confidence and design philosophy
- Technically creative: glitch effects, drag interactions
- Counterculture appeal — rejects "safe" design conventions
- Fast loading, accessible (content-first)
- Proves the designer understands rules well enough to break them
- Maximally different from every other style in the set

**Technical approach:** CSS hard shadows, CSS `clip-path` for glitch, CSS Grid with visible gaps, Drag API for interactivity, CSS `steps()` for harsh animations, monospace fonts (system fonts, zero dependencies).

---

### 5. 🌀 PSYCHEDELIC / ACID GRAPHICS
**Description:** Liquid, morphing, hallucinatory visuals. Inspired by 1960s concert posters, modern acid graphics (Gen Z revival), and optical illusions. Warping text, kaleidoscope patterns, rainbow gradients, organic flowing shapes, visual overwhelm done tastefully. Think: album art for Tame Impala, modern music festival posters.

**Color Palette:**
- Electric rainbow: `#FF0080` → `#FF8C00` → `#FFD700` → `#00FF80` → `#0080FF` → `#8000FF`
- Deep background: `#0D0221` or `#1A0533`
- Neon accents: `#39FF14`, `#FF073A`, `#00FFFF`

**Key Interactions/Animations:**
- SVG filter turbulence for liquid text distortion
- CSS `hue-rotate` cycling on backgrounds
- Kaleidoscope effect via CSS transforms (6-fold symmetry)
- Mouse-reactive warp shader (Canvas 2D or WebGL)
- Organic blob animations (SVG morph paths)
- Rainbow gradient text that flows continuously
- Optical illusion patterns (moiré via overlapping grids)
- Scroll-triggered color shifting of entire page

**Reference Sites:**
- Tame Impala's album art / website
- lefrfrk.co — Psychedelic portfolio design
- Coachella festival website designs
- sagmeisterwalsh.com — Experimental design studio
- Studio Dumbar — Boundary-pushing visual design

**Why it works for a design portfolio:**
- Absolutely unforgettable — visually overwhelming in the best way
- Shows advanced CSS/Canvas/SVG skills (filter effects, shaders)
- Perfect for a "creative" portfolio — screams artistic confidence
- Extremely distinct from all other styles
- Currently trending as "acid graphics" in design communities

**Technical approach:** SVG `<feTurbulence>` + `<feDisplacementMap>` for distortion, CSS `hue-rotate()` for color cycling, Canvas 2D for kaleidoscope/warp effects, CSS `@keyframes` for flowing gradients.

---

### 6. 🏙️ RETRO FUTURISM / SYNTHWAVE
**Description:** 1980s vision of the future. Neon grid landscapes, chrome text, sunset gradients (pink→purple→dark blue), laser lines, wireframe mountains, starfields. Think: Blade Runner, Tron, Drive, outrun music aesthetic. The portfolio as a cyberpunk dashboard.

**Color Palette:**
- Gradient sky: `#FF007F` → `#7B2FBE` → `#0D0221`
- Neon lines: `#00FFFF` (cyan), `#FF00FF` (magenta), `#FF007F` (hot pink)
- Grid: `#4A0E78` on `#0D0221`
- Chrome text: linear-gradient metallic effect
- Stars: `#FFFFFF` dots on deep purple-black

**Key Interactions/Animations:**
- Perspective CSS grid floor stretching to horizon (3D transform)
- Animated "driving forward" grid effect
- Neon glow text (text-shadow stacking)
- Synthwave sun (CSS radial-gradient with horizontal lines)
- Starfield parallax (Canvas particle system)
- Wireframe mountain silhouette (SVG polyline)
- Scanline CRT overlay
- Pulsing neon border animations

**Reference Sites:**
- synthwave.com — The aesthetic's spiritual home
- 1984.design — Retro-futurist design studio
- kanye2049.com — Viral synthwave landing page
- outrun subreddit — Community curating the aesthetic

**Why it works for a design portfolio:**
- Immediately recognizable and beloved aesthetic
- Demonstrates CSS 3D transforms, perspective, glow effects
- High "wow factor" — the moving grid floor alone is impressive
- Musical/cultural resonance — appeals to wide audience
- The dark palette doesn't overlap with P1 (vinyl is warm/analog, synthwave is cold/digital)

**Technical approach:** CSS perspective + grid for the floor, stacked `text-shadow` for neon glow, CSS `radial-gradient` for synthwave sun, Canvas for starfield, SVG for wireframe mountains.

---

### 7. 🧊 GLASSMORPHISM / AURORA UI
**Description:** Frosted glass panels floating over colorful, blurred backgrounds. Depth through transparency, subtle borders, soft glows. Apple's modern iOS/macOS aesthetic pushed to its artistic extreme. Ultra-clean but with depth and richness.

**Color Palette:**
- Background mesh: animated gradient of `#667EEA`, `#764BA2`, `#F093FB`, `#F5576C`
- Glass panels: `rgba(255,255,255,0.15)` with blur
- Borders: `rgba(255,255,255,0.2)`
- Text: white on dark, dark on light (adapts)

**Key Interactions/Animations:**
- `backdrop-filter: blur(20px)` glass cards
- Animated mesh gradient background (4+ color points morphing)
- Cards that tilt with mouse position (3D parallax)
- Frosted sliding panels for navigation
- Soft glow follows cursor
- Smooth card flip transitions for project details
- Layered depth with z-index stacking of glass panels

**Reference Sites:**
- Apple iOS/macOS Control Center
- glassmorphism.com — Style generator and showcase
- Linear.app — SaaS design using glassmorphism beautifully
- Michal Malewicz's original glassmorphism article (UX Collective, 2020)

**Why it works for a design portfolio:**
- Modern, polished, universally appealing
- Shows mastery of CSS backdrop-filter and layering
- The animated mesh gradient background is technically impressive
- Clean enough for recruiters, creative enough for designers
- Very different from both P1 (dark/textured) and P2 (flat/minimal)

**Technical approach:** CSS `backdrop-filter`, animated CSS mesh gradients (multiple `radial-gradient` layers with animated positions), CSS 3D transforms for card tilt, CSS custom properties for dynamic values.

---

### 8. 🎨 MIXED MEDIA / COLLAGE / ZINE
**Description:** Torn paper, tape, stamps, handwritten notes, stickers, Polaroids, magazine cutouts — the digital equivalent of a physical scrapbook or punk zine. Chaotic but curated. Raw textures mixed with clean digital elements. Anti-corporate, deeply personal.

**Color Palette:**
- Paper/cardboard: `#F5E6D3`, `#E8D5B7`, `#FFF8F0`
- Ink: `#1A1A1A`, `#333333`
- Accent markers: `#FF4444` (red marker), `#FFD700` (highlighter yellow), `#2196F3` (blue pen)
- Tape: `rgba(255,240,200,0.7)` with subtle texture

**Key Interactions/Animations:**
- CSS `clip-path` for torn paper edges (polygon with jagged points)
- Draggable elements (stickers, notes) users can rearrange
- Rubber stamp effect on click (scale bounce + ink splatter)
- Handwritten-style text using Google Fonts (Caveat, Patrick Hand)
- Polaroid photos with subtle rotation and tape
- Pin board / corkboard layout with CSS transforms (random rotations)
- Sticky note hover expand for project details
- Scotch tape CSS effect (semi-transparent rectangle with subtle texture)

**Reference Sites:**
- readymag.com showcase — Experimental editorial layouts
- The Outpost magazine — Digital zine aesthetics
- are.na — Curated creative reference boards
- David Carson's work — The godfather of grunge typography

**Why it works for a design portfolio:**
- Deeply personal and human — stands out in a sea of polished sites
- Shows range: not every designer does "clean"
- The tactile quality creates emotional connection
- Draggable/interactive elements showcase JS skills
- Tells a story about the designer's creative process
- Maximally different from digital-first styles

**Technical approach:** CSS `clip-path` for torn edges, CSS `transform: rotate()` for scattered layout, Drag API for interactivity, CSS `filter` for paper textures, CSS custom fonts for handwriting.

---

## Distinctiveness Matrix

| Style | Dark? | Bright? | Clean? | Chaotic? | Nostalgic? | Futuristic? | Technical Wow |
|-------|-------|---------|--------|----------|------------|-------------|---------------|
| P1 (Vinyl) | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | Medium |
| P2 (Float) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | Medium |
| Pixel Art | ❌ | Varies | ❌ | ❌ | ✅ (retro) | ❌ | HIGH |
| Frutiger Aero | ❌ | ✅ | ❌ | ❌ | ✅ (2000s) | ❌ | HIGH |
| Y2K Cybercore | ❌ | ✅ | ❌ | ❌ | ✅ (2000s) | ✅ | HIGH |
| Neo-Brutalism | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | Medium |
| Psychedelic | ✅ | ✅ | ❌ | ✅ | ✅ (60s) | ❌ | VERY HIGH |
| Synthwave | ✅ | ❌ | ✅ | ❌ | ✅ (80s) | ✅ | HIGH |
| Glassmorphism | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | HIGH |
| Mixed Media | ❌ | Warm | ❌ | ✅ | ✅ | ❌ | Medium |

## Selection Criteria

1. **Maximum visual contrast** between all 6 variants
2. **Different eras of nostalgia** (no two from the same decade)
3. **Different technical showcases** (CSS art vs Canvas vs SVG vs 3D)
4. **Different emotional registers** (fun vs serious vs dreamy vs raw)
5. **All achievable in a single HTML file with vanilla JS**
6. **Would impress both recruiters AND designers**

## Final 4 Selected → See P3-P6-PLAN.md
