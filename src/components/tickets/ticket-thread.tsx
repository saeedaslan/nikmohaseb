import { toJalali } from "@/lib/jalali";
import { UserCircle, Paperclip } from "lucide-react";

interface Attachment {
  filename: string;
  path: string;
  mime: string | null;
}

interface Message {
  id: string;
  content: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; role?: string } | null;
  attachments: Attachment[];
}

export function TicketThread({
  messages,
  authorId,
}: {
  messages: Message[];
  authorId: string;
}) {
  if (!messages.length) {
    return <p className="py-6 text-center text-sm text-text-muted">هنوز پیامی نیست.</p>;
  }
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} authorId={authorId} />
      ))}
    </div>
  );
}

function MessageBubble({
  msg,
  authorId,
}: {
  msg: Message;
  authorId: string;
}) {
  const isOwn = msg.user?.id === authorId;
  const isAdmin = msg.user?.role === "ADMIN" || msg.user?.role === "SUPPORT";
  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <UserCircle className="mt-1 h-8 w-8 text-text-muted" />
      <div
        className={`max-w-[75%] rounded-lg p-3 text-sm ${
          isAdmin
            ? "bg-accent-green/10 text-white"
            : isOwn
               ? "bg-primary-navy text-white dark:bg-accent-green"
              : "bg-surface-card"
        }`}
      >
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="font-semibold">
            {msg.user?.name ?? "کاربر"}
          </span>
          {isAdmin && (
            <span className="rounded bg-accent-green/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-green">
              پشتیبانی
            </span>
          )}
        </div>
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
