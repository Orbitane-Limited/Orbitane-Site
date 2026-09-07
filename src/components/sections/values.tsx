import { values } from "@/content/site";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Values (docs/02 §4.5): two typographic statements, near-empty. The core light
 * grows behind them (camera keyframe). Nothing else moves. The restraint is the design.
 */
export function Values() {
  return (
    <section
      id={values.id}
      data-camera="values"
      data-park="180"
      aria-label="Values"
      className="relative flex min-h-[100dvh] flex-col justify-center px-5 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-24 md:gap-40">
          {values.statements.map((s, i) => (
            <div key={s.headline} className={i === 1 ? "md:ml-auto md:max-w-3xl md:text-right" : "md:max-w-3xl"}>
              <SplitHeading
                className="text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-7xl"
                stagger={0.1}
              >
                {s.headline}
              </SplitHeading>
              <Reveal>
                <p className="mt-5 text-base leading-[1.6] text-starlight-2 md:text-lg">{s.line}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
