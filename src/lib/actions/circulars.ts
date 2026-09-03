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

function parseDate(value: FormDataEntryValue | null): Date | undefined {
  if (!value) return undefined;
  const str = value.toString();
  if (!str) return undefined;
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

function parseCircular(fd: FormData): CircularInput {
  const title = fd.get("title")?.toString() ?? "";
  let slug = fd.get("slug")?.toString() ?? "";
  if (!slug && title) {
    slug = slugify(title);
  }
  return {
    title,
    slug,
    number: fd.get("number")?.toString() || undefined,
    date: parseDate(fd.get("date")),
    issuer: fd.get("issuer")?.toString() || undefined,
    summary: fd.get("summary")?.toString() || undefined,
    content: fd.get("content")?.toString() || undefined,
    file: fd.get("file")?.toString() || undefined,
    published: fd.get("published") === "true",
    publishedAt: parseDate(fd.get("publishedAt")),
    seoTitle: fd.get("seoTitle")?.toString() || undefined,
    seoDescription: fd.get("seoDescription")?.toString() || undefined,
    categoryId: fd.get("categoryId")?.toString() || undefined,
  };
}

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  mime: string;
  size: number;
}

function parseGallery(raw: unknown): UploadedFile[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is UploadedFile =>
        typeof a === "object" &&
        a !== null &&
        typeof a.url === "string" &&
        typeof a.filename === "string",
    );
  } catch {
    return [];
  }
}

export async function createCircular(
  fd: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = circularSchema.safeParse(parseCircular(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const value = parsed.data;
  if (value.content) value.content = sanitizeHtml(value.content);
  const gallery = parseGallery(fd.get("gallery"));
  try {
    await prisma.circular.create({
      data: {
        ...value,
        images: {
          create: gallery.map((g, idx) => ({
            url: g.url,
            filename: g.originalName ?? g.filename,
            order: idx,
          })),
        },
      } as any,
    });
  } catch (error) {
    console.error("Create circular error:", error);
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
    await prisma.circular.update({
      where: { id },
      data: value as any,
    });
  } catch (error) {
    console.error("Update circular error:", error);
    return { error: "خطا در بروزرسانی." };
  }

  const gallery = parseGallery(fd.get("gallery"));
  if (gallery.length > 0 || fd.get("gallery")) {
    try {
      await prisma.circularImage.deleteMany({ where: { circularId: id } });
      if (gallery.length > 0) {
        await prisma.circularImage.createMany({
          data: gallery.map((g, idx) => ({
            url: g.url,
            filename: g.originalName ?? g.filename,
            order: idx,
            circularId: id,
          })),
        });
      }
    } catch (error) {
      console.error("Update gallery error:", error);
    }
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
