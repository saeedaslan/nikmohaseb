import { prisma } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";

export async function getActiveBanner() {
  const banner = await prisma.banner.findFirst({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return banner;
}

export async function getPublishedServices(limit = 6) {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
  return services;
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({ where: { slug } });
}

export async function getPublishedArticles(limit = 3) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true, author: { select: { name: true } } },
  });
}

export async function getPublishedCirculars(limit = 3) {
  return prisma.circular.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    include: { category: true },
    take: limit,
  });
}

export async function getCircularBySlug(slug: string) {
  return prisma.circular.findUnique({ where: { slug }, include: { category: true } });
}

export async function getPublishedLaws(limit = 3) {
  return prisma.law.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    include: { category: true },
    take: limit,
  });
}

export async function getLawBySlug(slug: string) {
  return prisma.law.findUnique({ where: { slug }, include: { category: true } });
}

export async function getFaqBySlug(slug: string) {
  return prisma.faq.findUnique({ where: { slug } });
}

export async function getPublishedFaqs(limit = 50) {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export type Article = Awaited<ReturnType<typeof getPublishedArticles>>[number];
export type Circular = Awaited<ReturnType<typeof getPublishedCirculars>>[number];
export type Law = Awaited<ReturnType<typeof getPublishedLaws>>[number];
export type Service = Awaited<ReturnType<typeof getPublishedServices>>[number];
export type Banner = NonNullable<Awaited<ReturnType<typeof getActiveBanner>>>;
export type Faq = Awaited<ReturnType<typeof getPublishedFaqs>>[number];

export type { Prisma } from "@/lib/prisma";