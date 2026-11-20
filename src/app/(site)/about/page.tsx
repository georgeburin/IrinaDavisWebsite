import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Irina Davis is a painter working in oil, acrylic and watercolor.",
};

// PLACEHOLDER TEXT: everything in [brackets] should be replaced with Irina's own words.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <figure className="md:sticky md:top-10 md:self-start">
          <Image
            src="/images/artist-portrait.jpg"
            width={1200}
            height={1500}
            alt="Portrait of Irina Davis (placeholder)"
            sizes="(min-width: 768px) 40vw, 100vw"
            loading="eager"
            className="h-auto w-full"
          />
          <figcaption className="mt-3 text-sm text-muted">Photo placeholder: a picture of Irina in her studio.</figcaption>
        </figure>

        <div>
          <h1 className="font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
            Hello, I&apos;m Irina Davis.
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted">
            I&apos;m a painter based in {site.location}. I paint landscapes, still lifes and quiet everyday scenes, mostly
            in oil, sometimes in acrylic and watercolor.
          </p>

          <div className="prose-page mt-10">
            <h2>How I work</h2>
            <p>
              Most of my paintings begin from life, outdoors or at the kitchen table, with a small color sketch. I finish
              them slowly in the studio, building up thin layers until the light feels right. [Replace with a few
              sentences about your process.]
            </p>

            <h2>About the paintings</h2>
            <p>
              Every painting on this site is an original: one of a kind and signed by hand. When a painting sells,
              it&apos;s gone for good. There are no prints. Each one is packed with care and shipped from my studio.
              [Mention varnish, framing or a certificate of authenticity if you include one.]
            </p>

            <h2>Background</h2>
            <p>
              [A short biography: where you grew up, how you started painting, any training or teachers, exhibitions or
              awards. Two or three sentences are plenty.]
            </p>

            <h2>Commissions</h2>
            <p>
              I take on a small number of commissions each year: a favorite place, a garden, a family home. If you have
              an idea, <Link href="/contact?topic=commission">I&apos;d love to hear it</Link>.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              See the paintings
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
