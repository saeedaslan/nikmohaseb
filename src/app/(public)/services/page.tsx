import { getPublishedServices } from "@/lib/queries";
import { ServiceCard } from "@/components/public/service-card";
import { Briefcase, ArrowLeft, Users, Clock, ShieldCheck } from "lucide-react";
import { domains } from "@/lib/nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "خدمات حسابداری و مالیاتی",
  description: "لیست خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت در تهران",
  alternates: {
    canonical: `${domains.primary}/services`,
    languages: { "fa-IR": `${domains.primary}/services` },
  },
};

const features = [
  { icon: Users, title: "مشاوره تخصصی", description: "ارائه راهکارهای حرفه‌ای" },
  { icon: Clock, title: "پاسخگویی سریع", description: "در کمتر از ۲۴ ساعت" },
  { icon: ShieldCheck, title: "ضمانت کیفیت", description: "رضایت مشتری" },
];

export default async function ServicesPage() {
  const services = await getPublishedServices(50);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green py-16 lg:py-24">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm mb-6">
            <Briefcase className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm text-white/90">خدمات تخصصی</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            خدمات نیک محاسب سرو
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            ارائه خدمات جامع حسابداری، مالی، مالیاتی و مشاوره‌ای با بهره‌وری بالا
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-navy">{feature.title}</h3>
                    <p className="text-sm text-text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {services.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
              <HelpCircle className="mx-auto h-16 w-16 text-text-muted mb-4" />
              <p className="text-lg text-text-muted">در حال حاضر سرویسی یافت نشد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">نیاز به مشاوره دارید؟</h2>
            <p className="mx-auto mb-6 max-w-xl text-white/70">
              برای دریافت مشاوره رایگان با تیم ما تماس بگیرید
            </p>
            <Button asChild size="lg" className="bg-accent-green text-white hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/30 transition-all duration-300">
              <Link href="/contact" className="flex items-center gap-2">
                <span>تماس با ما</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  );
}
