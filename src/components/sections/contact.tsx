import { contact } from "@/content/site";
import { telemetry } from "@/content/system";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { CtaButton } from "@/components/motion/cta-button";

/**
 * Contact (docs/02 §4.6): return complete. A centred closer inside the core's light.
 * The email pill renders only when a real address exists (dependency: founder).
 */
export function Contact() {
  return (
    <section
      id={contact.id}
      data-camera="contact"
      data-park="0"
      data-telemetry={telemetry.returnComplete()}
      aria-labelledby="contact-heading"
      className="relative flex min-h-[65dvh] flex-col items-center justify-center px-5 pt-28 pb-24 text-center md:px-8 md:pt-32"
    >
      <div className="max-w-4xl">
        <SplitHeading
          id="contact-heading"
          className="text-5xl font-semibold tracking-[-0.035em] leading-[0.95] md:text-8xl"
        >
          {contact.headline}
        </SplitHeading>
        <Reveal>
          <p className="mx-auto mt-7 max-w-[40ch] text-base leading-[1.6] text-starlight-2 md:text-lg">{contact.line}</p>
        </Reveal>
        {contact.email ? (
          <Reveal className="mt-10 flex justify-center">
            <CtaButton href={`mailto:${contact.email}`} icon="right" magnetic>
              {contact.cta}
            </CtaButton>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
