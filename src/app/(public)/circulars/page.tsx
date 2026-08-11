import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download } from "lucide-react";

export const metadata = {
  title: "بخشنامه‌ها | نیک محاسب سرو",
  description: "بخشنامه‌های مالی و مالیاتی",
};

const PAGE_SIZE = 12;

export default async function CircularsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page ?? 1));
  const skip = (current - 1) * PAGE_SIZE;

  const [circulars, total] = await Promise.all([
    prisma.circular.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      include: { category: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.circular.count({ where: { published: true } }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">بخشنامه‌ها</h1>
          <p className="mt-3 text-sm text-text-muted">
            بخشنامه‌های مالی، مالیاتی و حسابداری
          </p>
        </div>

        {circulars.length === 0 ? (
          <p className="py-12 text-center text-text-muted">
            بخشنامه‌ای یافت نشد.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {circulars.map((c) => (
                <Card key={c.id} className="flex flex-col">
                  <CardHeader>
                    {c.category && (
                      <span className="text-xs text-accent-green">
                        {c.category.name}
                      </span>
                    )}
                    <CardTitle className="text-right">{c.title}</CardTitle>
                    {c.number && (
                      <CardDescription>شماره: {c.number}</CardDescription>
                    )}
                    {c.summary && (
                      <CardDescription className="line-clamp-2">
                        {c.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <div className="mt-auto flex items-center justify-between p-6 pt-0">
                    <span className="text-xs text-text-muted">
                      {toJalali(c.date ?? c.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      {c.file && (
                        <Button asChild variant="ghost" size="sm">
                          <a href={c.file} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/circulars/${c.slug}`}>مشاهده</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Pagination
              current={current}
              pages={pages}
              total={total}
              basePath="/circulars"
            />
          </>
        )}
      </div>
    </section>
  );
}
