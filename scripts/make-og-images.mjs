#!/usr/bin/env node
/**
 * Share visuals (og:image / twitter:image) — desk rule « crédit photo en liséré ».
 * For every cover with a credit (src/lib/cover-credits.json + public/covers/{id}.jpg):
 *   public/og/{id}.jpg — 1200×630, the story's own photo, the SAME credit line as the site
 *   (coverCreditLine(id, "full") from src/lib/covers.ts) burned into a dark semi-transparent
 *   band on the bottom edge, small YES IT'S REAL logo top-left.
 * src/lib/og-images.json = { id: hash } (hash of photo bytes + credit + template) → the article
 * head only points at /og/{id}.jpg?v=hash when the file exists, and a new photo/credit busts
 * social caches. Unchanged entries are skipped; entries whose cover disappeared are pruned.
 */
import { createHash } from "node:crypto";
import { readFile, readdir, stat, unlink, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { createJiti } from "jiti";

const ROOT = join(import.meta.dirname, "..");
const COVERS = join(ROOT, "public/covers");
const OUT = join(ROOT, "public/og");
const MANIFEST = join(ROOT, "src/lib/og-images.json");
const FONT = join(ROOT, "scripts/fonts/Inter.ttf");
const LOGO = join(ROOT, "public/brand/logo-box.jpg");
const W = 1200;
const H = 630;
const BAND = 50; // X crops 2:1 cards ~15px top/bottom: text sits in the band's upper part
const TEMPLATE = "og-v1";
const POOL = 4;

const jiti = createJiti(import.meta.url, { interopDefault: true });
const covers = await jiti.import(join(ROOT, "src/lib/covers.ts"));
const { PHOTO_CREDITS, coverCreditLine } = covers;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function creditText(line) {
  // Shrink until it fits the band (max width W - 40).
  for (let size = 22; size >= 14; size--) {
    const buf = await sharp({
      text: {
        text: `<span foreground="#ffffff" font_weight="500">${esc(line)}</span>`,
        font: `Inter ${size}px`,
        fontfile: FONT,
        rgba: true,
        dpi: 72,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true });
    if (buf.info.width <= W - 40 || size === 14) return buf;
  }
}

let logoBuf;
async function logo() {
  if (!logoBuf) logoBuf = await sharp(LOGO).resize({ width: 190 }).png().toBuffer({ resolveWithObject: true });
  return logoBuf;
}

async function render(id, line) {
  const src = join(COVERS, `${id}.jpg`);
  const photo = await sharp(src).rotate().resize(W, H, { fit: "cover", position: "centre" }).toBuffer();
  const band = await sharp({
    create: { width: W, height: BAND, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.62 } },
  })
    .png()
    .toBuffer();
  const text = await creditText(line);
  const lg = await logo();
  const textTop = H - BAND + Math.max(4, Math.round((BAND - 15 - text.info.height) / 2));
  await sharp(photo)
    .composite([
      { input: band, left: 0, top: H - BAND },
      { input: text.data, left: W - 20 - text.info.width, top: textTop },
      { input: lg.data, left: 24, top: 24 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(OUT, `${id}.jpg`));
}

async function mapPool(items, n, fn) {
  for (let i = 0; i < items.length; i += n) await Promise.all(items.slice(i, i + n).map(fn));
}

await mkdir(OUT, { recursive: true });
const prev = (await exists(MANIFEST)) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
const next = {};
const force = process.argv.includes("--force");
const fontHash = createHash("sha1").update(await readFile(FONT)).update(await readFile(LOGO)).digest("hex");
const ids = Object.keys(PHOTO_CREDITS).sort();
let wrote = 0;
let missing = 0;
const t0 = Date.now();

await mapPool(ids, POOL, async (id) => {
  const src = join(COVERS, `${id}.jpg`);
  if (!(await exists(src))) {
    missing++;
    return;
  }
  const line = coverCreditLine(id, "full");
  if (!line) return;
  const hash = createHash("sha1")
    .update(TEMPLATE)
    .update(fontHash)
    .update(line)
    .update(await readFile(src))
    .digest("hex")
    .slice(0, 10);
  if (!force && prev[id] === hash && (await exists(join(OUT, `${id}.jpg`)))) {
    next[id] = hash;
    return;
  }
  await render(id, line);
  next[id] = hash;
  wrote++;
});

// Prune share images whose cover/credit is gone.
let pruned = 0;
for (const f of await readdir(OUT)) {
  const id = f.replace(/\.jpg$/i, "");
  if (f.endsWith(".jpg") && !next[id]) {
    await unlink(join(OUT, f));
    pruned++;
  }
}

const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
const body = `${JSON.stringify(sorted, null, 2)}\n`;
if (JSON.stringify(sorted) !== JSON.stringify(prev)) await writeFile(MANIFEST, body);
console.log(
  `[og] ${Object.keys(next).length} share images (wrote ${wrote}, pruned ${pruned}, no jpg ${missing}) in ${((Date.now() - t0) / 1000).toFixed(1)}s`,
);
