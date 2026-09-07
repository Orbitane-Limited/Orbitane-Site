import { approach } from "@/content/site";
import { telemetry } from "@/content/system";
import { CtaButton } from "@/components/motion/cta-button";
import { ScrollFade } from "@/components/motion/scroll-fade";

/**
 * Approach (docs/02 §4.1): the hero. Centred statement over the system at wide view.
 * Four text elements: headline, subtext, two CTAs, one telemetry line (rendered by the system).
 * The headline is static from first paint (it is the LCP element); the reveal is CSS-only around it (docs/05 §7).
 */
export function Approach() {
  return (
    <section
      id="approach"
      data-camera="approach"
      data-telemetry={telemetry.approach()}
      aria-labelledby="approach-heading"
      className="relative flex min-h-[100dvh] flex-col justify-center px-5 pt-24 pb-16 md:px-8"
    >
      <ScrollFade className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center md:mx-0 md:max-w-3xl md:text-left">
        <h1
          id="approach-heading"
          className="text-6xl font-semibold tracking-[-0.035em] leading-[0.95] md:text-8xl"
        >
          {approach.headline}
        </h1>
        <p
          className="hero-drift mx-auto mt-7 max-w-[46ch] text-base leading-[1.6] text-starlight-2 md:mx-0 md:mt-8 md:text-lg"
          style={{ "--delay": "0.7s" } as React.CSSProperties}
        >
          {approach.sub}
        </p>
        <div
          className="hero-drift mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          style={{ "--delay": "0.85s" } as React.CSSProperties}
        >
          <CtaButton href={approach.primary.href} icon="down" magnetic>
            {approach.primary.label}
          </CtaButton>
          <CtaButton href={approach.secondary.href} variant="ghost" icon="right">
            {approach.secondary.label}
          </CtaButton>
        </div>
        </div>
      </ScrollFade>
    </section>
  );
}
