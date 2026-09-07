import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev indicator out of the telemetry readout's corner (docs/04 §3).
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
