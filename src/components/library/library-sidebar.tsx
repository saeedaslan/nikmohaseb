"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toOrdinalWord } from "@/lib/jalali";

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

interface LibrarySidebarProps {
  chapters: ChapterNav[];
  lawSlug: string;
  activeArticleSlug?: string;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function LibrarySidebar({ chapters, lawSlug, activeArticleSlug }: LibrarySidebarProps) {
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    chapters.forEach((c) => {
      init[c.id] = c.articles.some((a) => a.slug === activeArticleSlug) || chapters.length === 1;
    });
    return init;
  });

  return (
    <nav className="space-y-1 text-sm">
      {chapters.map((chapter) => {
        const hasActive = chapter.articles.some((a) => a.slug === activeArticleSlug);
        return (
          <div key={chapter.id} className="rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenChapters((p) => ({ ...p, [chapter.id]: !p[chapter.id] }))}
              className={cn(
                "w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start font-extrabold transition-colors hover:bg-accent-green/5",
                hasActive ? "text-primary-navy" : "text-primary-navy/80",
              )}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-navy to-accent-green text-[10px] font-black text-white">
                  {toPersian(chapter.number)}
                </span>
                <span className="truncate text-sm">باب {toOrdinalWord(chapter.number)}: {chapter.title}</span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 text-text-muted transition-transform",
                  openChapters[chapter.id] && "rotate-180",
                )}
              />
            </button>
            {openChapters[chapter.id] && chapter.articles.length > 0 && (
              <ul className="ms-3 mt-1 space-y-1 border-s border-border ps-3">
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
    </nav>
  );
}
