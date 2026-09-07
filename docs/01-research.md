# Orbitane Site — Research Pass

> Live research pass, 2026-09-06. Each reference site was loaded in headless Chromium at 1440×900, inspected (DOM, fonts, network, detected libraries), and screenshotted along a ten-step scroll journey. Captures are in `research/captures/`. Landscape findings come from secondary sources listed in §5.
> Decisions derived from this document live in `02`–`05`. This document explains *why* those decisions were made.

## 1. The three references, verified

The founder chose three references, each for one quality. The pass checked what each site actually is today, so we take the right thing from each and avoid inheriting its costs.

### 1.1 At a glance

| | family.co | igloo.inc | superlist.com |
|---|---|---|---|
| **Chosen for** | The feel: buttery, weightless, zero bloat | The structure: a 3D scroll journey with a clear mental map | The personality: playful product motion |
| **What it is** | Marketing site for an iOS crypto wallet | Corporate site for the parent company of Pudgy Penguins | Marketing site for a task-management app |
| **Stack (detected)** | Next.js (pages router), React, Plausible analytics | Vite + Svelte + Three.js; Draco, Basis, EXR and MSDF text workers; audio worker | Framer (generator `Framer 8a671e2`) + Motion |
| **Text rendering** | HTML | Entirely WebGL. Zero headings, links or images in the DOM | HTML |
| **Display type** | Custom "Family" sans, 68px / weight 500 / tracking -0.02em / line-height 1.1 | IBM Plex Mono only (Medium, Regular) | Haffer XH SemiBold, 64px / 600 / -0.02em / line-height 0.95 |
| **Body type** | Inter | (none, WebGL labels) | Inter + Inter Display; Fragment Mono and Jersey 10 (pixel font) as accents |
| **Palette** | Warm off-white page, warm grey text `#474645`, black pill CTAs, illustration colours | Two greys, `#b6bac5` and `#383e4e` (Awwwards tags); loading screen `#A0A5B1` | Navy `#181824`, coral CTA, blue / violet / red colour blocks |
| **Motion technology** | Video recordings of the app (9 `<video>` elements), CSS transitions | GSAP-scrubbed camera through Three.js scenes; shader transitions (chromatic aberration, frost) | Motion (Framer) reveals; one video |
| **Weight on a full scroll** | ≈ 11.6 MB video, ≈ 4.9 MB images, ≈ 1.0 MB fonts | ≈ 13 MB textures and geometry, behind a loading screen | ≈ 0.81 MB JavaScript, ≈ 0.17 MB fonts |
| **Awards / scores** | Not entered | Awwwards Site of the Day 2024-07-23; overall 7.92, creativity 8.31, usability 7.5 (its lowest), animation 9.6 in the dev jury | Launch site (2021, Unseen Studio) won Awwwards Site of the Month, FWA and CSSDA |

### 1.2 family.co: what "buttery and weightless" actually is

Verified structure: centred hero headline ("Your favorite crypto wallet.") flanked by clusters of illustrated characters and stickers; two pill CTAs ("Download on iOS", "Watch the Video"); then feature chapters, each with a small blue eyebrow label, a headline and a paragraph; three phone demos; a mascot-led "Secure" chapter with a checklist; FAQ; footer.

The buttery quality is mostly the *product's* motion, shown through video, and the *page's* restraint around it. The page itself has almost no scroll effects. Its signature is warmth: warm paper, warm grey text, pill shapes, generous whitespace and paired declarative headlines ("Relentless protection. Restful ease.").

The design values published by Family's designer are Simplicity, Fluidity and Delight, with a "delight-impact curve": features used often get subtle touches, rare moments get the magic. Continuity is central: elements persist across states instead of being replaced.

**We take:** warm neutrals instead of cold ones; pill controls; paired declaratives; whitespace as confidence; continuity (the same element transforms rather than being swapped); the delight-impact curve as a rationing rule.
**We leave:** 11 MB of video (our motion is code), Inter (see §2.2), illustration-led branding (Orbitane's imagery is its products).

Captures: `research/captures/family-01-hero.jpg`, `family-02-scroll-a.jpg`, `family-04-scroll-c.jpg`.

### 1.3 igloo.inc: what "a clear mental map" is made of

Verified structure: an ASCII progress loader, then three chapters driven by one camera: (1) a wireframe igloo inside a crystalline lattice with numbered nodes, (2) a photoreal snowfield igloo with numbered hotspots, (3) portfolio companies encased in ice shards with monospace annotations ("PORTFOLIO_CO_02 · OVERPASS · TEMP 30.02 · CLICK TO EXPLORE"). A sound toggle sits bottom-left. The mental map works because there is **one object** (the igloo) that the camera approaches, enters and reveals, and because the interface speaks one consistent instrument language (mono labels, leader lines, readouts).

The costs are real: a loading screen, roughly 13 MB of assets, no DOM text (nothing for search engines or screen readers), and the lowest score on usability. The studio built it "entirely in WebGL, from procedurally grown ice crystals to shader-driven UI text".

**We take:** one persistent object the camera travels through; chapters as camera positions; annotation language (leader lines, mono readouts) tied to the scene; the "stop and stare" ambition.
**We leave:** WebGL for the interface, loading screens, text in shaders, glitch and scramble effects, 13 MB payloads. Our interface is HTML; our system is an SVG diagram the camera moves through (see `05 §4`).

Captures: `research/captures/igloo-01-hero.jpg` (loader), `igloo-02-scroll-a.jpg`, `igloo-03-scroll-b.jpg`, `igloo-05-deep.jpg`.

### 1.4 superlist.com: where the smile lives

Verified structure today: dark navy page; two-tone headlines (first line white, second line coral or grey: "Tasks, notes, and plans. / Finally in one app."); saturated colour-block panels (blue, violet, red) framing product screenshots; feature grid; app-store testimonials; footer with rainbow column headings. A pixel font (Jersey 10) appears as a wink. The current site is a conventional Framer build; the celebrated playful motion belongs to the product and to the 2021 launch site, which used WebGL 3D graphics bound to scroll, "3D buttons complete with sound effects" and letter-by-letter text.

**We take:** the two-tone headline device; personality carried by a few bold, saturated set pieces on a dark base; one deliberate wink per page; product shown inside framed panels.
**We leave:** rainbow footers, cookie banners, 810 KB of framework JS, colour blocks on every section (our colour is rationed to lit bodies).

Captures: `research/captures/superlist-01-hero.jpg`, `superlist-02-scroll-a.jpg`, `superlist-03-scroll-b.jpg`, `superlist-05-deep.jpg`.

## 2. The landscape Orbitane enters

### 2.1 AI companies converge on one look

A 2026 comparison of seven AI companies (OpenAI, Anthropic, Perplexity, Mistral, Cohere, xAI, Scale) finds the same recipe: "soft creams, warm grays, and muted off-whites", "oversized sans-serif headlines", imagery of "blurred gradients, atmospheric textures, and abstract forms", and messaging about trust rather than capability. The named risks are being "institutional" (Anthropic), "utility outweighs brand personality" (Perplexity), and "credible but less visually ownable" (Scale). Mistral's pixel art and orange are cited as proof that individuality is possible inside the constraints.

**Implication:** a warm-cream, oversized-sans, abstract-blob site would make Orbitane look like a small lab imitating big labs. A motion-led, product-led site is open ground.

### 2.2 The tells of generic, AI-generated design (what a design-literate client will notice)

Two 2026 write-ups converge on the same list:

| Tell | Why it reads generic |
|---|---|
| Inter everywhere | "Exactly why it became the default and exactly why it now reads as generic" |
| Indigo-to-purple gradient | "The single loudest AI tell in 2026" (traces to Tailwind's indigo-500 default) |
| Three rounded cards in a row | Found on "almost any AI-generated landing page" |
| Weightless headlines ("Build faster. Ship smarter.") | Says nothing specific about who it is for |
| Dark mode + soft italic serif on one word + amber/violet accents + mono labels in card corners + bento grids + "coming soon" pills | The 2026 "refined dark" template |
| Glowing orbs, cold circuits, chrome faces | "Fails to capture the mess, warmth, and wonder of what intelligence actually is" |

**Implication:** the Orbital System is dark and uses monospace readouts, so it sits one step from two of these tells. The design system must actively avoid the others (no Inter, no purple, no card rows, no italic-serif accent word) and must use monospace only as live telemetry tied to the scene, never as decorative card labels (`03 §7`).

### 2.3 Product houses with personality

| Studio | How it presents itself | The lesson |
|---|---|---|
| **Family** (wallet) | Warm paper, mascots, videos of the product, published design values | Warmth is a positioning choice, not a softness |
| **Not Boring Software** (six iOS apps) | "Stop optimizing. Start Living." Apps as cards with product codes; "3D, animation, physics, haptics, and sounds"; "100% independently-owned" | A multi-product house can be one voice; product codes and a system make a small catalogue feel like a world |
| **Superlist** | Dark base, colour-block set pieces, one pixel-font wink | Personality can be rationed to a few moments |

Orbitane's distinction against all three: its products are the imagery (real icons, real product moments), and its structure (one orbit per product) is itself the demonstration of imagination.

### 2.4 Prior art for the orbit concept, and why ours is different

Space and orbit scroll journeys exist:

- **Lunarwheel**: a studio portfolio as "a 3D journey through space" where "case studies are presented as celestial bodies". The closest neighbour to our concept.
- **Solar Journey** (Awwwards Honourable Mention): explore-the-solar-system site, Webflow with WebGL embeds.
- **Josh Worth's tediously accurate scale model of the solar system**: horizontal scroll where "the emptiness is the point".
- Template-level "cosmic scroll journeys" from site builders.

The pattern that makes these interchangeable: literal outer space (starfields, planets, nebula gradients) and generic spheres as content holders. **Orbitane's system is not a sky. It is a diagram**: a warm dark room, orbit lines drawn like an engineer's plate, bodies that are real products with real icons, and light instead of colour for the company itself. No stars, no planets, no nebulae. This is the single most important differentiation rule and it is written into `03 §7`.

## 3. Positioning

**The structure of igloo, the warmth of family, the smile of superlist, at a fraction of the weight, with honesty as a design principle.**

Where Orbitane sits on the two axes the research exposed:

| | Cold | Warm |
|---|---|---|
| **Heavy (WebGL, loaders, video)** | igloo.inc, Lunarwheel | Superlist 2021 launch site |
| **Light (HTML-first, code motion)** | Most AI labs (cream, static) | **Orbitane**: dark but warm, motion in code, one SVG system |

Differentiation does not come from an exotic hue or from 3D. It comes from: a consistent spatial metaphor that scales with the product line; motion that carries the visitor rather than performing at them; product moments that are working demonstrations; and restraint everywhere else.

## 4. Implications carried into the contract

| Finding | Decision | Where |
|---|---|---|
| One persistent object makes the mental map (igloo) | One SVG orbital system, fixed behind the content, moved by a scroll-driven camera | `04 §2`, `05 §4` |
| Loading screens and WebGL text cost usability | HTML text everywhere; no loader; no Three.js in V1 | `05 §2`, `05 §7` |
| Warmth is a position (family); cold space is a cliché | Warm near-black, warm ivory text, no blue-black, no starfield | `03 §1–2` |
| Purple gradients, Inter and card rows are tells | Bricolage Grotesque + Martian Mono; colour only on lit bodies; no three-card rows | `03 §2–3`, `02 §4` |
| Mono labels as decoration are a tell | Telemetry only inside the system layer, tied to scroll state, rationed | `03 §7`, `04 §3` |
| Continuity and the delight-impact curve (family) | Same element transforms across states; heavy motion only on the two set pieces | `04 §1` |
| Two-tone headline device (superlist) | Adopted as the one headline treatment in flyby sections | `03 §3` |
| Motion in code, not video (Hemta lesson, confirmed) | GSAP timelines, live product moments, 0 video in V1 | `04`, `05 §3` |
| Video and 3D payloads of 11–13 MB | Budgets: ≤ 170 KB gzipped JS, ≤ 600 KB images on the home journey | `05 §7` |

## 5. Sources and caveats

Live captures (2026-09-06, headless Chromium 1440×900): https://family.co, https://igloo.inc, https://www.superlist.com. Detected libraries, fonts and payloads are from the page's DOM, `document.fonts` and network responses during a ten-step scroll; payload figures are approximate (content-length headers).

Secondary sources:
- Family design values: https://benji.org/family-values; hero breakdown: https://hero.gallery/hero-gallery/family-wallet
- Igloo Inc case study: https://www.awwwards.com/igloo-inc-case-study.html; technical showcase: https://www.webgpu.com/showcase/igloo-inc-procedural-crystals/; scores and tags: https://www.awwwards.com/sites/igloo-inc
- Superlist launch site: https://unseen.co/projects/superlist/
- AI homepage convergence: https://www.designrush.com/agency/website-design-development/trends/ai-startup-homepage-design
- Generic-design tells: https://www.925studios.co/blog/ai-slop-design-tells; https://theaicliff.substack.com/p/ai-design-already-has-a-cliche-youre
- Not Boring Software: https://notbor.ing/
- Orbit prior art: https://www.awwwards.com/sites/solar-journey; https://scrollytelling.ai/examples/ (Lunarwheel); https://www.makeuseof.com/tag/scroll-though-solar-system-4-amazing-space-websites/

Caveats: family.co's animation curves are compiled into its bundle and could not be read; the "springy" character is inferred from the product and published values. igloo.inc's third chapter was observed after ten wheel steps in a headless browser; the live intro may vary. superlist.com today differs from the 2021 award-winning version; both are described. Landscape claims come from the cited articles, not from our own survey of every AI company.
