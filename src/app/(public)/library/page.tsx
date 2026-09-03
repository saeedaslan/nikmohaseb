import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileText,
  Library as LibraryIcon,
  Search,
  Sparkles,
  ArrowLeft,
  Gavel,
  Briefcase,
  Building2,
  Landmark,
  ScrollText,
  BookMarked,
  Inbox,
  Layers,
  ShieldCheck,
  Compass,
  GraduationCap,
} from "lucide-react";
import { getPublishedLibraryCategories } from "@/lib/queries/library";
import { LibrarySearch } from "@/components/library/library-search";
import { domains } from "@/lib/nav";
import type { Metadata } from "next";

export const revalidate = 600;

const baseTitle = "کتابخانه قوانین و مقررات";
const baseDescription =
  "مرجع کامل قوانین و مقررات مالیاتی، تجاری، کار، تأمین اجتماعی و حسابداری به همراه مواد و دستورالعمل‌ها.";

export const metadata: Metadata = {
  title: baseTitle,
  description: baseDescription,
  alternates: {
    canonical: `${domains.primary}/library`,
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scale: Scale,
  book: BookOpen,
  file: FileText,
  gavel: Gavel,
  briefcase: Briefcase,
  building: Building2,
  landmark: Landmark,
  scroll: ScrollText,
};

const themeRing: string[] = [
"ring-emerald-500/20 hover:ring-emerald-500/40",
"ring-blue-500/20 hover:ring-blue-500/40",
"ring-amber-500/20 hover:ring-amber-500/40",
"ring-violet-500/20 hover:ring-violet-500/40",
"ring-rose-500/20 hover:ring-rose-500/40",
  "ring-cyan-500/20 hover:ring-cyan-500/40",
];

const themeAccent: string[] = [
"bg-emerald-500/10 text-emerald-600",
"bg-blue-500/10 text-blue-600",
"bg-amber-500/10 text-amber-600",
"bg-violet-500/10 text-violet-600",
"bg-rose-500/10 text-rose-600",
  "bg-cyan-500/10 text-cyan-600",
];

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function LibraryIndexPage() {
  const categories = await getPublishedLibraryCategories();
  const totalLaws = categories.reduce((s, c) => s + c._count.laws, 0);
  const nonEmpty = categories.filter((c) => c._count.laws > 0);

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Hero — simple, no video, no banner */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-card to-surface-background">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-green/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl" />
        <div className="relative container mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
            <Sparkles className="h-3.5 w-3.5" />
            مرجع حقوقی و مالیاتی
          </div>
          <h1 className="text-3xl font-extrabold text-primary-navy lg:text-4xl">
            {baseTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-text-muted lg:text-base">
            {baseDescription}
          </p>
          <div className="mt-6 max-w-xl">
            <LibrarySearch />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1">
              <Layers className="h-3.5 w-3.5" />
              {toPersian(categories.length)} دسته‌بندی
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1">
              <BookMarked className="h-3.5 w-3.5" />
              {toPersian(totalLaws)} قانون
            </span>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="container mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-primary-navy lg:text-2xl">
              دسته‌بندی موضوعی
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              قوانین را بر اساس موضوع مرور کنید
            </p>
          </div>
        </header>

        {nonEmpty.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">دسته‌بندی‌ای یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonEmpty.map((cat, idx) => {
              const Icon = iconMap[cat.icon ?? "file"] ?? FileText;
              const accent = themeAccent[idx % themeAccent.length];
              const ring = themeRing[idx % themeRing.length];
              return (
                <Link
                  key={cat.id}
                  href={`/library/categories/${cat.slug}`}
                  className={`group flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-md ${ring}`}
                >
                  <div
                    className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-primary-navy group-hover:text-accent-green">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                        {cat.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-accent-green">
                      {toPersian(cat._count.laws)} قانون
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3 simple info cards — no video, no banner */}
      <section className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            icon={GraduationCap}
            title="متن کامل مواد"
            description="متن رسمی به همراه تبصره‌ها و اصلاحات"
          />
          <InfoCard
            icon={Compass}
            title="دسترسی سریع"
            description="جستجوی هوشمند در عنوان و متن مواد"
          />
          <InfoCard
            icon={ShieldCheck}
            title="محتوای به‌روز"
            description="آخرین اصلاحات و بخشنامه‌های مرتبط"
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-primary-navy">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-text-muted">{description}</p>
      </div>
    </div>
  );
}
