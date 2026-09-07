"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { cn } from "cn";
import { gsap, SplitText, ScrollTrigger, useGSAP, NO_PREF, EASE } from "@/lib/gsap";

type SplitHeadingProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  /** Play immediately on mount (hero) instead of on scroll into view. */
  immediate?: boolean;
  delay?: number;
  /** Stagger between lines. */
  stagger?: number;
};

/**
 * Masked line reveal for display type (docs/04 §4.1): lines rise out of an
 * overflow mask, 0.9s expo.out, 0.08 stagger. Splits after fonts load so the
 * split matches the final line breaks, and only once the heading approaches the
 * viewport, so hydration does no layout work for headings far below the fold.
 * Reduced motion: text simply visible.
 */
export function SplitHeading({
  as: Tag = "h2",
  id,
  className,
  children,
  immediate = false,
  delay = 0,
  stagger = 0.08,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(NO_PREF, () => {
        let split: SplitText | null = null;
        let armed = false;
        const run = () => {
          if (armed || !el.isConnected) return;
          armed = true;
          document.fonts.ready.then(() => {
            if (!el.isConnected) return;
            split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
            });
            gsap.set(el, { visibility: "visible" });
            gsap.fromTo(
              split.lines,
              { yPercent: 115 },
              {
                yPercent: 0,
                duration: 0.9,
                ease: EASE.drift,
                stagger,
                delay,
                ...(immediate
                  ? {}
                  : { scrollTrigger: { trigger: el, start: "top 80%", once: true } }),
              },
            );
          });
        };
        if (immediate) run();
        else ScrollTrigger.create({ trigger: el, start: "top 140%", once: true, onEnter: run });
        return () => split?.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn("split-ready", className)}>
      {children}
    </Tag>
  );
}
