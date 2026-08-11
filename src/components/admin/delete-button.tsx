"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  label: string;
  destructive?: boolean;
  onConfirm: () => Promise<unknown> | unknown;
}

export function DeleteButton({ label, destructive = true, onConfirm }: DeleteButtonProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      addToast({ message: `${label} حذف شد.`, variant: "success" });
      router.refresh();
    } catch {
      addToast({ message: "خطا در حذف.", variant: "error" });
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded p-1 text-red-600 hover:bg-surface-background"
        aria-label={label}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="تأیید حذف"
        description={`آیا از حذف ${label} مطمئن هستید؟ این عملیات قابل بازگشت نیست.`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            انصراف
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            size="sm"
            loading={deleting}
            onClick={confirm}
          >
            حذف
          </Button>
        </div>
      </Modal>
    </>
  );
}
