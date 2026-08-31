import Link from "next/link";
import { listFaqs } from "@/lib/actions/faqs";
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
import { ToggleButton } from "@/components/admin/toggle-button";
import { toJalali } from "@/lib/jalali";

export const metadata = {
  title: "سؤالات متداول | ادمین | نیک محاسب سرو",
};

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">سؤالات متداول</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/faqs/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">سؤال جدید</span>
          </Link>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <p className="py-8 text-center text-text-muted">سؤال متداولی یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>سؤال</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>منتشر</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {faqs.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.question}</TableCell>
                  <TableCell>{f.category ?? "-"}</TableCell>
                  <TableCell>{f.order}</TableCell>
                  <TableCell>
                    {f.published ? (
                      <Badge variant="success">منتشر شده</Badge>
                    ) : (
                      <Badge variant="warning">پیش‌نویس</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {toJalali(f.publishedAt ?? f.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <ToggleButton entityType="faq" entityId={f.id} active={f.published} />
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/faqs/${f.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton label="سؤال" entityType="faq" entityId={f.id} />
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
