import { howWeWork } from "@/content/site";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { Waypoints } from "@/components/motion/waypoints";

/**
 * How we work (docs/02 §4.4): the return begins. Process shown as four waypoints
 * on the way home. Horizontal rail on desktop, vertical on mobile. No icons per
 * step: the waypoints are the visual.
 */
export function HowWeWork() {
  return (
    <section
      id={howWeWork.id}
      data-camera="how-we-work"
      data-park="90"
      aria-labelledby="how-we-work-heading"
      className="relative px-5 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <SplitHeading
            id="how-we-work-heading"
            className="text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl"
          >
            {howWeWork.headline}
          </SplitHeading>
          <Reveal>
            <p className="mt-6 max-w-[52ch] text-base leading-[1.6] text-starlight-2 md:text-lg">{howWeWork.intro}</p>
          </Reveal>
        </div>

        <Waypoints steps={howWeWork.steps} className="mt-16 md:mt-24" />
      </div>
    </section>
  );
}
