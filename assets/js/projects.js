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
    tools: "Photoshop, After Effects, Magnific, Higgsfield",
    year: "2026",
    cover: `projects/capstone/cover.jpg`,
    hero: `projects/capstone/hero.jpg`,
    intro: `<p>A music visualizer for <a href="https://open.spotify.com/artist/" target="_blank" rel="noopener">Z</a>'s track <em>where it hurts.</em>, made as my senior capstone. Z isn't based in NY, so the piece had to be built rather than shot, and I art directed it end to end.</p>
<p>I storyboarded the scenes and wrote the direction, then composed each frame from AI-generated assets, broke the stills apart in Photoshop, and animated them in After Effects. The imagery stays abstract on purpose. Z gave me the freedom, and I'd rather leave room for the viewer than push a narrative he wasn't comfortable carrying.</p>
<p>I take in a lot of media, and the things I love end up shaping how I direct. The look here came out of that, <em>Spider-Man: Into the Spider-Verse</em> and <em>Invincible</em> most of all.</p>`,
    work: `<div class="project-video"><video src="projects/capstone/visualizer.mp4" controls playsinline preload="metadata" poster="projects/capstone/poster.jpg" width="1920" height="1080"></video></div>
<div class="img-grid-2">
<div><img src="projects/capstone/still-1.jpg" alt="Still from the visualizer" loading="lazy" width="1920" height="1080"></div>
<div><img src="projects/capstone/still-2.jpg" alt="Still from the visualizer" loading="lazy" width="1920" height="1080"></div>
</div>
<div class="img-grid-3" data-exact>
<div><img src="projects/capstone/still-3.jpg" alt="Still from the visualizer" loading="lazy" width="1920" height="1080"></div>
<div><img src="projects/capstone/still-4.jpg" alt="Still from the visualizer" loading="lazy" width="1920" height="1080"></div>
<div><img src="projects/capstone/still-5.jpg" alt="Still from the visualizer" loading="lazy" width="1920" height="1080"></div>
</div>`
  },
  {
    slug: "loya",
    title: "loya",
    category: "Creative Direction",
    tools: "Canon EOS R8, Premiere, After Effects, Illustrator, Photoshop, Blender, Magnific, Higgsfield, Claude",
    year: "2023–Present",
    cover: `projects/loya-and-co/cover.jpg`,
    hero: `projects/loya-and-co/cover.jpg`,
    intro: `<p>My brother produces music under our last name, <a href="https://open.spotify.com/artist/5gNQpoYEBE1jxjCgFkLWce" target="_blank" rel="noopener">loya</a>, and runs LYRC, a company he started to make lyric videos for independent artists. I work with him on promoting his music and his personal brand, keyed to cinematic and viral content.</p>
<p>We shape the idea together, then I execute it, shooting and editing it myself. My schooling and the work before this were graphic design; loya is where I'm building the video craft on top of it.</p>
<p>The logo came out of his hat collection, set in Amador, a blackletter that balances elegance with edge.</p>`,
    work: `<div class="project-video"><video src="projects/loya-and-co/intro.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/intro-poster.jpg" width="1920" height="1080"></video></div>
<div class="img-grid-3" data-exact>
<div><video src="projects/loya-and-co/oh-no-promo-1.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/oh-no-promo-1-poster.jpg" width="1280" height="960"></video></div>
<div><video src="projects/loya-and-co/oh-no-promo-2.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/oh-no-promo-2-poster.jpg" width="1280" height="960"></video></div>
<div><video src="projects/loya-and-co/sunrise-shoot.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/sunrise-shoot-poster.jpg" width="1280" height="960"></video></div>
</div>
<div class="img-grid-3" data-exact>
<div><video src="projects/loya-and-co/ikwud-promo.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/ikwud-promo-poster.jpg" width="1280" height="960"></video></div>
<div><video src="projects/loya-and-co/oh-no-oner.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/oh-no-oner-poster.jpg" width="1280" height="720"></video></div>
<div><video src="projects/loya-and-co/lie-promo.mp4" autoplay loop muted playsinline poster="projects/loya-and-co/lie-promo-poster.jpg" width="1280" height="960"></video></div>
</div>
<hr class="work-rule">
<div class="project-video"><video src="projects/loya-and-co/canvases.mp4" data-silent autoplay loop muted playsinline width="1920" height="1080"></video></div>
<div><img src="projects/loya-and-co/loya-hat-mockup.jpeg" alt="loya hat mockup" loading="lazy" width="2752" height="1536"></div>`
  },
  {
    slug: "bodyarmor-powerade",
    title: "BODYARMOR & Powerade",
    category: "Brand Campaign",
    tools: "Photoshop, Illustrator, Premiere, After Effects, Magnific, ChatGPT",
    year: "2025",
    cover: `projects/bodyarmor-powerade/cover.jpg`,
    hero: `projects/bodyarmor-powerade/cover.jpg`,
    intro: `<p>I spent the summer of 2025 interning with BODYARMOR and Powerade in Queens. Day to day I reformatted brand creative into point-of-sale ads — window clings, cooler clings, end caps — and produced an original video ad for Powerade's fall football campaign.</p>
<p>For my capstone I built an AI-generated BODYARMOR commercial end to end: generated imagery, Magnific for the upscale, voiceover, and After Effects to assemble. It was presented to C-suite executives, and it was the one that got the CEO to look up.</p>`,
    work: `<div class="project-video"><video src="projects/bodyarmor-powerade/pa-fall-football.mp4" controls playsinline preload="metadata" poster="projects/bodyarmor-powerade/pa-first.jpg" width="1920" height="1080"></video></div>
<div class="project-video"><video src="projects/bodyarmor-powerade/kling.mp4" data-silent autoplay loop muted playsinline width="1900" height="1200"></video></div>
<div class="project-video"><video src="projects/bodyarmor-powerade/aiba-commercial.mp4" controls playsinline preload="metadata" poster="projects/bodyarmor-powerade/aiba-poster.jpg" width="1280" height="720"></video></div>`
  },
  {
    slug: "university-union",
    title: "University Union",
    category: "Event Design",
    tools: "Illustrator, Photoshop, After Effects, Magnific",
    year: "2024–2026",
    cover: `projects/university-union/cover.jpg`,
    hero: `projects/university-union/cover.jpg`,
    intro: `<p>I was Co-Director of Design Board at University Union, Syracuse's largest programming organization, through May 2026. Concert posters, festival identity, large-format signage, and social assets reaching 12,000+ followers.</p>
<p>The biggest piece was Juice Jam 2025, the full visual identity for Syracuse's annual outdoor festival, built on a retro risograph look with bold gold type.</p>
<p>I also spent two years trying to get a logo approved for Block Party, our spring concert. I love it. Everybody else hates it.</p>`,
    work: `<div class="project-video"><video src="projects/university-union/jj-timelapse.mp4" data-silent autoplay loop muted playsinline width="1280" height="720"></video></div>
<div class="img-grid-3">
<div><img src="projects/university-union/jj-kiosk.jpg" alt="Juice Jam vertical kiosk" loading="lazy" width="1339" height="2400"></div>
<div><img src="projects/university-union/jj-merch.jpg" alt="Juice Jam merch mockup" loading="lazy" width="1696" height="2528"></div>
<div><img src="projects/university-union/jj-poster.jpg" alt="Juice Jam printed poster" loading="lazy" width="1560" height="2400"></div>
</div>
<div><img src="projects/university-union/jj-social.jpg?v=2" alt="Juice Jam social post" loading="lazy" width="2000" height="2000"></div>
<div class="img-grid-3">
<div><img src="projects/university-union/block-party-2026.jpg" alt="Block Party 2026" loading="lazy" width="1553" height="2400"></div>
<div><img src="projects/university-union/block-party-earlier.jpg" alt="Block Party earlier version" loading="lazy" width="1164" height="1800"></div>
<div><img src="projects/university-union/calenton.jpg" alt="Calentón Latin Music Festival" loading="lazy" width="1553" height="2400"></div>
</div>
<div class="project-video"><video src="projects/university-union/block-party-anim.mp4" data-silent autoplay loop muted playsinline onloadedmetadata="this.playbackRate=1.5" width="1280" height="720"></video></div>
<div class="img-grid-5">
<div><img src="projects/university-union/connor-wood.jpg" alt="A Night with Connor Wood" loading="lazy" width="1553" height="2400"></div>
<div><img src="projects/university-union/sarah-sherman.jpg" alt="A Night with Sarah Sherman" loading="lazy" width="1164" height="1800"></div>
<div><img src="projects/university-union/talent-show.jpg" alt="Talent Show" loading="lazy" width="1164" height="1800"></div>
<div><img src="projects/university-union/danielle-brooks.jpg" alt="Danielle Brooks" loading="lazy" width="1553" height="2400"></div>
<div><img src="projects/university-union/comedy-knockout.jpg" alt="Comedy Knockout" loading="lazy" width="1118" height="1727"></div>
</div>`
  },
  {
    slug: "album-covers",
    title: "Album Covers",
    category: "Cover Art",
    tools: "Photoshop, Illustrator",
    year: "2022–2024",
    cover: `projects/album-covers/commercial-break.jpg`,
    hero: `projects/album-covers/commercial-break.jpg`,
    intro: `<p>Covers I made back when I was producing my own music. Each one shot and designed from scratch in Photoshop and Illustrator.</p>`,
    work: `<div class="img-grid-3">
<div><img src="projects/album-covers/loya-passion-update.jpg" alt="Passion update" loading="lazy" width="2500" height="2500"></div>
<div><img src="projects/album-covers/loya-passion-4.jpg" alt="Passion series 4" loading="lazy" width="2500" height="2500"></div>
<div><img src="projects/album-covers/whitenoise.jpg" alt="White Noise" loading="lazy" width="1280" height="1280"></div>
</div>
<div class="img-grid-2">
<div><img src="projects/album-covers/scribbleboy.jpg" alt="Scribbleboy" loading="lazy" width="2500" height="2500"></div>
<div><img src="projects/album-covers/loya-passion-1.jpg" alt="Passion series 1" loading="lazy" width="2500" height="2500"></div>
</div>
<div class="img-grid-3">
<div><img src="projects/album-covers/swim.jpg" alt="Swim" loading="lazy" width="1800" height="1800"></div>
<div><img src="projects/album-covers/getting-loud.jpg" alt="Getting Loud" loading="lazy" width="1600" height="1600"></div>
<div><img src="projects/album-covers/loya-passion-6.jpg" alt="Passion series 6, Fade Away" loading="lazy" width="1800" height="1800"></div>
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
    /* ORDER IS DELIBERATE — most important first, least last. Mike's
       ranking, and where a new piece goes is decided by where he places it
       in this list, not by when it was made:
         felly, fuji, random element, lust, Z poster (sabt), jumpscare,
         logic, django, homelander, sketch (smiski), basketball video
         (web story), the other videos, steph curry, final four, freshmen,
         sweezy, then the rest.
       "Tyler the Creator" is mm-print.jpg, the Artist or Rapper magazine
       spread. Mike wants it left down in the rest, next to the characters
       sketchbook, rather than ranked up with steph curry.
       One grid, not several: the mosaic justifies EVERY row including the
       last, so the block always comes out rectangular. Splitting it would
       reintroduce ragged edges between the pieces. */
    work: `<div class="img-grid-3">
<div><img src="projects/miscellaneous/felly-wildfire.jpg" alt="Wildfire, an album by Felly" loading="lazy" width="1650" height="2550"></div>
<div><img src="projects/miscellaneous/fuji.jpg" alt="Fuji poster" loading="lazy" width="1800" height="2700"></div>
<div><img src="projects/miscellaneous/random-element.jpg" alt="Random Element poster" loading="lazy" width="1164" height="1800"></div>
<div><img src="projects/miscellaneous/lust.jpg" alt="LUST experimental design" loading="lazy" width="1333" height="2000"></div>
<div><img src="projects/miscellaneous/sabt.jpg" alt="Sweet American Boy Tour, a poster for Z" loading="lazy" width="1200" height="1600"></div>
<div><img src="projects/miscellaneous/jumpscare.jpg" alt="Jumpscare poster" loading="lazy" width="1164" height="1800"></div>
<div><img src="projects/miscellaneous/logic.jpg" alt="Logic-inspired design" loading="lazy" width="1080" height="1867"></div>
<div><img src="projects/miscellaneous/scene-2.jpg" alt="Django Unchained poster" loading="lazy" width="1190" height="1768"></div>
<div><video src="projects/miscellaneous/homelander.mp4" autoplay loop muted playsinline width="1280" height="720"></video></div>
<div><video src="projects/miscellaneous/smiski-dress.mp4" autoplay loop muted playsinline width="1280" height="1024"></video></div>
<div><video src="projects/miscellaneous/web-story.mp4" autoplay loop muted playsinline width="1080" height="1920"></video></div>
<div><video src="projects/miscellaneous/ml-anim.mp4" autoplay loop muted playsinline width="1920" height="1080"></video></div>
<div><video src="projects/miscellaneous/truck-circle.mp4" data-silent autoplay loop muted playsinline width="1920" height="1080"></video></div>
<div><img src="projects/miscellaneous/scene-3.png" alt="Steph Curry poster" loading="lazy" width="1292" height="1762"></div>
<div><img src="projects/miscellaneous/volleyball-final-four.jpg" alt="2024 Volleyball Final Four" loading="lazy" width="1200" height="1600"></div>
<div><img src="projects/miscellaneous/freshmen.jpg" alt="Mixtape Magazine 2023 Freshman" loading="lazy" width="1600" height="1600"></div>
<div><img src="projects/miscellaneous/exotic-sweezy.jpg" alt="Exotic, an album by Sweezy" loading="lazy" width="1800" height="1800"></div>
<div><img src="projects/miscellaneous/cartoon.jpg" alt="Cartoon illustration" loading="lazy" width="1002" height="1986"></div>
<div><img src="projects/miscellaneous/billboard.jpg" alt="2023 Billboard design" loading="lazy" width="2500" height="2500"></div>
<div><img src="projects/miscellaneous/mm-print.jpg" alt="Mixtape Magazine, Artist or Rapper" loading="lazy" width="1976" height="1525"></div>
<div><img src="projects/miscellaneous/characters-sketchbook.jpeg" alt="Character sketchbook mockup" loading="lazy" width="2272" height="1888"></div>
</div>`
  }
];
