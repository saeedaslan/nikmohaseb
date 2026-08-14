import { z } from "zod";

export const fullNameSchema = z
  .string()
  .min(2, "نام کامل باید حداقل ۲ کاراکتر باشد")
  .max(80);

export const emailSchema = z
  .string()
  .min(1, "ایمیل الزامی است")
  .email("ایمیل نامعتبر است");

export const phoneSchema = z
  .string()
  .min(1, "شماره موبایل الزامی است")
  .regex(/^09\d{9}$/, "شمابه موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");

export const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .regex(/[A-Za-z]/, "رمز عبور باید شامل حرف انگلیسی باشد")
  .regex(/[0-9]/, "رمز عبور باید شامر عدد باشد");

export const registerSchema = z
  .object({
    name: fullNameSchema,
    email: emailSchema.optional().or(z.literal("")),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "ایمیل یا شماره موبایل الزامی است")
    .refine(
      (val) => val.includes("@") || /^09\d{9}$/.test(val),
      "ایمیل یا شماره موبایل معتبر وارد کنید",
    ),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
