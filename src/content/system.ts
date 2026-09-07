/**
 * The product registry (docs/05 §5). Everything about the orbital system is
 * derived from this file: how many orbits exist, which bodies are lit, the
 * flyby sections, the orbit index and every telemetry string.
 *
 * Honesty by construction: a body that is "in-motion" has no name, hue, icon,
 * link or copy. Those fields are absent, not placeholders.
 */

export type BodyStatus = "shipped" | "in-motion";

export type FlybyMoment = {
  /** Two-tone headline: first line in starlight, second in the body's light hue. */
  headline: [string, string];
  line: string;
  cta: string;
  /** Demo data for the working moment. Illustrative values, never claims. */
  demo: {
    file: string;
    size: string;
    speed: string;
    caption: string;
  };
};

export type ShippedBody = {
  id: string;
  status: "shipped";
  orbit: number;
  name: string;
  kind: string;
  /** Telemetry tags shown after the name, e.g. "NATIVE MACOS". */
  tags: string[];
  hue: { base: string; light: string };
  icon: string;
  /** Product site. When absent the flyby renders without its CTA (dependency: founder). */
  href?: string;
  moment: FlybyMoment;
};

export type InMotionBody = {
  id: string;
  status: "in-motion";
  orbit: number;
};

export type Body = ShippedBody | InMotionBody;

export const system = {
  core: {
    name: "Orbitane",
    line: "A product house building AI/ML products and native macOS software.",
  },
  bodies: [
    {
      id: "hemta",
      status: "shipped",
      orbit: 1,
      name: "Hemta",
      kind: "Native Mac download manager",
      tags: ["NATIVE MACOS", "SHIPPED"],
      hue: { base: "#2144DF", light: "#7A8FFF" },
      icon: "/bodies/hemta.png",
      href: "https://hemta-site.vercel.app/",
      moment: {
        headline: ["Downloads that finish.", "Through drops, sleep and restarts."],
        line:
          "A native Mac download manager that captures downloads from your browser, accelerates them, and recovers them from wherever they stopped.",
        cta: "Visit Hemta",
        demo: {
          file: "Field-Recordings-2024.zip",
          size: "12.4 GB",
          speed: "34.2 MB/s",
          caption: "Downloads that survive interruptions.",
        },
      },
    },
    { id: "orbit-2", status: "in-motion", orbit: 2 },
    { id: "orbit-3", status: "in-motion", orbit: 3 },
  ] as Body[],
} as const;

export const shippedBodies = (): ShippedBody[] =>
  system.bodies.filter((b): b is ShippedBody => b.status === "shipped").sort((a, b) => a.orbit - b.orbit);

export const inMotionBodies = (): InMotionBody[] =>
  system.bodies.filter((b): b is InMotionBody => b.status === "in-motion").sort((a, b) => a.orbit - b.orbit);

export const orbitCount = () => Math.max(...system.bodies.map((b) => b.orbit));

/** Telemetry strings, always derived so they stay true (docs/04 §3). */
export const telemetry = {
  approach: () => {
    const lit = shippedBodies().length;
    const bodies = `${lit} ${lit === 1 ? "BODY" : "BODIES"} IN ORBIT`;
    const more = inMotionBodies().length > 0 ? " · MORE IN MOTION" : "";
    return `ORBITANE · ${bodies}${more}`;
  },
  flyby: (b: ShippedBody) => [`ORBIT ${pad(b.orbit)}`, b.name.toUpperCase(), ...b.tags].join(" · "),
  inMotion: (b: InMotionBody) => `ORBIT ${pad(b.orbit)} · IN MOTION · UNANNOUNCED`,
  returnComplete: () => "RETURN COMPLETE",
};

export const pad = (n: number) => String(n).padStart(2, "0");

/** Orbit geometry in system units (viewBox -1000 -1000 2000 2000). */
export const ORBIT = {
  tilt: -14,
  ratio: 0.42,
  /** Radius of orbit n along its major axis. */
  radius: (n: number) => 260 + (n - 1) * 140,
  /** Where a body rests on its orbit, in degrees (spread so bodies never overlap). */
  restAngle: (n: number) => [200, 20, 300, 120, 240, 60][(n - 1) % 6],
};
