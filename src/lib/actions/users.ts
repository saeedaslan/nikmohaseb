"use server";

import { prisma, Role } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
}

export async function updateUserRole(
  id: string,
  role: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.user.update({ where: { id }, data: { role: role as Role } });
  } catch {
    return { error: "خطا در بروزرسانی نقش کاربر." };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function toggleUserActive(
  id: string,
  active: boolean,
): Promise<{ ok?: boolean }> {
  await prisma.user.update({ where: { id }, data: { active } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    return { error: "خطا در حذف کاربر." };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
}
