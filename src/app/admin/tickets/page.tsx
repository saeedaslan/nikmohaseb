import Link from "next/link";
import { listAdminTickets, getAdminDashboardMetrics, getSupportStaff } from "@/lib/actions/admin-tickets";
import { Button } from "@/components/ui/button";
import { toJalali } from "@/lib/jalali";
import { Input } from "@/components/ui/input";
import {
  Ticket, Search, Filter, User, Calendar, Users,
  AlertCircle, AlertTriangle, ArrowDownCircle, CheckCircle2,
  MessageSquare, UserCheck, BarChart3
} from "lucide-react";
import { TICKET_PRIORITY_LABELS, TICKET_CATEGORY_LABELS } from "@/lib/constants";
import { AnalyticsCard } from "@/components/tickets/analytics-cards";
import { getCurrentUser } from "@/lib/auth";
import { DeleteConfirmModal } from "@/components/tickets/delete-confirm-modal";

export const metadata = {
  title: "تیکت‌ها | ادمین | نیک محاسب سرو",
};

const priorityConfig: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof AlertCircle;
  borderColor: string;
}> = {
  URGENT: { label: "بحرانی", color: "text-red-600", bgColor: "bg-red-500/10", icon: AlertCircle, borderColor: "border-red-500/30" },
  HIGH: { label: "بالا", color: "text-orange-500", bgColor: "bg-orange-500/10", icon: AlertTriangle, borderColor: "border-orange-500/30" },
  NORMAL: { label: "متوسط", color: "text-yellow-500", bgColor: "bg-yellow-500/10", icon: ArrowDownCircle, borderColor: "border-yellow-500/30" },
  CRITICAL: { label: "حیاتی", color: "text-purple-600", bgColor: "bg-purple-500/10", icon: CheckCircle2, borderColor: "border-purple-500/30" },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  NEW: { label: "جدید", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  IN_PROGRESS: { label: "در حال بررسی", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  ANSWERED: { label: "پاسخ داده شده", color: "text-green-500", bgColor: "bg-green-500/10" },
  CLOSED: { label: "بسته شده", color: "text-gray-500", bgColor: "bg-gray-500/10" },
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignee?: string;
  }>;
}) {
  const { q: query, status: statusFilter, priority: priorityFilter, category: categoryFilter, assignee: assigneeFilter } = await searchParams;
  const [tickets, metrics, currentUser, staff] = await Promise.all([
    listAdminTickets(query, statusFilter, priorityFilter, categoryFilter, assigneeFilter),
    getAdminDashboardMetrics(),
    getCurrentUser(),
    getSupportStaff(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">مرکز مدیریت تیکت‌ها</h1>
          <p className="text-sm text-text-muted">داشبور اجزایی و مدیریت درخواست‌های مشتریان</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/80 px-3 py-1.5 text-xs text-text-muted backdrop-blur-lg">
            <Users className="h-3.5 w-3.5" />
            <span>{staff.length} کارشناس فعال</span>
          </div>
        </div>
      </div>

      {/* Executive Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AnalyticsCard
          title="کل تیکت‌ها"
          value={metrics.overview.total}
          icon="ticket"
          color="green"
        />
        <AnalyticsCard
          title="تیکت‌های جدید"
          value={metrics.overview.new}
          icon="bell"
          color="blue"
        />
        <AnalyticsCard
          title="در حال بررسی"
          value={metrics.overview.inProgress}
          icon="clock"
          color="orange"
        />
        <AnalyticsCard
          title="فوری و بحرانی"
          value={metrics.overview.urgent + metrics.overview.critical}
          icon="alert"
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AnalyticsCard
          title="پاسخ داده شده"
          value={metrics.overview.answered}
          icon="message"
          color="green"
        />
        <AnalyticsCard
          title="بسته شده"
          value={metrics.overview.closed}
          icon="check"
          color="gray"
        />
        <AnalyticsCard
          title="بدون اختصاص"
          value={metrics.overview.unassigned}
          icon="user"
          color="yellow"
        />
        <AnalyticsCard
          title="تیکت‌های ۲۴ ساعت اخیر"
          value={metrics.overview.recent}
          icon="chart"
          color="purple"
        />
      </div>

      {/* Staff Workload */}
      {metrics.staffWorkload.length > 0 && (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <h3 className="mb-3 text-sm font-bold text-primary-navy flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            توزیع بار کاری کارشناسان
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.staffWorkload.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface-background p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green/10">
                  <User className="h-4 w-4 text-accent-green" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text truncate max-w-[80px]">{staff.name ?? "بدون نام"}</p>
                  <p className="text-xs text-text-muted">{staff.assignedCount} تیکت</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {metrics.categoryBreakdown.length > 0 && (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <h3 className="mb-3 text-sm font-bold text-primary-navy flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            توزیع دسته‌بندی
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {metrics.categoryBreakdown.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-background p-3"
              >
                <span className="text-xs text-text-muted">
                  {TICKET_CATEGORY_LABELS[item.category as keyof typeof TICKET_CATEGORY_LABELS] ?? item.category}
                </span>
                <span className="text-sm font-bold text-primary-navy">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              name="q"
              placeholder="جستجو با موضوع، کد پیگیری یا شناسه..."
              defaultValue={query}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              name="status"
              defaultValue={statusFilter ?? ""}
              className="rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none"
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
              className="rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none"
            >
              <option value="">همه اولویت‌ها</option>
              <option value="CRITICAL">حیاتی</option>
              <option value="URGENT">بحرانی</option>
              <option value="HIGH">بالا</option>
              <option value="NORMAL">متوسط</option>
            </select>
            <select
              name="category"
              defaultValue={categoryFilter ?? ""}
              className="rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none"
            >
              <option value="">همه دسته‌ها</option>
              {Object.entries(TICKET_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              name="assignee"
              defaultValue={assigneeFilter ?? ""}
              className="rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-text focus:border-accent-green focus:outline-none"
            >
              <option value="">همه کارشناسان</option>
              <option value="unassigned">بدون اختصاص</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name ?? "بدون نام"}</option>
              ))}
            </select>
            <Button type="submit" variant="primary" size="sm">
              <Filter className="h-4 w-4" />
              فیلتر
            </Button>
          </div>
        </form>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <Ticket className="mx-auto h-16 w-16 text-text-muted mb-4" />
          <p className="text-lg text-text-muted">تیکتی یافت نشد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const priority = priorityConfig[t.priority] ?? priorityConfig.NORMAL;
            const status = statusConfig[t.status] ?? statusConfig.NEW;
            const PriorityIcon = priority.icon;

            return (
              <div
                key={t.id}
                className={`group rounded-2xl border ${priority.borderColor} bg-white/80 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:bg-surface-card/80`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={`/admin/tickets/${t.id}`}
                    className="flex items-start gap-3 flex-1 min-w-0"
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${priority.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                      <PriorityIcon className={`h-5 w-5 ${priority.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-primary-navy truncate group-hover:text-accent-green transition-colors">
                        {t.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <User className="h-3 w-3" />
                          {t.user?.name ?? "-"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Calendar className="h-3 w-3" />
                          {toJalali(t.createdAt)}
                        </span>
                        {t._count && t._count.messages > 0 && (
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <MessageSquare className="h-3 w-3" />
                            {t._count.messages} پیام
                          </span>
                        )}
                        <span className="text-xs font-mono text-text-muted">
                          {t.trackingCode}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.assignedTo && (
                      <span className="flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-1 text-xs text-accent-green">
                        <UserCheck className="h-3 w-3" />
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

                {/* Quick Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                  <span className="text-xs text-text-muted">کد پیگیری:</span>
                  <span className="font-mono text-xs font-medium text-primary-navy">{t.trackingCode}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
