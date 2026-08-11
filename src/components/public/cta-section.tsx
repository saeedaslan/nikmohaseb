import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-primary-navy py-16 text-center text-white dark:bg-accent-green">
      <div className="container mx-auto px-4">
        <h2 className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
          <LifeBuoy className="h-6 w-6 text-accent-green-light" />
          <span>برای دریافت مشاوره با ما در ارتباط باشید</span>
        </h2>
        <p className="mb-6 text-sm text-accent-green-light/90 sm:text-base">
          درخواست مشاوره رایگان و پیگیری تخصصی امور مالی و مالیاتی شما
        </p>
        <Button asChild variant="accent" size="lg">
          <Link href="/contact">ثبت درخواست مشاوره</Link>
        </Button>
      </div>
    </section>
  );
}
