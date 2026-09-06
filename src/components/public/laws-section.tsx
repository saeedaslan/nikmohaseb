import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Scale,
  Calendar,
  Library as LibraryIcon,
  BookMarked,
  Layers,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { toJalali } from "@/lib/jalali";
import {
  ItemBadge,
  toPersianDigits,
  type BadgeTone,
} from "@/components/library/item-badge";

export type LawCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  date: Date | null;
  number: string | null;
  issuer: string | null;
  createdAt: Date;
  category: { name: string; icon?: string | null };
  chapterCount: number;
  articleCount: number;
  latestUpdate: Date;
};

const toPersian = toPersianDigits;

const fallbackAccent = {
  tone: "navy-green" as BadgeTone,
  chip: "bg-primary-navy/10 text-primary-navy",
  badge: "bg-accent-green/10 text-accent-green",
  iconBg: "from-primary-navy/10 to-primary-navy/5",
};

const accentMap: Record<
  string,
  { tone: BadgeTone; chip: string; badge: string; iconBg: string }
> = {
  scale: { tone: "navy-green", chip: "bg-primary-navy/10 text-primary-navy", badge: "bg-accent-green/10 text-accent-green", iconBg: "from-primary-navy/10 to-primary-navy/5" },
  landmark: { tone: "navy-green", chip: "bg-primary-navy/10 text-primary-navy", badge: "bg-accent-green/10 text-accent-green", iconBg: "from-primary-navy/10 to-primary-navy/5" },
  gavel: { tone: "navy-green", chip: "bg-primary-navy/10 text-primary-navy", badge: "bg-accent-green/10 text-accent-green", iconBg: "from-primary-navy/10 to-primary-navy/5" },
  book: { tone: "navy-green", chip: "bg-primary-navy/10 text-primary-navy", badge: "bg-accent-green/10 text-accent-green", iconBg: "from-primary-navy/10 to-primary-navy/5" },
  receipt: { tone: "green-yellow", chip: "bg-accent-green/10 text-accent-green", badge: "bg-accent-yellow/10 text-accent-yellow", iconBg: "from-accent-green/10 to-accent-green/5" },
  file: { tone: "green-yellow", chip: "bg-accent-green/10 text-accent-green", badge: "bg-accent-yellow/10 text-accent-yellow", iconBg: "from-accent-green/10 to-accent-green/5" },
  coins: { tone: "green-yellow", chip: "bg-accent-green/10 text-accent-green", badge: "bg-accent-yellow/10 text-accent-yellow", iconBg: "from-accent-green/10 to-accent-green/5" },
  briefcase: { tone: "green-yellow", chip: "bg-accent-green/10 text-accent-green", badge: "bg-accent-yellow/10 text-accent-yellow", iconBg: "from-accent-green/10 to-accent-green/5" },
  building: { tone: "green-yellow", chip: "bg-accent-green/10 text-accent-green", badge: "bg-accent-yellow/10 text-accent-yellow", iconBg: "from-accent-green/10 to-accent-green/5" },
  store: { tone: "yellow-navy", chip: "bg-accent-yellow/10 text-accent-yellow", badge: "bg-primary-navy/10 text-primary-navy", iconBg: "from-accent-yellow/10 to-accent-yellow/5" },
  calculator: { tone: "yellow-navy", chip: "bg-accent-yellow/10 text-accent-yellow", badge: "bg-primary-navy/10 text-primary-navy", iconBg: "from-accent-yellow/10 to-accent-yellow/5" },
  wallet: { tone: "yellow-navy", chip: "bg-accent-yellow/10 text-accent-yellow", badge: "bg-primary-navy/10 text-primary-navy", iconBg: "from-accent-yellow/10 to-accent-yellow/5" },
  scroll: { tone: "yellow-navy", chip: "bg-accent-yellow/10 text-accent-yellow", badge: "bg-primary-navy/10 text-primary-navy", iconBg: "from-accent-yellow/10 to-accent-yellow/5" },
};

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  landmark: LibraryIcon,
  gavel: Scale,
  book: BookMarked,
  receipt: FileText,
  file: FileText,
  coins: Layers,
  briefcase: LibraryIcon,
  building: LibraryIcon,
  store: LibraryIcon,
  calculator: Sparkles,
  wallet: LibraryIcon,
  scroll: BookMarked,
};

export async function LawsSection({ laws }: { laws: LawCardData[] }) {
  return (
    <section className="py-24 bg-gradient-to-b from-surface-background to-surface-card relative overflow-hidden">
      <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-primary-navy/5 blur-3xl" />
      <div className="absolute -right-40 bottom-40 h-80 w-80 rounded-full bg-accent-green/5 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary-navy/10 px-4 py-1 text-xs font-medium text-primary-navy">
              قوانین رسمی
            </span>
            <h2 className="mb-2 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
              آخرین قوانین مالیاتی
            </h2>
            <p className="max-w-xl text-sm text-text-muted sm:text-base">
              قوانین مالی و مالیاتی منتشر شده
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-accent-green hover:bg-accent-green/10"
          >
            <Link href="/library">
              مشاهده همه
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {laws.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            قانونی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {laws.map((l, index) => {
              const Icon = iconMap[l.category?.icon ?? "file"] ?? FileText;
              const accent = accentMap[l.category?.icon ?? "file"] ?? fallbackAccent;
              return (
                <Link key={l.id} href={`/library/laws/${l.slug}`} className="group block">
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-border">
                    <div
                      className={`relative flex h-52 w-full items-center justify-center bg-gradient-to-br ${accent.iconBg}`}
                    >
                      <ItemBadge icon={Icon} tone={accent.tone} size="lg" />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {l.category && (
                        <span
                          className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${accent.chip}`}
                        >
                          {l.category.name}
                        </span>
                      )}

                      <h3 className="mb-3 text-lg font-bold leading-7 text-primary-navy transition-colors group-hover:text-accent-green">
                        {l.title}
                      </h3>

                      {l.summary && (
                        <p className="mb-4 flex-1 text-sm leading-6 text-text-muted line-clamp-2">
                          {l.summary}
                        </p>
                      )}

                      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 font-bold ${accent.badge}`}>
                          <Layers className="h-3.5 w-3.5" />
                          {toPersian(l.chapterCount)} باب
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 font-bold text-text-muted">
                          <FileText className="h-3.5 w-3.5" />
                          {toPersian(l.articleCount)} ماده
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-text-muted">
                          <Calendar className="h-3.5 w-3.5" />
                          {toJalali(l.latestUpdate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-navy/10 px-3 py-1 text-xs font-medium text-primary-navy">
                          قانون مالیاتی
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green transition-all group-hover:gap-2">
                          مشاهده جزئیات
                          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-navy text-xs font-bold text-white shadow-lg">
                        جدید
                      </div>
                    )}
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-navy px-8 text-white hover:bg-primary-navy/90 hover:shadow-lg hover:shadow-primary-navy/20 transition-all duration-300"
          >
            <Link href="/library">
              مشاهده همه قوانین
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
