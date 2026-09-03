"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Loader2, FileText, Sparkles, X } from "lucide-react";

interface SearchResult {
  id: string;
  number: number;
  title: string | null;
  slug: string;
  excerpt: string;
  path: {
    lawTitle: string;
    lawSlug: string;
    bookTitle: string;
    bookNumber: number;
    chapterTitle: string;
    chapterNumber: number;
  };
}

export function LibrarySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    if (query.length < 2) {
      Promise.resolve().then(() => {
        if (!cancelled) setResults([]);
      });
      return () => {
        cancelled = true;
        ctrl.abort();
      };
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/library/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (!cancelled) {
          setResults(data.results ?? []);
          setOpen(true);
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError" && !cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="جستجو در قوانین، مواد و دستورالعمل‌ها... (مثلاً: ماده ۱۳۱ یا ارزش افزوده)"
          className="w-full h-14 rounded-2xl border border-white/30 bg-white/95 backdrop-blur-xl pr-12 pl-12 text-base text-primary-navy shadow-2xl shadow-black/20 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/30"
        />
        {loading ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-green animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-navy"
            aria-label="پاک کردن"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-yellow" />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-white/98 backdrop-blur shadow-2xl overflow-hidden z-50 max-h-[28rem] overflow-y-auto">
          <div className="border-b border-border bg-surface-background px-4 py-2.5 text-xs font-bold text-text-muted">
            {toPersianDigits(results.length)} نتیجه برای «{query}»
          </div>
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/library/laws/${r.path.lawSlug}/articles/${r.slug}`}
              onClick={() => setOpen(false)}
              className="group block border-b border-border last:border-0 px-4 py-3 transition-colors hover:bg-accent-green/5"
            >
              <div className="flex items-start gap-3">
                <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-primary-navy transition-colors group-hover:text-accent-green">
                    ماده {toPersianDigits(r.number)}
                    {r.title ? ` - ${r.title}` : ""}
                  </div>
                  <div className="mt-0.5 text-xs text-text-muted">{r.path.lawTitle}</div>
                  <div className="mt-1 text-xs leading-6 text-text-muted line-clamp-2">
                    {r.excerpt}
                  </div>
                  <div className="mt-1.5 text-[10px] text-text-muted">
                    کتاب {toPersianDigits(r.path.bookNumber)} › فصل {toPersianDigits(r.path.chapterNumber)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
