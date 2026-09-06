import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { domains } from "@/lib/nav";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, articles, circulars, faqs, libraryLaws, libraryArticles] = await Promise.all([
    prisma.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.circular.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.faq.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.libraryLaw.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.libraryArticle.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, chapter: { select: { law: { select: { slug: true } } } } },
    }),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: domains.primary,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${domains.primary}/services`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${domains.primary}/articles`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${domains.primary}/circulars`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${domains.primary}/faqs`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${domains.primary}/library`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${domains.primary}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${domains.primary}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${domains.primary}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${domains.primary}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const circularPages: MetadataRoute.Sitemap = circulars.map((c) => ({
    url: `${domains.primary}/circulars/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const faqPages: MetadataRoute.Sitemap = faqs.map((f) => ({
    url: `${domains.primary}/faqs/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const libraryLawPages: MetadataRoute.Sitemap = libraryLaws.map((l) => ({
    url: `${domains.primary}/library/laws/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const libraryArticlePages: MetadataRoute.Sitemap = libraryArticles.map((a) => ({
    url: `${domains.primary}/library/laws/${a.chapter.law.slug}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...servicePages,
    ...circularPages,
    ...faqPages,
    ...libraryLawPages,
    ...libraryArticlePages,
  ];
}
