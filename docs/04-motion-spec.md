# Orbitane Site — Motion Spec

> What moves, why it moves, and the exact values. GSAP + ScrollTrigger for all animation, Lenis for smooth scroll (see `05 §3`).
> Governing idea: **motion is the demonstration.** The site is Orbitane's first product demo; every animation must read as engineered craft, carry the visitor rather than perform at them, and communicate one of: where you are, what this is, or what just changed. If an animation cannot be justified in one sentence, it is cut.

## 1. Motion personality

From the three references: family's weightlessness, igloo's single camera, superlist's smile. The language is **weightless, continuous, exact.**

| Parameter | Value | Why |
|---|---|---|
| Default entrance ease | `expo.out` (`--ease-drift`) | Fast start, long soft tail: the "weightless" feel without bounce |
| Settle ease (small UI only: orbit index, chips) | `back.out(1.2)` (`--ease-settle`) | A hint of spring, family-style, rationed to elements under 48px |
| State changes | `power2.inOut` | Symmetric, calm |
| Scrubbed timelines | `ease: none`, `scrub: 1.2` | The scroll owns the time; 1.2s of lag makes it carry *with* the visitor |
| Entrance durations | 0.9–1.2s | Longer than a utility site; the drift is the point |
| Hover / press | 0.2s / 0.12s | Instant feedback, no drift |
| Stagger | 0.08–0.12s | Slow enough to read as sequence |
| Distances | 24–40px rises; camera moves in system units, never pixels | Enough travel to read as drift, never a 100px slide |
| Interruptibility | All hover tweens `overwrite: "auto"`; scrubbed timelines are interruptible by nature | Continuity: nothing plays to completion against the visitor |
| Perpetual motion budget | **Exactly one:** bodies drift along their orbits at rest (one revolution in 120s for Orbit 01, slower further out). Pauses when the tab is hidden or the system is offscreen. Off under reduced motion. | It says "in motion" without a word |

Zero: bounce or elastic on layout, parallax for its own sake, cursor effects, starfields, scale-from-zero entrances, ease-in on UI, text scramble or glitch, autoplaying video, scroll-jacking outside the two pinned scenes.

### Smooth scroll parameters (Lenis)
`lerp: 0.09`, `duration: 1.2`, `smoothWheel: true`, `syncTouch: false` (touch stays native), `anchors: true`. Lenis disables smoothing automatically under `prefers-reduced-motion`. ScrollTrigger is driven from Lenis's scroll event and GSAP's ticker (`05 §3`).

## 2. The camera model (the mental map)

The orbital system is one SVG, fixed behind the content, with a camera state `{ x, y, zoom }` applied as a single group transform. Sections do not animate the system directly; they define **camera keyframes**, and one master timeline scrubbed across the whole page interpolates between them. That is what makes the journey feel like one continuous flight instead of six separate effects.

| Section | Camera (system units; origin = core) | Zoom | Lit body | Orbit stroke opacity (lit / unlit) | Telemetry |
|---|---|---|---|---|---|
| Approach | `0, 0` | 1.0 | Hemta at rest glow (30%) | 0.55 / 0.14 | `ORBITANE · 1 BODY IN ORBIT · MORE IN MOTION` |
| Flyby · Hemta | Hemta's position, offset so the body sits at the left third | 2.2 | Hemta full (100%) | 0.8 / 0.06 | `ORBIT 01 · HEMTA · NATIVE MACOS · SHIPPED` |
| In motion | `0, 0` | 0.78 | none (Hemta 30%) | 0.4 / 0.30 | on hover: `ORBIT 0N · IN MOTION · UNANNOUNCED` |
| How we work | `0, -0.15` (core slightly above centre) | 1.1 | none | 0.3 / 0.12 + return path drawn | none |
| Values | `0, 0` | 1.6 | none; core light at 70% of viewport | 0.15 / 0.05 | none |
| Contact | `0, +0.35` (core rises into the lower viewport) | 2.0 | none; core light fills the lower third | 0 / 0 | `RETURN COMPLETE` (orbit index only) |

Rules: the zoom never exceeds 2.2 on desktop (1.6 on mobile). Camera moves use the master timeline's `scrub: 1.2`; nothing snaps. `invalidateOnRefresh: true` so the keyframe positions recompute on resize.

## 3. Telemetry (rationed instrument language)

- Lives only inside the system layer (bottom-left of the viewport and on hover over orbits), never on panels or cards.
- Content comes from the product registry, so the readouts are always true (`05 §5`).
- Changes by crossfade (0.3s) when the camera crosses a section boundary. No typing effect, no scramble.
- Maximum four static readouts across the page plus hover readouts on unlit orbits.

## 4. Scenes, beat by beat

### 4.1 Approach (hero). Load sequence, then scroll-driven
Purpose: the core comes into focus; the visitor understands "this is a system" in two seconds.

Load sequence (plays once, 1.6s total, starts on first paint of the headline so the headline is the LCP element):
- 0.00–1.20 core focuses: blur `40px → 0`, scale `1.3 → 1.0`, opacity `0 → 1`, `expo.out`
- 0.20–1.30 orbits draw: `stroke-dashoffset` from full length to 0, stagger 0.12 from inner to outer, `expo.out`
- 0.35–1.25 headline lines mask-reveal (SplitText lines, `y 100% → 0`, 0.9s, stagger 0.08)
- 0.70–1.40 subtext and CTAs rise 24px and fade in, stagger 0.1
- 0.90–1.30 Hemta body fades to rest glow; telemetry crossfades in
- Then: bodies begin their slow drift (the one perpetual motion)

Scroll-driven: from hero start to flyby start the camera holds; the headline block rises 40px and fades to 0 over the first 60% of the hero's scroll (continuity into the flyby).

Reduced motion: everything renders in its final state; no load sequence; no drift.

### 4.2 Flyby · Orbit 01 · Hemta (pinned, scrubbed). THE signature scene
Purpose: the visitor *feels* the journey pass a product, and sees the product's core promise work.

Structure: the section pins for 3 viewport-heights. The camera keyframe (zoom 2.2 toward the body) is on the master timeline; the panel and the working moment are on a local timeline scrubbed by the section's own ScrollTrigger (`scrub: 1`).

Beats (local timeline 0 → 1):
- 0.00–0.25 arrival: body scales `1 → 5.7` in system units (28px → 160px on screen through the camera), glow `30% → 100%`, other orbits dim to 0.06; telemetry flips to Orbit 01
- 0.20–0.40 the panel arrives: two-tone headline mask-reveals, body copy and CTA rise 32px
- 0.35–0.85 the working moment: download row `62% → 71%` (`scaleX`), speed ticks in mono; connection drops (Wi-Fi glyph dims, speed collapses to 0, chip `Downloading → Recovering` in calm amber); connection returns, chip flips back, bar completes to 100%, chip `Completed`; a 1.01 → 1.0 settle
- 0.85–1.00 departure: panel drifts `x +48px` and fades; the body eases back toward rest scale as the camera begins its pull-back for "In motion"

Reduced motion: no pin; body, panel and the completed download row render statically with a one-line caption ("Downloads that survive interruptions").
Mobile: pin shortened to 2.2 viewport-heights; body above panel; zoom capped at 1.6; identical states.

### 4.3 In motion (scroll-driven, not pinned)
Purpose: "more is coming", stated by structure rather than promise.

- Camera pulls back to 0.78 over the section's approach
- Unlit orbits brighten `0.14 → 0.30`; unlit bodies fade in as hairline discs
- Headline mask-reveals; body copy rises
- Hover / focus on an unlit orbit: stroke to 0.55, a single soft pulse (scale 1 → 1.02 → 1 on its body, 0.6s, `--ease-settle`), telemetry appears beside it. Keyboard-focusable with the same feedback.

### 4.4 How we work (scroll-driven)
Purpose: the return begins; process shown as waypoints on the way home.

- Return path draws inward (`stroke-dashoffset`, 1.2s, `expo.out`) when the section reaches `top 70%`
- Four waypoints light in order as the path passes them (0.15s apart), each with a settle on its dot and a 24px rise on its text
- Desktop: horizontal rail with the path above; mobile: vertical rail, path on the left

### 4.5 Values (scroll-driven)
- Camera zooms to 1.6; core light grows to 70% of the viewport height
- Two statements mask-reveal one after the other as they enter (`top 75%`), 1.1s each
- Nothing else moves

### 4.6 Contact (scroll-driven) and footer
- Core rises into the lower viewport (camera `y +0.35`, zoom 2.0); light fills the lower third
- Headline, line and email pill rise and fade in (stagger 0.12)
- Orbit index shows all dots visited and a completed hairline
- Footer: standard reveal, stagger 0.08

## 5. The orbit index (navigation mini-map)

- A 96×24 SVG: core dot, one dot per orbit on a hairline. Current section's dot is lit (`starlight`, or the body's colour on a flyby); visited dots at 60%; upcoming at 25%
- Dot changes crossfade 0.3s and settle with `--ease-settle`
- Click: Lenis `scrollTo` the anchor with `duration: 1.6`, `easing: expo.out`
- Hover: telemetry tooltip with the orbit's name, 0.2s fade
- Mobile: dots on a progress hairline; the hairline's fill is the page progress (`scaleX`)

## 6. Standard reveals and micro-interactions

- Every non-scene element uses `reveal.tsx` only: `opacity 0 → 1`, `y 24 → 0`, 0.9s, `expo.out`, stagger 0.1, fire at `top 80%`, once. Near-fold elements use its `immediate` mode (Hemta lesson: scroll-triggered reveals never fire for elements already near the viewport bottom).
- CTAs: magnetic pill (max 6px pull, pointer devices only), `:active scale-[0.98]`, 120ms; no glow
- Nav island: `bg-surface/70` at all times (no transparent-at-top state; the island floats over the system)
- Links: underline offset animates 2px on hover, 0.2s
- Bodies: hover scale 1.04 with glow +15%, 0.25s; focus ring in `starlight`

## 7. Reduced motion and mobile matrix

| Element | `prefers-reduced-motion: reduce` | < 768px |
|---|---|---|
| Smooth scroll | Lenis disables smoothing (built-in) | Native touch scroll, Lenis smooth only for wheel |
| Camera | Static wide view (Approach keyframe) for the whole page | Same keyframes, zoom capped 1.6 |
| Drift | Off | On, pauses offscreen |
| Load sequence | Off (final state) | On |
| Flyby pin | Off; static panel + completed moment | Pin 2.2vh, body above panel |
| Reveals | Off (visible) | On |
| Hover pulses | Off; focus still shows telemetry | Tap shows telemetry for 2s |
| Grain | Static (no animation, it never animates anyway) | On |

## 8. Performance discipline inside the system layer

- Animate only `transform` and `opacity`, plus `stroke-dashoffset` on the orbit paths (cheap, GPU-friendly)
- Blur is expensive: the core's blur is a static CSS filter on one element; body glows are radial-gradient circles, not filters. Maximum three filtered elements on the page.
- One group transform per frame for the camera; bodies are positioned by MotionPath along their orbit once per frame during drift only
- `will-change: transform` on the camera group and the drifting bodies only
- Test at 6× CPU throttle: if any scrubbed scene drops below 55fps, reduce (glow first, drift second, stagger third), never ship a stutter

## 9. Enforcement checklist (every animated PR)

- [ ] One-sentence justification for each new animation in the PR context
- [ ] `gsap.matchMedia` reduced-motion branch present; verified with Playwright under `prefers-reduced-motion: reduce`
- [ ] Only `transform`, `opacity` and `stroke-dashoffset` animated; no layout properties
- [ ] Cleanup via `useGSAP` scope; `ScrollTrigger.getAll()` shows no orphans after route change
- [ ] Camera keyframe registered on the master timeline, not tweened directly
- [ ] 55fps+ at 6× CPU throttle on the scene
- [ ] Verified at 375px or has an explicit mobile variant in the same file
- [ ] Telemetry text comes from the registry, not a string literal
