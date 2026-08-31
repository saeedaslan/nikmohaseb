"use client";

import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/actions/users";
import { useState } from "react";

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const { addToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setIsLoading(true);
    try {
      const result = await updateUserRole(userId, role);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "نقش کاربر بروزرسانی شد.", variant: "success" });
        router.refresh();
      }
    } catch (error) {
      addToast({ message: "خطا در بروزرسانی نقش کاربر.", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={isLoading}
      className="rounded-lg border border-border bg-surface-card px-3 py-1.5 text-sm text-text focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20 disabled:opacity-50"
    >
      <option value="USER">کاربر</option>
      <option value="SUPPORT">پشتیبان</option>
      <option value="ADMIN">ادمین</option>
    </select>
  );
}
