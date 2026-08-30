import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green">
        {/* Animated Blobs */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm animate-fade-in-up">
            مشاوره رایگان
          </span>
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl animate-fade-in-up stagger-1">
            برای دریافت مشاوره با ما در ارتباط باشید
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 sm:text-xl animate-fade-in-up stagger-2">
            درخواست مشاوره رایگان و پیگیری تخصصی امور مالی و مالیاتی شما
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
            <Button
              asChild
              size="lg"
              className="btn-shine bg-accent-green px-10 py-6 text-lg text-white hover:bg-accent-green/90 hover:shadow-[0_0_40px_rgba(21,136,88,0.5)] transition-all duration-300"
            >
              <Link href="/contact">
                درخواست مشاوره رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass px-10 py-6 text-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <Link href="tel:02182809515">
                <Phone className="mr-2 h-5 w-5" />
                تماس مستقیم
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
