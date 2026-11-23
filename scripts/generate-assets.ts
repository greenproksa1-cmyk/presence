/**
 * Generates the static brand assets from the source SVG and photography.
 * Run once (or whenever source images change): npm run assets:generate
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const p = (...parts: string[]) => path.join(root, ...parts);

async function resizeInto(file: string, width: number, quality = 82) {
  const input = p("public", "images", file);
  const source = await readFile(input);
  const buffer = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).jpeg({
    quality,
    mozjpeg: true,
    progressive: true,
  }).toBuffer();
  await writeFile(input, buffer);
  console.log(`  · ${file} → ${width}px, ${Math.round(buffer.length / 1024)}KB`);
}

async function main() {
  await mkdir(p("public", "brand"), { recursive: true });
  console.log("Optimising photography…");
  await resizeInto("hero.jpg", 1800, 84);
  await resizeInto("about.jpg", 1400, 82);
  await resizeInto("venue.jpg", 1600, 82);
  await resizeInto("food.jpg", 1200, 82);

  const markSvg = await readFile(p("public", "brand", "logo-mark.svg"));
  await sharp(markSvg, { density: 300 }).resize(512, 512).png().toFile(
    p("public", "brand", "logo-mark.png"),
  );
  console.log("  · logo-mark.png");

  const appleSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <rect width="180" height="180" rx="38" fill="#FBF8F2"/>
       <image href="data:image/svg+xml;base64,${markSvg.toString("base64")}" x="18" y="14" width="144" height="144"/>
     </svg>`,
  );
  await sharp(appleSvg).png().toFile(p("src", "app", "apple-icon.png"));
  console.log("  · apple-icon.png");

  // Open Graph card: navy identity panel + real catering photography.
  const overlay = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="600" height="630" fill="#16224A"/>
      <rect x="594" width="8" height="630" fill="#E1A63E"/>
      <text x="72" y="250" fill="#E1A63E" font-family="Segoe UI, Tahoma, Arial" font-size="19" font-weight="700" letter-spacing="3">MAKKAH FOOD CATERING</text>
      <text x="540" y="320" fill="#FFFFFF" font-family="Segoe UI, Tahoma, Arial" font-size="42" font-weight="700" text-anchor="start" direction="rtl">منتدى مكة الغذائي</text>
      <text x="540" y="376" fill="#FFFFFF" font-family="Segoe UI, Tahoma, Arial" font-size="42" font-weight="700" text-anchor="start" direction="rtl">للإعاشة والتموين</text>
      <text x="72" y="452" fill="#D9DEEA" font-family="Segoe UI, Tahoma, Arial" font-size="24">Makkah Food Catering &amp; Supply Forum</text>
      <rect x="72" y="502" width="336" height="56" rx="28" fill="#E1A63E"/>
      <text x="240" y="537" fill="#16224A" font-family="Segoe UI, Tahoma, Arial" font-size="20" font-weight="700" text-anchor="middle">10 JANUARY 2027 · MAKKAH</text>
      <text x="72" y="596" fill="#8E99B5" font-family="Segoe UI, Tahoma, Arial" font-size="16">HILTON CONFERENCE HALL · FREE ATTENDANCE</text>
    </svg>
  `);

  const photo = await sharp(p("public", "images", "hero.jpg"))
    .resize(600, 630, { fit: "cover", position: "attention" })
    .toBuffer();

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#16224A" },
  })
    .composite([
      { input: photo, left: 600, top: 0 },
      { input: overlay, left: 0, top: 0 },
      {
        input: await sharp(markSvg, { density: 300 }).resize(140, 140).png().toBuffer(),
        left: 72,
        top: 76,
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(p("public", "og.jpg"));
  console.log("  · og.jpg");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
