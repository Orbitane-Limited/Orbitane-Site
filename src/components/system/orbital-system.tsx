"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger, NO_PREF, REDUCED, EASE, PRIORITY } from "@/lib/gsap";
import { system, shippedBodies, inMotionBodies, orbitCount, ORBIT } from "@/content/system";
import { keyframe, bodyPosition, getBodyState, BODY_PX, type CameraKey, type CameraState } from "@/lib/camera";

/** System units visible across the longer viewport axis at zoom 1 (docs/05 §4). */
const VIEW = 1200;

/**
 * The orbital system (docs/05 §4): one fixed SVG behind the content, moved by a
 * scroll-driven camera. Sections register keyframes via `data-camera` (and
 * `data-focus` for flybys); telemetry via `data-telemetry`. This component never
 * knows about sections by name; it reads the DOM once per route.
 */
export function OrbitalSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shipped = shippedBodies();
  const unlit = inMotionBodies();
  const orbits = Array.from({ length: orbitCount() }, (_, i) => i + 1);
  const litOrbitNumbers = new Set(shipped.map((b) => b.orbit));

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const svg = root.querySelector("svg");
      if (!svg) return;
      const cameraG = svg.querySelector<SVGGElement>("[data-camera-group]");
      const coreFx = svg.querySelector<SVGGElement>("[data-core-fx]");
      const coreG = svg.querySelector<SVGGElement>("[data-core]");
      const litOrbits = svg.querySelectorAll<SVGElement>('[data-orbit="lit"]');
      const unlitOrbits = svg.querySelectorAll<SVGElement>('[data-orbit="unlit"]');
      const bodyEls = Array.from(svg.querySelectorAll<SVGGElement>("[data-body]"));
      const unlitEls = Array.from(svg.querySelectorAll<SVGGElement>("[data-unlit-body]"));
      const readout = root.querySelector<HTMLElement>("[data-telemetry-readout]");
      if (!cameraG || !coreFx || !coreG || !readout) return;

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-camera]"));
      const firstKey = (sections[0]?.dataset.camera as CameraKey | undefined) ?? "approach";

      const mm = gsap.matchMedia();
      mm.add(
        { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduce: REDUCED, noPref: NO_PREF },
        (ctx) => {
          const { mobile, reduce } = ctx.conditions as { mobile: boolean; reduce: boolean };

          // Reduced motion: the whole page sits on the calm "page" keyframe (docs/04 §7).
          const cam: CameraState = {
            ...keyframe(reduce ? "page" : firstKey, mobile),
            focus: sections[0]?.dataset.focus ?? null,
          };
          const bodies = bodyEls.map((el) => ({
            el,
            id: el.dataset.body as string,
            orbit: Number(el.dataset.orbit),
            state: getBodyState(el.dataset.body as string, Number(el.dataset.orbit)),
            glowEl: el.querySelector<SVGElement>("[data-glow]"),
            notchEl: el.querySelector<SVGElement>("[data-notch]"),
          }));
          let notchBase = 0;
          bodies.forEach((b) => Object.assign(b.state, { scale: 1, glow: 0.3, drift: !reduce }));

          // Viewport → system-unit scale (preserveAspectRatio slice: the 2000-unit box covers the viewport).
          let w = window.innerWidth;
          let h = window.innerHeight;
          let upp = VIEW / Math.max(w, h);
          const size = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            upp = VIEW / Math.max(w, h);
            const s = BODY_PX.rest * upp;
            bodies.forEach((b) => {
              const img = b.el.querySelector("image");
              img?.setAttribute("width", String(s));
              img?.setAttribute("height", String(s));
              img?.setAttribute("x", String(-s / 2));
              img?.setAttribute("y", String(-s / 2));
              b.glowEl?.setAttribute("r", String(s * 1.8));
              notchBase = s * 0.6;
            });
            unlitEls.forEach((el) => el.querySelector("circle")?.setAttribute("r", String(6 * upp)));
          };
          size();

          let lastSection: HTMLElement | null = sections[0] ?? null;
          // Hover/focus on an unlit orbit (announced by the In-motion buttons) lifts its stroke and rim.
          const boost = new Map<number, { v: number }>();
          unlitOrbits.forEach((o) => boost.set(Number(o.dataset.orbitN), { v: 0 }));
          const onOrbitFocus = (e: Event) => {
            const { orbit, active, text } = (e as CustomEvent<{ orbit: number; active: boolean; text: string }>).detail;
            const b = boost.get(orbit);
            if (!b) return;
            gsap.to(b, { v: active ? 1 : 0, duration: reduce ? 0 : 0.4, ease: EASE.drift, overwrite: true });
            if (!reduce) {
              const bodyEl = unlitEls.find((el) => Number(el.dataset.orbit) === orbit);
              if (active && bodyEl) gsap.fromTo(bodyEl.firstElementChild, { scale: 1 }, { scale: 1.6, duration: 0.6, ease: EASE.settle, yoyo: true, repeat: 1, transformOrigin: "50% 50%" });
            }
            setReadout(active ? text : lastSection?.dataset.telemetry || null);
          };
          window.addEventListener("orbit-focus", onOrbitFocus);

          let last = gsap.ticker.time;
          const render = (time: number) => {
            // The one perpetual motion: bodies drift along their orbits unless a flyby holds them.
            const dt = Math.min(0.1, Math.max(0, time - last));
            last = time;
            bodies.forEach((b) => {
              if (b.state.drift) b.state.angle = (b.state.angle + (360 / b.state.period) * dt) % 360;
            });
            let cx = cam.x;
            let cy = cam.y;
            if (cam.focus && cam.focusWeight > 0) {
              const b = bodies.find((x) => x.id === cam.focus);
              if (b) {
                const p = bodyPosition(b.orbit, b.state.angle);
                const ox = (cam.fx * w * upp) / cam.zoom;
                const oy = (cam.fy * h * upp) / cam.zoom;
                cx = gsap.utils.interpolate(cam.x, p.x + ox, cam.focusWeight);
                cy = gsap.utils.interpolate(cam.y, p.y + oy, cam.focusWeight);
              }
            }
            cameraG.setAttribute("transform", `translate(${-cx * cam.zoom} ${-cy * cam.zoom}) scale(${cam.zoom})`);
            coreG.setAttribute("transform", `scale(${cam.core})`);
            coreG.style.opacity = String(cam.coreOpacity);
            litOrbits.forEach((o) => (o.style.strokeOpacity = String(cam.lit)));
            unlitOrbits.forEach((o) => {
              const b = boost.get(Number(o.dataset.orbitN))?.v ?? 0;
              o.style.strokeOpacity = String(Math.max(cam.unlit, gsap.utils.interpolate(cam.unlit, 0.6, b)));
            });
            const unlitVis = gsap.utils.clamp(0, 1, (cam.unlit - 0.1) / 0.2);
            unlitEls.forEach((el) => {
              const b = boost.get(Number(el.dataset.orbit))?.v ?? 0;
              el.style.opacity = String(Math.max(unlitVis, b));
            });
            bodies.forEach((b) => {
              const p = bodyPosition(b.orbit, b.state.angle);
              b.el.setAttribute("transform", `translate(${p.x} ${p.y}) scale(${b.state.scale})`);
              if (b.glowEl) b.glowEl.style.opacity = String(b.state.glow);
              // The gap in the orbit line stays the same size on screen while the body grows.
              b.notchEl?.setAttribute("r", String(notchBase / b.state.scale));
            });
          };
          render(gsap.ticker.time);
          gsap.ticker.add(render);
          ScrollTrigger.addEventListener("refresh", size);

          // Telemetry readout: crossfades as sections cross the viewport centre (docs/04 §3).
          let current: string | null = null;
          const setReadout = (text: string | null) => {
            if (text === current) return;
            current = text;
            if (reduce) {
              readout.textContent = text ?? "";
              gsap.set(readout, { autoAlpha: text ? 1 : 0 });
              return;
            }
            const hidden = Number(gsap.getProperty(readout, "opacity")) < 0.05;
            if (hidden) {
              // Already faded out (or never shown): write and fade in directly, no dead frame.
              if (!text) return;
              readout.textContent = text;
              gsap.to(readout, { autoAlpha: 1, duration: 0.3, overwrite: true });
              return;
            }
            gsap.to(readout, {
              autoAlpha: 0,
              duration: 0.3,
              overwrite: true,
              onComplete: () => {
                if (!text) return;
                readout.textContent = text;
                gsap.to(readout, { autoAlpha: 1, duration: 0.3 });
              },
            });
          };
          sections.forEach((sec) => {
            ScrollTrigger.create({
              trigger: sec,
              start: "top 50%",
              end: "bottom 50%",
              refreshPriority: PRIORITY.system,
              onToggle: (self) => {
                if (self.isActive) {
                  lastSection = sec;
                  setReadout(sec.dataset.telemetry || null);
                }
              },
            });
          });
          // The readout yields to the footer (it is fixed and would sit over the footer's text).
          const footer = document.querySelector<HTMLElement>("footer");
          if (footer) {
            ScrollTrigger.create({
              trigger: footer,
              start: "top 85%",
              end: "bottom -200%",
              refreshPriority: PRIORITY.system,
              onEnter: () => setReadout(null),
              onLeaveBack: () => setReadout(lastSection?.dataset.telemetry || null),
            });
          }

          // Camera keyframes between consecutive sections (docs/04 §2).
          const cameraTweens: gsap.core.Tween[] = [];
          if (!reduce) {
            sections.forEach((sec, i) => {
              if (i === 0) return;
              const prev = sections[i - 1];
              const from = keyframe(prev.dataset.camera as CameraKey, mobile);
              const to = keyframe(sec.dataset.camera as CameraKey, mobile);
              const focusId = sec.dataset.focus ?? prev.dataset.focus ?? null;
              cameraTweens.push(gsap.fromTo(cam, from, {
                ...to,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: sec,
                  start: "top bottom",
                  end: "top top",
                  scrub: 1.2,
                  invalidateOnRefresh: true,
                  refreshPriority: PRIORITY.system,
                  onToggle: (self) => {
                    if (self.isActive) cam.focus = focusId;
                  },
                },
              }));
            });
          }

          // After any refresh (fonts, load, resize, or positions first measured before the stylesheet
          // applied), render exactly the camera segment the scroll position is in. The tweens share one
          // camera object, so only the active or most recently passed segment may write to it.
          const syncCamera = () => {
            if (!cameraTweens.length) return;
            const y = window.scrollY;
            let current: gsap.core.Tween | null = null;
            for (const tw of cameraTweens) {
              const st = tw.scrollTrigger;
              if (st && st.start <= y) current = tw;
            }
            if (current?.scrollTrigger) {
              current.progress(current.scrollTrigger.progress);
              const idx = cameraTweens.indexOf(current);
              const focusSec = sections[idx + 1];
              cam.focus = focusSec?.dataset.focus ?? sections[idx]?.dataset.focus ?? null;
            } else {
              cameraTweens[0].progress(0);
              cam.focus = sections[0]?.dataset.focus ?? null;
            }
          };
          ScrollTrigger.addEventListener("refresh", syncCamera);

          // Load sequence (docs/04 §4.1): the core comes into focus, orbits draw, bodies appear.
          if (!reduce) {
            gsap.set(coreFx, { opacity: 0, scale: 1.3, svgOrigin: "0 0", filter: "blur(40px)" });
            gsap.set(litOrbits, { drawSVG: "0%" });
            gsap.set(unlitOrbits, { opacity: 0 });
            gsap.set(bodyEls, { opacity: 0 });
            gsap.set(unlitEls, { opacity: 0 });
            const intro = gsap.timeline({ defaults: { ease: EASE.drift } });
            intro
              .to(coreFx, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 }, 0)
              .to(litOrbits, { drawSVG: "100%", duration: 1.1, stagger: 0.12 }, 0.2)
              .to(unlitOrbits, { opacity: 1, duration: 0.9, stagger: 0.12 }, 0.5)
              .to(bodyEls, { opacity: 1, duration: 0.6 }, 0.9)
              .call(() => setReadout(sections[0]?.dataset.telemetry || null), [], 0.9);
          } else {
            gsap.set(coreFx, { opacity: 1 });
            setReadout(sections[0]?.dataset.telemetry || null);
          }

          return () => {
            gsap.ticker.remove(render);
            ScrollTrigger.removeEventListener("refresh", size);
            ScrollTrigger.removeEventListener("refresh", syncCamera);
            window.removeEventListener("orbit-focus", onOrbitFocus);
          };
        },
      );
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <>
      <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <svg
          className="h-full w-full"
          viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Light, not paint: a bright small centre with a steep falloff, so the halo never turns
                into a grey-beige wash over copy (founder review, 2026-09-07). */}
            <radialGradient id="core-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--core-light)" stopOpacity="1" />
              <stop offset="9%" stopColor="var(--core-light)" stopOpacity="0.9" />
              <stop offset="18%" stopColor="var(--core-light)" stopOpacity="0.38" />
              <stop offset="32%" stopColor="var(--core-light)" stopOpacity="0.1" />
              <stop offset="55%" stopColor="var(--core-light)" stopOpacity="0.025" />
              <stop offset="100%" stopColor="var(--core-light)" stopOpacity="0" />
            </radialGradient>
            {shipped.map((b) => (
              <radialGradient key={b.id} id={`glow-${b.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={b.hue.base} stopOpacity="0.55" />
                <stop offset="35%" stopColor={b.hue.base} stopOpacity="0.14" />
                <stop offset="100%" stopColor={b.hue.base} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          <g data-camera-group>
            <g data-orbits>
              {orbits.map((n) => {
                const lit = litOrbitNumbers.has(n);
                const r = ORBIT.radius(n);
                return (
                  <ellipse
                    key={n}
                    data-orbit={lit ? "lit" : "unlit"}
                    data-orbit-n={n}
                    rx={r}
                    ry={r * ORBIT.ratio}
                    transform={`rotate(${ORBIT.tilt})`}
                    className="fill-none stroke-starlight"
                    strokeWidth={1.25}
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={lit ? undefined : "6 10"}
                    style={{ strokeOpacity: lit ? 0.55 : 0.14 }}
                  />
                );
              })}
            </g>

            <g data-core-fx>
              <g data-core>
                <circle r={150} fill="url(#core-light)" />
                <circle r={22} fill="var(--core-light)" style={{ filter: "blur(10px)" }} opacity={0.75} />
                <circle r={17} fill="var(--core-light)" />
              </g>
            </g>

            {unlit.map((b) => {
              const p = bodyPosition(b.orbit, ORBIT.restAngle(b.orbit));
              return (
                <g key={b.id} data-unlit-body data-orbit={b.orbit} transform={`translate(${p.x} ${p.y})`}>
                  <circle r={8} fill="var(--void)" stroke="var(--starlight)" strokeOpacity={0.35} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                </g>
              );
            })}

            {shipped.map((b) => (
              <g key={b.id} data-body={b.id} data-orbit={b.orbit}>
                <circle data-glow r={60} fill={`url(#glow-${b.id})`} style={{ opacity: 0.3 }} />
                {/* Notch: the orbit line breaks around the body, so it sits in the orbit, not on it. */}
                <circle data-notch r={28} fill="var(--void)" />
                <image href={b.icon} x={-20} y={-20} width={40} height={40} />
              </g>
            ))}
          </g>
        </svg>

        <p data-telemetry-readout className="telemetry invisible fixed bottom-3 left-5 right-5 truncate text-[9px] tracking-[0.06em] text-starlight-3 md:bottom-6 md:left-8 md:right-auto md:text-xs md:tracking-[0.08em]" />
      </div>

      <p className="sr-only">
        {system.core.name}&apos;s system: {shipped.map((b) => b.name).join(", ")} in orbit
        {unlit.length > 0 ? ", more products in development" : ""}.
      </p>
    </>
  );
}
