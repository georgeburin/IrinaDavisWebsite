// Site-wide settings. Everything marked PLACEHOLDER should be replaced before launch.
export const site = {
  name: "Irina Davis",
  title: "Irina Davis · Original Paintings",
  description:
    "Original oil, acrylic and watercolor paintings by Irina Davis. Every painting is one of a kind and ships from the studio.",
  email: "irinads14@yahoo.com",
  instagram: "https://www.instagram.com/", // PLACEHOLDER
  location: "[City, State]", // PLACEHOLDER
  currency: "USD",
};

/** Absolute URL of the site, used for link previews and the sitemap. */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Set automatically by Vercel (the project's production domain).
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
