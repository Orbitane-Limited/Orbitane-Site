"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, NO_PREF, EASE } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate direct children with a stagger instead of the wrapper itself. */
  stagger?: boolean;
  delay?: number;
  /** Play on mount (near the fold) instead of on scroll into view. */
  immediate?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Standard reveal (docs/04 §6): opacity 0→1, y 24→0, 0.9s expo.out, stagger 0.1,
 * fires once at "top 80%". Under prefers-reduced-motion nothing animates.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  immediate = false,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_PREF, () => {
        gsap.from(stagger ? Array.from(el.children) : el, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: EASE.drift,
          stagger: stagger ? 0.1 : 0,
          delay,
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: "top 80%", once: true } }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
