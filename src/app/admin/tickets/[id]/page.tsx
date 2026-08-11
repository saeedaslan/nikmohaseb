import { getAdminTicket } from "@/lib/actions/admin-tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TicketStatusSelect } from "@/components/admin/ticket-status-select";
import { TicketThread } from "@/components/tickets/ticket-thread";
import { AdminReplyForm } from "@/components/tickets/admin-reply-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "جزئیات تیکت | ادمین | نیک محاسب سرو",
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

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-navy">
            {ticket.subject}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <Badge variant="default">{ticket.priority}</Badge>
            <TicketStatusSelect ticketId={ticket.id} current={ticket.status} />
            <span>{" دسته: " + ticket.category}</span>
            <span>ایجاد شده: {toJalali(ticket.createdAt)}</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            کاربر: {ticket.user?.name ?? "-"} ({ticket.user?.email ?? "-"})
          </p>
        </div>
      </div>

      <Card className="p-4">
        <TicketThread
          messages={ticket.messages}
          authorId={currentUser?.id ?? ""}
        />
        {ticket.status !== "CLOSED" && <AdminReplyForm ticketId={ticket.id} />}
      </Card>
    </div>
  );
}
