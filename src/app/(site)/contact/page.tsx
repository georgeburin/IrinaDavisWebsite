import type { Metadata } from "next";
import { Suspense } from "react";

import { getPaintingBySlug } from "@/lib/paintings";
import { site } from "@/lib/site";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a painting, shipping or commissions? Get in touch with Irina Davis.",
};

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div>
        <h1 className="font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">Get in touch</h1>
        <p className="mt-5 mb-10 max-w-xl text-lg leading-relaxed text-muted">
          Questions about a painting, shipping or a commission? Send a message and Irina will reply within a few days.
        </p>
        <Suspense fallback={<ContactForm />}>
          <PrefilledContactForm searchParams={searchParams} />
        </Suspense>
      </div>

      <aside className="space-y-8 text-sm lg:pt-4">
        <div>
          <h2 className="font-serif text-2xl">Email</h2>
          <a href={`mailto:${site.email}`} className="link mt-1 inline-block">
            {site.email}
          </a>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Instagram</h2>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-block">
            @irinadavis (placeholder)
          </a>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Studio</h2>
          <p className="mt-1 text-muted">{site.location}. Studio visits by appointment.</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Commissions</h2>
          <p className="mt-1 text-muted">
            Irina takes a small number of commissions each year. Tell her about the place, size and timing you have in
            mind.
          </p>
        </div>
      </aside>
    </div>
  );
}

/** Pre-fills the form when coming from a painting's "Ask about this painting" button. */
async function PrefilledContactForm({ searchParams }: Pick<PageProps<"/contact">, "searchParams">) {
  const { painting: slug, topic } = await searchParams;
  const painting = typeof slug === "string" ? await getPaintingBySlug(slug) : null;

  return (
    <ContactForm
      topic={topic === "commission" ? "commission" : undefined}
      painting={painting ? { slug: painting.slug, title: painting.title, image: painting.images[0] } : undefined}
    />
  );
}
