// Project data for michaelloya.studio
// Each entry: title, overlayTitle, category, tools, year, cover, images[], content (HTML string)
const projects = [
  {
    title: "Senior Capstone",
    overlayTitle: "Senior<br>Capstone",
    category: "Capstone / Motion / AI",
    tools: "Photoshop, After Effects, Magnific, Higgsfield AI",
    year: "2026",
    cover: `projects/capstone/cover.jpg`,
    images: [],
    content: `<p>A music visualizer for <a href="https://open.spotify.com/artist/" target="_blank">Z</a>'s track <em>where it hurts.</em> — my senior capstone. Z isn't based in NY, so I couldn't shoot him for the video. I pivoted the whole project to AI-generated assets and built it as a fully art-directed piece without a real shoot. Creative direction is mine end to end.</p>
<div class="project-video"><video src="projects/capstone/visualizer.mp4" controls playsinline preload="metadata" poster="projects/capstone/poster.jpg"></video></div>
<h3>Process</h3>
<p>I started with the real photos Z supplied and built a character reference from them. From there I storyboarded the scenes and wrote direction. Claude expanded those notes into more detailed prompts, and I generated each scene with Nano Banana 2 (via Magnific).</p>
<p>From a still I'd either break it down in Photoshop and animate the layers myself, or generate a second still and use the two as start/end frames for video generation in Kling 3.0 (via Higgsfield). Final assembly, texture, and audio reactivity happened in After Effects.</p>
<div class="project-img"><img src="projects/capstone/frame-02.jpg" alt="Paper-cutout Z walking through a field" loading="lazy"></div>
<h3>Interpretation</h3>
<p>The visuals are deliberately abstract. Z gave me a lot of creative freedom and I didn't want to push a narrative he wasn't comfortable carrying — so the imagery sits open and lets the viewer fill it in. Here's how I read the recurring motifs.</p>
<div class="project-img"><img src="projects/capstone/frame-04.jpg" alt="Z floating among planets in space" loading="lazy"></div>
<p><strong>Space.</strong> Pulling away from everyone. Peaceful, but lonely.</p>
<div class="project-img"><img src="projects/capstone/frame-08.jpg" alt="Black hole with rings against a starfield" loading="lazy"></div>
<p><strong>The black hole.</strong> A metaphor for suicide — finally at peace, no longer anything. But still lonely; from inside, all you can do is wonder what life you left back on earth.</p>
<div class="project-img"><img src="projects/capstone/frame-03.jpg" alt="Paper-cutout Z facing a cliff in fog" loading="lazy"></div>
<p><strong>The paper cutout.</strong> He doesn't feel quite like himself. Moving and acting in a different way than he usually would — recognizable as him, but not him.</p>`
  },
  {
    title: "Loya and Co.",
    overlayTitle: "Music<br>Visuals",
    category: "Cover Art / Motion / Music",
    tools: "Illustrator, Photoshop, After Effects, Blender, Adobe Firefly, Magnific",
    year: "2023–Present",
    cover: `projects/loya-and-co/dnd-final.jpeg`,
    images: [],
    content: `<p>I collaborate with my brother, who produces music under our last name Loya (stylized as "<a href="https://open.spotify.com/artist/5gNQpoYEBE1jxjCgFkLWce?si=AsVRN9PsRu2rgS5POckwnQ" target="_blank">loya</a>"), bringing his music to life through cover art, motion graphics, and social content. I've also created pieces for other artists, tailoring visuals to fit their sound and aesthetic.</p>
<h3>loya</h3>
<p>The cover art is for loya's EP, <a href="https://open.spotify.com/album/6roxGKDYkVpcbcdqdpj6gG?si=mku1Dh4nR9OR_AJf92bb5Q" target="_blank"><em>Diamonds and Damage</em></a>, which he produced alongside his friend, Nicky. Loya had a clear vision for the design—a portrait of a woman surrounded by falling diamonds—and reached out to me to bring it to life. We started with a reference image to generate the portrait, then created multiple diamond variations. The assets were created by Adobe Firefly and then arranged, composed, and edited by me. After eight exports, we arrived at the final design.</p>
<div class="project-img"><img src="projects/loya-and-co/vinyl-cover.jpeg" alt="Vinyl record" loading="lazy"></div>
<p>I've also produced short vertical videos for loya's Spotify, known as "Canvas" visuals — dynamic, looping videos using After Effects and Blender that add an extra layer of engagement to his tracks.</p>
<div class="project-img project-img-video" data-video-src="projects/loya-and-co/canvases.mp4"><video src="projects/loya-and-co/canvases.mp4" autoplay loop muted playsinline style="width:100%;"></video></div>
<p>As loya's brand continued to grow, I recognized the need for a distinct logo that would enhance recognizability and adaptability across different platforms. Since he's an avid collector of unique hats, it felt natural to base the design on one of his favorites. I landed on Amador, a blackletter font that balances elegance with edge, fitting seamlessly with loya's artistic identity.</p>
<div class="project-img img-landscape"><img src="projects/loya-and-co/loya-hat-mockup.jpeg" alt="loya hat mockup" loading="lazy"></div>

<h3>Small Projects</h3>
<p>I created a motion graphic and posters for <a href="https://open.spotify.com/artist/2848adRcxvgWNRcz1g1tQD?si=SYY1m9QBSYaGsj-x30nrzQ" target="_blank">Felly</a>, an independent artist from my hometown with 556k monthly Spotify listeners. Our paths crossed when I met him at a show, and he's had a huge impact on my journey. I focused on creating designs that captured the essence of his sound and aesthetic.</p>
<div class="img-grid-3">
<div class="project-img"><img src="projects/loya-and-co/felly-1.jpg" alt="Felly poster design 1" loading="lazy"></div>
<div class="project-img"><img src="projects/loya-and-co/felly-2.jpg" alt="Felly poster design 2" loading="lazy"></div>
<div class="project-img"><img src="projects/loya-and-co/felly-3.jpg" alt="Felly poster design 3" loading="lazy"></div>
</div>
<div class="project-img project-img-video" data-video-src="projects/loya-and-co/felly-render.mp4"><video src="projects/loya-and-co/felly-render.mp4" autoplay loop muted playsinline style="width:100%;"></video></div>
<p>I pitched a cover art concept for the artist <a href="https://open.spotify.com/artist/4DSFmAOMwMqDVKIsPY0kqs?si=IuyZFZwoTCCsxNR4Py_JHA" target="_blank">Sweezy</a>. While ultimately rejected, I'm proud of the design and the creative process behind it. I also designed cover art for Chitt, who my brother and I met as a kid at our summer house. Now collaborating with loya, it was great to work on something for an artist with such a personal connection to us.</p>
<div class="img-grid-2">
<div class="project-img"><img src="projects/loya-and-co/exotic-sweezy.jpg" alt="Sweezy cover art concept" loading="lazy"></div>
<div class="project-img"><img src="projects/loya-and-co/feel-your-love.jpg" alt="Chitt cover art" loading="lazy"></div>
</div>`
  },
  {
    title: "BODYARMOR & Powerade",
    overlayTitle: "BODYARMOR<br>& Powerade",
    category: "Internship / Branding / AI",
    tools: "Photoshop, Illustrator, Premiere, After Effects, Kling, Runway, ChatGPT, Topaz Labs, ElevenLabs",
    year: "2025",
    cover: `projects/bodyarmor-powerade/bapa.png`,
    images: [],
    content: `<p>Last summer I interned with BODYARMOR and Powerade in Queens, NY, designing POS ads, producing a Powerade fall football video ad, and creating an AI-generated BODYARMOR commercial as my capstone project. The internship pushed my design and technical skills while giving me hands-on experience at the intersection of brand storytelling and emerging technology.</p>
<h3>Internship Work</h3>
<p>Day-to-day work involved reformatting BODYARMOR and Powerade creative into POS ads (window clings, cooler clings, end caps). Beyond that, I produced an original video ad for Powerade's fall football campaign, combining brand photography with stock video into a dynamic piece of content.</p>
<div class="project-img project-img-video" data-video-src="projects/bodyarmor-powerade/pa-fall-football.mp4" data-video-sound="true"><video src="projects/bodyarmor-powerade/pa-fall-football.mp4" autoplay loop muted playsinline style="width:100%;"></video></div>
<h3>Capstone Project</h3>
<p>For my capstone, I explored AI in creative production. My initial concept featured Joe Burrow ("Joe Chill") for BODYARMOR Chill, but AI struggled with character consistency. I pivoted to product visuals and created a commercial generated almost entirely with AI.</p>
<div class="img-match-height">
<div class="project-img"><img src="projects/bodyarmor-powerade/text-clarity-1.jpg" alt="AI character consistency challenge - snow scene" loading="lazy"></div>
<div class="project-img"><img src="projects/bodyarmor-powerade/text-clarity-2.jpg" alt="AI character consistency challenge - ice cave" loading="lazy" style="object-fit:cover;width:100%;object-position:40% center;"></div>
</div>
<p>I built a full AI workflow using Runway and Kling for imagery/video, Topaz Labs for upscaling, ElevenLabs for voiceover, and After Effects for the final edit. Prompt engineering was key to getting consistent, usable results.</p>
<div class="project-img project-img-video" data-video-src="projects/bodyarmor-powerade/kling.mp4"><video src="projects/bodyarmor-powerade/kling.mp4" autoplay loop muted playsinline style="width:100%;"></video></div>
<h3>Final Result</h3>
<p>The final AI-generated commercial was presented to C-suite executives. At the time, my takeaway was that AI worked for quick-turn content like product shots and social ads, but wasn't ready for high-end campaign work. That's changing fast — these tools are progressing at an incredible pace, and I plan to stay ahead of the curve.</p>
<div class="project-video"><video src="projects/bodyarmor-powerade/aiba-commercial.mp4" controls playsinline preload="metadata" poster="projects/bodyarmor-powerade/aiba-poster.jpg"></video></div>`
  },
  {
    title: "University Union",
    overlayTitle: "University<br>Union",
    category: "Event Design / Art Direction",
    tools: "Illustrator, Photoshop, After Effects",
    year: "2024–2026",
    cover: `projects/university-union/uu.png`,
    images: [],
    content: `<p>Design work as Co-Director of Design Board for University Union — Syracuse University's largest programming organization. Responsible for concert posters, festival branding, large-format signage, and social media assets reaching 12,000+ Instagram followers.</p>

<h3 style="font-family:'din-2014-rounded-variable',sans-serif;word-spacing:-0.05em;font-weight:400;font-size:1.4rem;margin:2.5rem 0 0.5rem;">Juice Jam 2025</h3>
<p style="margin-bottom:1rem;">Full visual identity for Syracuse's annual outdoor music festival featuring Ashe & Jordan Ward. Designed the main poster, digital signage, and large-format print materials. Retro risograph aesthetic with bold gold typography.</p>
<div class="project-img project-img-video" style="margin-bottom:0;overflow:hidden;border-radius:8px;"><video src="projects/university-union/jj-timelapse.mp4" autoplay loop muted playsinline style="width:100%;height:auto;object-fit:cover;border-radius:8px;transform:scale(1.03);transform-origin:center bottom;"></video></div>
<div class="img-grid-3" style="margin:0.6rem 0 0 0;margin-bottom:0;">
<div class="project-img"><img src="projects/university-union/jj-kiosk.jpg" alt="Juice Jam - vertical kiosk" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/jj-merch.jpg" alt="Juice Jam - merch mockup" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/jj-poster.jpg" alt="Juice Jam - printed poster" loading="lazy"></div>
</div>
<div class="project-img" style="margin:0.6rem 0 0 0;"><img src="projects/university-union/jj-social.jpg?v=2" alt="Juice Jam - social media post" loading="lazy"></div>

<h3 style="font-family:'din-2014-rounded-variable',sans-serif;word-spacing:-0.05em;font-weight:400;font-size:1.4rem;margin:2.5rem 0 0.5rem;">Events & Shows</h3>
<p style="margin-bottom:1rem;">Posters and promotional materials for concerts, comedy shows, and campus-wide events. As you can see, I really tried to get a version of that Block Party logo approved for two years. I love it — unfortunately, everybody else hates it.</p>
<div class="img-grid-3" style="margin-bottom:0;">
<div class="project-img"><img src="projects/university-union/block-party-2026.jpg" alt="Block Party 2026" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/block-party-earlier.jpg" alt="Block Party - earlier version" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/calenton.jpg" alt="Calentón - Latin Music Festival" loading="lazy"></div>
</div>
<div class="project-img project-img-video" data-video-src="projects/university-union/block-party-anim.mp4" style="margin:0.6rem 0 0 0;"><video src="projects/university-union/block-party-anim.mp4" autoplay loop muted playsinline style="width:100%;height:auto;object-fit:contain;" onloadedmetadata="this.playbackRate=1.5"></video></div>
<div class="img-grid-4" style="margin-top:0.6rem;">
<div class="project-img"><img src="projects/university-union/connor-wood.jpg" alt="A Night with Connor Wood" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/sarah-sherman.jpg" alt="A Night with Sarah Sherman" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/talent-show.jpg" alt="Talent Show" loading="lazy"></div>
<div class="project-img"><img src="projects/university-union/danielle-brooks.jpg" alt="Danielle Brooks" loading="lazy"></div>
</div>`
  },
  {
    title: "LYRC",
    overlayTitle: "LYRC",
    category: "Social Media / Advertising / Branding",
    tools: "Photoshop, Illustrator, After Effects, Premiere",
    year: "2025–Present",
    cover: `projects/lyrc/lyrc.png`,
    images: [],
    content: `<p><a href="https://lyrc.studio" target="_blank">LYRC</a> is an AI-powered content creation platform for musicians that generates lyric videos, performance visuals, and social media content. My brother loya founded it and brought me on to help out with the brand's social media and advertising: Instagram carousels, video ads, and promotional graphics.</p>

<h3>Logo Design</h3>
<p>The wordmark uses bold sans-serif letterforms that reflect LYRC's core product: stylized typography and lyric videos. A play button sits in the negative space of the R, and the icon mark reads as both a video camera and a microphone; capturing the dual nature of a platform built for musicians and visual content.</p>
<div class="project-img" style="margin:1.5rem 0;"><img src="projects/lyrc/logo-mockup.jpeg" alt="LYRC logo mockup" loading="lazy"></div>

<h3>Social Content</h3>
<p>Instagram ads, carousel posts, and video content designed to drive user acquisition.</p>
<div style="display:flex;justify-content:center;margin:1.5rem 0;">
<div id="lyrc-phone-embed" class="lyrc-phone-embed"></div>
</div>
<p style="text-align:center;font-size:0.85rem;color:#8a8580;margin-top:-0.25rem;font-style:italic;">Click around to browse the phone.</p>

<h3>Seedance 2.0</h3>
<p>Seedance 2.0 is ByteDance's new video generation model. While loya integrates it into LYRC's core pipeline, we've been testing it on the advertising side. The video below was generated from a single prompt that pulled assets straight from lyrc.studio.</p>
<div class="project-img-video" style="margin:1.5rem 0;cursor:pointer;">
  <video src="projects/lyrc/seedance.mov" autoplay loop muted playsinline style="width:100%;border-radius:8px;display:block;"></video>
</div>`
  },
  {
    title: "Miscellaneous Projects",
    overlayTitle: "Miscellaneous<br>Projects",
    category: "Mixed / Passion Projects",
    tools: "Various",
    year: "2022–Present",
    cover: `projects/album-covers/commercial-break.jpg`,
    images: [],
    content: `<h3>Album Covers</h3>
<p>Covers I did when I used to produce music. Each one was shot and designed from scratch using Photoshop and&nbsp;Illustrator.</p>
<div class="img-grid-3">
<div class="project-img"><img src="projects/album-covers/loya-passion-update.jpg" alt="Album cover - Passion update" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-4.jpg" alt="Album cover - Passion series 4" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/whitenoise.jpg" alt="White Noise album cover" loading="lazy"></div>
</div>
<div class="img-grid-2 img-grid-match-above">
<div class="project-img"><img src="projects/album-covers/scribbleboy.jpg" alt="Scribbleboy album cover" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-1.jpg" alt="Album cover - Passion series 1" loading="lazy"></div>
</div>
<div class="img-grid-3" style="margin-top:0.6rem;">
<div class="project-img"><img src="projects/album-covers/swim.jpg" alt="Swim cover" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/getting-loud.jpg" alt="Getting Loud cover" loading="lazy"></div>
<div class="project-img"><img src="projects/album-covers/loya-passion-6.jpg" alt="Album cover - Passion series 6 (Fade Away)" loading="lazy"></div>
</div>
<h3>Miscellaneous</h3>
<p>A mix of passion projects, school assignments, professional work, and collaborations. Not every concept made it to production, but each one shaped my process.</p>
<div class="img-grid-tight">
<div class="project-img" style="aspect-ratio:2/3;"><img src="projects/miscellaneous/lust.jpg" alt="LUST experimental design" loading="lazy"></div>
<div class="project-img project-img-video" data-video-src="projects/miscellaneous/web-story.mp4" style="aspect-ratio:2/3;"><video src="projects/miscellaneous/web-story.mp4" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video></div>
<div class="project-img" style="aspect-ratio:2/3;"><img src="projects/miscellaneous/scene-4.jpg" alt="Design project screenshot" loading="lazy"></div>
<div class="project-img project-img-video" data-video-src="projects/miscellaneous/ml-anim.mp4" style="grid-column:1/-1;"><video src="projects/miscellaneous/ml-anim.mp4" autoplay loop muted playsinline style="width:100%;height:auto;object-fit:contain;"></video></div>
<div class="project-img"><img src="projects/miscellaneous/volleyball-final-four.jpg" alt="2024 Volleyball Final Four design" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/logic.jpg" alt="Logic-inspired design" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/mm-print.jpg" alt="Mixtape Magazine - Artist or Rapper" loading="lazy" style="object-position:4% center;"></div>
<div class="project-img project-img-video" data-video-src="projects/miscellaneous/truck-circle.mp4" style="grid-column:1/-1;"><video src="projects/miscellaneous/truck-circle.mp4" autoplay loop muted playsinline style="width:100%;height:auto;object-fit:contain;"></video></div>
<div class="project-img"><img src="projects/miscellaneous/scene-2.jpg" alt="Django Unchained poster" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/scene-3.png" alt="Steph Curry graphic" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/cartoon.jpg" alt="Cartoon illustration" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/billboard.jpg" alt="2023 Billboard design" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/play-in.jpg" alt="Play-In tournament design" loading="lazy"></div>
<div class="project-img"><img src="projects/miscellaneous/scene-1.jpg" alt="Design project screenshot" loading="lazy"></div>
<div class="project-img" style="grid-column:1/-1;"><img src="projects/miscellaneous/characters-sketchbook.jpeg" alt="Character sketchbook mockup" loading="lazy" style="object-fit:contain;"></div>
</div>`
  },
];
