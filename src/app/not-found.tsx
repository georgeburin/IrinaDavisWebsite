import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-24 sm:px-6">
        <p className="text-sm tracking-widest text-muted uppercase">404</p>
        <h1 className="mt-3 font-serif text-5xl font-medium">This page isn&apos;t here</h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          The painting or page you&apos;re looking for may have moved or been removed.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          See all paintings
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
