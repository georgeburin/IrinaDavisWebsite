import type { Painting, PaintingStatus } from "./types";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

const trim = (n: number) => String(Math.round(n * 100) / 100);

/** e.g. "24 W × 18 H × 1.5 D in". Pass { depth: false } for the short form "24 W × 18 H in". */
export function formatSizeIn(
  p: Pick<Painting, "widthIn" | "heightIn" | "depthIn">,
  { depth = true }: { depth?: boolean } = {},
): string {
  const d = depth && p.depthIn ? ` × ${trim(p.depthIn)} D` : "";
  return `${trim(p.widthIn)} W × ${trim(p.heightIn)} H${d} in`;
}

/** e.g. "61 × 46 cm" */
export function formatSizeCm(p: Pick<Painting, "widthIn" | "heightIn">): string {
  const cm = (inches: number) => Math.round(inches * 2.54);
  return `${cm(p.widthIn)} × ${cm(p.heightIn)} cm`;
}

/** "2026-04-12" → "April 2026" */
export function formatCompleted(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function completedYear(date: string): string {
  return date.slice(0, 4);
}

export const STATUS_LABEL: Record<PaintingStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

/** Splits plain text into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function excerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}
