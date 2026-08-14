import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "سؤالات متداول | نیک محاسب سرو",
  description: "سؤالات متداول مالی و مالیاتی",
};

const PAGE_SIZE = 12;

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page ?? 1));
  const skip = (current - 1) * PAGE_SIZE;

  const [faqs, total] = await Promise.all([
    prisma.faq.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    prisma.faq.count({ where: { published: true } }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">سؤالات متداول</h1>
          <p className="mt-3 text-sm text-text-muted">
            پاسخ به سؤالات متداول درباره مشاوره مالی و مالیاتی
          </p>
        </div>

        {faqs.length === 0 ? (
          <p className="py-12 text-center text-text-muted">
            سؤال متداولی یافت نشد.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {faqs.map((f) => (
                <Card key={f.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-accent-yellow" />
                      {f.category && (
                        <span className="text-xs text-accent-green">
                          {f.category}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-right">{f.question}</CardTitle>
                    {f.answer && (
                      <CardDescription
                        className="line-clamp-3"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: f.answer }}
                      />
                    )}
                  </CardHeader>
                  <div className="mt-auto p-6 pt-0">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/faqs/${f.slug}`}>مشاهده جزئیات</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Pagination
              current={current}
              pages={pages}
              total={total}
              basePath="/faqs"
            />
          </>
        )}
      </div>
    </section>
  );
}
