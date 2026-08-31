"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { deleteBanner } from "@/lib/actions/banners";
import { deleteCircular } from "@/lib/actions/circulars";
import { deleteArticle } from "@/lib/actions/articles";
import { deleteLaw } from "@/lib/actions/laws";
import { deleteFaq } from "@/lib/actions/faqs";
import { deleteUser } from "@/lib/actions/users";
import { deleteService } from "@/lib/actions/services";

type EntityType = "banner" | "circular" | "article" | "law" | "faq" | "user" | "service";

interface DeleteButtonProps {
  label: string;
  entityType: EntityType;
  entityId: string;
  destructive?: boolean;
}

export function DeleteButton({ label, entityType, entityId, destructive = true }: DeleteButtonProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setDeleting(true);
    try {
      switch (entityType) {
        case "banner":
          await deleteBanner(entityId);
          break;
        case "circular":
          await deleteCircular(entityId);
          break;
        case "article":
          await deleteArticle(entityId);
          break;
        case "law":
          await deleteLaw(entityId);
          break;
        case "faq":
          await deleteFaq(entityId);
          break;
        case "user":
          await deleteUser(entityId);
          break;
        case "service":
          await deleteService(entityId);
          break;
      }
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
