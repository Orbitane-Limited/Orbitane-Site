"use client";

import { telemetry, type InMotionBody } from "@/content/system";

/**
 * The visible, accessible handle for an unlit orbit (docs/02 §4.3): a telemetry
 * pill. Hover or focus announces itself to the system layer, which lifts that
 * orbit's stroke, pulses its body and shows the readout. Nothing to click yet;
 * the restraint is the message.
 */
export function OrbitProbe({ body }: { body: InMotionBody }) {
  const text = telemetry.inMotion(body);
  const announce = (active: boolean) =>
    window.dispatchEvent(new CustomEvent("orbit-focus", { detail: { orbit: body.orbit, active, text } }));

  return (
    <button
      type="button"
      aria-label={`Orbit ${body.orbit}, a product in development, unannounced`}
      onMouseEnter={() => announce(true)}
      onMouseLeave={() => announce(false)}
      onFocus={() => announce(true)}
      onBlur={() => announce(false)}
      className="telemetry inline-flex h-9 items-center gap-2 rounded-full border border-hairline px-4 text-starlight-3 transition-colors duration-500 ease-[var(--ease-drift)] hover:border-starlight/30 hover:text-starlight focus-visible:text-starlight"
    >
      <span aria-hidden className="size-1.5 rounded-full border border-current" />
      {text}
    </button>
  );
}
