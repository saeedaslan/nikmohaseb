"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toOrdinalWord } from "@/lib/jalali";

export interface LawTocItem {
  id: string;
  number: number;
  title: string | null;
  slug: string;
  chapter: {
    id: string;
    number: number;
    title: string;
  };
}

interface ArticleNavProps {
  lawSlug: string;
  articles: LawTocItem[];
  activeArticleId: string;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function ArticleNav({ lawSlug, articles, activeArticleId }: ArticleNavProps) {
  const activeIdx = articles.findIndex((a) => a.id === activeArticleId);
  const prev = activeIdx > 0 ? articles[activeIdx - 1] : null;
  const next = activeIdx >= 0 && activeIdx < articles.length - 1 ? articles[activeIdx + 1] : null;

  return (
    <nav
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:hidden"
      aria-label="ناوبری بین مواد"
    >
      {prev ? (
        <Link
          href={`/library/laws/${lawSlug}/articles/${prev.slug}`}
          className="group relative overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-md"
          aria-label={`رفتن به ماده ${toPersian(prev.number)} (قبلی)`}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-accent-green/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-3">
            <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-text-muted">ماده قبلی</div>
              <div className="mt-0.5 text-sm font-extrabold text-primary-navy transition-colors group-hover:text-accent-green line-clamp-1">
                ماده {toPersian(prev.number)}
                {prev.title ? ` - ${prev.title}` : ""}
              </div>
              <div className="mt-0.5 text-[10px] text-text-muted line-clamp-1">
                باب {toOrdinalWord(prev.chapter.number)}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-surface-background/50 p-5 text-center text-xs text-text-muted">
          شما در اولین ماده هستید
        </div>
      )}
      {next ? (
        <Link
          href={`/library/laws/${lawSlug}/articles/${next.slug}`}
          className="group relative overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-green/40 hover:shadow-md"
          aria-label={`رفتن به ماده ${toPersian(next.number)} (بعدی)`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-green/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-3 text-end">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-text-muted">ماده بعدی</div>
              <div className="mt-0.5 text-sm font-extrabold text-primary-navy transition-colors group-hover:text-accent-green line-clamp-1">
                ماده {toPersian(next.number)}
                {next.title ? ` - ${next.title}` : ""}
              </div>
              <div className="mt-0.5 text-[10px] text-text-muted line-clamp-1">
                باب {toOrdinalWord(next.chapter.number)}
              </div>
            </div>
            <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-surface-background/50 p-5 text-center text-xs text-text-muted">
          شما در آخرین ماده هستید
        </div>
      )}
    </nav>
  );
}
