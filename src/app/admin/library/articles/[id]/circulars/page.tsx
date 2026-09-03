import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  getArticleWithCirculars,
  listPublishedCirculars,
} from "@/lib/actions/library";
import { ArticleCircularsEditor } from "@/components/admin/article-circulars-editor";

export const metadata = {
  title: "بخشنامه‌های مرتبط با ماده | ادمین | نیک محاسب سرو",
};

export default async function AdminArticleCircularsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, allCirculars] = await Promise.all([
    getArticleWithCirculars(id),
    listPublishedCirculars(),
  ]);
  if (!article) notFound();

  const backUrl = `/admin/library/laws/${article.chapter.book.law.id}`;

  return (
    <div className="space-y-4">
      <Link
        href={backUrl}
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-green"
      >
        <ChevronLeft className="h-4 w-4" />
        بازگشت به ساختار قانون
      </Link>
      <div>
        <h1 className="text-xl font-bold text-primary-navy">
          بخشنامه‌های مرتبط با ماده {toPersian(article.number)}
        </h1>
        <p className="text-sm text-text-muted">
          {article.chapter.book.law.title} · کتاب {toPersian(article.chapter.book.number)}، فصل {toPersian(article.chapter.number)}
          {article.title ? ` · ${article.title}` : ""}
        </p>
      </div>
      <ArticleCircularsEditor
        articleId={article.id}
        initialSelected={article.circulars.map((c) => c.circularId)}
        allCirculars={allCirculars}
        backUrl={backUrl}
      />
    </div>
  );
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
