"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const statusLabels: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال بررسی",
  ANSWERED: "پاسخ‌داده شده",
  CLOSED: "بسته‌شده",
};

export function TicketFilters({
  query,
  statusFilter,
}: {
  query?: string;
  statusFilter?: string;
}) {
  useEffect(() => {
    const select = document.querySelector<HTMLSelectElement>('select[name="status"]');
    if (!select) return;
    const handler = () => select.form?.requestSubmit();
    select.addEventListener("change", handler);
    return () => select.removeEventListener("change", handler);
  }, []);

  return (
    <form className="flex items-center gap-3">
      <Input
        name="q"
        placeholder="جستجو در تیکت‌ها..."
        defaultValue={query}
        className="max-w-xs"
      />
      <select
        name="status"
        defaultValue={statusFilter ?? ""}
        className="rounded-md border border-border bg-surface-card px-3 py-2 text-sm text-text"
      >
        <option value="">همه وضعیت‌ها</option>
        {Object.entries(statusLabels).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </form>
  );
}
