// Single import point for GSAP. Components import from "@/lib/gsap", never from
// "gsap" directly, so plugin registration is guaranteed everywhere (docs/05 §3).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
  if (process.env.NODE_ENV === "development") {
    // Dev-only handle for inspecting trigger positions from the browser (Playwright checks).
    (window as unknown as { __gsap?: unknown }).__gsap = { gsap, ScrollTrigger };
  }
}

/**
 * Refresh order (docs/05 §3): pinned scenes must compute before anything below them,
 * and the system layer's camera/telemetry triggers must compute last.
 */
export const PRIORITY = { pin: 1, section: 0, system: -1 } as const;

/** Media queries used by every animated component's gsap.matchMedia() branches. */
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const NO_PREF = "(prefers-reduced-motion: no-preference)";
/** Pointer devices that can hover and have not asked for reduced motion. */
export const HOVER_OK = "(hover: hover) and (prefers-reduced-motion: no-preference)";

/** The site's eases (docs/04 §1). */
export const EASE = {
  drift: "expo.out",
  settle: "back.out(1.2)",
  state: "power2.inOut",
} as const;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
