"use server";

import { prisma } from "@/lib/prisma";
import { faqSchema, type FaqInput } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export async function listFaqs() {
  return prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

function parseFaq(fd: FormData): FaqInput {
  return {
    category: fd.get("category")?.toString() || undefined,
    question: fd.get("question")?.toString() ?? "",
    answer: fd.get("answer")?.toString() ?? "",
    slug: fd.get("slug")?.toString() ?? "",
    order: fd.get("order") ? Number(fd.get("order")) : undefined,
    published: fd.get("published") === "true",
    publishedAt: fd.get("publishedAt")
      ? new Date(fd.get("publishedAt")!.toString())
      : undefined,
  };
}

export async function createFaq(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = faqSchema.safeParse(parseFaq(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.question);
  try {
    await prisma.faq.create({ data: value });
  } catch {
    return { error: "خطا در ثبت سؤال." };
  }
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true };
}

export async function updateFaq(
  id: string,
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = faqSchema.safeParse(parseFaq(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (!value.slug) value.slug = slugify(value.question);
  try {
    await prisma.faq.update({ where: { id }, data: value });
  } catch {
    return { error: "خطا در بروزرسانی." };
  }
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true };
}

export async function deleteFaq(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.faq.delete({ where: { id } });
  } catch {
    return { ok: false, error: "خطا در حذف." };
  }
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true };
}

export async function toggleFaqPublished(
  id: string,
  published: boolean,
): Promise<{ ok?: boolean }> {
  await prisma.faq.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true };
}
