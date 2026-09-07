"use client";

import { useRef } from "react";
import { cn } from "cn";
import { gsap, useGSAP, REDUCED, EASE } from "@/lib/gsap";
import { pad } from "@/content/system";

type Step = { name: string; line: string };

/**
 * Waypoints on the return path (docs/04 §4.4): a hairline draws inward
 * (scaleX on desktop, scaleY on mobile), then each waypoint lights in order
 * with a settle on its dot and a 24px rise on its text. Transform-only.
 */
export function Waypoints({ steps, className }: { steps: readonly Step[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const rail = el.querySelector("[data-rail]");
      const dots = el.querySelectorAll("[data-dot]");
      const texts = el.querySelectorAll("[data-text]");
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", reduce: REDUCED }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) {
          gsap.set([rail, dots, texts], { clearProps: "all" });
          return;
        }
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } });
        tl.fromTo(rail, desktop ? { scaleX: 0 } : { scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.2, ease: EASE.drift }, 0);
        tl.fromTo(
          dots,
          { scale: 0.4, opacity: 0.2 },
          { scale: 1, opacity: 1, duration: 0.6, ease: EASE.settle, stagger: 0.15 },
          0.25,
        );
        tl.fromTo(texts, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE.drift, stagger: 0.15 }, 0.3);
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={cn("relative grid gap-10 md:grid-cols-4 md:gap-8", className)}>
      {/* The return path: horizontal through the dots on desktop, vertical on the left on mobile. */}
      <span
        aria-hidden
        data-rail
        className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-hairline md:top-[5px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left"
      />
      {steps.map((step, i) => (
        <li key={step.name} className="relative pl-8 md:pl-0 md:pt-8">
          <span
            aria-hidden
            data-dot
            className="absolute top-0.5 left-0 block size-[11px] rounded-full border border-starlight/60 bg-void md:top-0 md:left-0"
          >
            <span className="absolute inset-[2px] rounded-full bg-starlight" />
          </span>
          <div data-text>
            <p className="telemetry text-starlight-3">
              {pad(i + 1)} · {step.name}
            </p>
            <h3 className="mt-2 text-xl font-medium tracking-[-0.01em] text-starlight md:text-2xl">{step.name}</h3>
            <p className="mt-2 max-w-[34ch] text-base leading-[1.6] text-starlight-2">{step.line}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
