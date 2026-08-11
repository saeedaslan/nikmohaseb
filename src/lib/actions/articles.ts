"use server";

import { prisma } from "@/lib/prisma";
import { articleSchema, type ArticleInput } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";

export async function listArticles() {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
  });
}

function parseArticle(fd: FormData): ArticleInput {
  return {
    title: fd.get("title")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    image: fd.get("image")?.toString() || undefined,
    published: fd.get("published") === "true",
    publishedAt: fd.get("publishedAt")
      ? new Date(fd.get("publishedAt")!.toString())
      : undefined,
    seoTitle: fd.get("seoTitle")?.toString() || undefined,
    seoDescription: fd.get("seoDescription")?.toString() || undefined,
    authorId: fd.get("authorId")?.toString() || undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

export async function createArticle(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = articleSchema.safeParse(parseArticle(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.title);
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.article.create({ data: value });
  } catch {
    return { error: "خطا در ثبت مقاله." };
  }
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  return { ok: true };
}

export async function updateArticle(
  id: string,
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = articleSchema.safeParse(parseArticle(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.title);
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.article.update({ where: { id }, data: value });
  } catch {
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  return { ok: true };
}

export async function deleteArticle(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.article.delete({ where: { id } });
  } catch {
    return { ok: false, error: "خطا در حذف." };
  }
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  return { ok: true };
}

export async function toggleArticlePublished(
  id: string,
  published: boolean,
): Promise<{ ok?: boolean }> {
  await prisma.article.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  return { ok: true };
}
