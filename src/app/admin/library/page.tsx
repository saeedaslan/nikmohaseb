import Link from "next/link";
import {
  listLibraryCategories,
  getLibraryStats,
  getRecentLaws,
} from "@/lib/actions/library";
import {
  Plus,
  FolderTree,
  Library as LibraryIcon,
  FileText,
  Link2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "کتابخانه قوانین | ادمین | نیک محاسب سرو",
};

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function AdminLibraryPage() {
  const [stats, recentLaws, categories] = await Promise.all([
    getLibraryStats(),
    getRecentLaws(5),
    listLibraryCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-6 shadow-sm lg:p-8">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-green/30 blur-3xl animate-float" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-yellow" />
              مدیریت کتابخانه
            </div>
            <h1 className="mt-3 text-2xl font-black text-white lg:text-3xl">
              کتابخانه قوانین و مقررات
            </h1>
            <p className="mt-1.5 text-sm text-white/70">
              مدیریت دسته‌بندی‌ها، قوانین، کتاب‌ها، فصل‌ها و مواد
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/library/categories/new"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <FolderTree className="h-3.5 w-3.5" />
              دسته‌بندی جدید
            </Link>
            <Link
              href="/admin/library/laws/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent-yellow px-3 py-2 text-xs font-extrabold text-primary-navy shadow-lg shadow-accent-yellow/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              قانون جدید
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={FolderTree}
          label="دسته‌بندی"
          value={toPersian(stats.categories)}
          sub={`${toPersian(stats.publishedCategories)} منتشر شده`}
          gradient="from-blue-500/10 to-blue-500/5"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={LibraryIcon}
          label="قوانین"
          value={toPersian(stats.laws)}
          sub={`${toPersian(stats.publishedLaws)} منتشر شده`}
          gradient="from-emerald-500/10 to-emerald-500/5"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={FileText}
          label="مواد"
          value={toPersian(stats.articles)}
          sub={`${toPersian(stats.publishedArticles)} منتشر شده`}
          gradient="from-amber-500/10 to-amber-500/5"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={Link2}
          label="بخشنامه ضمیمه"
          value={toPersian(stats.attachedCirculars)}
          sub="به مواد"
          gradient="from-violet-500/10 to-violet-500/5"
          iconColor="text-violet-600"
        />
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/library/categories"
          className="group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
              <FolderTree className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-primary-navy transition-colors group-hover:text-blue-600">
                دسته‌بندی‌ها
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                ایجاد و مدیریت دسته‌بندی موضوعی قوانین ({toPersian(stats.categories)} مورد)
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 text-text-muted transition-transform group-hover:-translate-x-1" />
          </div>
        </Link>
        <Link
          href="/admin/library/laws"
          className="group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-green/5 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green to-accent-green-light text-white shadow-lg shadow-accent-green/30">
              <LibraryIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-primary-navy transition-colors group-hover:text-accent-green">
                قوانین
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                مدیریت قوانین، کتاب‌ها، فصل‌ها و مواد ({toPersian(stats.laws)} مورد)
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 text-text-muted transition-transform group-hover:-translate-x-1" />
          </div>
        </Link>
      </section>

      {/* Recent laws + Categories preview */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h2 className="text-base font-extrabold text-primary-navy">قوانین اخیر</h2>
            </div>
            <Link
              href="/admin/library/laws"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent-green hover:underline"
            >
              مشاهده همه
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </header>
          {recentLaws.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">قانونی ثبت نشده است.</p>
          ) : (
            <ul className="space-y-2">
              {recentLaws.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/admin/library/laws/${l.id}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-background p-3 transition-all hover:border-accent-green/40 hover:bg-accent-green/5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                        <LibraryIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-primary-navy line-clamp-1">
                          {l.title}
                        </div>
                        <div className="mt-0.5 text-xs text-text-muted">
                          {l.category.title} · {toPersian(l._count.books)} کتاب
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1.5">
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
                      <ArrowLeft className="h-4 w-4 text-text-muted transition-transform group-hover:-translate-x-1" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <FolderTree className="h-4 w-4" />
              </div>
              <h2 className="text-base font-extrabold text-primary-navy">دسته‌بندی‌ها</h2>
            </div>
            <Link
              href="/admin/library/categories"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            >
              مدیریت
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </header>
          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">دسته‌بندی‌ای ثبت نشده.</p>
          ) : (
            <ul className="space-y-2">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/library/categories/${c.id}/edit`}
                    className="group flex items-center justify-between gap-2 rounded-2xl border border-border bg-surface-background p-3 transition-colors hover:border-blue-500/40 hover:bg-blue-500/5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FolderTree className="h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span className="text-sm font-bold text-primary-navy line-clamp-1">
                        {c.title}
                      </span>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                      {toPersian(c._count.laws)} قانون
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
      <div className="relative">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-background ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-3 text-2xl font-black text-primary-navy">{value}</div>
        <div className="mt-0.5 text-xs font-bold text-text-muted">{label}</div>
        {sub && <div className="mt-1 text-[10px] text-text-muted">{sub}</div>}
      </div>
    </div>
  );
}
