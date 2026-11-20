import "server-only";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "./paintings-store";
import { PAINTING_STATUSES, type Painting, type PaintingStatus } from "./types";

export type PaintingFields = Pick<
  Painting,
  | "title"
  | "description"
  | "priceCents"
  | "status"
  | "completedOn"
  | "medium"
  | "widthIn"
  | "heightIn"
  | "depthIn"
  | "framed"
>;

export type PaintingFieldName =
  | "title"
  | "description"
  | "price"
  | "status"
  | "completedOn"
  | "medium"
  | "widthIn"
  | "heightIn"
  | "depthIn"
  | "mainImage"
  | "extraImages";

export type PaintingFormErrors = Partial<Record<PaintingFieldName, string>>;

type ParseResult =
  | {
      ok: true;
      fields: PaintingFields;
      mainImage: File | null;
      extraImages: File[];
      removeImages: string[];
    }
  | { ok: false; errors: PaintingFormErrors };

const text = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

function isUpload(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && value.size > 0;
}

function checkImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Please use a JPG, PNG or WebP photo.";
  if (file.size > MAX_IMAGE_BYTES) return "That photo is too large (20 MB max).";
  return null;
}

function parseNumber(raw: string): number | null {
  if (!raw) return null;
  const n = Number(raw.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Reads and validates the add/edit painting form. Never trusts the browser's own checks. */
export function parsePaintingForm(formData: FormData, options: { requireMainImage: boolean }): ParseResult {
  const errors: PaintingFormErrors = {};

  const title = text(formData, "title");
  if (!title) errors.title = "Give the painting a title.";
  else if (title.length > 120) errors.title = "Keep the title under 120 characters.";

  const description = text(formData, "description").replace(/\r\n/g, "\n");
  if (description.length > 5000) errors.description = "Keep the description under 5,000 characters.";

  const price = parseNumber(text(formData, "price"));
  if (price === null) errors.price = "Enter a price in US dollars.";
  else if (price < 0 || price > 1_000_000) errors.price = "Enter a price between $0 and $1,000,000.";

  const status = text(formData, "status") as PaintingStatus;
  if (!PAINTING_STATUSES.includes(status)) errors.status = "Choose a status.";

  const completedOn = text(formData, "completedOn");
  const date = new Date(`${completedOn}T00:00:00Z`);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn) || Number.isNaN(date.getTime())) {
    errors.completedOn = "Choose the date the painting was finished.";
  } else if (completedOn > tomorrow) {
    errors.completedOn = "That date is in the future.";
  }

  const medium = text(formData, "medium");
  if (!medium) errors.medium = "Enter the medium, e.g. “Oil on canvas”.";
  else if (medium.length > 80) errors.medium = "Keep the medium under 80 characters.";

  const widthIn = parseNumber(text(formData, "widthIn"));
  if (widthIn === null || widthIn <= 0 || widthIn > 500) errors.widthIn = "Enter the width in inches.";
  const heightIn = parseNumber(text(formData, "heightIn"));
  if (heightIn === null || heightIn <= 0 || heightIn > 500) errors.heightIn = "Enter the height in inches.";
  const depthIn = parseNumber(text(formData, "depthIn"));
  if (depthIn !== null && (depthIn <= 0 || depthIn > 50)) errors.depthIn = "Enter the depth in inches, or leave it empty.";

  const framed = formData.get("framed") === "on";

  const main = formData.get("mainImage");
  const mainImage = isUpload(main) ? main : null;
  if (mainImage) {
    const problem = checkImage(mainImage);
    if (problem) errors.mainImage = problem;
  } else if (options.requireMainImage) {
    errors.mainImage = "Add a photo of the painting.";
  }

  const extraImages = formData.getAll("extraImages").filter(isUpload);
  if (extraImages.length > 8) errors.extraImages = "Add up to 8 extra photos at a time.";
  for (const file of extraImages) {
    const problem = checkImage(file);
    if (problem) {
      errors.extraImages = `${file.name}: ${problem}`;
      break;
    }
  }

  const removeImages = formData.getAll("removeImages").map(String);

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    fields: {
      title,
      description,
      priceCents: Math.round(price! * 100),
      status,
      completedOn,
      medium,
      widthIn: widthIn!,
      heightIn: heightIn!,
      depthIn,
      framed,
    },
    mainImage,
    extraImages,
    removeImages,
  };
}
