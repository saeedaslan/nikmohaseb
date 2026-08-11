"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { comparePasswords, hashPassword } from "@/lib/password";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Za-z]/, "باید شامر حرف انگلیسی باشد")
      .regex(/[0-9]/, "باید شامر عدد باشد"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "رمز عبور و تکرار آن متفاوت است",
    path: ["confirmPassword"],
  });

export async function changePassword(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.newPassword?.[0] ?? "اطلاعات نامعتبر است." };
  }

  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  if (!dbUser?.password) return { error: "کاربر یافت نشد." };

  const valid = await comparePasswords(parsed.data.currentPassword, dbUser.password);
  if (!valid) return { error: "رمز عبور فعلی صحیح نیست." };

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(parsed.data.newPassword) },
  });

  return { ok: true };
}
