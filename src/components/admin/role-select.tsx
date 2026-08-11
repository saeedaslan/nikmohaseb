"use client";

import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/actions/users";

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const { addToast } = useToast();
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    await updateUserRole(userId, role);
    addToast({ message: "نقش کاربر بروزرسانی شد.", variant: "success" });
    router.refresh();
  };

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      className="rounded-md border border-border bg-surface-card px-2 py-1 text-sm text-text"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
