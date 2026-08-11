"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Za-z]/, "باید شامر حرف انگلیسی باشد")
    .regex(/[0-9]/, "باید شامر عدد باشد"),
  confirmPassword: z.string(),
});

type Schema = z.infer<typeof schema>;

export function ProfilePasswordForm() {
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const { control, handleSubmit, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: Schema) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("currentPassword", data.currentPassword);
    fd.append("newPassword", data.newPassword);
    fd.append("confirmPassword", data.confirmPassword);
    const result = await changePassword(null, fd);
    setSubmitting(false);
    if (result?.ok) {
      addToast({ message: "رمز عبور با موفقیت تغییر یافت.", variant: "success" });
      reset();
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={control}
        name="currentPassword"
        label="رمز عبور فعلی"
        render={({ field }) => (
          <Input
            {...field}
            type={show ? "text" : "password"}
            placeholder="رمز عبور فعلی"
            autoComplete="current-password"
          />
        )}
      />
      <FormField
        control={control}
        name="newPassword"
        label="رمز عبور جدید"
        render={({ field }) => (
          <Input
            {...field}
            type={show ? "text" : "password"}
            placeholder="رمز عبور جدید"
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
            type={show ? "text" : "password"}
            placeholder="تکرار رمز عبور جدید"
            autoComplete="new-password"
          />
        )}
      />
      <Button type="submit" variant="accent" loading={submitting} disabled={submitting}>
        ذخیره
      </Button>
    </form>
  );
}
