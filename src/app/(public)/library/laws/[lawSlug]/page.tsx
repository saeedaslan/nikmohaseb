import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ChevronLeft,
  Library as LibraryIcon,
  Layers,
  Inbox,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { getLibraryLawBySlug } from "@/lib/queries/library";
import { domains } from "@/lib/nav";
import { BreadcrumbSchema } from "@/components/structured-data";
import { notFoundMeta } from "@/lib/seo";
import { ItemBadge, toPersianDigits } from "@/components/library/item-badge";
import { toOrdinalWord } from "@/lib/jalali";
import type { Metadata } from "next";

export const revalidate = 600;

const toPersian = toPersianDigits;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lawSlug: string }>;
}): Promise<Metadata> {
  const { lawSlug } = await params;
  const law = await getLibraryLawBySlug(lawSlug);
  const canonical = `${domains.primary}/library/laws/${lawSlug}`;
  if (!law) {
    return notFoundMeta({ canonical, fallbackTitle: "قانون یافت نشد" });
  }
  const fallbackDesc = law.description
    ? law.description.slice(0, 160)
    : `متن کامل ${law.title} به همراه تمامی مواد و تبصره‌ها`;
  return {
    title: law.seoTitle || `${law.title} | کتابخانه قوانین`,
    description: law.seoDescription || fallbackDesc,
    keywords: [law.title, law.category.title, "قانون", "متن قانون", "مواد قانونی"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: law.seoTitle || law.title,
      description: law.seoDescription || fallbackDesc,
      url: canonical,
      siteName: "نیک محاسب سرو",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title: law.seoTitle || law.title,
      description: law.seoDescription || fallbackDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LibraryLawPage({
  params,
}: {
  params: Promise<{ lawSlug: string }>;
}) {
  const { lawSlug } = await params;
  const law = await getLibraryLawBySlug(lawSlug);
  if (!law || !law.published) notFound();

  const basePath = `/library/laws/${law.slug}`;
  const chapters = law.chapters;
  const totalArticles = chapters.reduce((s, c) => s + c.articles.length, 0);

  // Single-article law: skip chapter list and go straight to the article
  if (totalArticles === 1) {
    const only = chapters.flatMap((c) => c.articles)[0];
    if (only) redirect(`${basePath}/articles/${only.slug}`);
  }

  // No articles at all → empty state
  if (totalArticles === 0) {
    return (
      <div className="min-h-screen bg-surface-background">
        <BreadcrumbSchema
          items={[
            { name: "خانه", href: "/" },
            { name: "کتابخانه قوانین", href: "/library" },
            { name: law.title, href: basePath },
          ]}
        />
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-text-muted" />
            <h2 className="mt-3 text-lg font-bold text-primary-navy">
              هنوز ماده‌ای برای این قانون ثبت نشده است
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              ساختار کامل این قانون به‌زودی اضافه خواهد شد.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-background">
      <BreadcrumbSchema
        items={[
          { name: "خانه", href: "/" },
          { name: "کتابخانه قوانین", href: "/library" },
          { name: law.title, href: basePath },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-card to-surface-background">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-green/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl" />
        <div className="relative container mx-auto max-w-5xl px-4 py-8 lg:py-12">
          <nav className="mb-4 text-sm text-text-muted" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-accent-green">خانه</Link>
              </li>
              <li className="text-text-muted/50">‹</li>
              <li>
                <Link href="/library" className="hover:text-accent-green">
                  کتابخانه قوانین
                </Link>
              </li>
              <li className="text-text-muted/50">‹</li>
              <li className="font-bold text-primary-navy">{law.title}</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
            <Layers className="h-3.5 w-3.5" />
            {law.category.title}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-primary-navy lg:text-3xl">
            {law.title}
          </h1>
          {law.description && (
            <p className="mt-2 max-w-2xl text-sm leading-8 text-text-muted">
              {law.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1">
              <FileText className="h-3.5 w-3.5" />
              {toPersian(chapters.length)} باب
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1">
              <LibraryIcon className="h-3.5 w-3.5" />
              {toPersian(totalArticles)} ماده
            </span>
          </div>
        </div>
      </section>

      {/* Chapter list — table of contents */}
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-primary-navy lg:text-lg">
              فهرست مطالب
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              ساختار کامل این قانون، فصل به فصل
            </p>
          </div>
          <ProgressIndicator chapters={chapters} />
        </div>

        {chapters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-3 text-base font-bold text-primary-navy">
              فصلی ثبت نشده است
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              به‌زودی فصل‌های این قانون اضافه خواهند شد.
            </p>
          </div>
        ) : (
          <ChapterToc chapters={chapters} basePath={basePath} />
        )}

        <div className="mt-8 text-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            بازگشت به کتابخانه
          </Link>
        </div>
      </section>
    </div>
  );
}

function ChapterToc({
  chapters,
  basePath,
}: {
  chapters: {
    id: string;
    number: number;
    title: string;
    articles: { id: string; number: number; title: string | null; slug: string; published: boolean }[];
  }[];
  basePath: string;
}) {
  return (
    <ol className="relative space-y-2.5">
      {/* Vertical connector line on the right (RTL start side) */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[27px] top-3 bottom-3 w-px bg-gradient-to-b from-accent-green/40 via-accent-green/20 to-transparent"
      />
      {chapters.map((chapter) => {
        const articles = chapter.articles;
        const publishedCount = articles.filter((a) => a.published).length;
        const first = articles[0]?.number;
        const last = articles[articles.length - 1]?.number;
        const rangeText =
          first && last
            ? first === last
              ? `ماده ${toPersian(first)}`
              : `مواد ${toPersian(first)} تا ${toPersian(last)}`
            : "—";
        const firstSlug = articles[0]?.slug;
        return (
          <li key={chapter.id} className="relative">
            {firstSlug ? (
              <Link
                href={`${basePath}/articles/${firstSlug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-green/40 hover:bg-accent-green/[0.03] hover:shadow-md sm:p-4"
              >
                <ItemBadge number={chapter.number} toPersian={toPersian} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold text-primary-navy transition-colors group-hover:text-accent-green lg:text-base">
                      <span className="text-accent-green">باب {toOrdinalWord(chapter.number)}:</span>{" "}
                      {chapter.title}
                    </h3>
                    <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-[10px] font-bold text-accent-green">
                      {toPersian(articles.length)} ماده
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {rangeText}
                    </span>
                    {publishedCount < articles.length && (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <Layers className="h-3 w-3" />
                        {toPersian(publishedCount)} از {toPersian(articles.length)} منتشر
                      </span>
                    )}
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent-green" />
              </Link>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface-background/50 p-3 sm:p-4">
                <ItemBadge number={chapter.number} toPersian={toPersian} muted />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-text-muted">
                    {chapter.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-text-muted">
                    هنوز ماده‌ای در این فصل ثبت نشده است.
                  </p>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ProgressIndicator({
  chapters,
}: {
  chapters: { articles: { published: boolean }[] }[];
}) {
  const total = chapters.reduce((s, c) => s + c.articles.length, 0);
  const published = chapters.reduce(
    (s, c) => s + c.articles.filter((a) => a.published).length,
    0,
  );
  const pct = total === 0 ? 0 : Math.round((published / total) * 100);
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/[0.06] px-3 py-1 text-[11px] font-bold text-accent-green">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-green shadow shadow-accent-green/40" />
        {toPersian(published)} از {toPersian(total)} ماده منتشر شده
      </div>
      <div
        className="h-1 w-44 overflow-hidden rounded-full bg-accent-green/15"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="پیشرفت انتشار مواد"
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-accent-green to-accent-green-light transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
