import Link from "next/link";
import { listAdminTickets } from "@/lib/actions/admin-tickets";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toJalali } from "@/lib/jalali";
import { TicketStatusSelect } from "@/components/admin/ticket-status-select";
import { TicketFilters } from "@/components/dashboard/ticket-filters";

export const metadata = {
  title: "تیکت‌ها | ادمین | نیک محاسب سرو",
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q: query, status: statusFilter } = await searchParams;
  const tickets = await listAdminTickets();

  const filtered = tickets.filter((t) => {
    const matchesQuery =
      !query || t.subject.includes(query) || t.id.includes(query);
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">تیکت‌ها</h1>
        <TicketFilters query={query} statusFilter={statusFilter} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-text-muted">تیکتی یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>موضوع</TableHead>
                <TableHead>کاربر</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>اولویت</TableHead>
                <TableHead>آخرین بروزرسانی</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Link
                      href={`/admin/tickets/${t.id}`}
                      className="font-medium text-accent-green hover:underline"
                    >
                      {t.subject}
                    </Link>
                  </TableCell>
                  <TableCell>{t.user?.name ?? "-"}</TableCell>
                  <TableCell>
                    <TicketStatusSelect ticketId={t.id} current={t.status} />
                  </TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell className="text-xs">
                    {toJalali(t.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/tickets/${t.id}`}>مشاهده</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
