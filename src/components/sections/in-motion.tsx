import { inMotion } from "@/content/site";
import { inMotionBodies } from "@/content/system";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { OrbitProbe } from "@/components/system/orbit-probe";

/**
 * Orbits in motion (docs/02 §4.3): the camera pulls back, unlit orbits brighten.
 * One typographic statement, honest by construction. Each unlit orbit has a
 * telemetry probe: hover or focus lights it in the system and shows its readout.
 */
export function InMotion() {
  const unlit = inMotionBodies();
  return (
    <section
      id={inMotion.id}
      data-camera="in-motion"
      aria-labelledby="in-motion-heading"
      className="relative flex min-h-[100dvh] items-center px-5 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <SplitHeading
            id="in-motion-heading"
            className="text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl"
          >
            {inMotion.headline}
          </SplitHeading>
          <Reveal>
            <p className="mt-6 max-w-[46ch] text-base leading-[1.6] text-starlight-2 md:text-lg">{inMotion.body}</p>
          </Reveal>
          {unlit.length > 0 ? (
            <Reveal className="mt-8 flex flex-wrap gap-2" stagger>
              {unlit.map((b) => (
                <OrbitProbe key={b.id} body={b} />
              ))}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
