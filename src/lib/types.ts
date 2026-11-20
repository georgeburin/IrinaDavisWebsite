export const PAINTING_STATUSES = ["available", "reserved", "sold"] as const;
export type PaintingStatus = (typeof PAINTING_STATUSES)[number];

export type PaintingImage = {
  /** Path under /public, e.g. "/paintings/morning-light.jpg" or "/uploads/…" */
  src: string;
  width: number;
  height: number;
};

export type Painting = {
  id: string;
  /** Used in the URL: /paintings/<slug>. Set once when the painting is created. */
  slug: string;
  title: string;
  /** Plain text. A blank line starts a new paragraph. */
  description: string;
  /** Price in cents (US dollars), which is also what Stripe expects. */
  priceCents: number;
  status: PaintingStatus;
  /** Date completed, as YYYY-MM-DD. */
  completedOn: string;
  medium: string;
  widthIn: number;
  heightIn: number;
  depthIn: number | null;
  framed: boolean;
  /** The first image is the main photo. The rest are extra photos (close-ups, framed, on a wall…). */
  images: PaintingImage[];
  createdAt: string;
  updatedAt: string;
};
