"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { ServiceIcon } from "./service-icon";

export function ServicesSection({ services }: { services: Service[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const itemsPerPage = 4;

  // Create an array that always has multiples of 4 items
  const fillToFour = (items: Service[]) => {
    const result = [...items];
    while (result.length % itemsPerPage !== 0 || result.length === 0) {
      result.push(items[result.length % items.length]);
    }
    return result;
  };

  const filledServices = fillToFour(services);
  const totalPages = filledServices.length / itemsPerPage;

  const currentItems = filledServices.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalPages]);

  if (services.length === 0) {
    return (
      <section id="services" className="py-24 bg-surface-background mesh-gradient">
        <div className="container mx-auto px-4">
          <p className="py-8 text-center text-text-muted">در حال حاضر سرویسی یافت نشد.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-surface-background mesh-gradient">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-accent-green/10 px-5 py-2 text-sm font-medium text-accent-green animate-fade-in-up">
            خدمات تخصصی
          </span>
          <h2 className="mb-3 text-3xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-4xl md:text-5xl animate-fade-in-up stagger-1">
            خدمات ما
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-muted sm:text-lg animate-fade-in-up stagger-2">
            ارائه خدمات جامع حسابداری، مالی، مالیاتی و مشاوره‌ای با بهره‌وری بالا
          </p>
        </div>

        {/* Services Grid */}
        <div className="relative overflow-hidden">
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {currentItems.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className="group block"
              >
                <div className="relative h-full rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-border">
                  {/* Icon */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/5 ring-1 ring-accent-green/10 transition-all duration-300 group-hover:scale-110">
                    <ServiceIcon slug={s.slug} className="h-7 w-7 text-accent-green" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-primary-navy transition-colors group-hover:text-accent-green">
                    {s.title}
                  </h3>
                  {s.summary && (
                    <p className="mb-4 text-sm leading-6 text-text-muted line-clamp-2">
                      {s.summary}
                    </p>
                  )}

                  {/* Link */}
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-green transition-all group-hover:gap-3">
                    مشاهده جزئیات
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentPage(index);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "w-8 bg-accent-green"
                    : "w-2 bg-border hover:bg-accent-green/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent-green text-accent-green hover:bg-accent-green hover:text-white hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-300"
          >
            <Link href="/services">مشاهده همه خدمات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
