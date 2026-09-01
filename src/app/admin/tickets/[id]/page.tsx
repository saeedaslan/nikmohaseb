import { getAdminTicket } from "@/lib/actions/admin-tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { getCurrentUser } from "@/lib/auth";
import { TICKET_CATEGORY_LABELS, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import {
  ArrowRight, User, Mail, Calendar, AlertCircle,
  AlertTriangle, ArrowDownCircle, CheckCircle2, Tag, Clock,
  Phone, UserCheck, Hash, MessageSquare, Shield, FileText
} from "lucide-react";
import Link from "next/link";
import { AdminReplyForm } from "@/components/tickets/admin-reply-form";
import { StatusPrioritySelect } from "@/components/tickets/status-priority-select";
import { DeleteConfirmModal } from "@/components/tickets/delete-confirm-modal";
import { AssignDropdown } from "@/components/tickets/assign-dropdown";
import { TicketThread } from "@/components/tickets/ticket-thread";

export const metadata = {
  title: "جزئیات تیکت | ادمین | نیک محاسب سرو",
};

const priorityConfig: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof AlertCircle;
}> = {
  URGENT: { label: "بحرانی", color: "text-red-600", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: AlertCircle },
  HIGH: { label: "بالا", color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: AlertTriangle },
  NORMAL: { label: "متوسط", color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: ArrowDownCircle },
  CRITICAL: { label: "حیاتی", color: "text-purple-600", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: CheckCircle2 },
};

const statusConfig: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Clock;
}> = {
  NEW: { label: "جدید", color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: Clock },
  IN_PROGRESS: { label: "در حال بررسی", color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: AlertTriangle },
  ANSWERED: { label: "پاسخ داده شده", color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: CheckCircle2 },
  CLOSED: { label: "بسته شده", color: "text-gray-500", bgColor: "bg-gray-500/10", borderColor: "border-gray-500/30", icon: CheckCircle2 },
};

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getAdminTicket(id);
  if (!ticket) notFound();

  const currentUser = await getCurrentUser();
  const priority = priorityConfig[ticket.priority] ?? priorityConfig.NORMAL;
  const status = statusConfig[ticket.status] ?? statusConfig.NEW;
  const PriorityIcon = priority.icon;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/admin/tickets" className="hover:text-accent-green transition-colors">
          تیکت‌ها
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-text truncate max-w-xs">{ticket.subject}</span>
      </div>

      {/* Ticket Header Card */}
      <div className={`rounded-2xl border-2 ${priority.borderColor} bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${priority.bgColor}`}>
                <PriorityIcon className={`h-6 w-6 ${priority.color}`} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-navy">{ticket.subject}</h1>
                <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                  <Hash className="h-3.5 w-3.5" />
                  {ticket.trackingCode}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bgColor} ${status.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                <PriorityIcon className="h-3.5 w-3.5" />
                {priority.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-background px-3 py-1 text-xs font-medium text-text-muted">
                <Tag className="h-3.5 w-3.5" />
                {TICKET_CATEGORY_LABELS[ticket.category as keyof typeof TICKET_CATEGORY_LABELS] ?? ticket.category}
              </span>
              {ticket.assignedTo ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600">
                  <UserCheck className="h-3.5 w-3.5" />
                  {ticket.assignedTo.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-3 py-1 text-xs font-medium text-gray-500">
                  <User className="h-3.5 w-3.5" />
                  تخصیص نشده
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Meta Info */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
              <User className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-xs text-text-muted">ثبت کننده</p>
              <p className="text-sm font-medium text-text">{ticket.user?.name ?? "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">تاریخ ثبت</p>
              <p className="text-sm font-medium text-text">{toJalali(ticket.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <UserCheck className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">کارشناس مسئول</p>
              <p className="text-sm font-medium text-text">{ticket.assignedTo?.name ?? "تخصیص نشده"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <MessageSquare className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">تعداد پیام‌ها</p>
              <p className="text-sm font-medium text-text">{ticket.messages.length} پیام</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
            <Shield className="h-4 w-4 text-accent-green" />
          </div>
          <h2 className="text-lg font-bold text-primary-navy">مدیریت تیکت</h2>
        </div>
        <div className="space-y-4">
          {/* Status, Priority and Assign in one row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">وضعیت</label>
              <StatusPrioritySelect
                ticketId={ticket.id}
                currentStatus={ticket.status}
                currentPriority={ticket.priority}
                type="status"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">اولویت</label>
              <StatusPrioritySelect
                ticketId={ticket.id}
                currentStatus={ticket.status}
                currentPriority={ticket.priority}
                type="priority"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
                <UserCheck className="h-3.5 w-3.5 text-accent-green" />
                کارشناس مسئول
              </label>
              <AssignDropdown
                ticketId={ticket.id}
                currentAssignee={ticket.assignedTo}
              />
            </div>
          </div>
          {/* Delete button for admin */}
          {currentUser?.role === "ADMIN" && (
            <div className="flex justify-end pt-2 border-t border-border/40">
              <DeleteConfirmModal
                ticketId={ticket.id}
                ticketSubject={ticket.subject}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-primary-navy">مکاتبات</h2>
          <span className="mr-auto rounded-full bg-surface-background px-2.5 py-0.5 text-xs text-text-muted">
            {ticket.messages.length} پیام
          </span>
        </div>
        <TicketThread
          messages={ticket.messages}
          authorId={ticket.userId}
          showInternal={true}
        />
      </div>

      {/* Admin Reply Form */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
            <FileText className="h-4 w-4 text-accent-green" />
          </div>
          <h2 className="text-lg font-bold text-primary-navy">ارسال پاسخ</h2>
        </div>
        <AdminReplyForm ticketId={ticket.id} />
      </div>
    </div>
  );
}
