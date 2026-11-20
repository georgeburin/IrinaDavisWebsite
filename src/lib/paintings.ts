import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { readPaintings } from "./paintings-store";
import type { Painting } from "./types";

/** Cache tag for painting data. Admin actions call updateTag(PAINTINGS_TAG) after a change. */
export const PAINTINGS_TAG = "paintings";

/** All paintings, newest first. */
export async function getPaintings(): Promise<Painting[]> {
  "use cache";
  cacheTag(PAINTINGS_TAG);
  cacheLife("max");

  const paintings = await readPaintings();
  return paintings.sort(
    (a, b) => b.completedOn.localeCompare(a.completedOn) || b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getPaintingBySlug(slug: string): Promise<Painting | null> {
  const paintings = await getPaintings();
  return paintings.find((p) => p.slug === slug) ?? null;
}

export async function getPaintingById(id: string): Promise<Painting | null> {
  const paintings = await getPaintings();
  return paintings.find((p) => p.id === id) ?? null;
}

/** The paintings before and after this one, for "previous / next" links. */
export async function getNeighbors(slug: string) {
  const paintings = await getPaintings();
  const i = paintings.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: null, next: null };
  return {
    previous: i > 0 ? paintings[i - 1] : null,
    next: i < paintings.length - 1 ? paintings[i + 1] : null,
  };
}
