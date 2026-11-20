"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { STATUS_LABEL } from "@/lib/format";
import type { PaintingImage, PaintingStatus } from "@/lib/types";

import { ExpandIcon } from "./icons";
import { Lightbox, type Slide } from "./lightbox";
import { StatusBadge } from "./status-badge";

export type GalleryItem = {
  id: string;
  slug: string;
  title: string;
  /** e.g. "Oil on canvas · 24 W × 18 H in" */
  details: string;
  priceLabel: string;
  status: PaintingStatus;
  image: PaintingImage;
};

type Filter = "all" | "available" | "sold";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

function matches(item: GalleryItem, filter: Filter) {
  return filter === "all" || item.status === filter;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(() => items.filter((item) => matches(item, filter)), [items, filter]);

  const slides: Slide[] = useMemo(
    () =>
      visible.map((item) => ({
        ...item.image,
        alt: `${item.title} by Irina Davis`,
        title: item.title,
        caption: `${item.details} · ${item.status === "available" ? item.priceLabel : STATUS_LABEL[item.status]}`,
        href: `/paintings/${item.slug}`,
      })),
    [visible],
  );

  return (
    <section aria-label="Paintings">
      <div role="group" aria-label="Show" className="mb-8 flex flex-wrap gap-2 text-sm">
        {FILTERS.map(({ value, label }) => {
          const count = items.filter((item) => matches(item, value)).length;
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 transition-colors ${
                active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {label} <span className={active ? "text-paper/70" : "text-muted/70"}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">No paintings here yet.</p>
      ) : (
        <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <li key={item.id}>
              <article>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative flex aspect-square w-full cursor-zoom-in items-center justify-center bg-panel p-[9%]"
                  aria-label={`View “${item.title}” full screen`}
                >
                  <Image
                    src={item.image.src}
                    width={item.image.width}
                    height={item.image.height}
                    alt={`${item.title} by Irina Davis`}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
                    loading={i < 3 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    className="h-auto max-h-full w-auto max-w-full shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_24px_-8px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute right-3 bottom-3 rounded-full bg-paper/90 p-2 text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ExpandIcon className="size-4" />
                  </span>
                </button>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl leading-tight">
                      <Link
                        href={`/paintings/${item.slug}`}
                        className="decoration-1 underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted">{item.details}</p>
                  </div>
                  <p className="shrink-0 pt-1 text-sm">
                    {item.status === "available" ? item.priceLabel : <StatusBadge status={item.status} />}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <Lightbox slides={slides} index={openIndex} onIndexChange={setOpenIndex} />
    </section>
  );
}
