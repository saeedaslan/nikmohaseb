import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Ticket, TicketCheck, Clock, CircleDot, Plus, ArrowLeft, MessageSquare } from "lucide-react";
import { TicketStatus } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";

export const metadata = {
  title: "داشبورد | نیک محاسب سرو",
  description: "پنل کاربری نیک محاسب سرو",
};

const statusConfig = [
  { status: "NEW", label: "جدید", icon: CircleDot, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { status: "IN_PROGRESS", label: "در حال بررسی", icon: Clock, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { status: "ANSWERED", label: "پاسخ داده شده", icon: MessageSquare, color: "text-green-500", bgColor: "bg-green-500/10" },
  { status: "CLOSED", label: "بسته شده", icon: TicketCheck, color: "text-gray-500", bgColor: "bg-gray-500/10" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [total, byStatus, recentTickets] = await Promise.all([
    prisma.ticket.count({ where: { userId: user.id } }),
    prisma.ticket.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { _all: true },
    }),
    prisma.ticket.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: {
        _count: { select: { messages: true } },
      },
    }),
  ]);

  const counts: Record<string, number> = {};
  byStatus.forEach((s) => {
    counts[s.status] = s._count._all;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">
            سلام، {user.name?.split(" ")[0] ?? "کاربر"} 👋
          </h1>
          <p className="text-sm text-text-muted">
            خوش آمدید. از پنل می‌توانید تیکت‌های خود را مدیریت کنید.
          </p>
        </div>
        <Button asChild className="bg-accent-green hover:bg-accent-green/90">
          <Link href="/dashboard/tickets/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>ثبت تیکت جدید</span>
          </Link>
        </Button>
      </div>

      {/* Total Tickets */}
      <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-accent-green/10 to-accent-green/5 p-6 shadow-lg backdrop-blur-lg animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">کل تیکت‌ها</p>
            <p className="text-4xl font-extrabold text-primary-navy">{total}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-green/20">
            <Ticket className="h-8 w-8 text-accent-green" />
          </div>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statusConfig.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.status}
              className="group rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-navy">{counts[s.status] ?? 0}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary-navy">آخرین تیکت‌ها</h2>
          {recentTickets.length > 0 && (
            <Link href="/dashboard/tickets" className="text-sm text-accent-green hover:underline flex items-center gap-1">
              مشاهده همه
              <ArrowLeft className="h-3 w-3" />
            </Link>
          )}
        </div>
        {recentTickets.length > 0 ? (
          <div className="space-y-3">
            {recentTickets.map((t, index) => (
              <Link
                key={t.id}
                href={`/dashboard/tickets/${t.id}`}
                className="flex items-center justify-between rounded-xl bg-surface-background p-4 hover:bg-accent-green/5 transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    t.status === "CLOSED" ? "bg-gray-400" :
                    t.status === "NEW" ? "bg-blue-500" :
                    t.status === "ANSWERED" ? "bg-green-500" : "bg-orange-500"
                  }`} />
                  <span className="font-medium text-text">{t.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{toJalali(t.updatedAt)}</span>
                  {t._count.messages > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-green/20 text-[10px] font-bold text-accent-green">
                      {t._count.messages}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Ticket className="mx-auto h-12 w-12 text-text-muted/50 mb-3" />
            <p className="text-sm text-text-muted mb-4">هنوز تیکتی ثبت نکرده‌اید</p>
            <Button asChild size="sm" className="bg-accent-green hover:bg-accent-green/90">
              <Link href="/dashboard/tickets/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>ثبت اولین تیکت</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
