"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicket } from "@/lib/actions/tickets";
import { ticketCreateSchema } from "@/lib/validations/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { FileUpload, type UploadedFileMeta } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";

export type TicketFormInput = z.infer<typeof ticketCreateSchema>;

export function TicketForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFileMeta[]>([]);

  const { control, handleSubmit } = useForm<TicketFormInput>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: {
      subject: "",
      category: "سایر",
      priority: "NORMAL",
      description: "",
      attachments: [],
    },
  });

  const onSubmit = async (data: TicketFormInput) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("subject", data.subject);
    fd.append("category", data.category);
    fd.append("priority", data.priority ?? "NORMAL");
    fd.append("description", data.description);
    if (attachments.length > 0) {
      fd.append("attachments", JSON.stringify(attachments));
    }
    const result = await createTicket(null, fd);
    setSubmitting(false);

    if (result?.ok) {
      addToast({ message: "تیکت شما ثبت شد.", variant: "success" });
      router.push(redirectTo ?? "/dashboard/tickets");
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    } else if (result?.errors) {
      addToast({ message: "لطفاً فیلدهای خطا را اصلاح کنید.", variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={control}
        name="subject"
        label="موضوع"
        render={({ field }) => (
          <Input {...field} placeholder="موضوع درخواست خود را وارد کنید" />
        )}
      />
      <FormField
        control={control}
        name="category"
        label="دسته‌بندی"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <option value="" disabled>دسته‌بندی انتخاب کنید</option>
            <option value="مالیاتی">مالیاتی</option>
            <option value="حسابداری">حسابداری</option>
            <option value="اظهارنامه">اظهارنامه</option>
            <option value="ارزش افزوده">ارزش افزوده</option>
            <option value="بیمه و حقوق">بیمه و حقوق</option>
            <option value="حسابرسی">حسابرسی</option>
            <option value="ثبت شرکت">ثبت شرکت</option>
            <option value="مشاوره مالی">مشاوره مالی</option>
            <option value="سایر">سایر</option>
          </Select>
        )}
      />
      <FormField
        control={control}
        name="priority"
        label="اولویت"
        render={({ field }) => (
          <Select value={field.value ?? "NORMAL"} onValueChange={field.onChange}>
            <option value="" disabled>اولویت انتخاب کنید</option>
            <option value="NORMAL">عادی</option>
            <option value="HIGH">مهم</option>
            <option value="URGENT">فوری</option>
            <option value="CRITICAL">حیاتی</option>
          </Select>
        )}
      />
      <FormField
        control={control}
        name="description"
        label="توضیحات"
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="توضیحات کامل درخواست خود را بنویسید..."
            className="min-h-[140px]"
          />
        )}
      />
      <div>
        <label className="block text-sm font-medium text-text mb-1">
          فایل پیوست
        </label>
        <FileUpload value={attachments} onChange={setAttachments} />
      </div>
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={submitting}
        disabled={submitting}
      >
        ثبت تیکت
      </Button>
    </form>
  );
}
