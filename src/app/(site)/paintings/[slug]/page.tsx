import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PaintingViewer } from "@/components/painting-viewer";
import { StatusBadge } from "@/components/status-badge";
import {
  completedYear,
  excerpt,
  formatCompleted,
  formatPrice,
  formatSizeCm,
  formatSizeIn,
  paragraphs,
} from "@/lib/format";
import { getNeighbors, getPaintingBySlug, getPaintings } from "@/lib/paintings";
import { site } from "@/lib/site";
import type { Painting } from "@/lib/types";

// Everything on this page depends on which painting it shows, so there's no useful
// placeholder to flash while it loads. This turns off Next.js's dev-mode check that asks
// for one. Every painting is prerendered at build time (generateStaticParams), so the
// pages still load fast. A URL for a painting that doesn't exist shows the "not found"
// page with a noindex tag, so search engines skip it.
export const instant = false;

export async function generateStaticParams() {
  const paintings = await getPaintings();
  // Cache Components needs at least one value here, even when there are no paintings yet.
  return paintings.length > 0 ? paintings.map((p) => ({ slug: p.slug })) : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/paintings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);
  if (!painting) return { title: "Painting not found" };

  const image = painting.images[0];
  const description = excerpt(painting.description) || `${painting.medium}, ${formatSizeIn(painting)}.`;
  return {
    title: painting.title,
    description,
    alternates: { canonical: `/paintings/${painting.slug}` },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: `/paintings/${painting.slug}`,
      title: `${painting.title} by ${site.name}`,
      description,
      images: [{ url: image.src, width: image.width, height: image.height, alt: `${painting.title} by ${site.name}` }],
    },
  };
}

export default async function PaintingPage({ params }: PageProps<"/paintings/[slug]">) {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);
  if (!painting) notFound();
  const { previous, next } = await getNeighbors(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <nav className="py-6 text-sm">
        <Link href="/" className="link text-muted">
          ← All paintings
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <PaintingViewer images={painting.images} title={painting.title} />

        <div>
          <h1 className="font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">{painting.title}</h1>
          <p className="mt-2 text-muted">
            {painting.medium}, {completedYear(painting.completedOn)}
          </p>

          <div className="mt-8 border-y border-line py-6">
            <PurchaseBox painting={painting} />
          </div>

          {painting.description && (
            <div className="mt-8 space-y-4 leading-relaxed">
              {paragraphs(painting.description).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          )}

          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-line pt-6 text-sm">
            <dt className="text-muted">Medium</dt>
            <dd>{painting.medium}</dd>
            <dt className="text-muted">Size</dt>
            <dd>
              {formatSizeIn(painting)} <span className="text-muted">({formatSizeCm(painting)})</span>
            </dd>
            <dt className="text-muted">Completed</dt>
            <dd>{formatCompleted(painting.completedOn)}</dd>
            <dt className="text-muted">Framing</dt>
            <dd>{painting.framed ? "Framed" : "Unframed"}</dd>
            <dt className="text-muted">Original</dt>
            <dd>One of a kind, signed by the artist</dd>
          </dl>

          <p className="mt-8 text-sm text-muted">
            Carefully packed and shipped from the studio. See{" "}
            <Link href="/shipping-returns" className="link">
              shipping &amp; returns
            </Link>
            .
          </p>
        </div>
      </div>

      {(previous || next) && (
        <nav aria-label="More paintings" className="mt-20 grid gap-6 border-t border-line pt-10 sm:grid-cols-2">
          {previous ? <NeighborLink painting={previous} direction="previous" /> : <span />}
          {next && <NeighborLink painting={next} direction="next" />}
        </nav>
      )}
    </div>
  );
}

function PurchaseBox({ painting }: { painting: Painting }) {
  const askHref = `/contact?painting=${encodeURIComponent(painting.slug)}`;

  if (painting.status === "sold") {
    return (
      <div className="space-y-4">
        <StatusBadge status="sold" className="text-lg" />
        <p className="text-muted">
          This painting has found a home. Irina takes a small number of commissions each year if you&apos;d like
          something similar.
        </p>
        <Link href={`/contact?painting=${encodeURIComponent(painting.slug)}&topic=commission`} className="btn btn-outline w-full">
          Ask about a commission
        </Link>
      </div>
    );
  }

  if (painting.status === "reserved") {
    return (
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="text-3xl">{formatPrice(painting.priceCents)}</p>
          <StatusBadge status="reserved" />
        </div>
        <p className="text-muted">This painting is on hold for a buyer. Ask to be told if it becomes available.</p>
        <Link href={askHref} className="btn btn-outline w-full">
          Ask about this painting
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-3xl">{formatPrice(painting.priceCents)}</p>
        <StatusBadge status="available" />
      </div>
      {/* Stripe Checkout goes here later. */}
      <button type="button" disabled className="btn btn-primary w-full">
        Buy now · coming soon
      </button>
      <Link href={askHref} className="btn btn-outline w-full">
        Ask about this painting
      </Link>
      <p className="text-sm text-muted">Online checkout is coming soon. Until then, send a message to buy this painting.</p>
    </div>
  );
}

function NeighborLink({ painting, direction }: { painting: Painting; direction: "previous" | "next" }) {
  const image = painting.images[0];
  return (
    <Link
      href={`/paintings/${painting.slug}`}
      className={`group flex items-center gap-4 ${direction === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      <span className="flex size-20 shrink-0 items-center justify-center bg-panel p-2">
        <Image src={image.src} width={image.width} height={image.height} alt="" sizes="80px" className="h-auto max-h-full w-auto max-w-full" />
      </span>
      <span>
        <span className="block text-sm text-muted">{direction === "previous" ? "← Previous" : "Next →"}</span>
        <span className="font-serif text-xl group-hover:underline">{painting.title}</span>
      </span>
    </Link>
  );
}
