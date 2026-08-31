"use client";

import { useState, useTransition } from "react";
import { deleteTicket } from "@/lib/actions/admin-tickets";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DeleteConfirmModalProps {
  ticketId: string;
  ticketSubject: string;
  onSuccess?: () => void;
}

export function DeleteConfirmModal({ ticketId, ticketSubject, onSuccess }: DeleteConfirmModalProps) {
  const { addToast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText !== "حذف") return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("ticketId", ticketId);

      const result = await deleteTicket(null, formData);
      if (result?.ok) {
        addToast({ message: "تیکت با موفقیت حذف شد.", variant: "success" });
        setIsOpen(false);
        onSuccess?.();
        router.push("/admin/tickets");
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        حذف تیکت
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isPending && setIsOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-500/30 bg-surface-card shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />

            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-background"
                  disabled={isPending}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="mt-4 text-lg font-bold text-text">حذف تیکت</h3>
              <p className="mt-2 text-sm text-text-muted">
                آیا از حذف تیکت زیر اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </p>

              <div className="mt-3 rounded-xl bg-surface-background p-3">
                <p className="text-sm font-medium text-text truncate">{ticketSubject}</p>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-text-muted mb-2">
                  برای تأیید، عبارت <span className="font-bold text-red-500">حذف</span> را تایپ کنید:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="حذف"
                  className="w-full rounded-xl border border-border bg-surface-card px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  disabled={isPending}
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmText !== "حذف" || isPending}
                  loading={isPending}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف دائمی
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
