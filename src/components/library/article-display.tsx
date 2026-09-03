import { sanitizeHtml } from "@/lib/sanitize";
import {
  Link2,
  FileText,
  Calendar,
  History,
  StickyNote,
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
      {/* Article header (compact — full title is shown above in the page H1) */}
      <header className="relative flex flex-col gap-4 border-b border-border bg-surface-background/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green to-accent-green-light text-lg font-black text-white shadow shadow-accent-green/30">
            {toPersian(number)}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent-green">
            ماده {toPersian(number)} — متن رسمی قانون
          </div>
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
      </header>

      {/* Article content */}
      <div className="p-6 lg:p-8">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </div>

      {/* Notes (تبصره‌ها) */}
      {notes.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/5 p-6 lg:p-8">
          <header className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-yellow/20 text-accent-yellow">
              <StickyNote className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-primary-navy">
              تبصره‌ها
            </h3>
          </header>
          <ol className="space-y-3">
            {notes.map((n, i) => (
              <li
                key={n.id}
                className="rounded-2xl border-r-4 border-accent-yellow bg-white p-4 text-sm leading-8 text-primary-navy/90 shadow-sm"
              >
                <span className="mb-1 block text-xs font-extrabold text-accent-yellow">
                  تبصره {toPersian(i + 1)}
                </span>
                <span className="block">{n.content}</span>
              </li>
            ))}
          </ol>
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

      {/* Circulars (small related list) */}
      {circulars.length > 0 && (
        <section className="border-t border-border bg-accent-yellow/5 p-6 lg:p-8">
          <header className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow/20 text-accent-yellow">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-primary-navy">
              بخشنامه‌های مرتبط ({toPersian(circulars.length)})
            </h3>
          </header>
          <ul className="space-y-2">
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
