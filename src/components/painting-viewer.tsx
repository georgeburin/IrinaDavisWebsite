"use client";

import Image from "next/image";
import { useState } from "react";

import type { PaintingImage } from "@/lib/types";

import { ExpandIcon } from "./icons";
import { Lightbox, type Slide } from "./lightbox";

/** Large photo of a painting with thumbnails of the extra photos. Click to view full screen. */
export function PaintingViewer({ images, title }: { images: PaintingImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides: Slide[] = images.map((image, i) => ({
    ...image,
    alt: i === 0 ? `${title} by Irina Davis` : `${title}, photo ${i + 1}`,
    title,
    caption: images.length > 1 ? `Photo ${i + 1} of ${images.length}` : undefined,
  }));
  const image = images[active] ?? images[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenIndex(active)}
        className="group relative flex w-full cursor-zoom-in items-center justify-center bg-panel p-5 sm:p-10"
        aria-label={`View “${title}” full screen`}
      >
        <Image
          key={image.src}
          src={image.src}
          width={image.width}
          height={image.height}
          alt={slides[active]?.alt ?? title}
          sizes="(min-width: 1152px) 640px, (min-width: 1024px) 55vw, 100vw"
          quality={90}
          loading="eager"
          fetchPriority="high"
          className="h-auto max-h-[72vh] w-auto max-w-full shadow-[0_1px_2px_rgba(0,0,0,0.12),0_14px_32px_-10px_rgba(0,0,0,0.35)]"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm">
          <ExpandIcon className="size-4" /> Full screen
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3" aria-label="More photos">
          {images.map((thumb, i) => (
            <li key={thumb.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show photo ${i + 1}`}
                className={`flex size-20 items-center justify-center overflow-hidden bg-panel p-1.5 outline-offset-2 transition sm:size-24 ${
                  i === active ? "outline-2 outline-ink" : "opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumb.src}
                  width={thumb.width}
                  height={thumb.height}
                  alt=""
                  sizes="96px"
                  className="h-auto max-h-full w-auto max-w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox slides={slides} index={openIndex} onIndexChange={setOpenIndex} />
    </div>
  );
}
