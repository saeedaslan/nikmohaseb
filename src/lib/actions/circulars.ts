"use server";

import { prisma } from "@/lib/prisma";
import { circularSchema, type CircularInput } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";

export async function listCirculars() {
  return prisma.circular.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

function parseCircular(fd: FormData): CircularInput {
  const dateStr = fd.get("date")?.toString();
  const publishedAtStr = fd.get("publishedAt")?.toString();
  const title = fd.get("title")?.toString() ?? "";
  let slug = fd.get("slug")?.toString() ?? "";
  if (!slug && title) {
    slug = slugify(title);
  }
  return {
    title,
    slug,
    number: fd.get("number")?.toString() || undefined,
    date: dateStr ? new Date(dateStr) : undefined,
    issuer: fd.get("issuer")?.toString() || undefined,
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    image: fd.get("image")?.toString() || undefined,
    file: fd.get("file")?.toString() || undefined,
    published: fd.get("published") === "true",
    publishedAt: publishedAtStr ? new Date(publishedAtStr) : undefined,
    seoTitle: fd.get("seoTitle")?.toString() || undefined,
    seoDescription: fd.get("seoDescription")?.toString() || undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

export async function createCircular(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = circularSchema.safeParse(parseCircular(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.circular.create({ data: value });
  } catch {
    return { error: "خطا در ثبت بخشنامه." };
  }
  revalidatePath("/admin/circulars");
  revalidatePath("/circulars");
  return { ok: true };
}

export async function updateCircular(
  id: string,
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = circularSchema.safeParse(parseCircular(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.circular.update({ where: { id }, data: value });
  } catch {
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/circulars");
  revalidatePath("/circulars");
  return { ok: true };
}

export async function deleteCircular(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.circular.delete({ where: { id } });
  } catch {
    return { ok: false, error: "خطا در حذف." };
  }
  revalidatePath("/admin/circulars");
  revalidatePath("/circulars");
  return { ok: true };
}

export async function toggleCircularPublished(
  id: string,
  published: boolean,
): Promise<{ ok?: boolean }> {
  await prisma.circular.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/admin/circulars");
  revalidatePath("/circulars");
  return { ok: true };
}
