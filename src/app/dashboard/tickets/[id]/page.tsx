import { getTicketById } from "@/lib/actions/tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { TICKET_CATEGORY_LABELS } from "@/lib/constants";
import {
  ArrowRight, User, Calendar, Tag, AlertCircle,
  AlertTriangle, ArrowDownCircle, CheckCircle2, Hash, UserCheck,
  MessageSquare, Clock, FileText
} from "lucide-react";
import Link from "next/link";
import { ReplyForm } from "@/components/tickets/reply-form";
import { TicketThread } from "@/components/tickets/ticket-thread";

export const metadata = {
  title: "جزئیات تیکت | نیک محاسب سرو",
};

export const revalidate = 30;

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
  const PriorityIcon = priority.icon;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/dashboard/tickets" className="hover:text-accent-green transition-colors">
          تیکت‌ها
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-text truncate max-w-xs">{ticket.subject}</span>
      </div>

      {/* Ticket Header Card */}
      <div className={`rounded-2xl border-2 ${priority.borderColor} bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${priority.bgColor}`}>
            <PriorityIcon className={`h-7 w-7 ${priority.color}`} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-navy">{ticket.subject}</h1>
            <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
              <Hash className="h-3.5 w-3.5" />
              {ticket.trackingCode}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
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
                  در انتظار تخصیص
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Meta Info */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-surface-background p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
              <Calendar className="h-5 w-5 text-accent-green" />
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
              <p className="text-sm font-medium text-text">{ticket.assignedTo?.name ?? "در انتظار تخصیص"}</p>
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
          showInternal={false}
        />
      </div>

      {/* Reply Form - Only show if ticket is not closed */}
      {ticket.status !== "CLOSED" && (
        <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-surface-card/80">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
              <FileText className="h-4 w-4 text-accent-green" />
            </div>
            <h2 className="text-lg font-bold text-primary-navy">ارسال پاسخ</h2>
          </div>
          <ReplyForm ticketId={ticket.id} />
        </div>
      )}

      {/* Closed Ticket Notice */}
      {ticket.status === "CLOSED" && (
        <div className="rounded-2xl border-2 border-gray-500/30 bg-gray-500/10 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-gray-500 mb-3" />
          <h3 className="text-lg font-bold text-text">این تیکت بسته شده است</h3>
          <p className="text-sm text-text-muted mt-2">
            اگر سوال دیگری دارید، لطفاً تیکت جدید ثبت کنید.
          </p>
        </div>
      )}
    </div>
  );
}
