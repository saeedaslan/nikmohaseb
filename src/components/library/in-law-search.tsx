"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface InLawSearchProps {
  articles: { id: string; number: number; title: string | null; content: string }[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function highlight(text: string, query: string): string {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${safe})`, "gi"), '<mark class="bg-accent-yellow/40 text-primary-navy rounded px-0.5">$1</mark>');
}

export function InLawSearch({ articles }: InLawSearchProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const matches = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return articles
      .map((a) => {
        const text = stripHtml(a.content);
        const title = a.title?.toLowerCase() ?? "";
        if (text.toLowerCase().includes(q) || title.includes(q)) {
          const idx = text.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 60);
          const excerpt = (start > 0 ? "…" : "") + text.slice(start, idx + 120) + (idx + 120 < text.length ? "…" : "");
          return { id: a.id, number: a.number, title: a.title, excerpt };
        }
        return null;
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);
  }, [articles, query]);

  const current = matches[index];

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          placeholder="جستجو در این قانون..."
          className="w-full rounded-lg border border-border bg-surface-background py-2.5 ps-9 pe-9 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIndex(0);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-navy"
            aria-label="پاک کردن جستجو"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {query.length >= 2 && (
        <div className="mt-3 text-xs">
          {matches.length === 0 ? (
            <p className="text-text-muted">نتیجه‌ای برای «{query}» یافت نشد.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-text-muted">
                <span>
                  {toPersian(matches.length)} نتیجه یافت شد
                </span>
                {matches.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i - 1 + matches.length) % matches.length)}
                      className="rounded px-2 py-0.5 hover:bg-surface-background"
                      aria-label="نتیجه قبلی"
                    >
                      قبلی
                    </button>
                    <span>
                      {toPersian(index + 1)}/{toPersian(matches.length)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i + 1) % matches.length)}
                      className="rounded px-2 py-0.5 hover:bg-surface-background"
                      aria-label="نتیجه بعدی"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </div>
              {current && (
                <a
                  href={`#${current.id}`}
                  className="block rounded-lg border border-border bg-surface-background p-3 hover:border-accent-green hover:bg-accent-green/5"
                >
                  <div className="mb-1 text-xs font-bold text-primary-navy">
                    ماده {toPersian(current.number)}
                    {current.title ? ` - ${current.title}` : ""}
                  </div>
                  <p
                    className="text-xs leading-6 text-text-muted"
                    dangerouslySetInnerHTML={{ __html: highlight(current.excerpt, query) }}
                  />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
