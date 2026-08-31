import { getTicketById } from "@/lib/actions/tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { TICKET_CATEGORY_LABELS } from "@/lib/constants";
import {
  ArrowRight, User, Calendar, Tag, AlertCircle,
  AlertTriangle, ArrowDownCircle, CheckCircle2, Hash, UserCheck
} from "lucide-react";
import Link from "next/link";
import { ReplyForm } from "@/components/tickets/reply-form";

export const metadata = {
  title: "جزئیات تیکت | نیک محاسب سرو",
};

export const revalidate = 30;

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  if (!ticket) notFound();

  const priority = priorityConfig[ticket.priority] ?? priorityConfig.NORMAL;
  const status = statusConfig[ticket.status] ?? statusConfig.NEW;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/dashboard/tickets" className="hover:text-accent-green transition-colors">
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
                </div>
                {msg.content && <p className="text-sm">{msg.content}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {ticket.status !== "CLOSED" && (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <h2 className="text-lg font-bold text-primary-navy mb-4">پاسخ دادن</h2>
          <ReplyForm ticketId={ticket.id} />
        </div>
      )}
    </div>
  );
}
