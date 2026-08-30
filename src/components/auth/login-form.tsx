"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl,
      });

      if (result?.error) {
        const errorMessage = result.error === "CredentialsSignin"
          ? "نام کاربری یا رمز عبور اشتباه است."
          : result.error.includes("AccessDenied")
            ? "شما اجازه دسترسی به این بخش را ندارید."
            : "خطا در ورود. دوباره سعی کنید.";
        addToast({ message: errorMessage, variant: "error" });
      } else if (result?.ok) {
        addToast({ message: "ورود موفقیت‌آمیز بود.", variant: "success" });
        const returnUrl = searchParams.get("callbackUrl") || result.url || callbackUrl;
        router.push(returnUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={control}
        name="identifier"
        label="ایمیل یا شماره موبایل"
        render={({ field }) => (
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Mail className="h-5 w-5" />
            </div>
            <Input
              {...field}
              type="text"
              placeholder="example@nikmohaseb.ir"
              autoComplete="username"
              className="pr-11 h-12 rounded-xl border-border focus:border-accent-green focus:ring-accent-green/20"
            />
          </div>
        )}
      />
      
      <FormField
        name="password"
        label="رمز عبور"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Lock className="h-5 w-5" />
            </div>
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور خود را وارد کنید"
              autoComplete="current-password"
              className="pr-11 pl-11 h-12 rounded-xl border-border focus:border-accent-green focus:ring-accent-green/20"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-navy transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "مخفی کردن" : "نمایش"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        )}
      />

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/register"
          className="text-text-muted hover:text-accent-green transition-colors"
        >
          حساب ندارید؟{" "}
          <span className="font-medium text-accent-green">ثبت‌نام</span>
        </Link>
        <Link
          href="/forgot-password"
          className="font-medium text-accent-green hover:text-accent-green/80 transition-colors"
        >
          فراموشی رمز عبور؟
        </Link>
      </div>

      <Button
        type="submit"
        className="btn-shine w-full h-12 bg-accent-green text-white text-base font-medium rounded-xl hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/30 transition-all duration-300"
        loading={isLoading}
        disabled={isLoading}
      >
        ورود
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-text-muted">یا</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <span className="text-text-muted">حساب کاربری ندارید؟ </span>
        <Link
          href="/register"
          className="font-medium text-primary-navy hover:text-accent-green transition-colors"
        >
          ثبت‌نام رایگان
        </Link>
      </div>
    </form>
  );
}
