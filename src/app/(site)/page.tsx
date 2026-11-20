import Link from "next/link";

import { Gallery, type GalleryItem } from "@/components/gallery";
import { formatPrice, formatSizeIn } from "@/lib/format";
import { getPaintings } from "@/lib/paintings";

export default async function HomePage() {
  const paintings = await getPaintings();

  const items: GalleryItem[] = paintings.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    details: `${p.medium} · ${formatSizeIn(p, { depth: false })}`,
    priceLabel: formatPrice(p.priceCents),
    status: p.status,
    image: p.images[0],
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="max-w-2xl py-14 sm:py-20">
        <h1 className="font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl">
          Original paintings by Irina Davis
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Landscapes, still lifes and quiet everyday moments in oil, acrylic and watercolor. Every painting is one of a
          kind and ships from the studio.{" "}
          <Link href="/about" className="link text-ink">
            About&nbsp;Irina&nbsp;→
          </Link>
        </p>
      </section>

      <Gallery items={items} />
    </div>
  );
}
