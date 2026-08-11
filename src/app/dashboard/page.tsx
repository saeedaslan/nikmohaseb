import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, TicketCheck, Clock, CircleDot } from "lucide-react";
import { TicketStatus } from "@/lib/prisma";

export const metadata = {
  title: "داشبورد | نیک محاسب سرو",
  description: "پنل کاربری نیک محاسب سرو",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [total, byStatus] = await Promise.all([
    prisma.ticket.count({ where: { userId: user.id } }),
    prisma.ticket.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { _all: true },
    }),
  ]);

  const counts: Record<string, number> = {};
  byStatus.forEach((s) => {
    counts[s.status] = s._count._all;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-navy">
          سلام، {user.name?.split(" ")[0] ?? user.email}
        </h1>
        <p className="text-sm text-text-muted">
          خوش آمدید. از منو می‌توانید تیکت‌ها و درخواست‌های خود را مدیریت کنید.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">کل تیکت‌ها</p>
            <p className="text-2xl font-bold text-primary-navy">{total}</p>
          </div>
          <Ticket className="h-8 w-8 text-accent-green" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<CircleDot className="h-6 w-6 text-blue-600" />}
          label="جدید"
          value={counts[TicketStatus.NEW] ?? 0}
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          label="در حال بررسی"
          value={counts[TicketStatus.IN_PROGRESS] ?? 0}
        />
        <StatCard
          icon={<TicketCheck className="h-6 w-6 text-green-600" />}
          label="بسته‌شده"
          value={counts[TicketStatus.CLOSED] ?? 0}
        />
      </div>

      <div className="flex gap-3">
        <Button asChild variant="primary">
          <Link href="/dashboard/tickets/new">ثبت تیکت جدید</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/tickets">مشاهده تیکت‌ها</Link>
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="flex items-center justify-between p-4">
      {icon}
      <div className="text-right">
        <p className="text-sm text-text-muted">{label}</p>
        <p className="text-xl font-bold text-primary-navy">{value}</p>
      </div>
    </Card>
  );
}
