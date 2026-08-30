import { Users, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

type AdvantageIcon = ComponentType<{ className?: string }>;

const advantages: { title: string; desc: string; Icon: AdvantageIcon; color: string; bg: string }[] = [
  {
    title: "تیم متخصص",
    desc: "کارشناسان با تجربه و مدرک‌های علمی مرتبط در امور حسابداری و مالیاتی",
    Icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "پاسخگویی سریع",
    desc: "زمان پاسخگویی منعطف و بر اساس اولویت درخواست شما",
    Icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "خدمات تخصصی",
    desc: "راهکارهای مالی و مالیاتی دقیق و بهینه‌شده برای کسب‌وکار شما",
    Icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "پیگیری تا نتیجه",
    desc: "از شروع تا تکمیل کار، همراه شما در تمام مراحل بودجه‌ریزی و اجرا",
    Icon: ShieldCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function AdvantagesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-surface-card to-surface-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-accent-green/5 blur-3xl" />
      <div className="absolute -left-40 bottom-40 h-80 w-80 rounded-full bg-accent-yellow/5 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-accent-green/10 px-5 py-2 text-sm font-medium text-accent-green">
            چرا ما را انتخاب کنید
          </span>
          <h2 className="mb-4 text-3xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-4xl md:text-5xl">
            مزایای کار با نیک محاسب سرو
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-muted sm:text-lg">
            دلیل انتخاب ما در خدمات مالی و مالیاتی شما
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a, index) => (
            <div
              key={a.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              {/* Number Badge */}
              <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-navy text-sm font-bold text-white shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${a.bg} transition-all duration-300 group-hover:scale-110`}>
                <a.Icon className={`h-8 w-8 ${a.color}`} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-primary-navy">
                {a.title}
              </h3>
              <p className="text-sm leading-7 text-text-muted">{a.desc}</p>

              {/* Bottom Accent Line */}
              <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-l from-accent-green to-accent-yellow transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
