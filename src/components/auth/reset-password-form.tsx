"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("token", token);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    const result = await resetPassword(null, fd);
    setSubmitting(false);
    if (result?.ok) {
      addToast({ message: "رمز عبور با موفقیت تغییر یافت.", variant: "success" });
      router.push("/login");
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <FormField
        control={control}
        name="password"
        label="رمز عبور جدید"
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="حداقل ۸ کاراکتر با حروف و اعداد"
            autoComplete="new-password"
          />
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        label="تکرار رمز عبور جدید"
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
        ذخیره رمز عبور جدید
      </Button>
    </form>
  );
}
