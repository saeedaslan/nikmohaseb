import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/queries";
import { Users, Award, Clock } from "lucide-react";

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
    <section className="relative flex min-h-[60vh] min-h-[600px] items-center justify-center overflow-hidden">
      <img
        src={imageSrc}
        alt={data.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-navy/70 via-primary-navy/60 to-primary-navy/80" />

      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent-yellow sm:text-base">
          حسابداری، مالی، مالیاتی و مشاوره تخصصی کسب‌وکار
        </p>
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {data.title}
        </h1>
        {data.description && (
          <p className="mx-auto mb-10 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
            {data.description}
          </p>
        )}
        {data.buttonText && data.buttonLink && (
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-accent-green px-8 text-white hover:bg-accent-green/90"
            >
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href="/services">مشاهده خدمات</Link>
            </Button>
          </div>
        )}

        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-6 backdrop-blur"
            >
              <stat.icon className="h-8 w-8 text-accent-yellow" />
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-white/70 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
