import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // CSS bundle uses a stable filename; force revalidation so stale
        // cached stylesheets (e.g. old white-on-white light mode) are
        // never served to users until a fresh copy is fetched.
        source: "/_next/static/chunks/:path*.css",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
