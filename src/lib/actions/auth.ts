"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { Role } from "@/lib/prisma";
import { randomBytes } from "crypto";
import type { ActionResult } from "@/lib/constants";

export async function register(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, error: "اطلاعات وارد شده نامعتبر است." };
  }

  const { name, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: email || undefined }, { phone }] },
    });
    if (existing) {
      return { ok: false, error: "کاربر با این ایمیل یا موبایل قبلاً ثبت شده است." };
    }

    const hashed = await hashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone,
        password: hashed,
        role: Role.USER,
      },
    });
  } catch {
    return { ok: false, error: "خطا در ثبت‌نام. دوباره سعی کنید." };
  }

  return { ok: true };
}

export async function forgotPassword(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { ok: false, error: "ایمیل نامعتبر است." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.resetToken.create({
      data: { token, userId: user.id, expiresAt },
    });
  }

  return { ok: true };
}

export async function resetPassword(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const token = formData.get("token")?.toString();
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { ok: false, error: errors.password?.[0] ?? "رمز عبور نامعتبر است." };
  }

  if (!token) return { ok: false, error: "توکن نامعتبر است." };

  const reset = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return { ok: false, error: "توکن منقضی یا نامعتبر است." };
  }

  try {
    const hashed = await hashPassword(parsed.data.password);
    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    });
    await prisma.resetToken.deleteMany({ where: { token } });
  } catch {
    return { ok: false, error: "خطا در بازنشانی رمز عبور." };
  }

  return { ok: true };
}
