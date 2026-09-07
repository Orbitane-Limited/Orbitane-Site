# Orbitane Site — Frontend Architecture

> How the site is built: stack, folder layout, the product registry that makes the site scale, the camera and motion strategy, and the quality gates every section must pass.
> Stack: Next.js 16 App Router, TypeScript, Tailwind v4, GSAP 3 + @gsap/react, Lenis, lucide-react, shadcn/ui (button only). Same toolkit as Hemta's site, so patterns and primitives carry over.
> Before writing Next.js code, consult the version-accurate docs in `node_modules/next/dist/docs/` or via the next-devtools MCP (Next 16 has breaking changes versus common knowledge).

## 1. Principles

1. **HTML first.** Every word on the page is DOM text. The system layer is decorative SVG with a text alternative. Search engines and screen readers get the full site (the igloo.inc lesson).
2. **One system, one camera.** The orbital system is one component with one camera state. Sections request camera keyframes; they never draw into the system.
3. **Data-driven scale.** Products live in a registry. Adding a product is a data change, not a design change.
4. **One runtime each.** GSAP for animation, Lenis for smooth scroll. No Motion/Framer, no Three.js, no Lottie in V1.
5. **Copy lives in one file.** Components receive strings; nothing user-visible is hard-coded.

## 2. Stack and dependencies

| Package | Role | Notes |
|---|---|---|
| `next` 16.x, `react` 19 | App Router, server components, `next/font`, `next/image`, metadata | Static output for all routes |
| `tailwindcss` v4 | Tokens via `@theme` in `globals.css` | No raw hex in components |
| `gsap` 3.13+, `@gsap/react` | All animation; plugins: ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin (all free since 3.13) | Single import point `lib/gsap.ts` |
| `lenis` | Smooth scroll (`lenis/react` provider) | `lenis/dist/lenis.css` imported once |
| `lucide-react` | Icons (16/20, `strokeWidth 1.5`) | Only icon family |
| `shadcn` (button) | Accessible button primitive, restyled to tokens | No default styling survives |

Explicitly not in V1: `three`, `@react-three/fiber`, `framer-motion`/`motion`, `lottie`, any analytics that phones home (see §12).

## 3. Motion runtime: GSAP + Lenis

- `lib/gsap.ts` registers plugins once and exports `gsap`, `ScrollTrigger`, `SplitText`, `MotionPathPlugin`, `DrawSVGPlugin`, `useGSAP`, plus `REDUCED` / `NO_PREF` media strings (ported from Hemta).
- `lib/lenis.tsx` wraps the app in `<ReactLenis root options={{ lerp: 0.09, duration: 1.2, smoothWheel: true, syncTouch: false, anchors: true }}>` and wires ScrollTrigger:
  ```ts
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  Lenis honours `prefers-reduced-motion` on its own (smoothing off, instant programmatic scrolls). Nested scrollables get `data-lenis-prevent`.
- Component pattern: `useGSAP(() => { const mm = gsap.matchMedia(); mm.add(NO_PREF, ...); mm.add(REDUCED, ...); }, { scope: ref })`. Reduced-motion branches set final states; pinned scenes degrade to static layouts, never to half-scenes.
- Pinned scenes: `start: "top top"`, `pin: true`, `end: "+=<n>vh"`, `invalidateOnRefresh: true`, `anticipatePin: 1`.
- Animate `transform`, `opacity` and `stroke-dashoffset` only. Progress bars animate via `scaleX`.
- Banned: `window.addEventListener("scroll")`, scroll math in React state, `useState` for continuous values, `gsap` imported anywhere but `lib/gsap.ts`.
- Hash navigation: pinned sections add scroll height after load, so `/#hemta` lands short. `OrbitIndex` re-scrolls to `location.hash` after 0.6s (Hemta lesson).

## 4. The system layer and the camera

```
components/system/
  orbital-system.tsx   # "use client". Fixed, full-viewport SVG. Owns the camera group and the master timeline.
  camera.ts            # Camera state {x, y, zoom} + keyframe registry; converts section keyframes into timeline labels.
  core.tsx             # The light: radial gradients + one blurred circle.
  orbit.tsx            # One <ellipse> per product (tilt -14°, ratio 1 : 0.42). Draws in via stroke-dashoffset. Lit/unlit styling from status.
  body.tsx             # One product on its orbit: <image> (real icon, WebP with alpha) or hairline disc if unlit. Drift via MotionPath. Focusable when it has a target.
  telemetry.tsx        # Bottom-left readout + hover readouts. Text from the registry only.
  orbit-index.tsx      # Nav mini-map. Reads camera/section state, scrolls via Lenis.
```

How the camera works:
- The SVG has a fixed `viewBox` in **system units** (`-1000 -1000 2000 2000`, origin at the core). Orbit radii and body positions are expressed in these units, so the layout is resolution independent.
- `camera.ts` holds `{ x, y, zoom }`. `orbital-system.tsx` applies it as one `transform` on a `<g>` (`translate(-x*zoom, -y*zoom) scale(zoom)`), so the whole system moves as one object per frame.
- Sections export a `cameraKeyframe` (values from `04 §2`). On mount, `orbital-system.tsx` builds **one master timeline** with a label per section and tweens the camera object between keyframes; a single `ScrollTrigger` scrubs it across the document (`start: "top top"`, `end: "bottom bottom"`, `scrub: 1.2`). Label positions come from each section's offset, recomputed on refresh.
- Body drift is a separate, paused-when-hidden `MotionPath` tween per lit body. It is the only non-scrubbed continuous motion.
- Under reduced motion the master timeline is not created and the camera sits at the Approach keyframe.

Layer stack (z): `0` void + grain → `1` system SVG (`position: fixed; inset: 0; pointer-events: none`, bodies and unlit orbits re-enable pointer events) → `2` content sections → `3` nav island.

## 5. The product registry (why the site scales without redesign)

```ts
// src/content/system.ts
export type BodyStatus = "shipped" | "in-motion";
export type Body = {
  id: string;                 // "hemta"
  name?: string;              // undefined while in-motion (never a placeholder name)
  kind?: string;              // "native macOS download manager"
  status: BodyStatus;
  orbit: number;              // 1 = innermost
  hue?: { base: string; light: string }; // only when shipped
  icon?: string;              // "/bodies/hemta.webp", only when shipped
  href?: string;              // product site, only when shipped
  moment?: FlybyMoment;       // copy + demo data for the flyby, only when shipped
};
export const system = {
  core: { name: "Orbitane", line: "A product house building AI/ML products and native macOS software." },
  bodies: [
    { id: "hemta", name: "Hemta", status: "shipped", orbit: 1, hue: { base: "#2144DF", light: "#7A8FFF" }, icon: "/bodies/hemta.webp", href: "<HEMTA_URL>", moment: { /* 02 §4.2 */ } },
    { id: "orbit-2", status: "in-motion", orbit: 2 },
    { id: "orbit-3", status: "in-motion", orbit: 3 },
  ],
};
```

What the registry drives: the number and radius of orbits, which bodies are lit, the flyby sections (`page.tsx` maps shipped bodies to `<Flyby body={…}/>` in orbit order), the orbit index dots, every telemetry string, and the honesty rule that in-motion bodies have no name, hue, icon or link (enforced by the type: those fields are absent, not empty).

Shipping a new product: add its icon to `public/bodies/`, change its entry to `shipped` with name, hue, href and moment copy, and the site gains a lit orbit, a flyby and an index dot. The design system's hue rule (`03 §2.3`) is checked in a unit test (hue distance and contrast).

## 6. Folder structure

```
src/
  app/
    layout.tsx            # fonts (next/font: Bricolage Grotesque, Martian Mono), metadata, <LenisProvider>, <Grain/>, <OrbitalSystem/>, <Nav/>, <Footer/>
    page.tsx              # server component: Approach, Flyby per shipped body, InMotion, HowWeWork, Values, Contact
    privacy/page.tsx      # plain-words privacy page
    globals.css           # Tailwind v4 @theme tokens = the design system's source of truth
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.png, apple-icon.png
  components/
    system/               # see §4
    sections/             # one file per section, server components by default
      nav.tsx approach.tsx flyby.tsx in-motion.tsx how-we-work.tsx values.tsx contact.tsx footer.tsx
    moment/               # the working Hemta moment (client leaves)
      mac-window.tsx download-row.tsx state-chip.tsx
    motion/               # reusable GSAP primitives (client leaves), ported from Hemta where noted
      reveal.tsx split-heading.tsx cta-button.tsx grain.tsx pinned-scene.tsx
    ui/                   # shadcn button, restyled
  content/
    site.ts               # ALL page copy, typed. No copy strings inside components.
    system.ts             # the product registry (§5)
  lib/
    gsap.ts lenis.tsx camera.ts utils.ts
docs/                     # these documents + diagrams + research captures
public/
  bodies/hemta.webp       # real product icons (alpha)
  og/                     # OG fallbacks
```

Rules: sections are server components; anything animated is an isolated `"use client"` leaf. `flyby.tsx` is one generic component fed by the registry, never a per-product copy. One icon family. No copy in components.

## 7. Performance budgets (hard gates)

| Gate | Budget | How it is met |
|---|---|---|
| LCP | < 2.5s | Hero headline is the LCP element; the system layer paints after it; fonts via `next/font` with fallback metrics |
| CLS | < 0.1 | All media has reserved space; SplitText splits before first paint under a `visibility: hidden` guard |
| INP | < 200ms | No React state on scroll; GSAP owns continuous values |
| First-load JS | ≤ 170 KB gzipped | Next runtime ≈ 95 + GSAP core ≈ 30 + ScrollTrigger ≈ 14 + MotionPath ≈ 6 + SplitText ≈ 8 + Lenis ≈ 5 + app ≤ 12 |
| Images on `/` | ≤ 600 KB | One body icon ≤ 60 KB; OG image not loaded on page; no photography |
| Fonts | 2 families, ≤ 4 files, ≤ 140 KB | Bricolage variable (wght + opsz) + Martian Mono 500 |
| Video | 0 | Motion is code |
| Frame rate | ≥ 55fps at 6× CPU throttle on every scrubbed scene | Transform/opacity only; ≤ 3 filtered elements; glows as gradients |
| Lighthouse (prod build) | ≥ 95 Performance, Accessibility, Best Practices, SEO | Run against `next build` + `next start` via Playwright before any "section done" |

## 8. Accessibility gates

- WCAG AA contrast on every text/background pair, including two-tone headlines and telemetry when active
- Landmarks: `header / nav / main / section[aria-labelledby] / footer`; one `h1`
- The system SVG is `aria-hidden` with a visually hidden paragraph describing the state ("Orbitane's system: Hemta in orbit, more products in development"); interactive bodies and unlit orbits are real `<a>` / `<button>` elements with labels
- Orbit index dots are buttons with `aria-label="Go to Orbit 01, Hemta"` and `aria-current`
- Full keyboard path: nav, index, CTAs, unlit orbit focus (shows telemetry), footer; visible focus rings in `starlight`
- `prefers-reduced-motion` honoured by every animated component and by Lenis
- The Hemta moment carries a text alternative describing the states shown

## 9. Responsiveness

- Breakpoints: Tailwind defaults. Container `max-w-7xl mx-auto px-5 md:px-8`.
- Hero `min-h-[100dvh]` (never `h-screen`); headline, subtext and both CTAs visible in the first viewport at 375×667.
- Camera zoom capped at 1.6 below 768px; the system's `viewBox` shifts so the core stays centred on narrow screens.
- Every multi-column section declares its `< 768px` collapse in the same file (waypoints go vertical; flyby stacks body above panel).
- Test at 375, 768, 1024, 1440 before any section is called done (Playwright screenshots).

## 10. Quality workflow per section

1. Copy from `content/site.ts` (drafted in `02 §4`), reviewed against the honesty walls
2. Type specimen page first (`/dev/type`, not deployed): the founder approves Bricolage vs the alternate from real rendering before sections are built
3. Build the section (server component + client leaves); register its camera keyframe
4. Verify against `03` tokens and the taste pre-flight (no generic tells: no em-dashes in copy, no three-card rows, telemetry only in the system layer, layout family unique)
5. Playwright: 375 + 1440 screenshots, reduced-motion pass, keyboard pass, 6× throttle scene check
6. next-devtools MCP: zero build, runtime and type errors before moving on
7. Founder review from screenshots; changes to intent go back to the docs first

## 11. SEO and metadata

- Per-page `metadata`; OG image rendered from the system at wide view with the wordmark
- `sitemap.ts`, `robots.ts` from day one; JSON-LD `Organization` with the real legal name once provided
- Copy carries the honest keywords naturally: "product house", "AI/ML products", "native macOS software", "Hemta". No keyword stuffing.

## 12. Privacy and analytics

Default: no third-party scripts, no cookies, no cookie banner (the superlist banner is the anti-pattern). If the founder wants traffic numbers, a privacy-preserving, cookieless option (self-hosted or Plausible-class, as family.co uses) is the only acceptable choice, stated plainly on `/privacy`.

## 13. Reuse from Hemta's site

Ported with token changes: `lib/gsap.ts`, `motion/reveal.tsx` (with `immediate` mode), `motion/split-heading.tsx`, `motion/cta-button.tsx` (magnetic pill), `motion/grain.tsx`, the pinned-scene pattern, the hash re-scroll fix, and the demo window / download row / state chip for the Hemta moment. Asset: Hemta's knot icon (`hemta-site/public/brand/app-icon.png`) converted to `public/bodies/hemta.webp`. Nothing is imported across repos at runtime; files are copied and re-tokenised.

## 14. Out of scope for V1 (explicit)

WebGL/Three.js, video, blog or MDX pipeline, CMS, i18n, theme toggle (one locked dark theme), analytics by default, client case-study pages (only with permission, later), a contact form (email pill first). All revisitable after launch without touching the system layer.
