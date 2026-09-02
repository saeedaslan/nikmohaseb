import { Card } from "@/components/ui/card";
import { contactInfo, domains } from "@/lib/nav";
import { Award, Users, Clock, ShieldCheck, Target, Heart, CheckCircle, ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutPageSchema } from "@/components/structured-data";

export const revalidate = 3600;

export const metadata = {
  title: "درباره ما | نیک محاسب سرو",
  description: "درباره نیک محاسب سرو - تیم متخصص حسابداری، مالیاتی و مشاوره مالی",
  alternates: {
    canonical: `${domains.primary}/about`,
  },
};

const stats = [
  { value: "۱۰+", label: "سال تجربه", icon: Clock },
  { value: "۵۰۰+", label: "مشتری راضی", icon: Users },
  { value: "۲۴/۷", label: "پشتیبانی", icon: ShieldCheck },
  { value: "۹۸٪", label: "رضایت", icon: Heart },
];

const values = [
  {
    icon: Target,
    title: "دقت و ظرافت",
    description: "به جزئیات اهمیت می‌دهیم و هر کار را با دقت بالا انجام می‌دهیم",
  },
  {
    icon: ShieldCheck,
    title: "شفافیت",
    description: "در ارتباط و گزارش‌گیری کاملاً شفاف هستیم",
  },
  {
    icon: Heart,
    title: "احترام",
    description: "به حریم شخصی و اطلاعات مشتری احترام می‌گذاریم",
  },
  {
    icon: Award,
    title: "تعهد",
    description: "تا رسیدن به نتیجه مطلوب پیگیری مستمر داریم",
  },
];

const timeline = [
  { year: "۱۳۹۳", title: "تاسیس", description: "شرکت نیک محاسب سرو با هدف ارائه خدمات تخصصی حسابداری تاسیس شد" },
  { year: "۱۳۹۶", title: "رشد", description: "توسعه تیم و افزایش تعداد مشتریان به بیش از ۱۰۰ نفر" },
  { year: "۱۳۹۹", title: "دیجیتالی‌سازی", description: "ارائه خدمات آنلاین و اتوماسیون فرآیندها" },
  { year: "۱۴۰۵", title: "امروز", description: "بیش از ۵۰۰ مشتری فعال و تیم ۲۰ نفره متخصص" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutPageSchema />
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
            <Award className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm text-white/90">بیش از ۱۰ سال تجربه</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            درباره نیک محاسب سرو
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            همراه مطمئن شما در امور مالی و مالیاتی
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="group rounded-2xl border border-white/20 bg-white/80 p-6 text-center shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className="h-6 w-6 text-accent-green" />
                </div>
                <div className="text-3xl font-extrabold text-primary-navy">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Story Section */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-navy">داستان ما</h2>
            <p className="mx-auto max-w-3xl text-text leading-relaxed">
              شرکت نیک محاسب سرو با تیمی متشکل از متخصصان حسابداری، مالیات و مشاوره مالی، 
              خدمات جامع و تخصصی به کسب‌وکارها ارائه می‌دهد. هدف ما ارائه راه‌حل‌های عملی، 
              قانونی و مؤثر است که به مشتریانمان کمک می‌کند تا در امور مالی و مالیاتی خود 
              آرامش و اطمینان داشته باشند.
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">مسیر ما</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent-green via-accent-green/50 to-transparent hidden md:block" />
              
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.year} className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl">
                        <div className="mb-2 text-sm font-bold text-accent-green">{item.year}</div>
                        <h3 className="mb-2 text-lg font-bold text-primary-navy">{item.title}</h3>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                    </div>
                    <div className="hidden h-4 w-4 rounded-full border-4 border-accent-green bg-white shadow-lg md:block" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">ارزش‌های ما</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                      <value.icon className="h-7 w-7 text-accent-green" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-primary-navy">{value.title}</h3>
                      <p className="text-sm text-text-muted">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-accent-green/5 to-accent-green/10 p-8 shadow-lg backdrop-blur-lg mb-16">
            <h2 className="mb-6 text-center text-3xl font-bold text-primary-navy">چرا ما را انتخاب کنید؟</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                "تیم متخصص و باتجربه",
                "خدمات تخصصی و جامع",
                "مشاوره رایگان اولیه",
                "پاسخگویی سریع",
                "قیمت منصفانه و شفاف",
                "پشتیبانی ۲۴/۷",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/60 p-3">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm text-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-2xl bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">آماده همکاری هستیم</h2>
            <p className="mx-auto mb-6 max-w-xl text-white/70">
              برای دریافت مشاوره رایگان یا شروع همکاری با ما تماس بگیرید
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-accent-green text-white hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/30 transition-all duration-300">
                <Link href="/contact" className="flex items-center gap-2">
                  <span>تماس با ما</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                <Link href="tel:02182809515" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>تماس مستقیم</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
