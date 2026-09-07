import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
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
  const text = `${site.name}${approach.headline}`;
  const [bricolage, ring] = await Promise.all([
    loadFont("Bricolage+Grotesque:wght@600", text).catch(() => null),
    readFile(path.join(process.cwd(), "public/brand/ring-icon-640.png")).then((b) => `data:image/png;base64,${b.toString("base64")}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: "#0F0E0C",
          fontFamily: bricolage ? "Bricolage" : "sans-serif",
          color: "#F4F1EC",
        }}
      >
        {/* The Ring, glossy render, on the left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ring} width={470} height={470} alt="" style={{ position: "absolute", left: 60, top: 80 }} />

        {/* Faint orbit through the composition */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 200,
            width: 1100,
            height: 300,
            border: "2px solid rgba(244,241,236,0.12)",
            borderRadius: "50%",
            transform: "rotate(-14deg)",
          }}
        />

        <div style={{ position: "absolute", left: 560, top: 190, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.6, color: "#A8A39B" }}>{site.name}</div>
          <div style={{ fontSize: 88, fontWeight: 600, letterSpacing: -3.2, lineHeight: 0.95, maxWidth: 580 }}>
            {approach.headline}
          </div>
          <div style={{ fontSize: 26, color: "#A8A39B", maxWidth: 560, lineHeight: 1.35 }}>
            A product house building AI/ML products and native macOS software.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: bricolage ? [{ name: "Bricolage", data: bricolage, style: "normal", weight: 600 }] : undefined,
    },
  );
}
