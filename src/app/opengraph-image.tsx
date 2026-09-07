import { ImageResponse } from "next/og";
import { site, approach } from "@/content/site";

export const alt = `${site.name} · ${approach.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Google Fonts served as TTF for Satori (docs/05 §11: OG rendered from the same tokens). */
async function loadFont(family: string, text: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("font not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function OpenGraphImage() {
  const text = `${site.name}${approach.headline}Products in motion.`;
  const bricolage = await loadFont("Bricolage+Grotesque:wght@600", text).catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0F0E0C",
          fontFamily: bricolage ? "Bricolage" : "sans-serif",
          color: "#F4F1EC",
        }}
      >
        {/* Orbits */}
        <div
          style={{
            position: "absolute",
            left: 600 - 420,
            top: 380 - 176,
            width: 840,
            height: 352,
            border: "2px solid rgba(244,241,236,0.16)",
            borderRadius: "50%",
            transform: "rotate(-14deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 600 - 300,
            top: 380 - 126,
            width: 600,
            height: 252,
            border: "2px solid rgba(244,241,236,0.5)",
            borderRadius: "50%",
            transform: "rotate(-14deg)",
          }}
        />
        {/* Core light */}
        <div
          style={{
            position: "absolute",
            left: 600 - 190,
            top: 380 - 190,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,248,242,1) 0%, rgba(251,248,242,0.9) 9%, rgba(251,248,242,0.3) 20%, rgba(251,248,242,0.06) 40%, rgba(251,248,242,0) 70%)",
          }}
        />
        {/* Hemta body */}
        <div
          style={{
            position: "absolute",
            left: 318,
            top: 392,
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #4A6BFF, #1A37BE)",
            boxShadow: "0 0 80px 30px rgba(33,68,223,0.35)",
          }}
        />
        {/* Wordmark */}
        <div style={{ position: "absolute", left: 72, top: 64, display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600, letterSpacing: -0.6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#FBF8F2" }} />
          {site.name}
        </div>
        {/* Headline */}
        <div style={{ position: "absolute", left: 72, bottom: 64, fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 0.95 }}>
          {approach.headline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: bricolage ? [{ name: "Bricolage", data: bricolage, style: "normal", weight: 600 }] : undefined,
    },
  );
}
