"use client";

import { useState, useTransition } from "react";
import { assignTicket, getSupportStaff } from "@/lib/actions/admin-tickets";
import { useToast } from "@/components/ui/toast";
import { User, ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Staff {
  id: string;
  name: string | null;
  role: string;
}

export function AssignDropdown({
  ticketId,
  currentAssignee,
}: {
  ticketId: string;
  currentAssignee?: { id: string; name: string | null } | null;
}) {
  const { addToast } = useToast();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getSupportStaff().then(setStaff).catch(console.error);
  }, []);

  const handleAssign = (assignedToId: string | null) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      if (assignedToId) {
        formData.append("assignedToId", assignedToId);
      }

      const result = await assignTicket(null, formData);
      if (result?.ok) {
        addToast({ message: "تیکت با موفقیت اختصاص یافت.", variant: "success" });
        setIsOpen(false);
        router.refresh();
      } else if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-surface-card px-4 py-2.5 text-sm transition-all duration-200 hover:border-accent-green/50",
          isOpen && "border-accent-green/50 ring-2 ring-accent-green/20",
        )}
      >
        <span className="flex items-center gap-2">
          <User className="h-4 w-4 text-text-muted" />
          <span className="text-text">
            {currentAssignee?.name ?? "تخصیص به کارشناس"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border/60 bg-surface-card shadow-xl backdrop-blur-xl">
          <div className="max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={() => handleAssign(null)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-background"
            >
              <span className="h-4 w-4" />
              بدون اختصاص
            </button>
            {staff.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleAssign(member.id)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-surface-background",
                  currentAssignee?.id === member.id && "bg-accent-green/10 text-accent-green",
                )}
              >
                {currentAssignee?.id === member.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                <span>{member.name ?? "بدون نام"}</span>
                <span className="mr-auto text-xs text-text-muted">
                  {member.role === "ADMIN" ? "مدیر" : "پشتیبانی"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface-card/80 backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-accent-green" />
        </div>
      )}
    </div>
  );
}
