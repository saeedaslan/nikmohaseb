import { sanitizeHtml } from "@/lib/sanitize";
import {
  Link2,
  FileText,
  Calendar,
  History,
  StickyNote,
  Layers,
} from "lucide-react";
import { toJalali } from "@/lib/jalali";
import Link from "next/link";
import { ArticleActions } from "./article-actions";

interface ArticleCircular {
  id: string;
  title: string;
  slug: string;
  number: string | null;
  date: Date | null;
}

interface ArticleDisplayProps {
  id: string;
  number: number;
  title: string | null;
  content: string;
  circulars?: ArticleCircular[];
  notes?: { id: string; content: string }[];
  history?: { id: string; changeDate: Date; changeType: string; description: string; source: string | null }[];
  related?: { id: string; number: number; title: string | null; slug: string }[];
  articleUrl?: string;
  articleTitle?: string;
  chapterLabel?: string;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function ArticleDisplay({
  id,
  number,
  title,
  content,
  circulars = [],
  notes = [],
  history = [],
  related = [],
  articleUrl,
  articleTitle,
  chapterLabel,
}: ArticleDisplayProps) {
  const sanitized = sanitizeHtml(content);
  const showActions = !!articleUrl && !!articleTitle;

  return (
    <article
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
    >
      {/* Compact action bar — number/title are shown in the page H1 above */}
      {showActions && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-background/40 px-5 py-3 sm:px-6 print:hidden">
          <div className="flex min-w-0 items-center gap-2 text-xs text-text-muted">
            <Layers className="h-3.5 w-3.5 flex-shrink-0 text-accent-green" />
            <span className="truncate">
              {chapterLabel ?? "متن رسمی قانون"}
            </span>
            {title && (
              <>
                <span className="text-text-muted/40">·</span>
                <span className="truncate font-bold text-accent-green">{title}</span>
              </>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <ArticleActions
              articleUrl={articleUrl!}
              articleTitle={articleTitle!}
              variant="card"
            />
          </div>
        </header>
      )}

      {/* Article body — constrained reading width */}
      <div className="px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
        <div
          className="article-body article-content mx-auto max-w-[44rem]"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </div>

      {/* Notes (تبصره‌ها) — visually distinct, numbered */}
      {notes.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/[0.04] px-5 py-7 sm:px-8 lg:px-10">
          <header className="mx-auto mb-5 flex max-w-[44rem] items-center gap-2.5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-yellow/15 text-accent-yellow ring-1 ring-accent-yellow/20">
              <StickyNote className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-primary-navy">
                تبصره‌ها
              </h3>
              <p className="text-[11px] text-text-muted">
                {toPersian(notes.length)} تبصره ضمیمه شده به این ماده
              </p>
            </div>
          </header>
          <ol className="mx-auto max-w-[44rem] space-y-3">
            {notes.map((n, i) => (
              <li
                key={n.id}
                className="relative rounded-2xl border border-accent-yellow/25 border-r-[3px] border-r-accent-yellow bg-gradient-to-l from-accent-yellow/[0.06] to-white p-4 shadow-sm sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-accent-yellow/15 px-2 text-[11px] font-black text-accent-yellow ring-1 ring-accent-yellow/20">
                    {toPersian(i + 1)}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-yellow">
                    تبصره {toPersian(i + 1)}
                  </span>
                </div>
                <div
                  className="tabareh-content text-[0.95rem] leading-[2.1] text-text"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(n.content) }}
                />
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Related articles (within same law) */}
      {related.length > 0 && (
        <section className="border-t border-border px-5 py-7 sm:px-8 lg:px-10">
          <header className="mx-auto mb-4 flex max-w-[44rem] items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
              <Link2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">مواد مرتبط</h3>
          </header>
          <div className="mx-auto grid max-w-[44rem] grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`#${r.id}`}
                className="group rounded-2xl border border-border bg-surface-background px-3 py-2.5 text-center text-xs font-bold text-primary-navy transition-all hover:-translate-y-0.5 hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
              >
                ماده {toPersian(r.number)}
                {r.title ? (
                  <div className="mt-0.5 text-[10px] font-normal text-text-muted line-clamp-1">
                    {r.title}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Circulars (small related list) */}
      {circulars.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/[0.04] px-5 py-7 sm:px-8 lg:px-10">
          <header className="mx-auto mb-3 flex max-w-[44rem] items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow/20 text-accent-yellow">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-primary-navy">
              بخشنامه‌های مرتبط ({toPersian(circulars.length)})
            </h3>
          </header>
          <ul className="mx-auto max-w-[44rem] space-y-2">
            {circulars.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/circulars/${c.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-accent-yellow/30 bg-white px-3 py-2.5 text-sm transition-colors hover:border-accent-yellow hover:bg-accent-yellow/10"
                >
                  {c.number && (
                    <span className="flex-shrink-0 rounded-md bg-accent-yellow/10 px-2 py-0.5 text-[11px] font-extrabold text-accent-yellow">
                      {c.number}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate font-bold text-primary-navy group-hover:text-accent-yellow">
                    {c.title}
                  </span>
                  {c.date && (
                    <span className="hidden flex-shrink-0 text-[11px] text-text-muted sm:inline">
                      {toJalali(c.date)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section className="border-t border-border px-5 py-7 sm:px-8 lg:px-10">
          <header className="mx-auto mb-4 flex max-w-[44rem] items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
              <History className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">سیر تحول ماده</h3>
          </header>
          <ol className="relative mx-auto max-w-[44rem] space-y-3 border-r-2 border-accent-green/30 pr-5">
            {history.map((h) => (
              <li key={h.id} className="relative">
                <span className="absolute -right-[26px] top-3 inline-block h-3 w-3 rounded-full border-2 border-white bg-accent-green shadow" />
                <div className="rounded-2xl border border-accent-green/20 bg-accent-green/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {toJalali(h.changeDate)}
                    </span>
                    <span className="rounded-full bg-accent-green/20 px-2 py-0.5 font-bold text-accent-green">
                      {h.changeType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-8 text-primary-navy/90">
                    {h.description}
                  </p>
                  {h.source && (
                    <p className="mt-1 text-xs text-text-muted">منبع: {h.source}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
