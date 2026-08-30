import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { ServiceIcon } from "./service-icon";

export async function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="py-20 bg-surface-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent-green/10 px-4 py-1 text-xs font-medium text-accent-green">
            خدمات تخصصی
          </span>
          <h2 className="mb-3 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
            خدمات ما
          </h2>
          <p className="mx-auto max-w-xl text-sm text-text-muted sm:text-base">
            ارائه خدمات جامع حسابداری، مالی، مالیاتی و مشاوره‌ای با بهره‌وری بالا
          </p>
        </div>

        {services.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            در حال حاضر سرویسی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="group block"
              >
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/5 ring-1 ring-accent-green/10">
                    <ServiceIcon slug={s.slug} className="h-7 w-7 text-accent-green" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-primary-navy">
                    {s.title}
                  </h3>
                  {s.summary && (
                    <p className="mb-4 flex-1 text-sm leading-6 text-text-muted">
                      {s.summary}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green opacity-0 transition-opacity group-hover:opacity-100">
                    مشاهده جزئیات
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-accent-green text-accent-green hover:bg-accent-green hover:text-white">
            <Link href="/services">مشاهده همه خدمات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
