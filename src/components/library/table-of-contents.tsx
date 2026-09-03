"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, List } from "lucide-react";

interface TocItem {
  id: string;
  number: number;
  title: string | null;
}

interface TableOfContentsProps {
  articles: TocItem[];
  lawSlug: string;
  stickyOffset?: number;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function TableOfContents({ articles, lawSlug, stickyOffset = 0 }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (articles.length === 0) return;
    const elements = articles
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${stickyOffset + 100}px 0px -50% 0px`, threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [articles, stickyOffset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, []);

  if (articles.length === 0) return null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary-navy shadow-lg lg:hidden"
        aria-expanded={open}
        aria-label="نمایش فهرست مطالب"
      >
        <List className="h-4 w-4" />
        فهرست مطالب ({toPersian(articles.length)})
      </button>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <aside
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-bold text-primary-navy">فهرست مطالب</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-primary-navy"
                aria-label="بستن"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            <nav className="max-h-[calc(80vh-4rem)] overflow-y-auto p-4">
              <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {articles.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`#${a.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-md border border-border bg-white px-2 py-1.5 text-center text-xs font-medium transition-colors",
                        activeId === a.id
                          ? "border-accent-green bg-accent-green/10 text-accent-green"
                          : "text-primary-navy hover:border-accent-green/50 hover:text-accent-green",
                      )}
                    >
                      ماده {toPersian(a.number)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sticky TOC */}
      <nav
        aria-label="فهرست مطالب"
        className="hidden lg:block lg:sticky lg:w-64 lg:flex-shrink-0"
        style={{ top: `${stickyOffset + 24}px` }}
      >
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-sm font-bold text-primary-navy">
            <List className="h-4 w-4 text-accent-green" />
            فهرست مطالب
            <span className="ms-auto rounded-full bg-surface-background px-2 py-0.5 text-xs text-text-muted">
              {toPersian(articles.length)}
            </span>
          </div>
          <ul className="max-h-[calc(100vh-12rem)] space-y-0.5 overflow-y-auto pr-1">
            {articles.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className={cn(
                    "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    activeId === a.id
                      ? "bg-accent-green/10 font-bold text-accent-green"
                      : "text-text-muted hover:bg-surface-background hover:text-primary-navy",
                  )}
                  aria-current={activeId === a.id ? "true" : undefined}
                >
                  <span className="inline-block w-14 text-text-muted/70">ماده {toPersian(a.number)}</span>
                  {a.title && <span className="line-clamp-1">{a.title}</span>}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-border pt-3">
            <Link
              href={`/library/laws/${lawSlug}`}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-green"
            >
              بازگشت به ساختار قانون
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

