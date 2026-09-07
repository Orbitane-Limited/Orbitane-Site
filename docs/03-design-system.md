# Orbitane Site — Design System

> The visual contract. These values become `@theme` tokens in `src/app/globals.css` and are the only values components may use.
>
> **Founder review revision (2026-09-07, supersedes values below):** the first build read "gold on black with a cold blue on top" and the copy sat over the light. Fixes: the core light is now near-white (`core-light #FBF8F2`) with a steep falloff, never a beige wash; the neutrals lost their yellow (`starlight #F4F1EC`, `starlight-2 #A8A39B`, `starlight-3 #86827C`); grain reduced to 2.5%; and a composition rule was added to §4: **light is never placed behind copy**. Camera keyframes now keep the core beside or below the text on every section (`04 §2`). Bodies are 40px at rest and sit *in* their orbit: a void-coloured notch breaks the line around them.
>
> **Build deltas (2026-09-07), supersede conflicting values below:** Martian Mono ships as a static 500 weight (no width axis; the variable file was not worth its bytes). Telemetry is 9px with 0.06em tracking on mobile, one line, truncated. Bodies are 36px at rest. The proposed typographic wordmark shipped (core dot in one orbit ring + "Orbitane" in Bricolage 600) pending a founder mark. The footer carries a transparent-to-void gradient so the core's light fades under it instead of cutting off. The orbit index is hidden under 768px (the mobile progress hairline is deferred) and on routes other than `/`. Favicon is `icon.svg` (void squircle, core dot, one ring, one cobalt body).
> Derived from `01-research.md`. Structure enforced by the consistency locks: one theme, one type pairing, one radius rule, one icon family.

## 1. Direction

**"A warm dark room, not outer space. Light for the company, colour for the products."**

The site opens in quiet darkness because the concept needs it (the core comes into focus). The research shows two ways dark goes wrong: the crypto/AI blue-black with purple glow, and the literal starfield. Orbitane's dark is *warm*: a near-black with a hint of paper in it, ivory text, and light instead of colour as the company's signature. It reads as a quiet studio at night, which is what a product house is.

Dials (taste-skill): `DESIGN_VARIANCE 8 / MOTION_INTENSITY 8 / VISUAL_DENSITY 2`.

### Theme decision (explicit)
- **V1 ships dark, locked site-wide.** The Orbital System is a light-in-darkness concept; a light theme would need a different metaphor.
- **Warm, not cool.** Every neutral leans toward paper, never toward blue. This is the single cheapest way to not look like every AI and crypto site.
- **Orbitane itself is achromatic light.** The company has no hue; its signature is the ivory light of the core. Colour on the page belongs to product bodies (Hemta is cobalt). This is the brand story in one rule: the products are the colour of the company.
- **Owner decision flagged:** if the founder wants Orbitane to own a hue, the recommended candidate is a warm solar ivory-gold used only as light (`#E8C98A`, never as a UI accent). Not recommended for V1: a second saturated colour competes with the bodies.

## 2. Colour

### 2.1 Neutrals (warm; no pure black, no pure white)

| Token | Value | Role |
|---|---|---|
| `void` | `#0F0E0C` | Page background. Warm near-black. |
| `surface` | `#171512` | Panels, the Hemta moment's window frame exterior, footer |
| `surface-2` | `#1F1C18` | Raised elements inside panels |
| `hairline` | `rgb(242 236 226 / 0.10)` | All borders and orbit strokes at rest |
| `starlight` | `#F4F1EC` | Headlines, primary text, primary CTA fill, lit orbit strokes |
| `starlight-2` | `#A8A39B` | Body and secondary text (AA on `void` and `surface`) |
| `starlight-3` | `#86827C` | Captions, telemetry at rest, unlit body rims (≥ 4.5:1 on `void`, so usable at small sizes) |

### 2.2 Light (the core; used as glow, never as fill for UI)

| Token | Value | Role |
|---|---|---|
| `core-light` | `#FBF8F2` | Centre of the core's radial gradient (near-white; the room is warm, the light is not gold) |
| `core-glow` | `rgb(255 243 224 / 0.18)` → `0` | Radial falloff around the core; hero and contact sections |

### 2.3 Body hues (delegated accent: exactly one lit body per viewport)

| Token | Value | Role |
|---|---|---|
| `body-hemta` | `#2144DF` | Hemta's orbit stroke when lit, glow, progress fill in its moment (Hemta's own accent, inherited) |
| `body-hemta-light` | `#7A8FFF` | Hemta text on dark (second line of the two-tone headline, state chip); ≥ 6:1 on `void` |
| `body-hemta-glow` | `rgb(33 68 223 / 0.35)` → `0` | Radial glow behind the body during the flyby |

Rule for future bodies: saturated, mid-luminance, at least 60° of hue away from every existing body, with a `-light` variant that passes 4.5:1 on `void`. Assigned when the product ships and registered in `content/system.ts`.

### 2.4 Product state colours (only inside the Hemta moment, mirroring Hemta's lifecycle)

| State | Value |
|---|---|
| Downloading | `body-hemta` |
| Recovering | `#C97A0A` (calm amber, Hemta's own value) |
| Completed | `#1D9A4E` |

Green and amber appear nowhere else on the page.

### 2.5 Locks and gates
- **One lit body per viewport.** The camera lights one body at a time, so any given screen has at most one saturated colour plus ivory light. This is how the "one accent" discipline survives a multi-product future.
- Contrast gates: every text/background pair passes WCAG AA (4.5:1 body, 3:1 large). `starlight` on `void` ≈ 17:1; `starlight-2` on `void` ≈ 8:1; `starlight-3` on `void` ≈ 5:1 (raised from `#6F6960` on 2026-09-07 after Lighthouse flagged small telemetry text). Verified at build, not by eye.
- Never: purple, indigo, gradients between two hues, pure `#000`, pure `#FFF`.

## 3. Typography

**Bricolage Grotesque (display and body) + Martian Mono (telemetry)**, both self-hosted via `next/font/google` with `display: swap` and fallback metrics.

Why Bricolage Grotesque: a variable grotesque with an optical-size axis. At display sizes its ink traps and slightly quirky shapes are memorable and warm (the smile); at body sizes the optical axis tames it into a clean reading face. One family does both jobs, which keeps the font budget small. It is not Inter, not Geist, not a Vercel or Tailwind default.

Why Martian Mono: an instrument-like monospace with a width axis, used only for telemetry and numerals. It gives the system layer its readout language without borrowing IBM Plex Mono from igloo.inc.

| Style | Spec |
|---|---|
| Display (hero) | Bricolage 600, `text-6xl md:text-8xl` (60 / 96px), `tracking-[-0.035em]`, `leading-[0.95]`, `opsz` at max |
| H2 (sections) | Bricolage 600, `text-4xl md:text-6xl`, `tracking-[-0.03em]`, `leading-[1.0]` |
| Two-tone H2 (flybys) | As H2; first line `starlight`, second line the body's `-light` token |
| H3 / waypoint titles | Bricolage 500, `text-xl md:text-2xl`, `tracking-[-0.01em]` |
| Body | Bricolage 400, `text-base md:text-lg`, `leading-[1.6]`, `max-w-[60ch]`, colour `starlight-2` |
| Telemetry | Martian Mono 500, `text-[11px] md:text-xs`, uppercase, `tracking-[0.08em]`, width axis 87.5, colour `starlight-3` at rest / `starlight` when active |
| Numerals (all demo values) | Martian Mono 500, `tabular-nums` |
| Small print | Bricolage 400, `text-sm`, `starlight-3` |

Signature details: negative tracking that tightens as display size grows; every numeral on the page is tabular mono (an Orbitane-wide rule, shared with Hemta's site); telemetry is always uppercase with a middle dot `·` as its separator.

Weights loaded: Bricolage 400, 500, 600 (variable file) + Martian Mono 500. Nothing else.

Owner alternate (flagged): Instrument Sans in place of Bricolage if the founder finds Bricolage too characterful at display size. Cleaner, less memorable. Decide from the type specimen page that the build produces first (`05 §10`).

## 4. Shape, depth, spacing

- **Radius rule (site-wide):** pills for all buttons, chips and the nav island; `20px` for panels and cards; `28px` outer / `20px` inner for the double-bezel frame around the Hemta moment. No other radii exist.
- **Depth is light, not shadow.** No drop shadows anywhere. Depth comes from: the core's radial light, a lit body's glow, hairline borders, and a fixed film-grain overlay at 3% (atmosphere by code, from the Hemta playbook).
- **Glow budget:** at most two glowing elements per viewport (the core and one body). Glows are radial gradients or a single blurred circle; never `box-shadow` colour halos on UI.
- **Section rhythm:** `py-28 md:py-40`; pinned scenes size themselves in viewport heights (`04`); container `max-w-7xl mx-auto px-5 md:px-8`.
- **Nav island:** 56px pill, `bg-surface/70 backdrop-blur-md border border-hairline`, 16px from the top edge, centred. The one translucent element on the page.
- **Light is never behind copy.** The core and a lit body are composition elements, not backgrounds: every camera keyframe places them beside or below the text of its section, and the falloff is steep enough that no paragraph ever sits on a mid-grey wash (founder review, 2026-09-07).
- **Hairlines everywhere borders are needed.** Orbits, panels, waypoint rails and the footer rule all use `hairline`. One stroke weight for UI (1px) and one for the system layer (1.25px at 1× zoom).

## 5. Iconography, marks and imagery

- Icons: **lucide-react only**, `strokeWidth={1.5}`, sizes 16 / 20. Used in CTAs and the footer. No icon per feature, no icon grids.
- **Wordmark (proposed, pending founder asset):** "Orbitane" set in Bricolage Grotesque 600 with `tracking-[-0.02em]`; the mark is a 10px core dot with a single 1px orbit ring. If a real logo exists, it replaces this and the docs are updated.
- **Bodies are real product icons.** Hemta's body is the knot render from Hemta's site (`public/brand/app-icon.png` there → `public/bodies/hemta.webp` here, alpha preserved, ≤ 60 KB at 320px). Future bodies use their real icons. Unlit bodies are code (a disc with a hairline rim).
- **The core is code:** layered radial gradients plus one blurred circle. No render in V1. A generated render may be used for the OG image only.
- **Forbidden imagery:** starfields, planets, nebula gradients, glowing orbs as decoration, circuit boards, chrome faces, stock photography, AI-generated imagery on the page. The system is a diagram, not a sky.
- OG image: the orbital system at wide view with the wordmark; rendered from the same tokens.

## 6. Voice anchors

Warm, plain, concrete, confident. We say what we build and how we work; we never say how good we are. The two values are stated as facts, not slogans. Copy rules and banned words live in `02 §6`.

## 7. What we deliberately avoid (from research)

Blue-black or navy backgrounds; purple or indigo anything; gradients between two hues; Inter, Geist or system-sans as the brand face; a soft italic serif on one "emotional" word; rows of three rounded cards; bento grids; "coming soon" pills; monospace labels as decoration on cards (telemetry lives only in the system layer and is tied to scroll state); starfields and planets; loading screens; text rendered in canvas or WebGL; glitch and scramble text effects; cursor trails; marquees (zero on this site); logo walls; anonymous star-rating widgets; em-dashes in visible copy.

## 8. `@theme` mapping preview (implemented in `globals.css` at build start)

```css
@theme {
  --color-void: #0F0E0C;
  --color-surface: #171512;
  --color-surface-2: #1F1C18;
  --color-hairline: rgb(242 236 226 / 0.10);
  --color-starlight: #F4F1EC;
  --color-starlight-2: #A8A39B;
  --color-starlight-3: #86827C;
  --color-core-light: #FBF8F2;
  --color-body-hemta: #2144DF;
  --color-body-hemta-light: #7A8FFF;
  --color-state-recovering: #C97A0A;
  --color-state-completed: #1D9A4E;
  --radius-panel: 20px;
  --radius-bezel: 28px;
  --font-sans: var(--font-bricolage);
  --font-mono: var(--font-martian);
  --ease-drift: cubic-bezier(0.16, 1, 0.3, 1);   /* expo.out, the site's default entrance */
  --ease-settle: cubic-bezier(0.34, 1.3, 0.64, 1); /* slight overshoot, small UI only */
}
```
