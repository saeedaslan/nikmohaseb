import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TicketStatus, TicketPriority, type Ticket } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TicketFilters } from "@/components/dashboard/ticket-filters";

export const metadata = {
  title: "تیکت‌های من | نیک محاسب سرو",
};

const statusLabels: Record<string, string> = {
  NEW: "جدید",
  IN_PROGRESS: "در حال بررسی",
  ANSWERED: "پاسخ‌داده شده",
  CLOSED: "بسته‌شده",
};
const priorityLabels = {
  NORMAL: "عادی",
  HIGH: "مهم",
  URGENT: "فوری",
  CRITICAL: "حیاتی",
};

export default async function DashboardTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { q: query, status: statusFilter } = await searchParams;

  const where = {
    userId: user.id,
    ...(statusFilter && statusFilter in statusLabels
      ? { status: statusFilter as Ticket["status"] }
      : {}),
    ...(query
      ? { OR: [{ subject: { contains: query } }, { description: { contains: query } }] }
      : {}),
  };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { messages: true, attachments: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">تیکت‌های من</h1>
        <Button asChild variant="primary" size="sm">
          <Link href="/dashboard/tickets/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">ثبت تیکت جدید</span>
          </Link>
        </Button>
      </div>

      <TicketFilters query={query} statusFilter={statusFilter} />

      {tickets.length === 0 ? (
        <p className="py-8 text-center text-text-muted">تیکتی یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>موضوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>اولویت</TableHead>
                <TableHead>تاریخ</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-surface-background/50">
                  <TableCell>
                    <Link
                      href={`/dashboard/tickets/${t.id}`}
                      className="font-medium text-accent-green hover:underline"
                    >
                      {t.subject}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === TicketStatus.CLOSED
                          ? "default"
                          : t.status === TicketStatus.NEW
                            ? "error"
                            : "success"
                      }
                    >
                      {statusLabels[t.status] ?? t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{priorityLabels[t.priority] ?? t.priority}</TableCell>
                  <TableCell className="text-xs">
                    {toJalali(t.createdAt)}
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
