import { getAdminTicket } from "@/lib/actions/admin-tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { getCurrentUser } from "@/lib/auth";
import { TICKET_CATEGORY_LABELS } from "@/lib/constants";
import {
  ArrowRight, User, Mail, Calendar, AlertCircle,
  AlertTriangle, ArrowDownCircle, CheckCircle2, Tag, Clock,
  Phone, UserCheck, Hash
} from "lucide-react";
import Link from "next/link";
import { AdminReplyForm } from "@/components/tickets/admin-reply-form";
import { StatusPrioritySelect } from "@/components/tickets/status-priority-select";
import { DeleteConfirmModal } from "@/components/tickets/delete-confirm-modal";
import { AssignDropdown } from "@/components/tickets/assign-dropdown";

export const metadata = {
  title: "جزئیات تیکت | ادمین | نیک محاسب سرو",
};

const priorityConfig: Record<string, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  URGENT: { label: "بحرانی", color: "text-red-600", bgColor: "bg-red-500/10" },
  HIGH: { label: "بالا", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  NORMAL: { label: "متوسط", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  CRITICAL: { label: "حیاتی", color: "text-purple-600", bgColor: "bg-purple-500/10" },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  NEW: { label: "جدید", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  IN_PROGRESS: { label: "در حال بررسی", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  ANSWERED: { label: "پاسخ داده شده", color: "text-green-500", bgColor: "bg-green-500/10" },
  CLOSED: { label: "بسته شده", color: "text-gray-500", bgColor: "bg-gray-500/10" },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/admin/tickets" className="hover:text-accent-green transition-colors">
          تیکت‌ها
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-text truncate max-w-xs">{ticket.subject}</span>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <h1 className="text-xl font-bold text-primary-navy">{ticket.subject}</h1>
        <p className="text-sm text-text-muted mt-2">کد پیگیری: {ticket.trackingCode}</p>
        <p className="text-sm text-text-muted">وضعیت: {status.label} | اولویت: {priority.label}</p>
        <p className="text-sm text-text-muted">دسته: {TICKET_CATEGORY_LABELS[ticket.category as keyof typeof TICKET_CATEGORY_LABELS] ?? ticket.category}</p>
        <p className="text-sm text-text-muted">تاریخ: {toJalali(ticket.createdAt)}</p>
        {ticket.assignedTo && (
          <p className="text-sm text-text-muted">کارشناس مسئول: {ticket.assignedTo.name}</p>
        )}
      </div>

      {/* Admin Controls */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <h2 className="text-lg font-bold text-primary-navy mb-4">مدیریت تیکت</h2>
        <div className="space-y-4">
          <StatusPrioritySelect
            ticketId={ticket.id}
            currentStatus={ticket.status}
            currentPriority={ticket.priority}
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-text-muted mb-1.5">تخصیص کارشناس</label>
              <AssignDropdown
                ticketId={ticket.id}
                currentAssignee={ticket.assignedTo}
              />
            </div>
            {currentUser?.role === "ADMIN" && (
              <div className="pt-5">
                <DeleteConfirmModal
                  ticketId={ticket.id}
                  ticketSubject={ticket.subject}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <h2 className="text-lg font-bold text-primary-navy mb-4">پیام‌ها</h2>
        {ticket.messages.length === 0 ? (
          <p className="text-text-muted">پیامی نیست.</p>
        ) : (
          <div className="space-y-4">
            {ticket.messages.map((msg) => (
              <div key={msg.id} className="rounded-xl bg-surface-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{msg.user?.name ?? "کاربر"}</span>
                  <span className="text-xs text-text-muted">{toJalali(msg.createdAt)}</span>
                  {msg.isInternal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-600">
                      یادداشت داخلی
                    </span>
                  )}
                </div>
                {msg.content && <p className="text-sm">{msg.content}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Reply Form */}
      <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
        <h2 className="text-lg font-bold text-primary-navy mb-4">ارسال پاسخ</h2>
        <AdminReplyForm ticketId={ticket.id} />
      </div>
    </div>
  );
}
