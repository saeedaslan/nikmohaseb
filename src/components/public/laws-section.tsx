import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, Calendar, ScaleIcon } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Law } from "@/lib/queries";

const lawTypeLabel: Record<string, string> = {
  DIRECT_TAX: "مالیات مستقیم",
  VAT: "مالیات ارزش افزوده",
  OTHER: "سایر",
};

const lawTypeColor: Record<string, string> = {
  DIRECT_TAX: "bg-blue-500/10 text-blue-600",
  VAT: "bg-purple-500/10 text-purple-600",
  OTHER: "bg-gray-500/10 text-gray-600",
};

export async function LawsSection({ laws }: { laws: Law[] }) {
  return (
    <section className="py-24 bg-gradient-to-b from-surface-background to-surface-card relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-primary-navy/5 blur-3xl" />
      <div className="absolute -right-40 bottom-40 h-80 w-80 rounded-full bg-accent-green/5 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary-navy/10 px-4 py-1 text-xs font-medium text-primary-navy">
              قوانین رسمی
            </span>
            <h2 className="mb-2 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
              آخرین قوانین مالیاتی
            </h2>
            <p className="max-w-xl text-sm text-text-muted sm:text-base">
              قوانین مالی و مالیاتی منتشر شده
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-accent-green hover:bg-accent-green/10"
          >
            <Link href="/laws">
              مشاهده همه
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {laws.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            قانونی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {laws.map((l, index) => (
              <Link key={l.id} href={`/laws/${l.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-border">
                  {/* Header with Type Badge */}
                  <div className="relative flex h-52 w-full items-center justify-center bg-gradient-to-br from-primary-navy/10 to-primary-navy/5">
                    <Scale className="h-16 w-16 text-primary-navy/20" />
                    
                    {/* Type Badge */}
                    <div className="absolute right-4 top-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${lawTypeColor[l.type ?? "OTHER"]}`}>
                        {lawTypeLabel[l.type ?? "OTHER"] ?? l.type}
                      </span>
                    </div>
                    
                    {/* Number Badge */}
                    {l.number && (
                      <span className="absolute left-4 top-4 rounded-full bg-primary-navy/90 px-3 py-1 text-xs font-bold text-white">
                        شماره {l.number}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {l.category && (
                      <span className="mb-2 inline-block text-xs font-medium text-accent-green">
                        {l.category.name}
                      </span>
                    )}
                    
                    <h3 className="mb-3 text-lg font-bold leading-7 text-primary-navy transition-colors group-hover:text-accent-green">
                      {l.title}
                    </h3>
                    
                    {l.summary && (
                      <p className="mb-4 flex-1 text-sm leading-6 text-text-muted line-clamp-2">
                        {l.summary}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      {l.issuer && (
                        <span className="flex items-center gap-1">
                          <ScaleIcon className="h-3.5 w-3.5" />
                          {l.issuer}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {toJalali(l.date ?? l.createdAt)}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-navy/10 px-3 py-1 text-xs font-medium text-primary-navy">
                        قانون مالیاتی
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green transition-all group-hover:gap-2">
                        مشاهده جزئیات
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Number Badge for first law */}
                  {index === 0 && (
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-navy text-xs font-bold text-white shadow-lg">
                      جدید
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-navy px-8 text-white hover:bg-primary-navy/90 hover:shadow-lg hover:shadow-primary-navy/20 transition-all duration-300"
          >
            <Link href="/laws">
              مشاهده همه قوانین
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
