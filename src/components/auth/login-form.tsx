"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (result?.error) {
      addToast({ message: "نام کاربری یا رمز عبور اشتباه است.", variant: "error" });
    } else if (result?.ok) {
      addToast({ message: "ورود موفقیت‌آمیز بود.", variant: "success" });
      router.push(result.url || callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        name="email"
        label="ایمیل"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            placeholder="example@nikmohaseb.ir"
            autoComplete="email"
          />
        )}
      />

      <FormField
        name="password"
        label="رمز عبور"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور"
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "مخفی کردن" : "نمایش"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}
      />

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/forgot-password"
          className="text-accent-green hover:underline"
        >
          فراموشی رمز عبور؟
        </Link>
        <span className="text-text-muted">
          حساب ندارید؟{" "}
          <Link
            href="/register"
            className="text-accent-green hover:underline"
          >
            ثبت‌نام
          </Link>
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        ورود
      </Button>
    </form>
  );
}
