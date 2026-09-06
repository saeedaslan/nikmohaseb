import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileText,
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
  Receipt,
  Store,
  Calculator,
  Wallet,
  Coins,
  type LucideIcon,
} from "lucide-react";
import { getPublishedLibraryCategories } from "@/lib/queries/library";
import { LibrarySearch } from "@/components/library/library-search";
import { ItemBadge, toPersianDigits, type BadgeTone } from "@/components/library/item-badge";
import { toJalali } from "@/lib/jalali";
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

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  book: BookOpen,
  file: FileText,
  gavel: Gavel,
  briefcase: Briefcase,
  building: Building2,
  landmark: Landmark,
  scroll: ScrollText,
  receipt: Receipt,
  store: Store,
  calculator: Calculator,
  wallet: Wallet,
  coins: Coins,
};

const accentMap: Record<string, { tone: BadgeTone; ring: string; chip: string; textColor: string; hoverText: string }> = {
  scale: {
    tone: "navy-green",
    ring: "ring-primary-navy/15 hover:ring-primary-navy/30 hover:border-primary-navy/30",
    chip: "bg-primary-navy/10 text-primary-navy",
    textColor: "text-primary-navy",
    hoverText: "group-hover:text-primary-navy",
  },
  landmark: {
    tone: "navy-green",
    ring: "ring-primary-navy/15 hover:ring-primary-navy/30 hover:border-primary-navy/30",
    chip: "bg-primary-navy/10 text-primary-navy",
    textColor: "text-primary-navy",
    hoverText: "group-hover:text-primary-navy",
  },
  gavel: {
    tone: "navy-green",
    ring: "ring-primary-navy/15 hover:ring-primary-navy/30 hover:border-primary-navy/30",
    chip: "bg-primary-navy/10 text-primary-navy",
    textColor: "text-primary-navy",
    hoverText: "group-hover:text-primary-navy",
  },
  receipt: {
    tone: "green-yellow",
    ring: "ring-accent-green/20 hover:ring-accent-green/40 hover:border-accent-green/40",
    chip: "bg-accent-green/10 text-accent-green",
    textColor: "text-accent-green",
    hoverText: "group-hover:text-accent-green",
  },
  file: {
    tone: "green-yellow",
    ring: "ring-accent-green/20 hover:ring-accent-green/40 hover:border-accent-green/40",
    chip: "bg-accent-green/10 text-accent-green",
    textColor: "text-accent-green",
    hoverText: "group-hover:text-accent-green",
  },
  coins: {
    tone: "green-yellow",
    ring: "ring-accent-green/20 hover:ring-accent-green/40 hover:border-accent-green/40",
    chip: "bg-accent-green/10 text-accent-green",
    textColor: "text-accent-green",
    hoverText: "group-hover:text-accent-green",
  },
  store: {
    tone: "yellow-navy",
    ring: "ring-accent-yellow/25 hover:ring-accent-yellow/50 hover:border-accent-yellow/40",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    textColor: "text-accent-yellow",
    hoverText: "group-hover:text-accent-yellow",
  },
  calculator: {
    tone: "yellow-navy",
    ring: "ring-accent-yellow/25 hover:ring-accent-yellow/50 hover:border-accent-yellow/40",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    textColor: "text-accent-yellow",
    hoverText: "group-hover:text-accent-yellow",
  },
  wallet: {
    tone: "yellow-navy",
    ring: "ring-accent-yellow/25 hover:ring-accent-yellow/50 hover:border-accent-yellow/40",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    textColor: "text-accent-yellow",
    hoverText: "group-hover:text-accent-yellow",
  },
  book: {
    tone: "navy-green",
    ring: "ring-primary-navy/15 hover:ring-primary-navy/30 hover:border-primary-navy/30",
    chip: "bg-primary-navy/10 text-primary-navy",
    textColor: "text-primary-navy",
    hoverText: "group-hover:text-primary-navy",
  },
  briefcase: {
    tone: "green-yellow",
    ring: "ring-accent-green/20 hover:ring-accent-green/40 hover:border-accent-green/40",
    chip: "bg-accent-green/10 text-accent-green",
    textColor: "text-accent-green",
    hoverText: "group-hover:text-accent-green",
  },
  building: {
    tone: "green-yellow",
    ring: "ring-accent-green/20 hover:ring-accent-green/40 hover:border-accent-green/40",
    chip: "bg-accent-green/10 text-accent-green",
    textColor: "text-accent-green",
    hoverText: "group-hover:text-accent-green",
  },
  scroll: {
    tone: "yellow-navy",
    ring: "ring-accent-yellow/25 hover:ring-accent-yellow/50 hover:border-accent-yellow/40",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    textColor: "text-accent-yellow",
    hoverText: "group-hover:text-accent-yellow",
  },
};

const fallbackAccent: { tone: BadgeTone; ring: string; chip: string; textColor: string; hoverText: string } = {
  tone: "navy-green",
  ring: "ring-primary-navy/15 hover:ring-primary-navy/30 hover:border-primary-navy/30",
  chip: "bg-primary-navy/10 text-primary-navy",
  textColor: "text-primary-navy",
  hoverText: "group-hover:text-primary-navy",
};

const toPersian = toPersianDigits;

export default async function LibraryIndexPage() {
  const categories = await getPublishedLibraryCategories();
  const totalLaws = categories.reduce((s, c) => s + c._count.laws, 0);
  const nonEmpty = categories
    .filter((c) => c._count.laws > 0)
    .map((c) => {
      const articleCount = c.laws.reduce(
        (s, l) => s + l.chapters.reduce((cs, ch) => cs + ch._count.articles, 0),
        0,
      );
      const latestUpdate = c.laws
        .map((l) => l.updatedAt)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
      return { ...c, articleCount, latestUpdate };
    });

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
            {nonEmpty.map((cat) => {
              const Icon = iconMap[cat.icon ?? "file"] ?? FileText;
              const accent = accentMap[cat.icon ?? "file"] ?? fallbackAccent;
              return (
                <Link
                  key={cat.id}
                  href={`/library/categories/${cat.slug}`}
                  className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-accent-green/0 blur-2xl transition-colors duration-300 group-hover:bg-accent-green/10"
                  />
                  <div className="relative flex items-start gap-4">
                    <ItemBadge icon={Icon} tone={accent.tone} size="lg" />
                    <div className="min-w-0 flex-1 pt-1">
                      <h3
                        className={`text-base font-extrabold transition-colors ${accent.textColor} ${accent.hoverText}`}
                      >
                        {cat.title}
                      </h3>
                      {cat.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-6 text-text-muted">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${accent.chip}`}
                      >
                        <Layers className="h-3 w-3" />
                        {toPersian(cat._count.laws)} قانون
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-background px-2 py-0.5 font-bold text-text-muted">
                        <FileText className="h-3 w-3" />
                        {toPersian(cat.articleCount)} ماده
                      </span>
                    </div>
                    {cat.latestUpdate && (
                      <span className="text-[10px] text-text-muted">
                        آخرین به‌روزرسانی: {toJalali(cat.latestUpdate)}
                      </span>
                    )}
                  </div>
                  <span
                    className={`relative inline-flex items-center gap-1 self-end text-[11px] font-bold transition-all group-hover:gap-2 ${accent.textColor}`}
                  >
                    مشاهده قوانین
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                  </span>
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
