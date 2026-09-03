"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { setArticleCirculars } from "@/lib/actions/library";

interface CircularOption {
  id: string;
  title: string;
  number: string | null;
  slug: string;
}

interface Props {
  articleId: string;
  initialSelected: string[];
  allCirculars: CircularOption[];
  backUrl: string;
}

export function ArticleCircularsEditor({
  articleId,
  initialSelected,
  allCirculars,
  backUrl,
}: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected),
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCirculars;
    return allCirculars.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.number ?? "").toLowerCase().includes(q),
    );
  }, [allCirculars, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      const result = await setArticleCirculars(articleId, Array.from(selected));
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({
          message: `${toPersian(selected.size)} بخشنامه ذخیره شد.`,
          variant: "success",
        });
        router.push(backUrl);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی بخشنامه..."
          className="pe-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-navy"
            aria-label="پاک کردن"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="text-sm text-text-muted">
        {toPersian(selected.size)} بخشنامه انتخاب شده
        {query && ` (${toPersian(filtered.length)} نتیجه)`}
      </div>

      <div className="max-h-96 space-y-1.5 overflow-y-auto rounded-xl border border-border bg-white p-2">
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-sm text-text-muted">نتیجه‌ای یافت نشد.</p>
        ) : (
          filtered.map((c) => {
            const isSelected = selected.has(c.id);
            return (
              <label
                key={c.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? "border-accent-green bg-accent-green/5"
                    : "border-border bg-white hover:border-accent-green/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(c.id)}
                  className="mt-1 h-4 w-4 accent-accent-green"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    {c.number && (
                      <span className="rounded-full bg-accent-yellow/10 px-2 py-0.5 font-medium text-accent-yellow">
                        شماره {c.number}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium text-primary-navy line-clamp-2">
                    {c.title}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 flex-shrink-0 text-accent-green" />
                )}
              </label>
            );
          })
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={save} disabled={pending}>
          {pending ? "در حال ذخیره..." : "ذخیره ارتباطات"}
        </Button>
        <Button variant="outline" onClick={() => router.push(backUrl)} disabled={pending}>
          انصراف
        </Button>
      </div>
    </div>
  );
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
