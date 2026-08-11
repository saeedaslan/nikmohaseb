import { Card } from "@/components/ui/card";
import { Users, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

type AdvantageIcon = ComponentType<{ className?: string }>;

const advantages: { title: string; desc: string; Icon: AdvantageIcon }[] = [
  {
    title: "تیم متخصص",
    desc: "کارشناسان با تجربه و مدرک‌های علمی مرتبط در امور حسابداری و مالیاتی",
    Icon: Users,
  },
  {
    title: "پاسخگویی سریع",
    desc: "زمان پاسخگویی منعطف و بر اساس اولویت درخواست شما",
    Icon: Clock,
  },
  {
    title: "خدمات تخصصی",
    desc: "راهکارهای مالی و مالیاتی دقیق و بهینه‌شده برای کسب‌وکار شما",
    Icon: TrendingUp,
  },
  {
    title: "پیگیری تا نتیجه",
    desc: "از شروع تا تکمیل کار، همراه شما در تمام مراحل بودجه‌ریزی و اجرا",
    Icon: ShieldCheck,
  },
];

export function AdvantagesSection() {
  return (
    <section className="bg-surface-card py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-navy sm:text-3xl">
          <ShieldCheck className="h-6 w-6 text-accent-green" />
          <span>چرا نیک محاسب سرو؟</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-text-muted sm:text-base">
          دلیل انتخاب ما در خدمات مالی و مالیاتی شما
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <Card
              key={a.title}
              className="flex flex-col items-center gap-3 border-0 p-6 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-green/20 text-accent-green">
                <a.Icon className="h-6 w-6" />
              </div>
              <h3 className="text-primary-navy">{a.title}</h3>
              <p className="text-sm text-text-muted">{a.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
