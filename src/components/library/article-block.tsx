import { sanitizeHtml } from "@/lib/sanitize";
import { Link2, FileText, Calendar, ChevronLeft } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import Link from "next/link";

interface ArticleCircular {
  id: string;
  title: string;
  slug: string;
  number: string | null;
  date: Date | null;
}

interface ArticleBlockProps {
  id: string;
  number: number;
  title: string | null;
  content: string;
  circulars?: ArticleCircular[];
  prev?: { id: string; number: number; title: string | null } | null;
  next?: { id: string; number: number; title: string | null } | null;
  showNavigation?: boolean;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function ArticleBlock({
  id,
  number,
  title,
  content,
  circulars = [],
  prev,
  next,
  showNavigation = true,
}: ArticleBlockProps) {
  const sanitized = sanitizeHtml(content);

  return (
    <article
      id={id}
      className="group scroll-mt-24 rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:p-8"
    >
      <header className="mb-5 flex items-start gap-3 border-b border-border pb-4">
        <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-green/10 text-sm font-bold text-accent-green">
          {toPersian(number)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-accent-green">
            ماده {toPersian(number)}
          </div>
          {title && (
            <h3 className="mt-1 text-lg font-bold text-primary-navy">{title}</h3>
          )}
        </div>
        <a
          href={`#${id}`}
          className="rounded-md p-1.5 text-text-muted opacity-0 transition-opacity hover:bg-accent-green/10 hover:text-accent-green group-hover:opacity-100"
          aria-label={`لینک به ماده ${toPersian(number)}`}
        >
          <Link2 className="h-4 w-4" />
        </a>
      </header>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />

      {circulars.length > 0 && (
        <section className="mt-6 rounded-xl border border-accent-yellow/30 bg-accent-yellow/5 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-navy">
            <FileText className="h-4 w-4 text-accent-yellow" />
            بخشنامه‌های مرتبط با این ماده
          </h4>
          <ul className="space-y-2">
            {circulars.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/circulars/${c.slug}`}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-white p-3 transition-colors hover:border-accent-yellow hover:bg-accent-yellow/5"
                >
                  <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-yellow/10 text-accent-yellow">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      {c.number && (
                        <span className="rounded-full bg-accent-yellow/10 px-2 py-0.5 font-medium text-accent-yellow">
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
                    <div className="mt-1 text-sm font-medium text-primary-navy group-hover:text-accent-yellow line-clamp-1">
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

      {showNavigation && (prev || next) && (
        <nav
          className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between"
          aria-label="ناوبری بین مواد"
        >
          {prev ? (
            <a
              href={`#${prev.id}`}
              className="group flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface-background p-3 transition-colors hover:border-accent-green hover:bg-accent-green/5"
              aria-label={`رفتن به ماده ${toPersian(prev.number)} (قبلی)`}
            >
              <ChevronLeft className="h-5 w-5 text-text-muted group-hover:text-accent-green" />
              <div className="min-w-0">
                <div className="text-xs text-text-muted">ماده قبلی</div>
                <div className="font-bold text-primary-navy group-hover:text-accent-green line-clamp-1">
                  ماده {toPersian(prev.number)}
                </div>
              </div>
            </a>
          ) : (
            <div className="flex-1 rounded-xl border border-dashed border-border bg-surface-background/50 p-3 text-center text-xs text-text-muted">
              اولین ماده
            </div>
          )}
          {next ? (
            <a
              href={`#${next.id}`}
              className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-surface-background p-3 text-end transition-colors hover:border-accent-green hover:bg-accent-green/5"
              aria-label={`رفتن به ماده ${toPersian(next.number)} (بعدی)`}
            >
              <div className="min-w-0">
                <div className="text-xs text-text-muted">ماده بعدی</div>
                <div className="font-bold text-primary-navy group-hover:text-accent-green line-clamp-1">
                  ماده {toPersian(next.number)}
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-text-muted group-hover:text-accent-green" />
            </a>
          ) : (
            <div className="flex-1 rounded-xl border border-dashed border-border bg-surface-background/50 p-3 text-center text-xs text-text-muted">
              آخرین ماده
            </div>
          )}
        </nav>
      )}
    </article>
  );
}
