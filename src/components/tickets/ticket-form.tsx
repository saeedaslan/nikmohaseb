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
import { useState, useEffect, useCallback } from "react";
import type { z } from "zod";
import { TICKET_CATEGORY_LABELS, TICKET_CATEGORY_DESCRIPTIONS, TICKET_TEMPLATES } from "@/lib/constants";
import { FileText, CheckCircle2, Copy, Sparkles, AlertCircle, Clipboard } from "lucide-react";

export type TicketFormInput = z.infer<typeof ticketCreateSchema>;

const STORAGE_KEY = "ticket-draft";

export function TicketForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFileMeta[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [successData, setSuccessData] = useState<{ trackingCode: string } | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TicketFormInput>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: {
      subject: "",
      category: "GENERAL",
      priority: "NORMAL",
      description: "",
      attachments: [],
    },
  });

  const description = watch("description");
  const category = watch("category");

  useEffect(() => {
    setCharCount(description?.length ?? 0);
  }, [description]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setValue("subject", data.subject || "");
        setValue("category", data.category || "GENERAL");
        setValue("priority", data.priority || "NORMAL");
        setValue("description", data.description || "");
      } catch {}
    }
  }, [setValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const data = {
        subject: watch("subject"),
        category: watch("category"),
        priority: watch("priority"),
        description: watch("description"),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [watch("subject"), watch("category"), watch("priority"), watch("description")]);

  const applyTemplate = useCallback((template: typeof TICKET_TEMPLATES[0]) => {
    setValue("subject", template.subject);
    setValue("description", template.description);
    addToast({ message: `قالب "${template.label}" اعمال شد`, variant: "success" });
  }, [setValue, addToast]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          setAttachments((prev) => [...prev, {
            url,
            filename: `clipboard-${Date.now()}.png`,
            originalName: `clipboard-${Date.now()}.png`,
            mime: file.type,
            size: file.size,
          }]);
          addToast({ message: "تصویر از کلیپ‌بورد اضافه شد", variant: "success" });
        }
        break;
      }
    }
  }, [addToast]);

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
      localStorage.removeItem(STORAGE_KEY);
      setSuccessData({ trackingCode: result.trackingCode ?? "TK-XXXX" });
    } else if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    } else if (result?.errors) {
      const firstError = Object.values(result.errors)[0]?.[0];
      addToast({ message: firstError ?? "لطفاً فیلدهای خطا را اصلاح کنید.", variant: "error" });
    }
  };

  const copyTrackingCode = () => {
    if (successData?.trackingCode) {
      navigator.clipboard.writeText(successData.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successData) {
    return (
      <div className="rounded-2xl border border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 p-8 text-center animate-fade-in-scale">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-accent-green/20 mb-6">
          <CheckCircle2 className="h-10 w-10 text-accent-green" />
        </div>
        <h2 className="text-2xl font-bold text-primary-navy mb-2">تیکت شما ثبت شد!</h2>
        <p className="text-text-muted mb-6">می‌توانید وضعیت تیکت را از پنل پیگیری کنید.</p>

        <div className="rounded-xl bg-white/80 border border-border p-4 mb-6">
          <p className="text-sm text-text-muted mb-2">کد پیگیری</p>
          <div className="flex items-center justify-center gap-3">
            <code className="text-xl font-bold text-primary-navy font-mono">{successData.trackingCode}</code>
            <button
              onClick={copyTrackingCode}
              className="flex items-center gap-1 rounded-lg bg-accent-green/10 px-3 py-1.5 text-sm text-accent-green hover:bg-accent-green/20 transition-colors"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "کپی شد" : "کپی"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="bg-accent-green hover:bg-accent-green/90">
            <a href={redirectTo ?? "/dashboard/tickets"} className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              <span>مشاهده تیکت‌ها</span>
            </a>
          </Button>
          <Button variant="outline" onClick={() => setSuccessData(null)} className="w-full">
            ثبت تیکت جدید
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Quick Templates */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
          <Sparkles className="h-4 w-4 text-accent-yellow" />
          قالب‌های سریع
        </label>
        <div className="flex flex-wrap gap-2">
          {TICKET_TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => applyTemplate(t)}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-text-muted hover:border-accent-green hover:text-accent-green transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" onPaste={handlePaste}>
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
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <option value="" disabled>دسته‌بندی انتخاب کنید</option>
                {Object.entries(TICKET_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              {category && TICKET_CATEGORY_DESCRIPTIONS[category] && (
                <p className="mt-1 text-xs text-text-muted flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {TICKET_CATEGORY_DESCRIPTIONS[category]}
                </p>
              )}
            </>
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
            <div>
              <Textarea
                {...field}
                placeholder="توضیحات کامل درخواست خود را بنویسید... (حداقل ۲۰ کاراکتر)"
                className="min-h-[140px]"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className={`text-xs ${charCount < 20 ? "text-red-500" : "text-text-muted"}`}>
                  {charCount} کاراکتر {charCount < 20 && `(${20 - charCount} کاراکتر بیشتر)`}
                </span>
                {charCount >= 20 && (
                  <span className="flex items-center gap-1 text-xs text-accent-green">
                    <CheckCircle2 className="h-3 w-3" />
                    تعداد کافی
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-muted flex items-center gap-1">
                <Clipboard className="h-3 w-3" />
                می‌توانید تصویر را از کلیپ‌بورد پیست کنید (Ctrl+V)
              </p>
            </div>
          )}
        />

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            فایل پیوست
          </label>
          <FileUpload value={attachments} onChange={setAttachments} />
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              لطفاً فیلدهای خطا را اصلاح کنید.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex-1"
            disabled={!watch("subject") || !watch("description")}
          >
            پیش‌نمایش
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={submitting}
            disabled={submitting || charCount < 20}
          >
            ثبت تیکت
          </Button>
        </div>
      </form>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fade-in-scale">
            <h3 className="text-lg font-bold text-primary-navy mb-4">پیش‌نمایش تیکت</h3>
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-xs text-text-muted">موضوع:</span>
                <p className="font-medium text-text">{watch("subject")}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">دسته‌بندی:</span>
                <p className="font-medium text-text">{TICKET_CATEGORY_LABELS[watch("category")]}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">اولویت:</span>
                <p className="font-medium text-text">{watch("priority")}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">توضیحات:</span>
                <p className="text-sm text-text whitespace-pre-wrap">{watch("description")}</p>
              </div>
              {attachments.length > 0 && (
                <div>
                  <span className="text-xs text-text-muted">پیوست‌ها: {attachments.length} فایل</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                بازگشت
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                className="flex-1"
                loading={submitting}
              >
                تأیید و ثبت
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
