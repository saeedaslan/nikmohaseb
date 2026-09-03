import Link from "next/link";
import { listLibraryCategories, deleteLibraryCategory } from "@/lib/actions/library";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
} from "lucide-react";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "دسته‌بندی کتابخانه | ادمین | نیک محاسب سرو",
};

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function LibraryCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const all = await listLibraryCategories();
  const q = (sp.q ?? "").trim().toLowerCase();
  const status = sp.status ?? "all";

  const categories = all.filter((c) => {
    if (q && !c.title.toLowerCase().includes(q)) return false;
    if (status === "published" && !c.published) return false;
    if (status === "draft" && c.published) return false;
    return true;
  });

  async function handleDelete(id: string) {
    "use server";
    await deleteLibraryCategory(id);
    revalidatePath("/admin/library/categories");
  }

  const totalCount = all.length;
  const publishedCount = all.filter((c) => c.published).length;
  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-5 shadow-sm lg:p-6">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">دسته‌بندی‌های کتابخانه</h1>
            <p className="mt-1 text-sm text-white/70">
              مدیریت دسته‌بندی موضوعی قوانین
            </p>
          </div>
          <Button asChild variant="accent" size="sm" className="bg-accent-yellow text-primary-navy shadow-lg shadow-accent-yellow/30 hover:bg-accent-yellow/90">
            <Link href="/admin/library/categories/new">
              <Plus className="h-4 w-4" />
              <span className="mr-1">دسته‌بندی جدید</span>
            </Link>
          </Button>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur text-white">
            <FolderTree className="h-3.5 w-3.5 text-accent-yellow" />
            {toPersian(totalCount)} دسته
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-green/40 bg-accent-green/10 px-3 py-1 backdrop-blur text-accent-green">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {toPersian(publishedCount)} منتشر
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur text-white">
            <Clock className="h-3.5 w-3.5" />
            {toPersian(draftCount)} پیش‌نویس
          </span>
        </div>
      </section>

      <form className="rounded-3xl border border-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="جستجو در عنوان..."
              className="w-full h-11 rounded-xl border border-border bg-surface-background pe-9 ps-3 text-sm focus:border-accent-green focus:outline-none"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="flex h-11 rounded-xl border border-border bg-surface-background px-3 text-sm"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-text-muted">{toPersian(categories.length)} نتیجه</p>
          <Button type="submit" size="sm" variant="outline">
            اعمال فیلتر
          </Button>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
            <FolderTree className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="mt-4 text-base font-bold text-primary-navy">نتیجه‌ای یافت نشد</h3>
          <p className="mt-1 text-sm text-text-muted">
            اولین دسته‌بندی کتابخانه را ایجاد کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-lg"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                    <FolderTree className="h-5 w-5" />
                  </div>
                  {c.published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-0.5 text-[10px] font-bold text-accent-green">
                      <CheckCircle2 className="h-3 w-3" />
                      منتشر
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-text-muted">
                      <Clock className="h-3 w-3" />
                      پیش‌نویس
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-extrabold text-primary-navy line-clamp-1">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-text-muted">
                    {c.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {toPersian(c._count.laws)} قانون
                  </span>
                  <span className="text-text-muted/40">/</span>
                  <span className="font-mono text-[10px]">{c.slug}</span>
                </div>
                <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-border/60 pt-3">
                  <Link
                    href={`/admin/library/categories/${c.id}/edit`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-background text-primary-navy transition-colors hover:border-blue-500 hover:bg-blue-500/10"
                    title="ویرایش"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Link>
                  <form action={handleDelete.bind(null, c.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
