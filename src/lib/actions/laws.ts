"use server";

import { prisma } from "@/lib/prisma";
import { lawSchema, type LawInput } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";

export async function listLaws() {
  return prisma.law.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

function parseLaw(fd: FormData): LawInput {
  return {
    title: fd.get("title")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    number: fd.get("number")?.toString() || undefined,
    date: fd.get("date") ? new Date(fd.get("date")!.toString()) : undefined,
    issuer: fd.get("issuer")?.toString() || undefined,
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    file: fd.get("file")?.toString() || undefined,
    type: (fd.get("type")?.toString() as any) || "OTHER",
    published: fd.get("published") === "true",
    publishedAt: fd.get("publishedAt")
      ? new Date(fd.get("publishedAt")!.toString())
      : undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

export async function createLaw(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = lawSchema.safeParse(parseLaw(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.title);
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.law.create({ data: value });
  } catch {
    return { error: "خطا در ثبت قانون." };
  }
  revalidatePath("/admin/laws");
  revalidatePath("/laws");
  return { ok: true };
}

export async function updateLaw(
  id: string,
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = lawSchema.safeParse(parseLaw(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.title);
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.law.update({ where: { id }, data: value });
  } catch {
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/laws");
  revalidatePath("/laws");
  return { ok: true };
}

export async function deleteLaw(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.law.delete({ where: { id } });
  } catch {
    return { ok: false, error: "خطا در حذف." };
  }
  revalidatePath("/admin/laws");
  revalidatePath("/laws");
  return { ok: true };
}

export async function toggleLawPublished(
  id: string,
  published: boolean,
): Promise<{ ok?: boolean }> {
  await prisma.law.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/admin/laws");
  revalidatePath("/laws");
  return { ok: true };
}
