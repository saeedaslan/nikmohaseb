"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/lib/actions/auth";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email ?? "");
    fd.append("phone", data.phone);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    const result = await register(null, fd);
    setSubmitting(false);
    if (result?.ok) {
      addToast({ message: "ثبت‌نام موفقی! ورود کنید.", variant: "success" });
      router.push("/login");
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={control}
        name="name"
        label="نام و نام خانوادگی"
        render={({ field }) => (
          <Input {...field} placeholder="مثال: علی احمدی" autoComplete="name" />
        )}
      />
      <FormField
        control={control}
        name="email"
        label="ایمیل (اختیاری)"
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
        control={control}
        name="phone"
        label="شماره موبایل"
        render={({ field }) => (
          <Input
            {...field}
            type="tel"
            placeholder="09123456789"
            autoComplete="tel"
          />
        )}
      />
      <FormField
        control={control}
        name="password"
        label="رمز عبور"
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="حداقل ۸ کاراکتر"
            autoComplete="new-password"
          />
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        label="تکرار رمز عبور"
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="تکرار رمز عبور"
            autoComplete="new-password"
          />
        )}
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={submitting}
        disabled={submitting}
      >
        ثبت‌نام
      </Button>
    </form>
  );
}
