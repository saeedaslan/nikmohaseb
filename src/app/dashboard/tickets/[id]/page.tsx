import { getTicketById } from "@/lib/actions/tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "@/components/tickets/reply-form";
import { TicketThread } from "@/components/tickets/ticket-thread";

const priorityLabels: Record<string, string> = {
  NORMAL: "عادی",
  HIGH: "مهم",
  URGENT: "فوری",
  CRITICAL: "حیاتی",
};

const statusLabels: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال بررسی",
  ANSWERED: "پاسخ‌داده شده",
  CLOSED: "بسته‌شده",
};

export const metadata = {
  title: "جزئیات تیکت | نیک محاسب سرو",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  if (!ticket) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-navy">
            {ticket.subject}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <Badge variant="default" className="text-xs">
              {priorityLabels[ticket.priority] ?? ticket.priority}
            </Badge>
            <Badge
              variant={
                ticket.status === "CLOSED"
                  ? "default"
                  : ticket.status === "NEW"
                    ? "error"
                    : "success"
              }
            >
              {statusLabels[ticket.status] ?? ticket.status}
            </Badge>
            <span>دسته: {ticket.category}</span>
            <span>ایجاد شده: {toJalali(ticket.createdAt)}</span>
          </div>
        </div>
        <span className="text-xs text-text-muted">#{ticket.id.slice(0, 8)}</span>
      </div>

      <TicketThread
        messages={ticket.messages.map((m) => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt,
          user: m.user,
          attachments: m.attachments.map((a) => ({
            filename: a.filename,
            path: a.path,
            mime: a.mime,
          })),
        }))}
        authorId={ticket.userId}
      />

      {ticket.status !== "CLOSED" && <ReplyForm ticketId={ticket.id} />}
    </div>
  );
}
