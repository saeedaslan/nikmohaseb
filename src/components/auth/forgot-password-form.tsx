"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/lib/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("email", data.email);
    const result = await forgotPassword(null, fd);
    setSubmitting(false);
    if (result?.ok && result.token) {
      router.push(`/reset-password?token=${result.token}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={control}
        name="email"
        label="ایمیل"
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            placeholder="example@nikmohaseb.ir"
            autoComplete="email"
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
        ارسال لینک بازنشانی
      </Button>
      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="text-accent-green hover:underline">
          بازگشت به ورود
        </Link>
      </p>
    </form>
  );
}
