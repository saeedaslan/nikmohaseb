import { Users, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

type AdvantageIcon = ComponentType<{ className?: string }>;

const advantages: { title: string; desc: string; Icon: AdvantageIcon; color: string }[] = [
  {
    title: "تیم متخصص",
    desc: "کارشناسان با تجربه و مدرک‌های علمی مرتبط در امور حسابداری و مالیاتی",
    Icon: Users,
    color: "from-blue-500/20 to-blue-500/5 text-blue-600",
  },
  {
    title: "پاسخگویی سریع",
    desc: "زمان پاسخگویی منعطف و بر اساس اولویت درخواست شما",
    Icon: Clock,
    color: "from-amber-500/20 to-amber-500/5 text-amber-600",
  },
  {
    title: "خدمات تخصصی",
    desc: "راهکارهای مالی و مالیاتی دقیق و بهینه‌شده برای کسب‌وکار شما",
    Icon: TrendingUp,
    color: "from-accent-green/20 to-accent-green/5 text-accent-green",
  },
  {
    title: "پیگیری تا نتیجه",
    desc: "از شروع تا تکمیل کار، همراه شما در تمام مراحل بودجه‌ریزی و اجرا",
    Icon: ShieldCheck,
    color: "from-purple-500/20 to-purple-500/5 text-purple-600",
  },
];

export function AdvantagesSection() {
  return (
    <section className="bg-surface-card py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent-yellow/10 px-4 py-1 text-xs font-medium text-accent-yellow">
            چرا ما را انتخاب کنید
          </span>
          <h2 className="mb-3 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
            مزایای کار با نیک محاسب سرو
          </h2>
          <p className="mx-auto max-w-xl text-sm text-text-muted sm:text-base">
            دلیل انتخاب ما در خدمات مالی و مالیاتی شما
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a, index) => (
            <div
              key={a.title}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.color} ring-1 ring-inset ring-black/5`}>
                <a.Icon className="h-8 w-8" />
              </div>
              <div>
                <div className="mb-2 text-xs font-bold text-text-muted">
                  {String(index + 1).padStart(2, "۰")}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-primary-navy">
                  {a.title}
                </h3>
                <p className="text-sm leading-6 text-text-muted">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
