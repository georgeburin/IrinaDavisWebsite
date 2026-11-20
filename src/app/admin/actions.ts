"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { endSession, requireAdmin, startDemoSession } from "@/lib/auth";
import { parsePaintingForm, type PaintingFormErrors } from "@/lib/painting-form";
import { PAINTINGS_TAG } from "@/lib/paintings";
import { canSave, deleteImage, readPaintings, saveImage, writePaintings } from "@/lib/paintings-store";
import { slugify, uniqueSlug } from "@/lib/slug";
import { PAINTING_STATUSES, type PaintingImage, type PaintingStatus } from "@/lib/types";

export type PaintingFormState = {
  message?: string;
  errors?: PaintingFormErrors;
};

const READ_ONLY_MESSAGE =
  "Saving is turned off on the live site for now. Run the site on your computer (npm run dev) to try adding and editing paintings.";
const BAD_PHOTO_MESSAGE = "One of the photos couldn't be read. Please use JPG, PNG or WebP files.";

// ---- Sign in / out (placeholder) ----

export async function signIn() {
  await startDemoSession();
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin/login");
}

// ---- Paintings ----

async function saveUploads(files: File[], baseName: string): Promise<PaintingImage[] | null> {
  const saved: PaintingImage[] = [];
  try {
    for (const file of files) saved.push(await saveImage(file, baseName));
    return saved;
  } catch (error) {
    console.error("Could not save photo", error);
    await Promise.all(saved.map((image) => deleteImage(image.src)));
    return null;
  }
}

export async function createPainting(_prev: PaintingFormState, formData: FormData): Promise<PaintingFormState> {
  await requireAdmin();
  if (!canSave) return { message: READ_ONLY_MESSAGE };

  const parsed = parsePaintingForm(formData, { requireMainImage: true });
  if (!parsed.ok) return { errors: parsed.errors, message: "Please check the highlighted fields." };

  const paintings = await readPaintings();
  const slug = uniqueSlug(
    slugify(parsed.fields.title),
    paintings.map((p) => p.slug),
  );

  const images = await saveUploads([parsed.mainImage!, ...parsed.extraImages], slug);
  if (!images) return { message: BAD_PHOTO_MESSAGE };

  const now = new Date().toISOString();
  paintings.push({ id: randomUUID(), slug, ...parsed.fields, images, createdAt: now, updatedAt: now });
  await writePaintings(paintings);

  updateTag(PAINTINGS_TAG);
  redirect(`/admin?saved=${encodeURIComponent(slug)}`);
}

export async function updatePainting(
  id: string,
  _prev: PaintingFormState,
  formData: FormData,
): Promise<PaintingFormState> {
  await requireAdmin();
  if (!canSave) return { message: READ_ONLY_MESSAGE };

  const parsed = parsePaintingForm(formData, { requireMainImage: false });
  if (!parsed.ok) return { errors: parsed.errors, message: "Please check the highlighted fields." };

  const paintings = await readPaintings();
  const index = paintings.findIndex((p) => p.id === id);
  if (index === -1) return { message: "This painting doesn't exist anymore." };
  const current = paintings[index];

  const uploads = await saveUploads(
    parsed.mainImage ? [parsed.mainImage, ...parsed.extraImages] : parsed.extraImages,
    current.slug,
  );
  if (!uploads) return { message: BAD_PHOTO_MESSAGE };

  const removed: string[] = [];
  const remove = new Set(parsed.removeImages);
  let [main, ...extras] = current.images;
  extras = extras.filter((image) => {
    if (!remove.has(image.src)) return true;
    removed.push(image.src);
    return false;
  });
  if (parsed.mainImage) {
    removed.push(main.src);
    main = uploads.shift()!;
  }

  paintings[index] = {
    ...current,
    ...parsed.fields,
    images: [main, ...extras, ...uploads],
    updatedAt: new Date().toISOString(),
  };
  await writePaintings(paintings);
  await Promise.all(removed.map(deleteImage));

  updateTag(PAINTINGS_TAG);
  redirect(`/admin?saved=${encodeURIComponent(current.slug)}`);
}

export async function setPaintingStatus(id: string, status: PaintingStatus) {
  await requireAdmin();
  if (!canSave || !PAINTING_STATUSES.includes(status)) return;

  const paintings = await readPaintings();
  const painting = paintings.find((p) => p.id === id);
  if (!painting) return;
  painting.status = status;
  painting.updatedAt = new Date().toISOString();
  await writePaintings(paintings);

  updateTag(PAINTINGS_TAG);
}

export async function deletePainting(id: string) {
  await requireAdmin();
  if (!canSave) return;

  const paintings = await readPaintings();
  const painting = paintings.find((p) => p.id === id);
  if (!painting) return;
  await writePaintings(paintings.filter((p) => p.id !== id));
  await Promise.all(painting.images.map((image) => deleteImage(image.src)));

  updateTag(PAINTINGS_TAG);
  redirect(`/admin?deleted=${encodeURIComponent(painting.title)}`);
}
