#!/usr/bin/env node
/**
 * Build-time next-gen covers for Vercel CDN.
 * Reads public/covers/*.jpg → writes -480/-960 .webp + .avif next to them.
 * Skip if the target is newer than the jpg.
 */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const COVERS = join(ROOT, "public/covers");
const SIZES = [480, 960];
const POOL = 6;

async function mapPool(items, n, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += n) {
    const chunk = await Promise.all(items.slice(i, i + n).map(fn));
    out.push(...chunk);
  }
  return out;
}

async function needsWrite(srcMtime, dest) {
  try {
    const d = await stat(dest);
    return d.mtimeMs < srcMtime;
  } catch {
    return true;
  }
}

async function convertOne(file) {
  const id = file.replace(/\.jpg$/i, "");
  const src = join(COVERS, file);
  const srcStat = await stat(src);
  const img = sharp(src).rotate();
  const meta = await img.metadata();
  const width = meta.width || 1400;
  let wrote = 0;

  for (const w of SIZES) {
    const targetW = Math.min(w, width);
    const webpPath = join(COVERS, `${id}-${w}.webp`);
    const avifPath = join(COVERS, `${id}-${w}.avif`);
    if (await needsWrite(srcStat.mtimeMs, webpPath)) {
      await img
        .clone()
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: 74, effort: 4 })
        .toFile(webpPath);
      wrote++;
    }
    if (await needsWrite(srcStat.mtimeMs, avifPath)) {
      await img
        .clone()
        .resize({ width: targetW, withoutEnlargement: true })
        .avif({ quality: 48, effort: 2 })
        .toFile(avifPath);
      wrote++;
    }
  }

  const aliasWebp = join(COVERS, `${id}.webp`);
  const aliasAvif = join(COVERS, `${id}.avif`);
  const src960 = join(COVERS, `${id}-960.webp`);
  const src960a = join(COVERS, `${id}-960.avif`);
  if (await needsWrite(srcStat.mtimeMs, aliasWebp)) {
    await img.clone().resize({ width: Math.min(960, width), withoutEnlargement: true }).webp({ quality: 74, effort: 4 }).toFile(aliasWebp);
    wrote++;
  }
  if (await needsWrite(srcStat.mtimeMs, aliasAvif)) {
    await img.clone().resize({ width: Math.min(960, width), withoutEnlargement: true }).avif({ quality: 48, effort: 2 }).toFile(aliasAvif);
    wrote++;
  }
  void src960;
  void src960a;
  return wrote;
}

async function compressOg() {
  const og = join(ROOT, "public/og.jpg");
  try {
    await stat(og);
  } catch {
    return 0;
  }
  const webp = join(ROOT, "public/og.webp");
  const st = await stat(og);
  if (!(await needsWrite(st.mtimeMs, webp))) return 0;
  await sharp(og).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(webp);
  return 1;
}

async function compressAds() {
  const dir = join(ROOT, "public/ads");
  let n = 0;
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));
  } catch {
    return 0;
  }
  for (const f of files) {
    const src = join(dir, f);
    const dest = join(dir, f.replace(/\.jpe?g$/i, ".webp"));
    const st = await stat(src);
    if (!(await needsWrite(st.mtimeMs, dest))) continue;
    await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 72, effort: 4 }).toFile(dest);
    n++;
  }
  return n;
}

const files = (await readdir(COVERS)).filter((f) => /^s\d+\.jpg$/i.test(f)).sort();
console.log(`[covers] ${files.length} jpg → webp/avif`);
const t0 = Date.now();
const wrote = (await mapPool(files, POOL, convertOne)).reduce((a, b) => a + b, 0);
const og = await compressOg();
const ads = await compressAds();
console.log(`[covers] wrote ${wrote} (+ og ${og}, ads ${ads}) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
