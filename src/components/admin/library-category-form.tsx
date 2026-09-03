"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import {
  createLibraryCategory,
  updateLibraryCategory,
} from "@/lib/actions/library";
import {
  FolderTree,
  Scale,
  BookOpen,
  FileText,
  Sparkles,
  Save,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initial?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    order: number;
    published: boolean;
  };
}

const ICON_OPTIONS = [
  { value: "file", label: "فایل", Icon: FileText },
  { value: "scale", label: "ترازو", Icon: Scale },
  { value: "book", label: "کتاب", Icon: BookOpen },
  { value: "folder", label: "پوشه", Icon: FolderTree },
];

export function LibraryCategoryForm({ initial }: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "file",
    order: initial?.order ?? 0,
    published: initial?.published ?? true,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    const result = initial
      ? await updateLibraryCategory(initial.id, fd)
      : await createLibraryCategory(fd);
    setSubmitting(false);
    if (result?.error) {
      addToast({ message: result.error, variant: "error" });
    } else {
      addToast({ message: "ذخیره شد.", variant: "success" });
      router.push("/admin/library/categories");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary-navy">
          {initial ? `ویرایش «${initial.title}»` : "دسته‌بندی جدید"}
        </h1>
        <Link
          href="/admin/library/categories"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-blue-500/5 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary-navy">اطلاعات اصلی</h2>
              <p className="text-xs text-text-muted">عنوان و توضیحات دسته‌بندی</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">عنوان</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثلاً: قوانین مالیاتی"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">اسلاگ (URL)</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="tax-laws"
                dir="ltr"
              />
              <p className="mt-1 text-[10px] text-text-muted">در صورت خالی بودن، خودکار از عنوان ساخته می‌شود.</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-navy">توضیحات</label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="توضیح کوتاه درباره این دسته‌بندی..."
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-gradient-to-l from-violet-500/5 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary-navy">نمایش و ترتیب</h2>
              <p className="text-xs text-text-muted">آیکون، ترتیب و وضعیت انتشار</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-primary-navy">آیکون</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ICON_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                const isActive = form.icon === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, icon: opt.value })}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all ${
                      isActive
                        ? "border-accent-green bg-accent-green/5 text-accent-green"
                        : "border-border bg-white text-text-muted hover:border-accent-green/40"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-bold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">ترتیب نمایش</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
              <p className="mt-1 text-[10px] text-text-muted">عدد کمتر = نمایش بالاتر</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-navy">وضعیت</label>
              <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-background px-3">
                <Checkbox
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <span className="text-sm font-bold">منتشر شود</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <Link href="/admin/library/categories">
          <Button type="button" variant="outline">انصراف</Button>
        </Link>
        <Button type="submit" loading={submitting} disabled={submitting}>
          <Save className="h-4 w-4" />
          {initial ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
        </Button>
      </div>
    </form>
  );
}
