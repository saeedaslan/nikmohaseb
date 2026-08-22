import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Users, Ticket, FileText, ReceiptText, HelpCircle } from "lucide-react";
import { TicketStatus } from "@/lib/prisma";
import type { ComponentType } from "react";

export const metadata = {
  title: "داشبورد ادمین | نیک محاسب سرو",
};

type Stat = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  iconColor?: string;
};

export default async function AdminDashboardPage() {
  const [userCount, tickets, articles, circulars, faqs, statusCounts] =
    await Promise.all([
      prisma.user.count(),
      prisma.ticket.count(),
      prisma.article.count(),
      prisma.circular.count(),
      prisma.faq.count(),
      prisma.ticket
        .groupBy({ by: ["status"], _count: { _all: true } })
        .then((r) => Object.fromEntries(r.map((x) => [x.status, x._count._all]))),
    ]);

  const stats: Stat[] = [
    { label: "کل کاربران", value: userCount, icon: Users },
    { label: "کل تیکت‌ها", value: tickets, icon: Ticket },
    { label: "کل مقالات", value: articles, icon: FileText },
    { label: "کل بخشنامه‌ها", value: circulars, icon: ReceiptText },
    { label: "کل سؤالات متداول", value: faqs, icon: HelpCircle },
    {
      label: "تیکت‌های جدید",
      value: statusCounts[TicketStatus.NEW] ?? 0,
      icon: Ticket,
      iconColor: "text-blue-600",
    },
    {
      label: "تیکت‌های بسته‌شده",
      value: statusCounts[TicketStatus.CLOSED] ?? 0,
      icon: Ticket,
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-navy">
          داشبورد مدیریت
        </h1>
        <p className="text-sm text-text-muted">
          خلاصه وضعیت وبسایت و فعالیت‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-accent-green/20 p-2 text-accent-green">
                <Icon className={`h-6 w-6 ${s.iconColor ?? ""}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-navy">{s.value}</p>
                <p className="text-sm text-text-muted">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
