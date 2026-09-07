"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED, EASE, PRIORITY } from "@/lib/gsap";
import { telemetry, type ShippedBody } from "@/content/system";
import { getBodyState, nearestAngle, BODY_PEAK, BODY_REST, FLYBY_ANGLE } from "@/lib/camera";
import { MacWindow } from "@/components/moment/mac-window";
import { DownloadRow } from "@/components/moment/download-row";
import { CtaButton } from "@/components/motion/cta-button";

/**
 * Flyby (docs/02 §4.2, docs/04 §4.2): THE signature scene. The section pins for
 * three viewport-heights while the camera (system layer) zooms toward the body.
 * A local timeline, scrubbed by this section, runs the beats: arrival, the panel,
 * the working moment, departure. One generic component fed by the registry.
 */
export function Flyby({ body }: { body: ShippedBody }) {
  const ref = useRef<HTMLElement>(null);
  const { moment } = body;
  const total = parseFloat(moment.demo.size);
  const speedValue = parseFloat(moment.demo.speed);
  const speedUnit = moment.demo.speed.replace(/[\d.\s]/g, "");

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const state = getBodyState(body.id, body.orbit);
      const mm = gsap.matchMedia();

      mm.add(
        { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduce: REDUCED },
        (ctx) => {
          const { mobile, reduce } = ctx.conditions as { mobile: boolean; reduce: boolean };
          const panel = q("[data-panel]")[0];
          const lines = q("[data-line]");
          const copy = q("[data-copy]");
          const progress = q("[data-progress]")[0];
          const bytes = q("[data-bytes]")[0];
          const speed = q("[data-speed]")[0];
          const wifiOn = q('[data-wifi="on"]')[0];
          const wifiOff = q('[data-wifi="off"]')[0];
          const chip = (s: string) => q(`[data-chip="${s}"]`)[0];
          const window_ = q("[data-window]")[0];

          if (reduce) {
            // Static storyboard: the completed state with its caption (docs/04 §7).
            gsap.set([panel, lines, copy], { clearProps: "all" });
            gsap.set(progress, { scaleX: 1 });
            bytes.textContent = `${total.toFixed(1)} GB of ${moment.demo.size}`;
            speed.textContent = "Done";
            gsap.set(chip("downloading"), { autoAlpha: 0 });
            gsap.set(chip("completed"), { autoAlpha: 1 });
            return;
          }

          const peak = mobile ? BODY_PEAK.mobile : BODY_PEAK.desktop;
          const demo = { p: 0.62, speed: speedValue };
          const writeNumbers = () => {
            bytes.textContent = `${(demo.p * total).toFixed(1)} GB of ${moment.demo.size}`;
            speed.textContent = `${demo.speed.toFixed(1)} ${speedUnit}`;
          };

          gsap.set(lines, { yPercent: 115 });
          gsap.set(copy, { y: 32, autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // Pin for two viewport-heights (three in total with the section itself); 1.2 on mobile.
              end: () => `+=${Math.round(window.innerHeight * (mobile ? 1.2 : 2))}`,
              pin: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
              refreshPriority: PRIORITY.pin,
              // Capture: while pinned the body glides to its canonical angle and stops drifting,
              // so the composition (body left, core below it, panel right) is deterministic.
              onToggle: (self) => {
                if (self.isActive) {
                  state.drift = false;
                  gsap.to(state, {
                    angle: nearestAngle(state.angle, mobile ? FLYBY_ANGLE.mobile : FLYBY_ANGLE.desktop),
                    duration: 1.1,
                    ease: EASE.drift,
                    overwrite: "auto",
                  });
                } else {
                  gsap.killTweensOf(state, "angle");
                  state.drift = true;
                }
              },
            },
          });

          // 0.00–0.25 arrival: the body grows and lights; everything else dims (camera does the rest).
          tl.to(state, { scale: peak.scale, glow: peak.glow, duration: 0.22, ease: "power2.inOut" }, 0);

          // 0.20–0.40 the panel arrives.
          tl.to(lines, { yPercent: 0, duration: 0.16, stagger: 0.04, ease: "power3.out" }, 0.12);
          tl.to(copy, { y: 0, autoAlpha: 1, duration: 0.14, stagger: 0.03, ease: "power3.out" }, 0.18);

          // 0.35–0.85 the working moment (real lifecycle states: Downloading → Recovering → Downloading → Completed).
          tl.to(demo, { p: 0.71, duration: 0.12, onUpdate: writeNumbers }, 0.35);
          tl.to(demo, { speed: 0, duration: 0.04, onUpdate: writeNumbers }, 0.47);
          tl.to(wifiOn, { autoAlpha: 0, duration: 0.03 }, 0.47);
          tl.to(wifiOff, { autoAlpha: 1, duration: 0.03 }, 0.47);
          tl.to(chip("downloading"), { autoAlpha: 0, duration: 0.03 }, 0.48);
          tl.to(chip("recovering"), { autoAlpha: 1, duration: 0.03 }, 0.48);
          tl.to(progress, { scaleX: 0.71, duration: 0.01 }, 0.47); // holds; nothing lost
          tl.to(wifiOff, { autoAlpha: 0, duration: 0.03 }, 0.6);
          tl.to(wifiOn, { autoAlpha: 1, duration: 0.03 }, 0.6);
          tl.to(chip("recovering"), { autoAlpha: 0, duration: 0.03 }, 0.61);
          tl.to(chip("downloading"), { autoAlpha: 1, duration: 0.03 }, 0.61);
          tl.to(demo, { speed: speedValue, duration: 0.05, onUpdate: writeNumbers }, 0.61);
          tl.to(demo, { p: 1, duration: 0.16, onUpdate: writeNumbers }, 0.64);
          tl.to(chip("downloading"), { autoAlpha: 0, duration: 0.03 }, 0.8);
          tl.to(chip("completed"), { autoAlpha: 1, duration: 0.03 }, 0.8);
          tl.to(demo, { speed: 0, duration: 0.02, onUpdate: () => (speed.textContent = "Done") }, 0.8);
          tl.fromTo(window_, { scale: 1.01 }, { scale: 1, duration: 0.05, ease: "power2.out" }, 0.8);

          // The bar itself is driven by the byte counter so they can never disagree.
          tl.eventCallback("onUpdate", () => gsap.set(progress, { scaleX: demo.p }));

          // 0.85–1.00 departure: the panel drifts out; the body eases back as the camera pulls away.
          tl.to(panel, { x: 48, autoAlpha: 0, duration: 0.15, ease: "power2.in" }, 0.85);

          // The body returns to rest while the camera pulls back toward the next keyframe.
          const all = Array.from(document.querySelectorAll<HTMLElement>("[data-camera]"));
          const next = all[all.indexOf(section) + 1] ?? null;
          if (next) {
            gsap.to(state, {
              scale: BODY_REST.scale,
              glow: BODY_REST.glow,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top top",
                scrub: 1.2,
                invalidateOnRefresh: true,
                refreshPriority: PRIORITY.system,
              },
            });
          }
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id={body.id}
      data-camera="flyby"
      data-focus={body.id}
      data-telemetry={telemetry.flyby(body)}
      aria-labelledby={`${body.id}-heading`}
      className="relative grid min-h-[100dvh] grid-cols-1 items-end px-5 pt-24 pb-10 md:grid-cols-2 md:items-center md:px-8 md:pb-0"
    >
      {/* The body itself lives in the system layer; the camera puts it in this empty column. */}
      <div aria-hidden className="hidden md:block" />

      <div data-panel className="mx-auto w-full max-w-md md:mx-0 md:max-w-lg">
        <h2
          id={`${body.id}-heading`}
          className="text-[2rem] font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl"
        >
          <span className="block overflow-hidden">
            <span data-line className="block">
              {moment.headline[0]}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block" style={{ color: body.hue.light }}>
              {moment.headline[1]}
            </span>
          </span>
        </h2>

        <p data-copy className="mt-4 max-w-[46ch] text-sm leading-[1.6] text-starlight-2 md:mt-6 md:text-lg">
          {moment.line}
        </p>

        <div data-copy data-window className="mt-6 origin-center md:mt-8">
          <MacWindow title={body.name}>
            <DownloadRow
              file={moment.demo.file}
              size={moment.demo.size}
              speed={moment.demo.speed}
              progress={0.62}
              initial="downloading"
            />
          </MacWindow>
          <p className="mt-3 text-sm text-starlight-3">{moment.demo.caption}</p>
        </div>

        {body.href ? (
          <div data-copy className="mt-8">
            <CtaButton href={body.href} icon="external" variant="ghost">
              {moment.cta}
            </CtaButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
