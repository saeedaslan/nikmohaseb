import { toJalali } from "@/lib/jalali";
import { UserCircle, Paperclip, Download, Image as ImageIcon, FileText, Eye, Lock, CheckCircle2 } from "lucide-react";
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
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface-background mb-4">
          <UserCircle className="h-10 w-10 text-text-muted" />
        </div>
        <p className="text-sm text-text-muted">هنوز پیامی نیست.</p>
        <p className="text-xs text-text-muted/70 mt-1">اولین پیام را ارسال کنید</p>
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
            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
            : isAdmin
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : isOwn
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        )}
      >
        {isAdmin ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <UserCircle className="h-8 w-8" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 shadow-sm",
          isInternal
            ? "bg-amber-50 border-2 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700"
            : isAdmin
              ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-700"
              : isOwn
                ? "bg-blue-600 text-white border border-blue-500 dark:bg-blue-700"
                : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={cn(
            "text-sm font-semibold",
            isOwn ? "text-white" : isInternal ? "text-amber-800 dark:text-amber-200" : "text-gray-900 dark:text-gray-100"
          )}>
            {msg.user?.name ?? "کاربر"}
          </span>
          {isAdmin && (
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200"
            )}>
              پشتیبانی
            </span>
          )}
          {isInternal && showInternal && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
            )}>
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
              isOwn ? "text-white" : isInternal ? "text-amber-900 dark:text-amber-100" : "text-gray-800 dark:text-gray-200",
            )}
          >
            {msg.content}
          </p>
        )}

        {/* Attachments */}
        {msg.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"
            )}>
              <Paperclip className="h-3 w-3" />
              <span>{msg.attachments.length} فایل ضمیمه</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {msg.attachments.map((a, index) => (
                <div
                  key={a.id ?? index}
                  className={cn(
                    "group relative rounded-xl border overflow-hidden transition-all duration-200 hover:border-emerald-400",
                    isOwn ? "border-white/30 bg-white/20" : "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900",
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
                        <p className={cn(
                          "text-xs truncate",
                          isOwn ? "text-white/90" : "text-gray-600 dark:text-gray-400"
                        )}>
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
                          isOwn ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700",
                        )}
                      >
                        <FileText className={cn("h-4 w-4", isOwn ? "text-white" : "text-gray-500 dark:text-gray-400")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs truncate", isOwn ? "text-white/90" : "text-gray-600 dark:text-gray-400")}>
                          {a.filename}
                        </p>
                        {a.size && (
                          <p className={cn("text-[10px]", isOwn ? "text-white/60" : "text-gray-400 dark:text-gray-500")}>
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
            isOwn ? "text-left text-white/70" : "text-right text-gray-400 dark:text-gray-500",
          )}
        >
          {toJalali(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}
