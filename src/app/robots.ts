import type { MetadataRoute } from "next";
import { domains } from "@/lib/nav";

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
    sitemap: `${domains.primary}/sitemap.xml`,
    host: domains.primary,
  };
}
