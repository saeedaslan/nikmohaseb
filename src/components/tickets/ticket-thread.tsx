import { toJalali } from "@/lib/jalali";
import { UserCircle, Paperclip, Download, Image as ImageIcon, FileText, Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Attachment {
  id?: string;
  filename: string;
  path: string;
  mime: string | null;
  size?: number | null;
}

interface Message {
  id: string;
  content: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; role?: string } | null;
  senderRole?: string;
  isInternal?: boolean;
  attachments: Attachment[];
}

export function TicketThread({
  messages,
  authorId,
  showInternal = false,
}: {
  messages: Message[];
  authorId: string;
  showInternal?: boolean;
}) {
  const filteredMessages = showInternal
    ? messages
    : messages.filter((m) => !m.isInternal);

  if (!filteredMessages.length) {
    return (
      <div className="py-12 text-center">
        <UserCircle className="mx-auto h-16 w-16 text-text-muted mb-3" />
        <p className="text-sm text-text-muted">هنوز پیامی نیست.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMessages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} authorId={authorId} showInternal={showInternal} />
      ))}
    </div>
  );
}

function MessageBubble({
  msg,
  authorId,
  showInternal,
}: {
  msg: Message;
  authorId: string;
  showInternal: boolean;
}) {
  const isOwn = msg.user?.id === authorId;
  const isAdmin = msg.user?.role === "ADMIN" || msg.user?.role === "SUPPORT";
  const isInternal = msg.isInternal;

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (mime: string | null) => mime?.startsWith("image/") ?? false;

  return (
    <div className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "")}>
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
          isInternal
            ? "bg-yellow-500/20 text-yellow-600"
            : isAdmin
              ? "bg-accent-green/20 text-accent-green"
              : "bg-surface-background text-text-muted",
        )}
      >
        <UserCircle className="h-8 w-8" />
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4",
          isInternal
            ? "bg-yellow-500/10 border-2 border-yellow-500/30"
            : isAdmin
              ? "bg-accent-green/10 border border-accent-green/20"
              : isOwn
                ? "bg-primary-navy text-white"
                : "bg-surface-background border border-border/60",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={cn("text-sm font-semibold", isOwn ? "text-white" : "text-text")}>
            {msg.user?.name ?? "کاربر"}
          </span>
          {isAdmin && (
            <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-[10px] font-bold text-accent-green">
              پشتیبانی
            </span>
          )}
          {isInternal && showInternal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-600">
              <Lock className="h-2.5 w-2.5" />
              یادداشت داخلی
            </span>
          )}
        </div>

        {/* Content */}
        {msg.content && (
          <p
            className={cn(
              "text-sm whitespace-pre-wrap break-words leading-relaxed",
              isOwn ? "text-white/90" : "text-text",
            )}
          >
            {msg.content}
          </p>
        )}

        {/* Attachments */}
        {msg.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-1 text-xs opacity-70">
              <Paperclip className="h-3 w-3" />
              <span>{msg.attachments.length} فایل ضمیمه</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {msg.attachments.map((a, index) => (
                <div
                  key={a.id ?? index}
                  className={cn(
                    "group relative rounded-xl border overflow-hidden transition-all duration-200 hover:border-accent-green/50",
                    isOwn ? "border-white/20 bg-white/10" : "border-border/60 bg-surface-card",
                  )}
                >
                  {isImage(a.mime) ? (
                    <a href={a.path} target="_blank" rel="noreferrer" className="block">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={a.path}
                          alt={a.filename}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className={cn("text-xs truncate", isOwn ? "text-white/80" : "text-text-muted")}>
                          {a.filename}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <a
                      href={a.path}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          isOwn ? "bg-white/20" : "bg-surface-background",
                        )}
                      >
                        <FileText className={cn("h-4 w-4", isOwn ? "text-white" : "text-text-muted")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs truncate", isOwn ? "text-white/80" : "text-text-muted")}>
                          {a.filename}
                        </p>
                        {a.size && (
                          <p className={cn("text-[10px]", isOwn ? "text-white/50" : "text-text-muted/70")}>
                            {formatFileSize(a.size)}
                          </p>
                        )}
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span
          className={cn(
            "mt-2 block text-xs",
            isOwn ? "text-left text-white/50" : "text-right text-text-muted/70",
          )}
        >
          {toJalali(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}
