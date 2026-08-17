// Project data for michaelloya.studio
//
// Each entry:
//   slug     — URL: /<slug>.html  (must match the filename)
//   title, category, tools, year
//   cover    — grid tile / social image
//   hero     — big media at the top of the project page. A .mp4/.mov renders
//              as a poster-backed player; anything else renders as an image.
//   intro    — ONE short block of copy. Keep it tight.
//   work     — the media below the copy. No prose here.
const projects = [
  {
    slug: "where-it-hurts",
    title: "where it hurts.",
    category: "Music Video",
    tools: "Photoshop, After Effects, Magnific, Higgsfield AI",
    year: "2026",
    cover: `projects/capstone/cover.jpg`,
    hero: `projects/capstone/frame-04.jpg`,
    intro: `<p>A music visualizer for <a href="https://open.spotify.com/artist/" target="_blank" rel="noopener">Z</a>'s track <em>where it hurts.</em>, made as my senior capstone. Z isn't based in NY, so instead of shooting him I built the whole piece out of AI-generated assets and art-directed it end to end.</p>
<p>I storyboarded the scenes and wrote the direction, generated each one, then broke the stills apart in Photoshop and animated them in After Effects. The imagery stays abstract on purpose. Z gave me the freedom, and I'd rather leave room for the viewer than push a narrative he wasn't comfortable carrying.</p>`,
    work: `<div class="project-video"><video src="projects/capstone/visualizer.mp4" controls playsinline preload="metadata" poster="projects/capstone/poster.jpg"></video></div>
<div class="project-img"><img src="projects/capstone/frame-02.jpg" alt="Paper-cutout Z walking through a field" loading="lazy"></div>
<div class="project-img"><img src="projects/capstone/frame-08.jpg" alt="Black hole with rings against a starfield" loading="lazy"></div>
<div class="project-img"><img src="projects/capstone/frame-03.jpg" alt="Paper-cutout Z facing a cliff in fog" loading="lazy"></div>`
  },
  {
    slug: "loya",
    title: "loya",
    category: "Creative Direction",
    tools: "Illustrator, Photoshop, After Effects, Blender, Adobe Firefly, Magnific",
    year: "2023–Present",
    cover: `projects/loya-and-co/cover.jpg`,
    hero: `projects/loya-and-co/cover.jpg`,
    intro: `<p>I work with my brother, who produces under our last name — <a href="https://open.spotify.com/artist/5gNQpoYEBE1jxjCgFkLWce" target="_blank" rel="noopener">loya</a>. Cover art, Spotify canvas visuals, logo design, and social content, shaped around each release.</p>
<p>The logo came out of his hat collection, set in Amador — a blackletter that balances elegance with edge. I've also made pieces for other artists, including posters and a motion graphic for <a href="https://open.spotify.com/artist/2848adRcxvgWNRcz1g1tQD" target="_blank" rel="noopener">Felly</a>.</p>`,
    work: `<div class="project-video"><video src="projects/loya-and-co/canvases.mp4" autoplay loop muted playsinline></video></div>
<div class="project-img"><img src="projects/loya-and-co/loya-hat-mockup.jpeg" alt="loya hat mockup" loading="lazy"></div>
<div class="img-grid-3">
<div class="project-img"><img src="projects/loya-and-co/felly-1.jpg" alt="Felly poster design 1" loading="lazy"></div>
<div class="project-img"><img src="projects/loya-and-co/felly-2.jpg" alt="Felly poster design 2" loading="lazy"></div>
<div class="project-img"><img src="projects/loya-and-co/felly-3.jpg" alt="Felly poster design 3" loading="lazy"></div>
</div>
<div class="project-video"><video src="projects/loya-and-co/felly-render.mp4" autoplay loop muted playsinline></video></div>`
  },
  {
    slug: "bodyarmor-powerade",
    title: "BODYARMOR & Powerade",
    category: "Brand Campaign",
    tools: "Photoshop, Illustrator, Premiere, After Effects, Kling, Runway, ChatGPT, Topaz Labs, ElevenLabs",
    year: "2025",
    cover: `projects/bodyarmor-powerade/cover.jpg`,
    hero: `projects/bodyarmor-powerade/cover.jpg`,
    intro: `<p>I spent last summer interning with BODYARMOR and Powerade in Queens. Day to day I reformatted brand creative into point-of-sale ads — window clings, cooler clings, end caps — and produced an original video ad for Powerade's fall football campaign.</p>
<p>For my capstone I built an AI-generated BODYARMOR commercial end to end: Runway and Kling for imagery, Topaz for upscaling, ElevenLabs for voiceover, After Effects to assemble. It was presented to C-suite executives.</p>`,
    work: `<div class="project-video"><video src="projects/bodyarmor-powerade/pa-fall-football.mp4" controls playsinline preload="metadata" poster="projects/bodyarmor-powerade/pa-first.jpg"></video></div>
<div class="project-video"><video src="projects/bodyarmor-powerade/kling.mp4" autoplay loop muted playsinline></video></div>
<div class="project-video"><video src="projects/bodyarmor-powerade/aiba-commercial.mp4" controls playsinline preload="metadata" poster="projects/bodyarmor-powerade/aiba-poster.jpg"></video></div>`
  },
  {
    slug: "university-union",
    title: "University Union",
    category: "Event Design",
    tools: "Illustrator, Photoshop, After Effects",
    year: "2024–2026",
    cover: `projects/university-union/cover.jpg`,
    hero: `projects/university-union/cover.jpg`,
    intro: `<p>Co-Director of Design Board at University Union, Syracuse's largest programming organization. Concert posters, festival identity, large-format signage, and social assets reaching 12,000+ followers.</p>
<p>The biggest piece was Juice Jam 2025 — the full visual identity for Syracuse's annual outdoor festival, built on a retro risograph look with bold gold type. I also spent two years trying to get a Block Party logo approved. I love it. Everybody else hates it.</p>`,
    work: `<div class="project-video"><video src="projects/university-union/jj-timelapse.mp4" autoplay loop muted playsinline></video></div>
<div class="img-grid-3">
<div class="project-img"><img src="projects/university-union/jj-kiosk.jpg" alt="Juice Jam vertical kiosk" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/jj-merch.jpg" alt="Juice Jam merch mockup" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/jj-poster.jpg" alt="Juice Jam printed poster" loading="lazy"></div>
</div>
<div class="project-img"><img src="projects/university-union/jj-social.jpg?v=2" alt="Juice Jam social post" loading="lazy"></div>
<div class="img-grid-3">
<div class="project-img"><img src="projects/university-union/block-party-2026.jpg" alt="Block Party 2026" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/block-party-earlier.jpg" alt="Block Party earlier version" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/calenton.jpg" alt="Calentón Latin Music Festival" loading="lazy"></div>
</div>
<div class="project-video"><video src="projects/university-union/block-party-anim.mp4" autoplay loop muted playsinline onloadedmetadata="this.playbackRate=1.5"></video></div>
<div class="img-grid-4">
<div class="project-img"><img src="projects/university-union/connor-wood.jpg" alt="A Night with Connor Wood" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/sarah-sherman.jpg" alt="A Night with Sarah Sherman" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/talent-show.jpg" alt="Talent Show" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/danielle-brooks.jpg" alt="Danielle Brooks" loading="lazy"></div>
</div>`
  },
  {
    slug: "album-covers",
    title: "Album Covers",
    category: "Cover Art",
    tools: "Photoshop, Illustrator",
    year: "2022–Present",
    cover: `projects/album-covers/commercial-break.jpg`,
    hero: `projects/album-covers/commercial-break.jpg`,
    intro: `<p>Covers I made back when I was producing my own music. Each one shot and designed from scratch in Photoshop and Illustrator.</p>`,
    work: `<div class="img-grid-3">
<div class="project-img"><img src="projects/album-covers/loya-passion-update.jpg" alt="Passion update" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-4.jpg" alt="Passion series 4" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/whitenoise.jpg" alt="White Noise" loading="lazy"></div>
</div>
<div class="img-grid-2">
<div class="project-img"><img src="projects/album-covers/scribbleboy.jpg" alt="Scribbleboy" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-1.jpg" alt="Passion series 1" loading="lazy"></div>
</div>
<div class="img-grid-3">
<div class="project-img"><img src="projects/album-covers/swim.jpg" alt="Swim" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/getting-loud.jpg" alt="Getting Loud" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-6.jpg" alt="Passion series 6, Fade Away" loading="lazy"></div>
</div>`
  },
  {
    slug: "miscellaneous",
    title: "Miscellaneous",
    category: "Selected Works",
    tools: "Various",
    year: "2022–Present",
    cover: `projects/miscellaneous/lyrc-hat.jpeg`,
    hero: `projects/miscellaneous/lyrc-hat.jpeg`,
    intro: `<p>A mix of passion projects, school assignments, professional work, and collaborations. Not every concept made it to production, but each one shaped my process.</p>`,
    work: `<div class="img-grid-3">
<div class="project-img"><img src="projects/miscellaneous/lust.jpg" alt="LUST experimental design" loading="lazy"></div>
<div class="project-video"><video src="projects/miscellaneous/web-story.mp4" autoplay loop muted playsinline></video></div>
<div class="project-img"><img src="projects/miscellaneous/scene-4.jpg" alt="Design project screenshot" loading="lazy"></div>
</div>
<div class="project-video"><video src="projects/miscellaneous/ml-anim.mp4" autoplay loop muted playsinline></video></div>
<div class="img-grid-3">
<div class="project-img"><img src="projects/miscellaneous/volleyball-final-four.jpg" alt="2024 Volleyball Final Four" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/logic.jpg" alt="Logic-inspired design" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/mm-print.jpg" alt="Mixtape Magazine, Artist or Rapper" loading="lazy"></div>
</div>
<div class="project-video"><video src="projects/miscellaneous/truck-circle.mp4" autoplay loop muted playsinline></video></div>
<div class="img-grid-4">
<div class="project-img"><img src="projects/miscellaneous/scene-2.jpg" alt="Django Unchained poster" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/scene-3.png" alt="Steph Curry poster" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/cartoon.jpg" alt="Cartoon illustration" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/billboard.jpg" alt="2023 Billboard design" loading="lazy"></div>
</div>
<div class="project-img"><img src="projects/miscellaneous/characters-sketchbook.jpeg" alt="Character sketchbook mockup" loading="lazy"></div>`
  }
];
