// Brand asset pipeline (docs/03 §5). Source: public/brand/ring-icon.png (the glossy ring render).
// Produces: ring-core.webp (ring + glow cut out by luminance, for the system's core),
// orbitane-icon-1024.png (social avatar), ring-icon-640.png (OG), src/app/apple-icon.png (180).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/brand/ring-icon.png";
const img = sharp(SRC);
const { width, height } = await img.metadata();

// 1. Find the ring's bounding box: bright pixels only (ignores the faint squircle rim).
const { data, info } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
// The squircle's bevel is bright too, so only search the central region where the torus lives.
const x0 = Math.round(info.width * 0.2), x1 = Math.round(info.width * 0.8);
const y0 = Math.round(info.height * 0.2), y1 = Math.round(info.height * 0.8);
for (let y = y0; y < y1; y++) {
  for (let x = x0; x < x1; x++) {
    if (data[y * info.width + x] > 215) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}
const pad = Math.round((maxX - minX) * 0.2);
// Clamp the crop inside the squircle so its bright bevel never enters the cutout.
const inner = { left: Math.round(width * 0.17), top: Math.round(height * 0.17), right: Math.round(width * 0.83), bottom: Math.round(height * 0.83) };
const left = Math.max(inner.left, minX - pad), top = Math.max(inner.top, minY - pad);
const right = Math.min(inner.right, maxX + pad), bottom = Math.min(inner.bottom, maxY + pad);
const region = { left, top, width: right - left, height: bottom - top };
console.log("ring bbox", { minX, minY, maxX, maxY }, "crop", region);

// 2. Alpha from luminance: the near-black squircle becomes transparent, the ring stays opaque,
//    the warm glow becomes translucent. Curve: lum 10 → 0, lum 110 → 255.
const rgb = await img.clone().extract(region).removeAlpha().toBuffer();
const alpha = await sharp(rgb).greyscale().linear(255 / 100, (-10 * 255) / 100).toBuffer();
await mkdir("public/brand", { recursive: true });
// Soft elliptical edge fade on the alpha so the cutout can never show a rectangle.
const vignette = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${region.width}" height="${region.height}">
     <defs><radialGradient id="g"><stop offset="62%" stop-color="#fff"/><stop offset="100%" stop-color="#000"/></radialGradient></defs>
     <rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const fade = await sharp(vignette).greyscale().toBuffer();
const alphaFaded = await sharp(alpha).composite([{ input: fade, blend: "multiply" }]).toBuffer();
await sharp(rgb).joinChannel(alphaFaded).resize({ width: 900 }).webp({ quality: 90, alphaQuality: 90 }).toFile("public/brand/ring-core.webp");

// 3. Icon sizes from the full render.
await img.clone().resize(1024, 1024).png({ compressionLevel: 9 }).toFile("public/brand/orbitane-icon-1024.png");
await img.clone().resize(640, 640).png({ compressionLevel: 9 }).toFile("public/brand/ring-icon-640.png");
await img.clone().resize(180, 180).png({ compressionLevel: 9 }).toFile("src/app/apple-icon.png");
const out = await sharp("public/brand/ring-core.webp").metadata();
console.log("ring-core.webp", out.width, "x", out.height, "alpha:", out.hasAlpha);
