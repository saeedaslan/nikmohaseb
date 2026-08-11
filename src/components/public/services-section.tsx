import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/queries";
import { Briefcase } from "lucide-react";
import { ServiceIcon } from "./service-icon";

export async function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-navy sm:text-3xl">
          <Briefcase className="h-6 w-6 text-accent-green" />
          <span>خدمات ما</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-text-muted sm:text-base">
          ارائه خدمات جامع حسابداری، مالی، مالیاتی و مشاوره‌ای با بهره‌وری بالا
        </p>

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
                <div className="flex h-full flex-col rounded-xl border border-border bg-surface-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-green/30 ring-1 ring-inset ring-accent-green/25 dark:bg-accent-green-light/45 dark:ring-accent-green-light/40">
                      <ServiceIcon slug={s.slug} className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                    </div>
                  <h3 className="mb-1 text-lg font-semibold text-primary-navy">
                    {s.title}
                  </h3>
                  {s.summary && (
                    <p className="mt-1 text-sm text-text-muted line-clamp-2">
                      {s.summary}
                    </p>
                  )}
                  <span className="mt-auto pt-4 text-sm font-medium text-accent-green">
                    مشاهده جزئیات
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/services">همه خدمات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
