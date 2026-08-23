import { prisma } from "@/lib/prisma";
import { domains } from "@/lib/nav";

export async function GET() {
  try {
    const [articles, services, laws, circulars, faqs] = await Promise.all([
      prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.law.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.circular.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.faq.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const staticPaths = [
      { path: "/", changefreq: "weekly", priority: "1.0" },
      { path: "/services", changefreq: "weekly", priority: "0.9" },
      { path: "/articles", changefreq: "daily", priority: "0.9" },
      { path: "/laws", changefreq: "weekly", priority: "0.8" },
      { path: "/circulars", changefreq: "weekly", priority: "0.8" },
      { path: "/faqs", changefreq: "weekly", priority: "0.8" },
      { path: "/about", changefreq: "monthly", priority: "0.7" },
      { path: "/contact", changefreq: "monthly", priority: "0.7" },
    ];

    const allUrls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    for (const staticPath of staticPaths) {
      allUrls.push({
        loc: `${domains.primary}${staticPath.path}`,
        lastmod: new Date().toISOString(),
        changefreq: staticPath.changefreq,
        priority: staticPath.priority,
      });
    }

    for (const article of articles) {
      allUrls.push({
        loc: `${domains.primary}/articles/${article.slug}`,
        lastmod: article.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    for (const service of services) {
      allUrls.push({
        loc: `${domains.primary}/services/${service.slug}`,
        lastmod: service.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    for (const law of laws) {
      allUrls.push({
        loc: `${domains.primary}/laws/${law.slug}`,
        lastmod: law.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.6",
      });
    }

    for (const circular of circulars) {
      allUrls.push({
        loc: `${domains.primary}/circulars/${circular.slug}`,
        lastmod: circular.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.6",
      });
    }

    for (const faq of faqs) {
      allUrls.push({
        loc: `${domains.primary}/faqs/${faq.slug}`,
        lastmod: faq.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.5",
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domains.primary}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(minimalSitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
