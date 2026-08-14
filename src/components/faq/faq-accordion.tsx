"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Faq } from "@/lib/queries";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f) => {
        const isOpen = openId === f.id;
        return (
          <div
            key={f.id}
            className="rounded-lg border border-border/60 bg-surface-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : f.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-right"
            >
              <div className="flex-1 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-accent-yellow" />
                  {f.category && (
                    <span className="text-xs text-accent-green">
                      {f.category}
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium text-primary-navy">
                  {f.question}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-text-muted transition-transform`}
                style={{ rotate: isOpen ? "180deg" : "0deg" }}
              />
            </button>

            <div
              className="overflow-hidden border-t border-border/60"
              style={{ maxHeight: isOpen ? "2000px" : "0" }}
            >
              <div className="px-4 py-3 text-sm text-text">
                {f.answer ? (
                  <div
                    className="article-content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: f.answer }}
                  />
                ) : (
                  <p className="text-text-muted">پاسخی ثبت نشده است.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
