import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download, Search } from "lucide-react";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "بخشنامه‌های مالیاتی",
  description: "جدیدترین بخشنامه‌های سازمان مالیاتی، توضیحات و دستورالعمل‌های اجرایی",
  alternates: {
    canonical: `${domains.primary}/circulars`,
  },
};

const PAGE_SIZE = 12;

export default async function CircularsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}) {
    const { page, q, category } = await searchParams;
    const current = Math.max(1, Number(page ?? 1));
    const skip = (current - 1) * PAGE_SIZE;

    const where: any = { published: true };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { number: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.categoryId = category;
    }

    const [circulars, total, categories] = await Promise.all([
      prisma.circular.findMany({
        where,
        orderBy: { date: "desc" },
        include: { category: true },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.circular.count({ where }),
      prisma.category.findMany({
        where: { type: "CIRCULAR" },
        orderBy: { name: "asc" },
      }),
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

          {current > 1 && (
            <link rel="prev" href={`${domains.primary}/circulars?page=${current - 1}`} />
          )}
          {current < pages && (
            <link rel="next" href={`${domains.primary}/circulars?page=${current + 1}`} />
          )}

          <div className="mb-8 rounded-lg border border-border/60 bg-surface-card p-6 text-right">
            <p className="text-sm text-text-muted leading-6">
              در این بخش جدیدترین بخشنامه‌های صادر شده توسط سازمان مالیاتی ایران را مطالعه کنید. این بخشنامه‌ها شامل دستورالعمل‌های اجرایی، توضیحات و راهنمایی‌های مربوط به قوانین مالیاتی هستند. برای مشاهده جزئیات کامل هر بخشنامه، روی دکمه مشاهده کلیک کنید.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <form className="flex-1" method="get" action="/circulars">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="جستجو در بخشنامه‌ها..."
                  className="w-full rounded-lg border border-border bg-surface-card py-2.5 pl-4 pr-10 text-sm text-text focus:border-accent-green focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-green"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              {category && <input type="hidden" name="category" value={category} />}
            </form>

            <form method="get" action="/circulars">
              <div className="flex items-center gap-2">
                <select
                  name="category"
                  defaultValue={category ?? ""}
                  className="rounded-lg border border-border bg-surface-card px-4 py-2.5 text-sm text-text focus:border-accent-green focus:outline-none"
                >
                  <option value="">همه دسته‌ها</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-accent-green px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-green/90"
                >
                  فیلتر
                </button>
              </div>
              {q && <input type="hidden" name="q" value={q} />}
            </form>
          </div>

          {circulars.length === 0 ? (
            <p className="py-12 text-center text-text-muted">
              {q || category ? "بخشنامه‌ای با این مشخصات یافت نشد." : "بخشنامه‌ای یافت نشد."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {circulars.map((c) => (
                  <Card key={c.id} className="flex flex-col">
                    {c.image && (
                      <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
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
