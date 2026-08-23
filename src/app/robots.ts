import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/unauthorized"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/unauthorized"],
      },
    ],
    sitemap: "https://nikmohaseb.ir/sitemap.xml",
    host: "https://nikmohaseb.ir",
  };
}
