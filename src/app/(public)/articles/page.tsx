import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "مقالات مالی و مالیاتی",
  description: "مقالات تخصصی حسابداری، مالیاتی، مشاوره مالی و حقوق دستمزد. راهنمای‌های کاربردی برای کسب‌وکارها",
  alternates: {
    canonical: `${domains.primary}/articles`,
  },
};

const PAGE_SIZE = 9;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page ?? 1));
  const skip = (current - 1) * PAGE_SIZE;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where: { published: true } }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">مقالات</h1>
          <p className="mt-3 text-sm text-text-muted">
            مقالات و راهنمایی‌های مالی و مالیاتی
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="py-12 text-center text-text-muted">مقاله‌ای یافت نشد.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

            <Pagination
              current={current}
              pages={pages}
              total={total}
              basePath="/articles"
            />
          </>
        )}
      </div>
    </section>
  );
}
