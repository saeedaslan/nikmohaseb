import Link from "next/link";
import { listCirculars } from "@/lib/actions/circulars";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Download } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { toJalali } from "@/lib/jalali";

export const metadata = {
  title: "بخشنامه‌ها | ادمین | نیک محاسب سرو",
};

export default async function AdminCircularsPage() {
  const circulars = await listCirculars();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">بخشنامه‌ها</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/circulars/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">بخشنامه جدید</span>
          </Link>
        </Button>
      </div>

      {circulars.length === 0 ? (
        <p className="py-8 text-center text-text-muted">
          بخشنامه‌ای یافت نشد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>عنوان</TableHead>
                <TableHead>شماره</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>منتشر</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {circulars.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.number ?? "-"}</TableCell>
                  <TableCell>{c.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    {c.published ? (
                      <Badge variant="success">منتشر شده</Badge>
                    ) : (
                      <Badge variant="warning">پیش‌نویس</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {toJalali(c.date ?? c.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {c.file && (
                        <a
                          href={c.file}
                          download
                          className="rounded p-1 text-text-muted hover:text-accent-green"
                          aria-label="دانلود"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/circulars/${c.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton label="بخشنامه" entityType="circular" entityId={c.id} />
                    </div>
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
