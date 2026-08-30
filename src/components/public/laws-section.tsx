import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Law } from "@/lib/queries";

const lawTypeLabel: Record<string, string> = {
  DIRECT_TAX: "مالیات مستقیم",
  VAT: "مالیات ارزش افزوده",
  OTHER: "سایر",
};

export async function LawsSection({ laws }: { laws: Law[] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-primary-navy/10 px-4 py-1 text-xs font-medium text-primary-navy">
            قوانین رسمی
          </span>
          <h2 className="mb-3 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
            آخرین قوانین مالیاتی
          </h2>
          <p className="mx-auto max-w-xl text-sm text-text-muted sm:text-base">
            قوانین مالی و مالیاتی منتشر شده
          </p>
        </div>

        {laws.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            قانونی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {laws.map((l) => (
              <Link key={l.id} href={`/laws/${l.slug}`} className="group block">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary-navy/10 to-primary-navy/5">
                    <FileText className="h-12 w-12 text-primary-navy/30" />
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-accent-yellow/10 px-3 py-1 text-xs font-medium text-accent-yellow">
                        {lawTypeLabel[l.type ?? "OTHER"] ?? l.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {l.category && (
                      <span className="mb-2 inline-block text-xs font-medium text-accent-green">
                        {l.category.name}
                      </span>
                    )}
                    <h3 className="mb-2 text-lg font-semibold text-primary-navy">
                      {l.title}
                    </h3>
                    {l.summary && (
                      <p className="mb-4 flex-1 text-sm leading-6 text-text-muted">
                        {l.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {toJalali(l.date ?? l.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green opacity-0 transition-opacity group-hover:opacity-100">
                        مشاهده
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-accent-green text-accent-green hover:bg-accent-green hover:text-white">
            <Link href="/laws">مشاهده همه قوانین</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
