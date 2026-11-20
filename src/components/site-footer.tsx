import { cacheLife } from "next/cache";
import Link from "next/link";

import { site } from "@/lib/site";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();

  return (
    <footer className="mt-24 border-t border-line text-sm">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-2 max-w-xs text-muted">Original paintings, one of a kind. Shipped from the studio in {site.location}.</p>
        </div>
        <nav aria-label="Site">
          <ul className="space-y-2">
            <li><Link className="link" href="/">All paintings</Link></li>
            <li><Link className="link" href="/about">About Irina</Link></li>
            <li><Link className="link" href="/contact">Contact &amp; commissions</Link></li>
          </ul>
        </nav>
        <nav aria-label="Policies">
          <ul className="space-y-2">
            <li><Link className="link" href="/shipping-returns">Shipping &amp; returns</Link></li>
            <li><Link className="link" href="/terms">Terms of sale</Link></li>
            <li><Link className="link" href="/privacy">Privacy</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-muted sm:px-6">
          <p>© {year} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="link" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <Link className="link" href="/admin">Artist login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
