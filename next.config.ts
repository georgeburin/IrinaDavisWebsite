import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // 90 is used for the large and fullscreen views of a painting.
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      // Room for a main photo plus a few extra photos per upload.
      bodySizeLimit: "50mb",
    },
  },
  // Make sure the paintings file is included with the server code on Vercel.
  outputFileTracingIncludes: {
    "/**": ["./data/paintings.json"],
  },
};

export default nextConfig;
