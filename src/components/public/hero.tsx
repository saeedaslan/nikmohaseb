import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/queries";
import { Users, Award, Clock, ChevronDown } from "lucide-react";

const defaultBanner = {
  title: "همراه مطمئن شما در امور مالی و مالیاتی",
  description:
    "خدمات تخصصی حسابداری، مالی، مالیاتی و مشاوره کسب‌وکار با نیک محاسب سرو",
  buttonText: "درخواست مشاوره",
  buttonLink: "/contact",
};

const stats = [
  { value: "+۵۰۰", label: "مشتری راضی", icon: Users },
  { value: "+۱۰", label: "سال تجربه", icon: Award },
  { value: "۲۴/۷", label: "پشتیبانی", icon: Clock },
];

export async function Hero({ banner }: { banner: Banner | null }) {
  const data = banner ?? (defaultBanner as Banner);
  const imageSrc = data.image || "/images/hero.png";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={data.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-navy/80 via-primary-navy/70 to-primary-navy/90" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-green/20 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm animate-fade-in-up">
          <span className="text-sm font-medium text-white/90">
            خدمات تخصصی حسابداری و مالیاتی
          </span>
        </div>
        
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up stagger-1">
          {data.title}
        </h1>
        
        {data.description && (
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl md:text-2xl animate-fade-in-up stagger-2">
            {data.description}
          </p>
        )}
        
        {data.buttonText && data.buttonLink && (
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
            <Button
              asChild
              size="lg"
              className="btn-shine bg-accent-green px-10 py-6 text-lg text-white hover:bg-accent-green/90 hover:shadow-[0_0_40px_rgba(21,136,88,0.5)] transition-all duration-300"
            >
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass px-10 py-6 text-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <Link href="/services">مشاهده خدمات</Link>
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 md:gap-8 animate-fade-in-up stagger-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/30 to-accent-green/10 transition-transform group-hover:scale-110">
                <stat.icon className="h-7 w-7 text-accent-yellow" />
              </div>
              <span className="text-3xl font-bold text-white sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-sm text-white/70 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <Link href="#services" className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-xs">اسکرول کنید</span>
          <ChevronDown className="h-6 w-6 animate-scroll-bounce" />
        </Link>
      </div>
    </section>
  );
}
