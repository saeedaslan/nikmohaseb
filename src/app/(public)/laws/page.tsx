import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download, FileText } from "lucide-react";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "قوانین مالی و مالیاتی",
  description: "جدیدترین قوانین مالیاتی، ارزش افزوده و مالیات مستقیم. اطلاعیه‌های رسمی و تشریحات کاربردی",
  alternates: {
    canonical: `${domains.primary}/laws`,
  },
};

const PAGE_SIZE = 12;

export default async function LawsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page ?? 1));
  const skip = (current - 1) * PAGE_SIZE;

  const [laws, total] = await Promise.all([
    prisma.law.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      include: { category: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.law.count({ where: { published: true } }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">قوانین</h1>
          <p className="mt-3 text-sm text-text-muted">
            قوانین مالی و مالیاتی منتشر شده
          </p>
        </div>

        {laws.length === 0 ? (
          <p className="py-12 text-center text-text-muted">
            قانونی یافت نشد.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {laws.map((l) => (
                <Card key={l.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent-yellow" />
                      {l.type === "DIRECT_TAX" && (
                        <span className="text-xs text-accent-yellow">مالیات مستقیم</span>
                      )}
                      {l.type === "VAT" && (
                        <span className="text-xs text-accent-yellow">ارزش افزوده</span>
                      )}
                    </div>
                    {l.category && (
                      <span className="text-xs text-accent-green">
                        {l.category.name}
                      </span>
                    )}
                    <CardTitle className="text-right">{l.title}</CardTitle>
                    {l.number && (
                      <CardDescription>شماره: {l.number}</CardDescription>
                    )}
                    {l.summary && (
                      <CardDescription className="line-clamp-2">
                        {l.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <div className="mt-auto flex items-center justify-between p-6 pt-0">
                    <span className="text-xs text-text-muted">
                      {toJalali(l.date ?? l.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      {l.file && (
                        <Button asChild variant="ghost" size="sm">
                          <a href={l.file} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/laws/${l.slug}`}>مشاهده</Link>
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
              basePath="/laws"
            />
          </>
        )}
      </div>
    </section>
  );
}
