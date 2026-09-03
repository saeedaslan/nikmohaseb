"use client";

import { useState, useEffect } from "react";
import { Link2, Printer, Check, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ArticleActionsProps {
  articleUrl: string;
  articleTitle: string;
  variant?: "default" | "hero" | "card";
}

export function ArticleActions({ articleUrl, articleTitle, variant = "default" }: ArticleActionsProps) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fullUrl = typeof window !== "undefined"
    ? new URL(articleUrl, window.location.origin).toString()
    : articleUrl;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      addToast({ message: "لینک کپی شد.", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({ message: "خطا در کپی لینک.", variant: "error" });
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (data: { title: string; url: string }) => Promise<void> }).share({
          title: articleTitle,
          url: fullUrl,
        });
      } catch {
        /* cancelled */
      }
    } else {
      copyLink();
    }
  }

  function print() {
    if (typeof window !== "undefined") window.print();
  }

  const isHero = variant === "hero";
  const isCard = variant === "card";

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-2 print:hidden", isHero && "")}>
        <button
          type="button"
          onClick={copyLink}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
            isCard
              ? "border border-border bg-white text-text-muted hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
              : isHero
              ? "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              : "border border-border bg-white text-primary-navy hover:border-accent-green hover:text-accent-green",
          )}
          aria-label="کپی لینک ماده"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent-green" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          {copied ? "کپی شد" : "کپی لینک"}
        </button>
        <button
          type="button"
          onClick={share}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors lg:hidden",
            isCard
              ? "border border-border bg-white text-text-muted hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
              : isHero
              ? "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              : "border border-border bg-white text-primary-navy hover:border-accent-green hover:text-accent-green",
          )}
          aria-label="اشتراک‌گذاری"
        >
          <Share2 className="h-3.5 w-3.5" />
          اشتراک
        </button>
        <button
          type="button"
          onClick={print}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
            isCard
              ? "border border-border bg-white text-text-muted hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
              : isHero
              ? "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              : "border border-border bg-white text-primary-navy hover:border-accent-green hover:text-accent-green",
          )}
          aria-label="چاپ ماده"
        >
          <Printer className="h-3.5 w-3.5" />
          چاپ
        </button>
      </div>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-2 text-xs font-bold text-primary-navy shadow-lg transition-colors hover:border-accent-green hover:text-accent-green print:hidden"
          aria-label="بازگشت به بالا"
        >
          ↑ بالا
        </button>
      )}
    </>
  );
}
