import Link from "next/link";
import { listLaws } from "@/lib/actions/laws";
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
import { Plus, Edit } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { toJalali } from "@/lib/jalali";

export const metadata = {
  title: "قوانین | ادمین | نیک محاسب سرو",
};

export default async function AdminLawsPage() {
  const laws = await listLaws();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">قوانین</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/laws/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">قانون جدید</span>
          </Link>
        </Button>
      </div>

      {laws.length === 0 ? (
        <p className="py-8 text-center text-text-muted">
          قانونی یافت نشد.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>عنوان</TableHead>
                <TableHead>شماره</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>منتشر</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {laws.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.title}</TableCell>
                  <TableCell>{l.number ?? "-"}</TableCell>
                  <TableCell>{l.type === "DIRECT_TAX" ? "مالیات مستقیم" : l.type === "VAT" ? "ارزش افزوده" : "سایر"}</TableCell>
                  <TableCell>{l.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    {l.published ? (
                      <Badge variant="success">منتشر شده</Badge>
                    ) : (
                      <Badge variant="warning">پیش‌نویس</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {toJalali(l.date ?? l.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/laws/${l.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton label="قانون" entityType="law" entityId={l.id} />
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
