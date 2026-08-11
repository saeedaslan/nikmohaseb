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
  return {
    title: fd.get("title")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    number: fd.get("number")?.toString() || undefined,
    date: fd.get("date") ? new Date(fd.get("date")!.toString()) : undefined,
    issuer: fd.get("issuer")?.toString() || undefined,
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    file: fd.get("file")?.toString() || undefined,
    published: fd.get("published") === "true",
    publishedAt: fd.get("publishedAt")
      ? new Date(fd.get("publishedAt")!.toString())
      : undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

export async function createCircular(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = circularSchema.safeParse(parseCircular(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.title);
  if (value.content) value.content = sanitizeHtml(value.content);
  if (parsed.success) {
    try {
      await prisma.circular.create({ data: value });
    } catch {
      return { error: "خطا در ثبت بخشنامه." };
    }
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
  if (!value.slug) value.slug = slugify(value.title);
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
