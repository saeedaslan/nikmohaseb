"use client";

import { updateTicketStatus } from "@/lib/actions/admin-tickets";
import { TICKET_STATUS_LABELS } from "@/lib/constants";

export function TicketStatusSelect({
  ticketId,
  current,
}: {
  ticketId: string;
  current: string;
}) {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateTicketStatus(ticketId, e.target.value);
    window.location.reload();
  };
  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="rounded-md border border-border bg-surface-card px-2 py-1 text-sm text-text"
    >
      {Object.entries(TICKET_STATUS_LABELS).map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}
