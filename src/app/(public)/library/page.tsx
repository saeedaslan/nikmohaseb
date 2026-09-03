import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileText,
  ChevronLeft,
  Library as LibraryIcon,
  Search,
  Sparkles,
  ArrowRight,
  Gavel,
  Briefcase,
  Building2,
  Landmark,
  ScrollText,
  TrendingUp,
  BookMarked,
  Inbox,
  Layers,
} from "lucide-react";
import { getPublishedLibraryCategories, getPublishedLibraryLaws } from "@/lib/queries/library";
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

const categoryThemes: Array<{
  gradient: string;
  ring: string;
  iconBg: string;
  iconColor: string;
  text: string;
  accent: string;
}> = [
  {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    ring: "ring-emerald-500/20 hover:ring-emerald-500/40",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconColor: "text-white",
    text: "group-hover:text-emerald-600",
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
    ring: "ring-blue-500/20 hover:ring-blue-500/40",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconColor: "text-white",
    text: "group-hover:text-blue-600",
    accent: "bg-blue-500/10 text-blue-600",
  },
  {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    ring: "ring-amber-500/20 hover:ring-amber-500/40",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    iconColor: "text-white",
    text: "group-hover:text-amber-600",
    accent: "bg-amber-500/10 text-amber-600",
  },
  {
    gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    ring: "ring-violet-500/20 hover:ring-violet-500/40",
    iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
    iconColor: "text-white",
    text: "group-hover:text-violet-600",
    accent: "bg-violet-500/10 text-violet-600",
  },
  {
    gradient: "from-rose-500/15 via-rose-500/5 to-transparent",
    ring: "ring-rose-500/20 hover:ring-rose-500/40",
    iconBg: "bg-gradient-to-br from-rose-500 to-rose-600",
    iconColor: "text-white",
    text: "group-hover:text-rose-600",
    accent: "bg-rose-500/10 text-rose-600",
  },
  {
    gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    ring: "ring-cyan-500/20 hover:ring-cyan-500/40",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    iconColor: "text-white",
    text: "group-hover:text-cyan-600",
    accent: "bg-cyan-500/10 text-cyan-600",
  },
];

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default async function LibraryIndexPage() {
  const [categories, allLaws] = await Promise.all([
    getPublishedLibraryCategories(),
    getPublishedLibraryLaws(),
  ]);

  const totalLaws = categories.reduce((s, c) => s + c._count.laws, 0);
  const nonEmptyCategories = categories.filter((c) => c._count.laws > 0);

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent-green/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute right-1/3 top-1/2 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl animate-float" style={{ animationDelay: '0.7s' }} />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-accent-yellow" />
                <span className="text-sm font-medium text-white/90">مرجع رسمی حقوقی و مالیاتی</span>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white lg:text-5xl xl:text-6xl">
                کتابخانه قوانین و مقررات
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
                دسترسی سریع به تمامی قوانین، مواد و دستورالعمل‌های مالیاتی، تجاری و حسابداری — به‌روز، دقیق و قابل جستجو
              </p>

              <div className="mt-8 max-w-2xl">
                <LibrarySearch />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                  <Layers className="h-3.5 w-3.5" />
                  {toPersian(categories.length)} دسته‌بندی
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                  <BookMarked className="h-3.5 w-3.5" />
                  {toPersian(totalLaws)} قانون
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                  <Search className="h-3.5 w-3.5" />
                  جستجوی هوشمند
                </span>
              </div>
            </div>

            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent-yellow/30 to-accent-green/30 blur-2xl" />
                <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-3">
                    {nonEmptyCategories.slice(0, 4).map((cat) => {
                      const Icon = iconMap[cat.icon ?? "file"] ?? FileText;
                      return (
                        <Link
                          key={cat.id}
                          href={`/library/categories/${cat.slug}`}
                          className="group flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/20"
                        >
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-sm font-bold text-white">{cat.title}</div>
                          <div className="text-xs text-white/60">{toPersian(cat._count.laws)} قانون</div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-4 rounded-2xl border border-accent-yellow/30 bg-accent-yellow/10 p-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold text-accent-yellow">
                      <TrendingUp className="h-3.5 w-3.5" />
                      پیشنهاد ویژه
                    </div>
                    <div className="mt-2 text-sm leading-7">
                      با جستجوی سریع، به متن کامل مواد قانونی به همراه بخشنامه‌های مرتبط دسترسی پیدا کنید.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-background to-transparent" />
      </section>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <SectionHeader
          icon={Layers}
          eyebrow="دسته‌بندی موضوعی"
          title="مرور قوانین بر اساس موضوع"
          description={`${toPersian(nonEmptyCategories.length)} دسته‌بندی اصلی برای دسترسی سریع به قوانین مرتبط`}
        />

        {nonEmptyCategories.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="دسته‌بندی‌ای یافت نشد"
            description="به‌زودی دسته‌بندی‌های جدید اضافه خواهند شد."
          />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nonEmptyCategories.map((cat, idx) => {
              const Icon = iconMap[cat.icon ?? "file"] ?? FileText;
              const theme = categoryThemes[idx % categoryThemes.length];
              return (
                <Link
                  key={cat.id}
                  href={`/library/categories/${cat.slug}`}
                  className={`group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${theme.ring}`}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className={`inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg ${theme.iconBg} ${theme.iconColor}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${theme.accent}`}>
                        <BookMarked className="h-3 w-3" />
                        {toPersian(cat._count.laws)}
                      </div>
                    </div>
                    <h3 className={`mt-5 text-lg font-extrabold text-primary-navy transition-colors ${theme.text}`}>
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-text-muted">
                        {cat.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                      <span className="text-xs text-text-muted">مشاهده قوانین</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-background text-text-muted transition-all group-hover:bg-primary-navy group-hover:text-white group-hover:[&_svg]:-translate-x-0.5">
                        <ArrowRight className="h-4 w-4 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Recent laws */}
        {allLaws.length > 0 && (
          <section className="mt-16">
            <SectionHeader
              icon={BookMarked}
              eyebrow="جدیدترین قوانین"
              title="آخرین قوانین اضافه شده"
              description={`${toPersian(allLaws.length)} قانون در کتابخانه موجود است`}
              action={
                <Link
                  href="/library"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-green hover:underline"
                >
                  مشاهده همه
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allLaws.slice(0, 6).map((law) => (
                <LawCard key={law.id} law={law} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function LawCard({ law }: { law: { id: string; slug: string; title: string; description: string | null; status: string | null; category: { title: string } } }) {
  return (
    <Link
      href={`/library/laws/${law.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-green to-accent-yellow opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
          <LibraryIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          {law.status && (
            <span className="mb-1 inline-block rounded-full bg-accent-green/10 px-2.5 py-0.5 text-xs font-bold text-accent-green">
              {law.status}
            </span>
          )}
          <h3 className="text-base font-extrabold text-primary-navy transition-colors group-hover:text-accent-green line-clamp-2">
            {law.title}
          </h3>
        </div>
      </div>
      {law.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-text-muted">{law.description}</p>
      )}
      <div className="mt-auto flex items-center justify-end pt-4">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-green transition-all group-hover:gap-2">
          مشاهده قانون
          <ChevronLeft className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-green">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>
        <h2 className="mt-2 text-2xl font-extrabold text-primary-navy lg:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-border bg-white p-12 text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-primary-navy">{title}</h3>
      {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
    </div>
  );
}
