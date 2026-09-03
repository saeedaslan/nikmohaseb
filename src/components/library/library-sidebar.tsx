"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleNav {
  id: string;
  number: number;
  title: string | null;
  slug: string;
}

interface ChapterNav {
  id: string;
  title: string;
  number: number;
  articles: ArticleNav[];
}

interface BookNav {
  id: string;
  title: string;
  number: number;
  chapters: ChapterNav[];
}

interface LibrarySidebarProps {
  structure: BookNav[];
  lawSlug: string;
  activeArticleSlug?: string;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function LibrarySidebar({ structure, lawSlug, activeArticleSlug }: LibrarySidebarProps) {
  const [openBooks, setOpenBooks] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    structure.forEach((b) => {
      const isActive = b.chapters.some((c) =>
        c.articles.some((a) => a.slug === activeArticleSlug),
      );
      init[b.id] = isActive || structure.length === 1;
    });
    return init;
  });
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    structure.forEach((b) => {
      b.chapters.forEach((c) => {
        init[c.id] = c.articles.some((a) => a.slug === activeArticleSlug);
      });
    });
    return init;
  });

  return (
    <nav className="space-y-1 text-sm">
      {structure.map((book) => (
        <div key={book.id} className="rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenBooks((p) => ({ ...p, [book.id]: !p[book.id] }))}
            className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start font-extrabold text-primary-navy transition-colors hover:bg-accent-green/5"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-navy to-accent-green text-[10px] font-black text-white">
                {toPersian(book.number)}
              </span>
              <span className="truncate text-sm">{book.title}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 text-text-muted transition-transform",
                openBooks[book.id] && "rotate-180",
              )}
            />
          </button>
          {openBooks[book.id] && (
            <div className="ms-3 mt-1 space-y-0.5 border-s border-border ps-3">
              {book.chapters.map((chapter) => {
                const hasActive = chapter.articles.some((a) => a.slug === activeArticleSlug);
                return (
                  <div key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => setOpenChapters((p) => ({ ...p, [chapter.id]: !p[chapter.id] }))}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-start text-xs transition-colors",
                        hasActive
                          ? "font-bold text-primary-navy"
                          : "text-text-muted hover:text-primary-navy",
                      )}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">فصل {toPersian(chapter.number)}: {chapter.title}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 flex-shrink-0 transition-transform",
                          openChapters[chapter.id] && "rotate-180",
                        )}
                      />
                    </button>
                    {openChapters[chapter.id] && chapter.articles.length > 0 && (
                      <ul className="ms-2 mt-1 space-y-1 border-s border-border ps-2">
                        {chapter.articles.map((a) => {
                          const isActive = a.slug === activeArticleSlug;
                          return (
                            <li key={a.id}>
                              <Link
                                href={`/library/laws/${lawSlug}/articles/${a.slug}`}
                                className={cn(
                                  "flex items-start gap-2 rounded-lg px-2.5 py-2 text-[12px] leading-6 transition-all",
                                  isActive
                                    ? "bg-accent-green/15 font-extrabold text-accent-green ring-1 ring-accent-green/30 shadow-sm"
                                    : "text-text-muted hover:bg-surface-background hover:text-primary-navy",
                                )}
                                title={a.title ?? `ماده ${toPersian(a.number)}`}
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
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
