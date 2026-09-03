"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { createLibraryLaw, updateLibraryLaw } from "@/lib/actions/library";
import { Calendar, Save, ArrowLeft, Library as LibraryIcon } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  title: string;
}

interface Props {
  initial?: {
    id: string;
    title: string;
    slug: string;
    categoryId: string;
    description: string | null;
    approvalDate: string | null;
    executionDate: string | null;
    status: string | null;
    order: number;
    published: boolean;
  };
  categories: Category[];
}

function toDateInput(d: Date | string | null): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export function LibraryLawForm({ initial, categories }: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    description: initial?.description ?? "",
    approvalDate: toDateInput(initial?.approvalDate ?? null),
    executionDate: toDateInput(initial?.executionDate ?? null),
    status: initial?.status ?? "",
    order: initial?.order ?? 0,
    published: initial?.published ?? true,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    const result = initial
      ? await updateLibraryLaw(initial.id, fd)
      : await createLibraryLaw(fd);
    setSubmitting(false);
    if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    } else {
      addToast({ message: "ذخیره شد.", variant: "success" });
      router.push("/admin/library/laws");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary-navy">
          {initial ? `ویرایش «${initial.title}»` : "قانون جدید"}
        </h1>
        <Link
          href="/admin/library/laws"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-accent-green/5 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
              <LibraryIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary-navy">اطلاعات اصلی</h2>
              <p className="text-xs text-text-muted">عنوان، دسته‌بندی و توضیحات قانون</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">عنوان قانون</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثلاً: قانون مالیات بر ارزش افزوده"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">اسلاگ (URL)</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="vat-law"
                dir="ltr"
              />
              <p className="mt-1 text-[10px] text-text-muted">در صورت خالی بودن، خودکار از عنوان ساخته می‌شود.</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-navy">دسته‌بندی</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="flex h-11 w-full rounded-xl border border-border bg-surface-background px-3 text-sm focus:border-accent-green focus:outline-none"
              required
            >
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-navy">توضیحات</label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="توضیح کوتاه درباره این قانون..."
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-amber-500/5 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary-navy">تاریخ‌ها و وضعیت</h2>
              <p className="text-xs text-text-muted">تاریخ تصویب، اجرا و وضعیت فعلی</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">تاریخ تصویب</label>
              <Input
                type="date"
                value={form.approvalDate}
                onChange={(e) => setForm({ ...form, approvalDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">تاریخ اجرا</label>
              <Input
                type="date"
                value={form.executionDate}
                onChange={(e) => setForm({ ...form, executionDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">وضعیت</label>
              <Input
                value={form.status ?? ""}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="مثلاً: پایدار، اصلاحیه، در دست بررسی"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">ترتیب نمایش</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
              <p className="mt-1 text-[10px] text-text-muted">عدد کمتر = نمایش بالاتر</p>
            </div>
          </div>
          <div>
            <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-background px-3">
              <Checkbox
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span className="text-sm font-bold">منتشر شود</span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <Link href="/admin/library/laws">
          <Button type="button" variant="outline">انصراف</Button>
        </Link>
        <Button type="submit" loading={submitting} disabled={submitting}>
          <Save className="h-4 w-4" />
          {initial ? "ذخیره تغییرات" : "ایجاد قانون"}
        </Button>
      </div>
    </form>
  );
}
