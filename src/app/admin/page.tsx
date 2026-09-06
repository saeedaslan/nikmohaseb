import { prisma } from "@/lib/prisma";
import { Users, Ticket, FileText, ReceiptText, HelpCircle, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { TicketStatus } from "@/lib/prisma";
import type { ComponentType } from "react";
import Link from "next/link";

export const metadata = {
  title: "داشبورد ادمین | نیک محاسب سرو",
};

type Stat = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href?: string;
};

export default async function AdminDashboardPage() {
  const [userCount, tickets, articles, circulars, faqs, libraryLaws, services, statusCounts] =
    await Promise.all([
      prisma.user.count(),
      prisma.ticket.count(),
      prisma.article.count(),
      prisma.circular.count(),
      prisma.faq.count(),
      prisma.libraryLaw.count(),
      prisma.service.count(),
      prisma.ticket
        .groupBy({ by: ["status"], _count: { _all: true } })
        .then((r) => Object.fromEntries(r.map((x) => [x.status, x._count._all]))),
    ]);

  const stats: Stat[] = [
    { label: "کاربران", value: userCount, icon: Users, color: "text-purple-500", bgColor: "bg-purple-500/10", href: "/admin/users" },
    { label: "تیکت‌ها", value: tickets, icon: Ticket, color: "text-orange-500", bgColor: "bg-orange-500/10", href: "/admin/tickets" },
    { label: "مقالات", value: articles, icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10", href: "/admin/articles" },
    { label: "بخشنامه‌ها", value: circulars, icon: ReceiptText, color: "text-yellow-500", bgColor: "bg-yellow-500/10", href: "/admin/circulars" },
    { label: "قوانین", value: libraryLaws, icon: FileText, color: "text-red-500", bgColor: "bg-red-500/10", href: "/admin/library/laws" },
    { label: "سؤالات متداول", value: faqs, icon: HelpCircle, color: "text-cyan-500", bgColor: "bg-cyan-500/10", href: "/admin/faqs" },
    { label: "خدمات", value: services, icon: Eye, color: "text-blue-500", bgColor: "bg-blue-500/10", href: "/admin/services" },
    { label: "تیکت‌های جدید", value: statusCounts[TicketStatus.NEW] ?? 0, icon: Ticket, color: "text-blue-600", bgColor: "bg-blue-600/10" },
    { label: "تیکت‌های بسته‌شده", value: statusCounts[TicketStatus.CLOSED] ?? 0, icon: Ticket, color: "text-green-600", bgColor: "bg-green-600/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-navy">داشبورد مدیریت</h1>
        <p className="text-sm text-text-muted">خلاصه وضعیت وبسایت و فعالیت‌ها</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const content = (
            <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-primary-navy">{s.value.toLocaleString("fa-IR")}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${s.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-7 w-7 ${s.color}`} />
                </div>
              </div>
            </div>
          );

          return s.href ? (
            <Link key={s.label} href={s.href}>
              {content}
            </Link>
          ) : (
            <div key={s.label}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
        <h2 className="text-lg font-bold text-primary-navy mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[
            { label: "مقالۀ جدید", href: "/admin/articles/new", color: "bg-green-500" },
            { label: "بخشنامه جدید", href: "/admin/circulars/new", color: "bg-yellow-500" },
            { label: "قانون جدید", href: "/admin/library/laws/new", color: "bg-red-500" },
            { label: "سؤال جدید", href: "/admin/faqs/new", color: "bg-cyan-500" },
            { label: "سرویس جدید", href: "/admin/services/new", color: "bg-blue-500" },
            { label: "بنر جدید", href: "/admin/banners/new", color: "bg-pink-500" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface-background px-4 py-3 text-sm font-medium text-text hover:border-accent-green/50 hover:bg-accent-green/5 transition-all duration-200"
            >
              <span className={`h-2 w-2 rounded-full ${action.color}`} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
