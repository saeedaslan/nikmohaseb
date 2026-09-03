import { sanitizeHtml } from "@/lib/sanitize";
import {
  Link2,
  FileText,
  Calendar,
  ChevronLeft,
  Sparkles,
  History,
  StickyNote,
  Copy,
  Printer,
  Check,
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
}: ArticleDisplayProps) {
  const sanitized = sanitizeHtml(content);
  const showActions = !!articleUrl && !!articleTitle;

  return (
    <article
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
    >
      {/* Article header */}
      <header className="relative overflow-hidden border-b border-border bg-gradient-to-bl from-surface-background via-white to-accent-green/5 p-6 lg:p-8">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-accent-green/10 blur-2xl" />
        <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-accent-yellow/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green to-accent-green-light text-2xl font-black text-white shadow-lg shadow-accent-green/30">
            {toPersian(number)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-green">
              <Sparkles className="h-3.5 w-3.5" />
              ماده {toPersian(number)}
            </div>
            {title && (
              <h2 className="mt-2 text-xl font-extrabold leading-snug text-primary-navy lg:text-2xl">
                {title}
              </h2>
            )}
          </div>
          {showActions && (
            <div className="flex flex-shrink-0 items-center gap-1.5 print:hidden">
              <ArticleActions
                articleUrl={articleUrl!}
                articleTitle={articleTitle!}
                variant="card"
              />
            </div>
          )}
        </div>
      </header>

      {/* Article content */}
      <div className="p-6 lg:p-8">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </div>

      {/* Notes */}
      {notes.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/5 p-6 lg:p-8">
          <header className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-yellow/20 text-accent-yellow">
              <StickyNote className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">نکات مهم</h3>
          </header>
          <ul className="space-y-3">
            {notes.map((n) => (
              <li
                key={n.id}
                className="flex gap-3 rounded-2xl border-r-4 border-accent-yellow bg-white p-4 text-sm leading-8 text-primary-navy/90 shadow-sm"
              >
                <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-yellow" />
                <span>{n.content}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related articles (within same law) */}
      {related.length > 0 && (
        <section className="border-t border-border p-6 lg:p-8">
          <header className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
              <Link2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">مواد مرتبط</h3>
          </header>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
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

      {/* Circulars */}
      {circulars.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/5 p-6 lg:p-8">
          <header className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-yellow/20 text-accent-yellow">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-primary-navy">
                بخشنامه‌های مرتبط با این ماده
              </h3>
              <p className="text-xs text-text-muted">
                {toPersian(circulars.length)} بخشنامه ضمیمه شده
              </p>
            </div>
          </header>
          <ul className="space-y-2.5">
            {circulars.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/circulars/${c.slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-accent-yellow/30 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-accent-yellow hover:shadow-md"
                >
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-yellow/10 text-accent-yellow transition-colors group-hover:bg-accent-yellow group-hover:text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      {c.number && (
                        <span className="rounded-full bg-accent-yellow/10 px-2 py-0.5 font-bold text-accent-yellow">
                          شماره {c.number}
                        </span>
                      )}
                      {c.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {toJalali(c.date)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm font-bold text-primary-navy transition-colors group-hover:text-accent-yellow line-clamp-2">
                      {c.title}
                    </div>
                  </div>
                  <ChevronLeft className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section className="border-t border-border p-6 lg:p-8">
          <header className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
              <History className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">سیر تحول ماده</h3>
          </header>
          <ol className="relative space-y-3 border-r-2 border-accent-green/30 pr-5">
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
