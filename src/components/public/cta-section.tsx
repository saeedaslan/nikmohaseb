import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-12 text-center shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-green/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-yellow/20 blur-3xl" />
          
          <div className="relative z-10">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white backdrop-blur">
              مشاوره رایگان
            </span>
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              برای دریافت مشاوره با ما در ارتباط باشید
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-base text-white/70">
              درخواست مشاوره رایگان و پیگیری تخصصی امور مالی و مالیاتی شما
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-accent-green px-8 text-white hover:bg-accent-green/90"
              >
                <Link href="/contact">
                  درخواست مشاوره رایگان
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20"
              >
                <Link href="tel:02182809515">تماس مستقیم</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
