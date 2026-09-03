"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LawTocItem } from "./article-nav";

interface Props {
  articles: LawTocItem[];
  lawSlug: string;
  activeArticleId: string | null;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function ArticleSidebar({ articles, lawSlug, activeArticleId }: Props) {
  const [open, setOpen] = useState(false);

  if (articles.length === 0) return null;

  const basePath = `/library/laws/${lawSlug}/articles`;

  return (
    <>
      {/* Mobile floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold text-primary-navy shadow-lg lg:hidden"
        aria-label="نمایش فهرست مواد"
      >
        <List className="h-4 w-4" />
        فهرست مواد ({toPersian(articles.length)})
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
              <h2 className="font-bold text-primary-navy">فهرست مواد</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-primary-navy"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="max-h-[calc(80vh-4rem)] overflow-y-auto p-4">
              <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {articles.map((a) => {
                  const isActive = a.id === activeArticleId;
                  return (
                    <li key={a.id}>
                      <Link
                        href={`${basePath}/${a.slug}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md border px-2 py-1.5 text-center text-xs font-bold transition-colors",
                          isActive
                            ? "border-accent-green bg-accent-green/15 text-accent-green"
                            : "border-border bg-white text-primary-navy hover:border-accent-green/50 hover:text-accent-green",
                        )}
                      >
                        ماده {toPersian(a.number)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sticky sidebar */}
      <nav
        aria-label="فهرست مواد"
        className="hidden lg:block lg:sticky lg:w-72 lg:flex-shrink-0"
        style={{ top: "1.5rem" }}
      >
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-sm font-extrabold text-primary-navy">
            <List className="h-4 w-4 text-accent-green" />
            فهرست مواد
            <span className="ms-auto rounded-full bg-surface-background px-2 py-0.5 text-xs text-text-muted">
              {toPersian(articles.length)}
            </span>
          </div>
          <ul className="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto pr-1">
            {articles.map((a) => {
              const isActive = a.id === activeArticleId;
              return (
                <li key={a.id}>
                  <Link
                    href={`${basePath}/${a.slug}`}
                    className={cn(
                      "flex items-start gap-2 rounded-lg px-2.5 py-2 text-[12px] leading-6 transition-all",
                      isActive
                        ? "bg-accent-green/15 font-extrabold text-accent-green ring-1 ring-accent-green/30"
                        : "text-text-muted hover:bg-surface-background hover:text-primary-navy",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-5 w-7 flex-shrink-0 items-center justify-center rounded text-[10px] font-black",
                        isActive
                          ? "bg-accent-green text-white"
                          : "bg-surface-background text-text-muted",
                      )}
                    >
                      {toPersian(a.number)}
                    </span>
                    <span className="min-w-0 break-words">
                      {a.title ? (
                        <>
                          <span className="block font-extrabold">ماده {toPersian(a.number)}</span>
                          <span className="block text-[11px] font-normal opacity-80 line-clamp-2">{a.title}</span>
                        </>
                      ) : (
                        `ماده ${toPersian(a.number)}`
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
