import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Calendar, Building } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Circular } from "@/lib/queries";

export async function CircularsSection({ circulars }: { circulars: Circular[] }) {
  return (
    <section className="py-24 bg-gradient-to-b from-surface-card to-surface-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-accent-yellow/5 blur-3xl" />
      <div className="absolute -left-40 bottom-40 h-80 w-80 rounded-full bg-accent-green/5 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="mb-2 inline-block rounded-full bg-accent-yellow/10 px-4 py-1 text-xs font-medium text-accent-yellow">
              اطلاعیه‌های رسمی
            </span>
            <h2 className="mb-2 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
              آخرین بخشنامه‌ها
            </h2>
            <p className="max-w-xl text-sm text-text-muted sm:text-base">
              بخشنامه‌های مالی و مالیاتی منتشر شده
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-accent-green hover:bg-accent-green/10"
          >
            <Link href="/circulars">
              مشاهده همه
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {circulars.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            بخشنامه‌ای یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {circulars.map((c, index) => (
              <Link key={c.id} href={`/circulars/${c.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-border">
                  {/* Image / Header */}
                  {c.image ? (
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {c.category && (
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-navy backdrop-blur">
                            {c.category.name}
                          </span>
                        )}
                      </div>
                      {c.number && (
                        <span className="absolute left-4 top-4 rounded-full bg-accent-yellow/90 px-3 py-1 text-xs font-bold text-white">
                          شماره {c.number}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex h-52 w-full items-center justify-center bg-gradient-to-br from-accent-yellow/15 to-accent-yellow/5">
                      <FileDown className="h-16 w-16 text-accent-yellow/30" />
                      {c.number && (
                        <span className="absolute left-4 top-4 rounded-full bg-accent-yellow/90 px-3 py-1 text-xs font-bold text-white">
                          شماره {c.number}
                        </span>
                      )}
                      {c.category && (
                        <span className="absolute bottom-4 right-4 rounded-full bg-accent-yellow/10 px-3 py-1 text-xs font-medium text-accent-yellow">
                          {c.category.name}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-lg font-bold leading-7 text-primary-navy transition-colors group-hover:text-accent-green">
                      {c.title}
                    </h3>
                    {c.summary && (
                      <p className="mb-4 flex-1 text-sm leading-6 text-text-muted line-clamp-2">
                        {c.summary}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      {c.issuer && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {c.issuer}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {toJalali(c.date ?? c.createdAt)}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-3 py-1 text-xs font-medium text-accent-green">
                        منتشر شده
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green transition-all group-hover:gap-2">
                        مشاهده جزئیات
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Number Badge for first circular */}
                  {index === 0 && (
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-yellow text-xs font-bold text-white shadow-lg">
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
            className="bg-accent-yellow px-8 text-white hover:bg-accent-yellow/90 hover:shadow-lg hover:shadow-accent-yellow/20 transition-all duration-300"
          >
            <Link href="/circulars">
              مشاهده همه بخشنامه‌ها
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
