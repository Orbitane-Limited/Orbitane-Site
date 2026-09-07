import { shippedBodies, inMotionBodies } from "@/content/system";
import { Approach } from "@/components/sections/approach";
import { Flyby } from "@/components/sections/flyby";
import { InMotion } from "@/components/sections/in-motion";
import { HowWeWork } from "@/components/sections/how-we-work";
import { Values } from "@/components/sections/values";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

/**
 * The journey (docs/02 §5): Approach → Flyby per shipped body → In motion →
 * How we work → Values → Contact → Footer.
 * Flybys are generated from the registry: shipping a product adds one here automatically.
 * `data-index` tells the orbit index which dots a section lights.
 */
export default function Home() {
  const shipped = shippedBodies();
  const unlitIds = inMotionBodies()
    .map((b) => b.id)
    .join(" ");
  return (
    <>
      <main className="relative z-10">
        <div data-index="approach">
          <Approach />
        </div>
        {shipped.map((body) => (
          <div key={body.id} data-index={body.id}>
            <Flyby body={body} />
          </div>
        ))}
        <div data-index={unlitIds}>
          <InMotion />
        </div>
        <div data-index="contact">
          <HowWeWork />
          <Values />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
