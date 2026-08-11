"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  current: number;
  pages: number;
  total: number;
  basePath: string;
}

export function Pagination({ current, pages, basePath }: PaginationProps) {
  if (pages <= 1) return null;

  const range = generateRange(1, pages);
  const items: (number | string)[] = [];
  range.forEach((p) => {
    if (p === 1 || p === pages || (p >= current - 1 && p <= current + 1)) {
      items.push(p);
    } else if (items[items.length - 1] !== "...") {
      items.push("...");
    }
  });

  const buildHref = (page: number) => `${basePath}?page=${page}`;

  return (
    <nav
      className="mt-8 flex justify-center"
      aria-label="ناوبری صفحات"
    >
      <ul className="flex items-center gap-1">
        <li>
          <Link
            href={buildHref(Math.max(1, current - 1))}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-sm",
              "text-text-muted hover:bg-surface-background",
            )}
            aria-label="صفحه قبلی"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </li>
        {items.map((p, i) =>
          p === "..." ? (
            <li key={`ellipsis-${i}`}>
              <span className="flex h-9 w-9 items-center justify-center text-sm text-text-muted">
                ...
              </span>
            </li>
          ) : (
            <li key={p as number}>
              <Link
                href={buildHref(p as number)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium",
                  current === p
                    ? "bg-accent-green text-white"
                    : "text-text hover:bg-surface-background",
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          <Link
            href={buildHref(Math.min(pages, current + 1))}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-sm",
              "text-text-muted hover:bg-surface-background",
            )}
            aria-label="صفحه بعدی"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function generateRange(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}
