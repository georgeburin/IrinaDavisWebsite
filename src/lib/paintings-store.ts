import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Painting, PaintingImage } from "./types";

// ---------------------------------------------------------------------------
// TEMPORARY STORAGE.
//
// For now, paintings live in data/paintings.json and uploaded photos are saved
// to public/uploads. That only works on your own computer (`npm run dev`):
// Vercel can't keep files that the site writes while it's running.
//
// When the real database and image storage are added, replace the functions in
// this file (readPaintings, writePaintings, saveImage, deleteImage). Nothing
// else in the app needs to know where the data lives.
// ---------------------------------------------------------------------------

const DATA_FILE = path.join(process.cwd(), "data", "paintings.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Saving works only when running locally with `npm run dev`. */
export const canSave = process.env.NODE_ENV === "development";

export class ReadOnlyError extends Error {
  constructor() {
    super("Saving is turned off on the live site until a database and image storage are connected.");
  }
}

export async function readPaintings(): Promise<Painting[]> {
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as Painting[];
}

export async function writePaintings(paintings: Painting[]): Promise<void> {
  if (!canSave) throw new ReadOnlyError();
  const tmp = `${DATA_FILE}.tmp`;
  await writeFile(tmp, `${JSON.stringify(paintings, null, 2)}\n`, "utf8");
  await rename(tmp, DATA_FILE);
}

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB per photo

/**
 * Saves an uploaded photo. It is rotated upright, resized to at most 2400px
 * and re-encoded as JPEG, which also strips EXIF data such as GPS location.
 */
export async function saveImage(file: File, baseName: string): Promise<PaintingImage> {
  if (!canSave) throw new ReadOnlyError();
  const { default: sharp } = await import("sharp");
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${baseName}-${randomUUID().slice(0, 8)}.jpg`;
  const input = Buffer.from(await file.arrayBuffer());
  const info = await sharp(input)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(UPLOAD_DIR, name));
  return { src: `/uploads/${name}`, width: info.width, height: info.height };
}

/** Deletes a photo that was uploaded through the admin. Bundled sample photos are left alone. */
export async function deleteImage(src: string): Promise<void> {
  if (!canSave || !src.startsWith("/uploads/")) return;
  const file = path.join(UPLOAD_DIR, path.basename(src));
  await unlink(file).catch(() => {});
}
