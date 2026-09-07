"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll for the whole document (docs/04 §1, docs/05 §3).
 * Lenis owns the scroll position; GSAP's ticker drives Lenis; Lenis tells
 * ScrollTrigger when to update. One clock for everything.
 * Lenis disables smoothing on its own under prefers-reduced-motion.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      }}
    >
      <Ticker />
      {children}
    </ReactLenis>
  );
}

/** Wires the Lenis instance (from context, once it exists) to GSAP's ticker and ScrollTrigger. */
function Ticker() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // This effect runs after every child effect, so all ScrollTriggers (including pins)
    // exist now. One refresh recomputes every position with pin spacing accounted for;
    // a second after fonts settle catches any reflow (docs/05 §3).
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(refresh);
    document.fonts.ready.then(refresh);
    // Async scripts can hydrate before the stylesheet applies; measure again once everything has loaded.
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
    // Pinned scenes add scroll height after load, so a URL hash lands short. Re-land once settled.
    const land = gsap.delayedCall(0.6, () => {
      if (!window.location.hash) return;
      const target = document.querySelector<HTMLElement>(window.location.hash);
      if (target) lenis.scrollTo(target, { immediate: true });
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      land.kill();
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
    };
  }, [lenis]);

  return null;
}
