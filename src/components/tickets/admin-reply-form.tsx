"use client";

import { useForm } from "react-hook-form";
import { adminAddMessage } from "@/lib/actions/admin-tickets";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { Send, Paperclip, X, Image as ImageIcon, FileText, Lock } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AttachmentPreview {
  file: File;
  preview?: string;
}

export function AdminReplyForm({ ticketId }: { ticketId: string }) {
  const { addToast } = useToast();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentPreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachment: AttachmentPreview = { file };

      if (file.type.startsWith("image/")) {
        attachment.preview = URL.createObjectURL(file);
      }

      newAttachments.push(attachment);
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const onSubmit = async (data: { content: string }) => {
    if (!data.content.trim() && attachments.length === 0) {
      addToast({ message: "لطفاً متن پاسخ یا فایل ضمیمه را وارد کنید.", variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("content", data.content);
      fd.append("isInternal", String(isInternal));

      attachments.forEach((a) => {
        fd.append("attachments", a.file);
      });

      const result = await adminAddMessage(ticketId, fd);
      if (result?.ok) {
        addToast({
          message: isInternal ? "یادداشت داخلی ثبت شد." : "پیام ارسال شد.",
          variant: "success",
        });
        reset();
        setAttachments([]);
        setIsInternal(false);
        router.refresh();
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    } catch {
      addToast({ message: "خطا در ارسال پیام.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      {/* Internal Note Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsInternal(!isInternal)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
            isInternal
              ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
              : "bg-surface-background text-text-muted border border-border/60 hover:border-yellow-500/30",
          )}
        >
          <Lock className="h-3.5 w-3.5" />
          {isInternal ? "یادداشت داخلی" : "پاسخ عمومی"}
        </button>
        {isInternal && (
          <span className="text-xs text-yellow-600">
            این پیام فقط برای کارشناسان قابل مشاهده است
          </span>
        )}
      </div>

      <FormField
        control={control}
        name="content"
        label={isInternal ? "یادداشت داخلی" : "پاسخ ادمین"}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder={isInternal ? "یادداشت داخلی خود را وارد کنید..." : "متن پاسخ خود را وارد کنید..."}
            className={cn(
              "min-h-[120px] rounded-xl",
              isInternal && "border-yellow-500/30 focus:border-yellow-500 focus:ring-yellow-500/20",
            )}
          />
        )}
      />

      {/* File Upload Area */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-surface-background p-4 cursor-pointer hover:border-accent-green/50 hover:bg-accent-green/5 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-text-muted" />
          <span className="text-sm text-text-muted">برای آپلود فایل کلیک کنید یا بکشید و رها کنید</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-border/60 bg-surface-background overflow-hidden transition-all duration-200 hover:border-accent-green/50"
              >
                {attachment.preview ? (
                  <div className="aspect-square">
                    <img
                      src={attachment.preview}
                      alt={attachment.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square flex-col items-center justify-center gap-2 p-3">
                    {getFileIcon(attachment.file.type)}
                    <span className="text-xs text-text-muted text-center line-clamp-2">
                      {attachment.file.name}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {formatFileSize(attachment.file.size)}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                {attachment.preview && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                    <p className="text-[10px] text-white truncate">{attachment.file.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="accent" disabled={isSubmitting} loading={isSubmitting}>
          <Send className="h-4 w-4" />
          <span className="mr-1">{isInternal ? "ثبت یادداشت" : "ارسال پاسخ"}</span>
        </Button>
        <span className="text-xs text-text-muted">
          {attachments.length > 0 && `${attachments.length} فایل انتخاب شده`}
        </span>
      </div>
    </form>
  );
}
