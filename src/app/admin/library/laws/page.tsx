import Link from "next/link";
import { listLibraryLaws, deleteLibraryLaw } from "@/lib/actions/library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Library as LibraryIcon,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "قوانین کتابخانه | ادمین | نیک محاسب سرو",
};

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function AdminLibraryLawsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const allLaws = await listLibraryLaws();

  const q = (sp.q ?? "").trim().toLowerCase();
  const status = sp.status ?? "all";
  const categoryFilter = sp.category ?? "all";

  const categories = Array.from(
    new Map(allLaws.map((l) => [l.category.id, l.category])).values(),
  );

  const laws = allLaws.filter((l) => {
    if (q && !l.title.toLowerCase().includes(q)) return false;
    if (status === "published" && !l.published) return false;
    if (status === "draft" && l.published) return false;
    if (categoryFilter !== "all" && l.category.id !== categoryFilter) return false;
    return true;
  });

  async function handleDelete(id: string) {
    "use server";
    await deleteLibraryLaw(id);
    revalidatePath("/admin/library/laws");
  }

  const totalCount = allLaws.length;
  const publishedCount = allLaws.filter((l) => l.published).length;
  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-5 shadow-sm lg:p-6">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-green/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">قوانین کتابخانه</h1>
            <p className="mt-1 text-sm text-white/70">
              مدیریت و ویرایش قوانین ثبت شده
            </p>
          </div>
          <Button asChild variant="accent" size="sm" className="bg-accent-yellow text-primary-navy shadow-lg shadow-accent-yellow/30 hover:bg-accent-yellow/90">
            <Link href="/admin/library/laws/new">
              <Plus className="h-4 w-4" />
              <span className="mr-1">قانون جدید</span>
            </Link>
          </Button>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur text-white">
            <LibraryIcon className="h-3.5 w-3.5 text-accent-yellow" />
            {toPersian(totalCount)} قانون
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

      {/* Filters */}
      <form className="rounded-3xl border border-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="جستجو در عنوان..."
              className="pe-9"
            />
          </div>
          <select
            name="category"
            defaultValue={categoryFilter}
            className="flex h-11 rounded-xl border border-border bg-surface-background px-3 text-sm"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
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
          <p className="text-xs text-text-muted">
            {toPersian(laws.length)} نتیجه
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/library/laws"
              className="text-xs text-text-muted hover:text-accent-green"
            >
              پاک کردن فیلتر
            </Link>
            <Button type="submit" size="sm" variant="outline">
              <Filter className="h-3.5 w-3.5" />
              اعمال فیلتر
            </Button>
          </div>
        </div>
      </form>

      {/* Laws list */}
      {laws.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
            <LibraryIcon className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="mt-4 text-base font-bold text-primary-navy">
            نتیجه‌ای یافت نشد
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {q || status !== "all" || categoryFilter !== "all"
              ? "فیلترهای دیگری را امتحان کنید."
              : "اولین قانون کتابخانه را ایجاد کنید."}
          </p>
          {!q && status === "all" && categoryFilter === "all" && (
            <Button asChild variant="accent" size="sm" className="mt-4">
              <Link href="/admin/library/laws/new">
                <Plus className="h-4 w-4" />
                <span className="mr-1">قانون جدید</span>
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {laws.map((l) => (
            <div
              key={l.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-green/30 hover:shadow-lg"
            >
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-accent-green to-accent-yellow opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green/10 to-accent-yellow/10 text-accent-green">
                    <LibraryIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-primary-navy">
                        {l.title}
                      </h3>
                      {l.published ? (
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
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {l.category.title}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {toPersian(l._count.books)} کتاب
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/library/laws/${l.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent-green px-3 text-xs font-extrabold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-green/90"
                  >
                    مدیریت مواد
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/admin/library/laws/${l.id}/edit`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-background text-primary-navy transition-colors hover:border-accent-green hover:bg-accent-green/10"
                    title="ویرایش"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <form action={handleDelete.bind(null, l.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
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
