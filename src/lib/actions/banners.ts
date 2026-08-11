"use server";

import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export interface BannerRow {
  id: string;
  title: string;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  image: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
}

export async function listBanners(): Promise<BannerRow[]> {
  return prisma.banner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

function parseActive(formData: FormData): boolean {
  const v = formData.get("active");
  return v === "true" || v === "on" || v === "1";
}

export async function createBanner(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = bannerSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    buttonText: formData.get("buttonText"),
    buttonLink: formData.get("buttonLink"),
    image: formData.get("image"),
    active: parseActive(formData),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  try {
    await prisma.banner.create({ data: parsed.data });
  } catch {
    return { error: "خطا در ثبت بنر." };
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function updateBanner(
  id: string,
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; errors?: Record<string, string[]> }> {
  const parsed = bannerSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    buttonText: formData.get("buttonText"),
    buttonLink: formData.get("buttonLink"),
    image: formData.get("image"),
    active: parseActive(formData),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  try {
    await prisma.banner.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "خطا در بروزرسانی بنر." };
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({ where: { id } });
  } catch {
    return { error: "خطا در حذف بنر." };
  }
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleBannerActive(id: string, active: boolean) {
  await prisma.banner.update({ where: { id }, data: { active } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}
