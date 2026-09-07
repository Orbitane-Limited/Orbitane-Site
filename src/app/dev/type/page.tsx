import { notFound } from "next/navigation";
import { Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";

/**
 * Type specimen (docs/05 §10, step 2). Development only: the founder judges
 * Bricolage Grotesque (recommended) against the flagged alternate, Instrument Sans,
 * from real rendering on the real tokens before any section is built.
 */

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = { title: "Type specimen · Orbitane", robots: { index: false } };

const SWATCHES: { name: string; className: string; note: string }[] = [
  { name: "void", className: "bg-void", note: "#0F0E0C page" },
  { name: "surface", className: "bg-surface", note: "#171512 panels" },
  { name: "surface-2", className: "bg-surface-2", note: "#1F1C18 raised" },
  { name: "starlight", className: "bg-starlight", note: "#F2ECE2 text, CTAs" },
  { name: "starlight-2", className: "bg-starlight-2", note: "#A69F93 body" },
  { name: "starlight-3", className: "bg-starlight-3", note: "#6F6960 captions" },
  { name: "core-light", className: "bg-core-light", note: "#FFF3E0 the core" },
  { name: "body-hemta", className: "bg-body-hemta", note: "#2144DF Orbit 01" },
  { name: "body-hemta-light", className: "bg-body-hemta-light", note: "#7A8FFF on dark" },
];

function Specimen({ label, fontClass, note }: { label: string; fontClass?: string; note: string }) {
  return (
    <section className={fontClass} style={fontClass ? { fontFamily: "var(--font-instrument)" } : undefined}>
      <div className="mb-8 flex items-baseline justify-between border-b border-hairline pb-3">
        <span className="telemetry text-starlight">{label}</span>
        <span className="telemetry text-starlight-3">{note}</span>
      </div>

      <p className="telemetry mb-6 text-starlight-3">Display · 96px · 600 · -0.035em · 0.95</p>
      <h1 className="text-6xl font-semibold tracking-[-0.035em] leading-[0.95] md:text-8xl">Products in motion.</h1>

      <p className="telemetry mt-16 mb-6 text-starlight-3">H2 · 60px · 600 · -0.03em · 1.0</p>
      <h2 className="text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl">More bodies in motion.</h2>

      <p className="telemetry mt-16 mb-6 text-starlight-3">Two-tone H2 · flyby headline · second line in the body&apos;s light hue</p>
      <h2 className="text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl">
        Downloads that finish.
        <br />
        <span className="text-body-hemta-light">Through drops, sleep and restarts.</span>
      </h2>

      <p className="telemetry mt-16 mb-6 text-starlight-3">H3 · 24px · 500 · -0.01em</p>
      <h3 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">Your problem becomes ours.</h3>

      <p className="telemetry mt-16 mb-6 text-starlight-3">Body · 18px · 400 · 1.6 · 60ch · starlight-2</p>
      <p className="max-w-[60ch] text-base leading-[1.6] text-starlight-2 md:text-lg">
        Orbitane is a product house building AI/ML products and native macOS software. Clients hand us a problem. From
        that moment it is ours until it is solved. We build section by section, verified in a real browser, and we stay
        until it works without us.
      </p>

      <p className="telemetry mt-16 mb-6 text-starlight-3">Small print · 14px · starlight-3</p>
      <p className="text-sm text-starlight-3">New products are in development. We name them when they ship.</p>
    </section>
  );
}

export default function TypeSpecimen() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className={`${instrument.variable} mx-auto max-w-5xl px-6 py-24 md:px-8`}>
      <header className="mb-20">
        <p className="telemetry text-starlight-3">Orbitane · type specimen · development only</p>
        <p className="mt-4 max-w-[60ch] text-starlight-2">
          Two candidates on the real tokens. The recommendation is Bricolage Grotesque (docs/03 §3); Instrument Sans is
          the flagged alternate. Telemetry in both is Martian Mono.
        </p>
      </header>

      <section className="mb-24">
        <p className="telemetry mb-6 text-starlight-3">Tokens · docs/03 §2</p>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-9">
          {SWATCHES.map((s) => (
            <div key={s.name}>
              <div className={`h-16 rounded-[var(--radius-panel)] border border-hairline ${s.className}`} />
              <p className="telemetry mt-2 text-starlight">{s.name}</p>
              <p className="mt-0.5 text-xs text-starlight-3">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <p className="telemetry mb-6 text-starlight-3">Telemetry · Martian Mono 500 · 11/12px · uppercase · 0.08em</p>
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          <span className="telemetry text-starlight">ORBITANE · 1 BODY IN ORBIT · MORE IN MOTION</span>
          <span className="telemetry text-starlight">ORBIT 01 · HEMTA · NATIVE MACOS · SHIPPED</span>
          <span className="telemetry text-starlight-3">ORBIT 02 · IN MOTION · UNANNOUNCED</span>
          <span className="font-mono text-sm tabular-nums text-starlight-2">8.4 GB of 12.4 GB · 34.2 MB/s</span>
        </div>
      </section>

      <div className="grid gap-24">
        <Specimen label="A · Bricolage Grotesque" note="recommended · variable · optical sizes" />
        <Specimen label="B · Instrument Sans" note="alternate · cleaner · less memorable" fontClass="alt" />
      </div>
    </main>
  );
}
