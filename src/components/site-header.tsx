"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

const NAV = [
  { href: "/", label: "Paintings", match: (p: string) => p === "/" || p.startsWith("/paintings") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-4 py-5 sm:px-6 sm:py-7">
        <Link href="/" className="font-serif text-[1.75rem] leading-none font-medium tracking-tight sm:text-3xl">
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-5 text-[0.9375rem] sm:gap-8">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`underline-offset-[6px] transition-colors hover:text-ink ${
                      active ? "text-ink underline decoration-1" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
