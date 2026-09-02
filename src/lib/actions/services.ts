"use server";

import { prisma, CategoryType } from "@/lib/prisma";
import { serviceSchema, type ServiceInput } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";

export async function listServices() {
  return prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });
}

function parseService(fd: FormData): ServiceInput {
  const title = fd.get("title")?.toString() ?? "";
  let slug = fd.get("slug")?.toString() ?? "";
  if (!slug && title) {
    slug = slugify(title);
  }
  return {
    title,
    slug,
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    icon: fd.get("icon")?.toString() || undefined,
    image: fd.get("image")?.toString() || undefined,
    order: Number(fd.get("order")) || 0,
    published: fd.get("published") === "true",
    seoTitle: fd.get("seoTitle")?.toString() || undefined,
    seoDescription: fd.get("seoDescription")?.toString() || undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

export async function createService(fd: FormData): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const data = parseService(fd);
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.service.create({ data: value });
  } catch {
    return { error: "خطا در ثبت خدمت." };
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function updateService(id: string, fd: FormData): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const data = parseService(fd);
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (value.content) value.content = sanitizeHtml(value.content);
  try {
    await prisma.service.update({ where: { id }, data: value });
  } catch {
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function deleteService(id: string): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.service.delete({ where: { id } });
  } catch {
    return { ok: false, error: "خطا در حذف." };
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function toggleServicePublished(id: string, published: boolean): Promise<{ ok?: boolean }> {
  await prisma.service.update({ where: { id }, data: { published } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}
