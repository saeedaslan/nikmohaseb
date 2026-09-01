"use client";

import { useState, useTransition } from "react";
import { assignTicket, getSupportStaff } from "@/lib/actions/admin-tickets";
import { useToast } from "@/components/ui/toast";
import { User, ChevronDown, Check, Loader2, Users, Shield, Headphones } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getSupportStaff()
      .then(setStaff)
      .catch(console.error)
      .finally(() => setIsLoading(false));
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

  const getRoleIcon = (role: string) => {
    if (role === "ADMIN") return <Shield className="h-3.5 w-3.5 text-red-500" />;
    return <Headphones className="h-3.5 w-3.5 text-blue-500" />;
  };

  const getRoleLabel = (role: string) => {
    if (role === "ADMIN") return "مدیر";
    return "پشتیبانی";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-surface-card px-4 py-3 text-sm transition-all duration-200",
          "hover:border-accent-green/50 hover:shadow-md hover:shadow-accent-green/5",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "border-accent-green/50 ring-2 ring-accent-green/20 shadow-lg shadow-accent-green/10",
        )}
      >
        <span className="flex items-center gap-3">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            currentAssignee ? "bg-accent-green/10" : "bg-surface-background"
          )}>
            <User className={cn("h-4 w-4", currentAssignee ? "text-accent-green" : "text-text-muted")} />
          </div>
          <span className="text-text font-medium">
            {currentAssignee?.name ?? "تخصیص به کارشناس"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-accent-green",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-border/60 bg-surface-card shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="border-b border-border/40 bg-surface-background/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent-green" />
                <span className="text-sm font-semibold text-text">انتخاب کارشناس</span>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-accent-green" />
                  <span className="mr-2 text-sm text-text-muted">در حال بارگذاری...</span>
                </div>
              ) : staff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-text-muted/50 mb-2" />
                  <p className="text-sm text-text-muted">کارشناسی یافت نشد</p>
                  <p className="text-xs text-text-muted/70 mt-1">ابتدا کاربران با نقش ادمین یا پشتیبان ایجاد کنید</p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleAssign(null)}
                    disabled={isPending}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      "hover:bg-surface-background",
                      !currentAssignee && "bg-accent-green/10 text-accent-green",
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-background">
                      <span className="h-3 w-3 rounded-full bg-text-muted/30" />
                    </div>
                    <span className="flex-1 text-right">بدون اختصاص</span>
                    {!currentAssignee && <Check className="h-4 w-4" />}
                  </button>
                  <div className="my-2 border-t border-border/30" />
                  {staff.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleAssign(member.id)}
                      disabled={isPending}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                        "hover:bg-surface-background",
                        currentAssignee?.id === member.id && "bg-accent-green/10 text-accent-green",
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        currentAssignee?.id === member.id ? "bg-accent-green/20" : "bg-surface-background"
                      )}>
                        {currentAssignee?.id === member.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          getRoleIcon(member.role)
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <span className="block">{member.name ?? "بدون نام"}</span>
                      </div>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        member.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {getRoleLabel(member.role)}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface-card/80 backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-accent-green" />
        </div>
      )}
    </div>
  );
}
