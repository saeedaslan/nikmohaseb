"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query ?? "");

  const updateURL = (newQuery: string, newStatus: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newStatus) params.set("status", newStatus);
    const url = params.toString() ? `?${params.toString()}` : "/dashboard/tickets";
    router.push(url);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(search, statusFilter ?? "");
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateURL(search, e.target.value);
  };

  useEffect(() => {
    setSearch(query ?? "");
  }, [query]);

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-3">
      <Input
        name="q"
        placeholder="جستجو در تیکت‌ها..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />
      <select
        name="status"
        value={statusFilter ?? ""}
        onChange={handleStatusChange}
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
