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

export async function register(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: "اطلاعات وارد شده نامعتبر است." };
  }

  const { name, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: email || undefined }, { phone }] },
    });
    if (existing) {
      return { error: "کاربر با این ایمیل یا موبایل قبلاً ثبت شده است." };
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
    return { error: "خطا در ثبت‌نام. دوباره سعی کنید." };
  }

  return { ok: true };
}

export async function forgotPassword(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string; token?: string }> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: "ایمیل نامعتبر است." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // NOTE: In production, send the reset link via email and do NOT return the
  // token here. The token is returned only for local development without SMTP.
  let token: string | undefined;
  if (user) {
    token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.resetToken.create({
      data: { token, userId: user.id, expiresAt },
    });
  }

  return { ok: true, token };
}

export async function resetPassword(
  prevState: unknown,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const token = formData.get("token")?.toString();
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: errors.password?.[0] ?? "رمز عبور نامعتبر است." };
  }

  if (!token) return { error: "توکن نامعتبر است." };

  const reset = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return { error: "توکن منقضی یا نامعتبر است." };
  }

  try {
    const hashed = await hashPassword(parsed.data.password);
    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    });
    await prisma.resetToken.deleteMany({ where: { token } });
  } catch {
    return { error: "خطا در بازنشانی رمز عبور." };
  }

  return { ok: true };
}
