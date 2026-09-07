"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, NO_PREF } from "@/lib/gsap";

/**
 * Continuity out of the hero (docs/04 §4.1): the headline block rises 40px and
 * fades over the first 60% of its section's scroll. Scrubbed, so it carries with
 * the visitor. The trigger is the nearest <section>.
 */
export function ScrollFade({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const section = el?.closest("section");
      if (!el || !section) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        gsap.to(el, {
          y: -40,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "60% top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
