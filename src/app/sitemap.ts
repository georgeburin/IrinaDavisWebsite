import type { MetadataRoute } from "next";

import { getPaintings } from "@/lib/paintings";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const paintings = await getPaintings();

  const pages = ["", "/about", "/contact", "/shipping-returns", "/terms", "/privacy"].map((path) => ({
    url: `${base}${path}`,
  }));

  return [
    ...pages,
    ...paintings.map((p) => ({
      url: `${base}/paintings/${p.slug}`,
      lastModified: p.updatedAt,
      images: [`${base}${p.images[0].src}`],
    })),
  ];
}
