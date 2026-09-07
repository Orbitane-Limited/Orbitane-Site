"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, ScrollTrigger, EASE, NO_PREF, REDUCED, PRIORITY } from "@/lib/gsap";
import { nav } from "@/content/site";
import { system, shippedBodies, pad } from "@/content/system";

type Stop = { id: string; label: string; href: string; kind: "core" | "body" | "unlit" };

/**
 * The orbit index (docs/04 §5): a miniature of the system in the nav. One dot per
 * orbit plus the core; the current section's dot is lit, visited dots at 60%,
 * upcoming at 25%. Dots are real buttons: click travels there (Lenis scrollTo).
 * Sections opt in with `data-index="<stop id>"`.
 */
export function OrbitIndex() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const shipped = shippedBodies();

  const stops: Stop[] = [
    { id: "approach", label: system.core.name, href: "#approach", kind: "core" },
    ...system.bodies
      .slice()
      .sort((a, b) => a.orbit - b.orbit)
      .map<Stop>((b) =>
        b.status === "shipped"
          ? { id: b.id, label: `Orbit ${pad(b.orbit)} · ${b.name}`, href: `#${b.id}`, kind: "body" }
          : { id: b.id, label: `Orbit ${pad(b.orbit)} · in motion`, href: "#in-motion", kind: "unlit" },
      ),
    { id: "contact", label: "Return · contact", href: "#contact", kind: "core" },
  ];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const dots = Array.from(el.querySelectorAll<HTMLButtonElement>("[data-stop]"));
      const order = dots.map((d) => d.dataset.stop as string);
      const hueOf = (id: string) => shipped.find((b) => b.id === id)?.hue.light ?? "var(--starlight)";
      const mm = gsap.matchMedia();

      const paint = (activeIds: string, instant = false) => {
        const ids = activeIds.split(/\s+/).filter(Boolean);
        const idx = ids.map((id) => order.indexOf(id)).filter((i) => i >= 0);
        const first = Math.min(...idx);
        dots.forEach((d, i) => {
          const isActive = idx.includes(i);
          const visited = i < first;
          d.setAttribute("aria-current", isActive ? "true" : "false");
          const dot = d.firstElementChild as HTMLElement;
          gsap.to(dot, {
            backgroundColor: isActive ? hueOf(d.dataset.stop as string) : "var(--starlight)",
            opacity: isActive ? 1 : visited ? 0.6 : 0.25,
            scale: isActive ? 1.35 : 1,
            duration: instant ? 0 : 0.3,
            ease: EASE.settle,
            overwrite: true,
          });
        });
      };

      mm.add(NO_PREF, () => {
        // Sections announce themselves with data-index; a stop is active while its section crosses the viewport centre.
        document.querySelectorAll<HTMLElement>("[data-index]").forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 50%",
            end: "bottom 50%",
            refreshPriority: PRIORITY.system,
            onToggle: (self) => {
              if (self.isActive) paint(sec.dataset.index as string);
            },
          });
        });
        paint(order[0]);
      });
      mm.add(REDUCED, () => {
        // Still a map without motion: the dot for the section at the viewport centre is lit, instantly.
        document.querySelectorAll<HTMLElement>("[data-index]").forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 50%",
            end: "bottom 50%",
            refreshPriority: PRIORITY.system,
            onToggle: (self) => {
              if (self.isActive) paint(sec.dataset.index as string, true);
            },
          });
        });
        paint(order[0], true);
      });
    },
    { scope: ref },
  );

  const go = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      window.location.href = `/${href}`;
      return;
    }
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(2, -10 * t) });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // The index maps the journey; other routes have no journey to map.
  if (pathname !== "/") return <span aria-hidden className="flex-1" />;

  return (
    <nav ref={ref} aria-label={nav.indexLabel} className="hidden items-center gap-1 px-2 md:flex">
      {stops.map((s) => (
        <button
          key={s.id}
          type="button"
          data-stop={s.id}
          aria-label={`Go to ${s.label}`}
          title={s.label}
          onClick={() => go(s.href)}
          className="group relative flex size-6 items-center justify-center rounded-full"
        >
          <span
            className={
              s.kind === "unlit"
                ? "block size-1.5 rounded-full border border-starlight bg-transparent opacity-25"
                : "block size-1.5 rounded-full bg-starlight opacity-25"
            }
          />
        </button>
      ))}
    </nav>
  );
}
