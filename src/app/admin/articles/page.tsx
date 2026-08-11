import Link from "next/link";
import {
  listArticles,
  deleteArticle,
  toggleArticlePublished,
} from "@/lib/actions/articles";
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
  title: "مقالات | ادمین | نیک محاسب سرو",
};

export default async function AdminArticlesPage() {
  const articles = await listArticles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">مقالات</h1>
        <Button asChild variant="accent" size="sm">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" />
            <span className="mr-1">مقاله جدید</span>
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <p className="py-8 text-center text-text-muted">مقاله‌ای یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>عنوان</TableHead>
                <TableHead>نویسنده</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>منتشر</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.author?.name ?? "-"}</TableCell>
                  <TableCell>{a.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    {a.published ? (
                      <Badge variant="success">منتشر شده</Badge>
                    ) : (
                      <Badge variant="warning">پیش‌نویس</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {toJalali(a.publishedAt ?? a.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/articles/${a.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        label="مقاله"
                        onConfirm={deleteArticle.bind(null, a.id)}
                      />
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
