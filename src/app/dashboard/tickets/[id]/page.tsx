import { getTicketById } from "@/lib/actions/tickets";
import { notFound } from "next/navigation";
import { toJalali } from "@/lib/jalali";
import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "@/components/tickets/reply-form";
import { UserCircle, Paperclip } from "lucide-react";

const priorityLabels = {
  NORMAL: "عادی",
  HIGH: "مهم",
  URGENT: "فوری",
  CRITICAL: "حیاتی",
};

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
            <Badge variant="default">
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
              {ticket.status}
            </Badge>
            <span>دسته: {ticket.category}</span>
            <span>ایجاد شده: {toJalali(ticket.createdAt)}</span>
          </div>
        </div>
        <span className="text-xs text-text-muted">#{ticket.id.slice(0, 8)}</span>
      </div>

      <div className="space-y-4">
        {ticket.messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} currentUserId={ticket.userId} />
        ))}
      </div>

      {ticket.status !== "CLOSED" && <ReplyForm ticketId={ticket.id} />}
    </div>
  );
}

function MessageBubble({
  msg,
  currentUserId,
}: {
  msg: {
    id: string;
    content: string | null;
    createdAt: Date;
    user: { id: string; name: string | null };
    attachments: { filename: string; path: string; mime: string | null }[];
  };
  currentUserId: string;
}) {
  const isOwn = msg.user.id === currentUserId;
  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <UserCircle className="mt-1 h-8 w-8 text-text-muted" />
      <div
        className={`max-w-[75%] rounded-lg p-3 text-sm ${
          isOwn ? "bg-primary-navy text-white dark:bg-accent-green" : "bg-surface-card"
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-semibold text-accent-green">
            {msg.user.name ?? msg.user.id}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        {msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {msg.attachments.map((a) => (
              <a
                key={a.path}
                href={a.path}
                className="flex items-center gap-1 text-xs underline"
                target="_blank"
                rel="noreferrer"
              >
                <Paperclip className="h-3 w-3" />
                {a.filename}
              </a>
            ))}
          </div>
        )}
        <span
          className={`mt-1 block text-xs opacity-70 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {toJalali(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}
