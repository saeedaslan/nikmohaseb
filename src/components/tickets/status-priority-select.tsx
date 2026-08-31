"use client";

import { useState, useTransition } from "react";
import { updateTicketStatus, updateTicketPriority } from "@/lib/actions/admin-tickets";
import { useToast } from "@/components/ui/toast";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusPrioritySelectProps {
  ticketId: string;
  currentStatus: string;
  currentPriority: string;
}

export function StatusPrioritySelect({
  ticketId,
  currentStatus,
  currentPriority,
}: StatusPrioritySelectProps) {
  const { addToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("status", status);

      const result = await updateTicketStatus(null, formData);
      if (result?.ok) {
        addToast({ message: "وضعیت تیکت به‌روزرسانی شد.", variant: "success" });
        router.refresh();
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    });
  };

  const handlePriorityChange = (priority: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("priority", priority);

      const result = await updateTicketPriority(null, formData);
      if (result?.ok) {
        addToast({ message: "اولویت تیکت به‌روزرسانی شد.", variant: "success" });
        router.refresh();
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    });
  };

  const priorityColors: Record<string, string> = {
    NORMAL: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    HIGH: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    URGENT: "bg-red-500/10 text-red-600 border-red-500/30",
    CRITICAL: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-text-muted mb-1.5">وضعیت</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStatusChange(value)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200",
                currentStatus === value
                  ? "border-accent-green bg-accent-green/10 text-accent-green"
                  : "border-border/60 bg-surface-card text-text-muted hover:border-accent-green/50",
              )}
            >
              {currentStatus === value && <Check className="h-3 w-3" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1.5">اولویت</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePriorityChange(value)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200",
                currentPriority === value
                  ? priorityColors[value]
                  : "border-border/60 bg-surface-card text-text-muted hover:border-accent-green/50",
              )}
            >
              {currentPriority === value && <Check className="h-3 w-3" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-xs text-accent-green">
          <Loader2 className="h-3 w-3 animate-spin" />
          در حال به‌روزرسانی...
        </div>
      )}
    </div>
  );
}
