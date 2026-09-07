# Orbitane Website — Project Rules

@AGENTS.md

## What this repo is

The company website for **Orbitane**, a product house building AI/ML products and native macOS software. First shipped product: Hemta (its own site lives in a separate repo). The site is built on one approved concept, **THE ORBITAL SYSTEM**: the scroll is a trajectory through Orbitane's system; every product is a body in orbit.

## The docs are the contract

Read `docs/README.md` first, then `docs/00-brief.md` through `docs/05-architecture.md`. Anything built that contradicts them needs a doc change first. The docs are shown to Orbitane's clients as proof of process, so keep them presentation-quality when updating.

## HARD RULE: No git / GitHub operations, ever

The founder performs all version control personally from their own account. Claude must **never** run `git commit`, `git push`, `git pull`, `git fetch`, `git clone`, `git merge`, `git rebase`, `git reset`, `git tag`, modify remotes, or use the `gh` CLI, and must never suggest doing so as a step it performs itself. Deny rules live in `.claude/settings.json`. Editing files, building and running dev servers is fine.

## Stack

Next.js 16 App Router, TypeScript, Tailwind v4 (`src/` layout, npm), shadcn/ui (button only), GSAP + @gsap/react (ScrollTrigger, SplitText, MotionPath, DrawSVG), Lenis smooth scroll, lucide-react. MCPs in `.mcp.json`: playwright, next-devtools, shadcn-ui, figma. Design and motion skills in `.claude/skills/`.

## Working agreements

- **Honest content only.** No invented clients, testimonials, metrics, product names or dates. Unannounced products are unlit orbits described only as "in motion".
- **Copy lives in `src/content/site.ts`; the product registry in `src/content/system.ts`.** No user-visible strings inside components. Telemetry text comes from the registry.
- **GSAP is imported only from `src/lib/gsap.ts`.** Every animation has a reduced-motion branch. Animate transform, opacity and stroke-dashoffset only.
- **One system, one camera.** Sections register camera keyframes; they never draw into the orbital system.
- **Design tokens live in `globals.css` `@theme`.** No raw hex in components.
- **Verify in the browser** (Playwright MCP) at 375 and 1440, reduced-motion and 6× CPU throttle, before calling a section done. Zero errors in next-devtools.
- No em-dashes in visible copy. Banned marketing vocabulary is listed in `docs/02 §6`.
