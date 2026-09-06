import { Users, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { ItemBadge, toPersianDigits } from "@/components/library/item-badge";

type AdvantageIcon = ComponentType<{ className?: string }>;

type Advantage = {
  title: string;
  desc: string;
  Icon: AdvantageIcon;
  color: string;
};

const advantages: Advantage[] = [
  {
    title: "تیم متخصص",
    desc: "کارشناسان با تجربه و مدرک‌های علمی مرتبط در امور حسابداری و مالیاتی",
    Icon: Users,
    color: "text-blue-600",
  },
  {
    title: "پاسخگویی سریع",
    desc: "زمان پاسخگویی منعطف و بر اساس اولویت درخواست شما",
    Icon: Clock,
    color: "text-amber-600",
  },
  {
    title: "خدمات تخصصی",
    desc: "راهکارهای مالی و مالیاتی دقیق و بهینه‌شده برای کسب‌وکار شما",
    Icon: TrendingUp,
    color: "text-emerald-600",
  },
  {
    title: "پیگیری تا نتیجه",
    desc: "از شروع تا تکمیل کار، همراه شما در تمام مراحل بودجه‌ریزی و اجرا",
    Icon: ShieldCheck,
    color: "text-purple-600",
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
        {/* Header (unchanged) */}
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

        {/* Process / timeline flow */}
        <div className="relative isolate">
          {/* Desktop: horizontal connector trimmed to the step-node centers */}
          <div
            className="absolute top-6 -translate-y-1/2 hidden h-0.5 bg-border lg:block"
            style={{ left: "12.5%", right: "12.5%" }}
            aria-hidden="true"
          />

          {/* Mobile: vertical spine centered behind the step nodes */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-border lg:hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-4 lg:gap-0">
            {advantages.map((a, index) => {
              const number = index + 1;
              return (
                <div
                  key={a.title}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step marker — number node sitting on the connector line */}
                  <div
                    className="relative z-10 mb-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ItemBadge number={number} toPersian={toPersianDigits} />
                  </div>

                  {/* Step content */}
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-card border border-border shadow-sm">
                      <a.Icon className={`h-8 w-8 ${a.color}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-primary-navy dark:text-primary-navy-light">
                      {a.title}
                    </h3>
                    <p className="text-sm leading-7 text-text-muted">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
