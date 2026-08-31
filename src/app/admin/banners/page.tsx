import Link from "next/link";
import { listBanners, type BannerRow } from "@/lib/actions/banners";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleButton } from "@/components/admin/toggle-button";

export const metadata = {
  title: "بنرها | ادمین | نیک محاسب سرو",
};

export default async function AdminBannersPage() {
  const banners = await listBanners();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">بنرها</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/banners/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">بنر جدید</span>
          </Link>
        </Button>
      </div>

      {banners.length === 0 ? (
        <p className="py-8 text-center text-text-muted">بنری یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>عنوان</TableHead>
                <TableHead>فعال</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {banners.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>
                    <ToggleButton entityType="banner" entityId={b.id} active={b.active} />
                  </TableCell>
                  <TableCell>{b.order}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/banners/${b.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton label="حذف بنر" entityType="banner" entityId={b.id} />
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
