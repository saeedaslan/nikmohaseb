import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Article } from "@/lib/queries";

export async function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl">
          <FileText className="h-6 w-6 text-accent-yellow" />
          <span>آخرین مقالات</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-text-muted sm:text-base">
          مقالات و راهنمایی‌های مالی و مالیاتی
        </p>

        {articles.length === 0 ? (
          <p className="py-8 text-center text-text-muted">مقاله‌ای یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((a) => (
              <Card key={a.id} className="flex flex-col">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-40 w-full rounded-t-xl object-cover"
                  />
                ) : (
                  <div className="h-40 w-full rounded-t-xl bg-surface-background" />
                )}
                <CardHeader>
                  {a.category && (
                    <span className="text-xs text-accent-yellow">
                      {a.category.name}
                    </span>
                  )}
                  <CardTitle className="text-right">{a.title}</CardTitle>
                  {a.summary && (
                    <CardDescription className="line-clamp-2">
                      {a.summary}
                    </CardDescription>
                  )}
                </CardHeader>
                <div className="mt-auto flex items-center justify-between p-6 pt-0">
                  <span className="text-xs text-text-muted">
                    {toJalali(a.publishedAt ?? a.createdAt)}
                  </span>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/articles/${a.slug}`}>مطالعه مقاله</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
