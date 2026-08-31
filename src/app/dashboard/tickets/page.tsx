import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Ticket, AlertCircle, AlertTriangle, ArrowDownCircle, CheckCircle2, MessageSquare, Hash } from "lucide-react";
import { TICKET_CATEGORY_LABELS } from "@/lib/constants";

export default async function DashboardTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; priority?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { q: query, status: statusFilter, priority: priorityFilter } = await searchParams;

  const where = {
    userId: user.id,
    isDeleted: false,
    ...(statusFilter ? { status: statusFilter as "NEW" | "IN_PROGRESS" | "ANSWERED" | "CLOSED" } : {}),
    ...(priorityFilter ? { priority: priorityFilter as "URGENT" | "HIGH" | "NORMAL" | "CRITICAL" } : {}),
    ...(query ? { OR: [{ subject: { contains: query } }, { trackingCode: { contains: query } }] } : {}),
  };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        select: { id: true },
      },
      attachments: {
        select: { id: true },
      },
      assignedTo: {
        select: { id: true, name: true },
      },
    },
  });

  const ticketsWithCounts = tickets.map((t) => ({
    ...t,
    _count: {
      messages: t.messages.length,
      attachments: t.attachments.length,
    },
    messages: undefined,
    attachments: undefined,
  }));

  const priorityConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof AlertCircle }> = {
    URGENT: { label: "بحرانی", color: "text-red-600", bgColor: "bg-red-500/10", icon: AlertCircle },
    HIGH: { label: "بالا", color: "text-orange-500", bgColor: "bg-orange-500/10", icon: AlertTriangle },
    NORMAL: { label: "متوسط", color: "text-yellow-500", bgColor: "bg-yellow-500/10", icon: ArrowDownCircle },
    CRITICAL: { label: "حیاتی", color: "text-purple-600", bgColor: "bg-purple-500/10", icon: CheckCircle2 },
  };

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    NEW: { label: "جدید", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    IN_PROGRESS: { label: "در حال بررسی", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    ANSWERED: { label: "پاسخ داده شده", color: "text-green-500", bgColor: "bg-green-500/10" },
    CLOSED: { label: "بسته شده", color: "text-gray-500", bgColor: "bg-gray-500/10" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">تیکت‌های من</h1>
          <p className="text-sm text-text-muted">مدیریت تیکت‌ها و درخواست‌ها</p>
        </div>
        <Button asChild className="bg-accent-green hover:bg-accent-green/90">
          <Link href="/dashboard/tickets/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>ثبت تیکت جدید</span>
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              placeholder="جستجو با موضوع یا کد پیگیری..."
              defaultValue={query}
              className="w-full rounded-xl border border-border bg-surface-card py-2.5 pl-4 pr-10 text-sm focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={statusFilter ?? ""}
              className="rounded-xl border border-border bg-surface-card px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="NEW">جدید</option>
              <option value="IN_PROGRESS">در حال بررسی</option>
              <option value="ANSWERED">پاسخ داده شده</option>
              <option value="CLOSED">بسته شده</option>
            </select>
            <select
              name="priority"
              defaultValue={priorityFilter ?? ""}
              className="rounded-xl border border-border bg-surface-card px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none"
            >
              <option value="">همه اولویت‌ها</option>
              <option value="CRITICAL">حیاتی</option>
              <option value="URGENT">بحرانی</option>
              <option value="HIGH">بالا</option>
              <option value="NORMAL">متوسط</option>
            </select>
            <Button type="submit" variant="primary" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Tickets List */}
      {ticketsWithCounts.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <Ticket className="mx-auto h-16 w-16 text-text-muted mb-4" />
          <p className="text-lg text-text-muted mb-4">تیکتی یافت نشد.</p>
          <Button asChild className="bg-accent-green hover:bg-accent-green/90">
            <Link href="/dashboard/tickets/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>ثبت تیکت جدید</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketsWithCounts.map((t) => {
            const priority = priorityConfig[t.priority] ?? priorityConfig.NORMAL;
            const status = statusConfig[t.status] ?? statusConfig.NEW;
            const PriorityIcon = priority.icon;

            return (
              <Link
                key={t.id}
                href={`/dashboard/tickets/${t.id}`}
                className="group block rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:bg-surface-card/80"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${priority.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                      <PriorityIcon className={`h-5 w-5 ${priority.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-primary-navy truncate group-hover:text-accent-green transition-colors">
                        {t.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">
                          {TICKET_CATEGORY_LABELS[t.category as keyof typeof TICKET_CATEGORY_LABELS] ?? t.category}
                        </span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{toJalali(t.updatedAt)}</span>
                        {t._count.messages > 0 && (
                          <>
                            <span className="text-xs text-text-muted">•</span>
                            <span className="flex items-center gap-1 text-xs text-text-muted">
                              <MessageSquare className="h-3 w-3" />
                              {t._count.messages}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.assignedTo && (
                      <span className="flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-1 text-xs text-accent-green">
                        {t.assignedTo.name}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                      <PriorityIcon className="h-3 w-3" />
                      {priority.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Tracking Code */}
                <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                  <Hash className="h-3 w-3 text-text-muted" />
                  <span className="text-xs text-text-muted">کد پیگیری:</span>
                  <span className="font-mono text-xs font-medium text-primary-navy">{t.trackingCode}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
