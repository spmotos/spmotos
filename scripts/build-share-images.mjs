import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const BANNER = path.join(rootDir, "public/banner.webp");
/** Logo branco em fundo transparente: precisa do fundo escuro da marca para aparecer. */
const LOGO = path.join(rootDir, "public/logo-spmotos.webp");
const CHROME = "#0b0d0c";
const ACCENT = "#c6ff00";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const ogOverlaySvg = () =>
  Buffer.from(`<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${CHROME}" stop-opacity="0.94"/>
      <stop offset="0.6" stop-color="${CHROME}" stop-opacity="0.7"/>
      <stop offset="1" stop-color="${CHROME}" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <rect x="72" y="388" width="64" height="6" fill="${ACCENT}"/>
  <text x="72" y="452" font-family="Inter" font-weight="700" font-size="46" fill="#f4f4f4">Loja de motos seminovas</text>
  <text x="72" y="508" font-family="Inter" font-weight="700" font-size="46" fill="${ACCENT}">em Pelotas/RS</text>
  <text x="72" y="562" font-family="Inter" font-weight="500" font-size="26" fill="#a8a8a8">Financiamento · Consórcio · Negociação pelo WhatsApp</text>
</svg>`);

const buildOpenGraph = async () => {
  const output = path.join(rootDir, "app/opengraph-image.jpg");
  const logo = await sharp(LOGO).trim().resize({ width: 360 }).toBuffer();
  await sharp(BANNER)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
    .composite([
      { input: ogOverlaySvg(), top: 0, left: 0 },
      { input: logo, top: 72, left: 72 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(output);
  console.log(`Gerado: ${output} (${OG_WIDTH}×${OG_HEIGHT})`);
};

const buildIcon = async (size, fileName) => {
  const output = path.join(rootDir, "app", fileName);
  const logo = await sharp(LOGO)
    .trim()
    .resize({ width: Math.round(size * 0.8), height: Math.round(size * 0.8), fit: "inside" })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: CHROME } })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(output);
  console.log(`Gerado: ${output} (${size}×${size})`);
};

const run = async () => {
  await buildOpenGraph();
  await buildIcon(512, "icon.png");
  await buildIcon(180, "apple-icon.png");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
