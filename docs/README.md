# Orbitane Site — Planning Docs

> The design and build contract for orbitane.com. Read in order. Anything built that contradicts these documents needs a doc change first, not a silent exception.
> Status: **Contract approved 2026-09-07; V1 built and browser-verified the same day.** Build deltas are recorded at the top of docs 02–04 and in `05 §15`; founder inputs still owed are listed in `02 §7`.

These documents are written to be shown to Orbitane's clients as proof of process. Vocabulary is explained where it first appears, decisions carry their reasoning, and every claim about a reference site was verified live.

| Doc | What it locks down | Status |
|---|---|---|
| [00-brief.md](00-brief.md) | The founding brief: who Orbitane is, the approved Orbital System concept, references, values, working agreements | approved |
| [01-research.md](01-research.md) | Live research pass over family.co, igloo.inc, superlist.com; the AI/ML product-house landscape; the orbit-concept prior art; where Orbitane positions | done |
| [02-orbital-mindmap-and-sitemap.md](02-orbital-mindmap-and-sitemap.md) | The system vocabulary, the orbital mindmap, page tree, the scroll journey section by section with working copy, the scaling rule for new products | built |
| [03-design-system.md](03-design-system.md) | Direction, palette, typography, shape, imagery, voice; becomes `@theme` tokens in `globals.css` | built |
| [04-motion-spec.md](04-motion-spec.md) | Motion personality, the camera model, every scene beat by beat, smooth-scroll parameters, reduced-motion and mobile behaviour, enforcement checklist | built |
| [05-architecture.md](05-architecture.md) | Stack, folder layout, the product registry that makes the site scale, GSAP + Lenis strategy, performance and accessibility gates, workflow, build notes | built |

Supporting material: `diagrams/orbital-system.svg` (+ `.png`) is the system map used across the docs; `research/captures/` holds the reference screenshots taken during the research pass.

## Non-negotiables that apply across all docs

1. **Honest content only.** No invented clients, testimonials, metrics, product names or dates. Unannounced products are shown as unlit orbits and described as "in motion", nothing more.
2. **Git is human-operated.** No git or gh commands from Claude, ever (enforced in `.claude/settings.json`).
3. **One system.** One theme, one type pairing, one radius rule, one icon family, one animation runtime, one smooth-scroll runtime. Consistency locks in `03` are site-wide.
4. **Motion is proof, not decoration.** Every animation answers "what does this communicate?" in one sentence or it is cut (`04 §1`).
5. **Performance and reduced-motion gates are hard gates**, identical in spirit to the Hemta build (`05 §7–8`).
6. **The brief outranks these docs** on any question of intent; these docs outrank code.

## How to read the vocabulary

The site is built on one metaphor, THE ORBITAL SYSTEM. The words used everywhere in these docs:

| Term | Meaning on the site |
|---|---|
| **Core** | Orbitane itself. The light at the centre. Values and contact live here. |
| **Orbit** | One product's path around the core. Every product gets exactly one. |
| **Body** | The product riding its orbit, shown as its real app icon. |
| **Lit / unlit** | Shipped products are lit in their own colour; products in development are unlit outlines. |
| **Approach, Flyby, In motion, Return** | The four phases of the visitor's scroll trajectory. |
| **Telemetry** | Small monospace readouts tied to the scroll position (which orbit, which body, its status). Instrument language, rationed. |
| **Orbit index** | The miniature system map in the navigation that shows where the visitor is and lets them jump between orbits. |
