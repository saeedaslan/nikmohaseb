import Link from "next/link";
import { listServices, deleteService, toggleServicePublished } from "@/lib/actions/services";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleButton } from "@/components/admin/toggle-button";

export const metadata = {
  title: "خدمات | ادمین | نیک محاسب سرو",
};

export default async function AdminServicesPage() {
  const services = await listServices();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">خدمات</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">خدمت جدید</span>
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="py-8 text-center text-text-muted">سرویسی یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>عنوان</TableHead>
                <TableHead>اسلاک</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>منتشر</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>{s.slug}</TableCell>
                  <TableCell>{s.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    <ToggleButton
                      active={s.published}
                      onToggle={toggleServicePublished.bind(null, s.id, !s.published)}
                    />
                  </TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/services/${s.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton label="خدمت" onConfirm={deleteService.bind(null, s.id)} />
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
