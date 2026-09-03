import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download, Search, FileText, AlertCircle } from "lucide-react";
import { domains } from "@/lib/nav";
import { ItemListSchema } from "@/components/structured-data";

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNum = Number(page ?? 1);
  
  return {
    title: pageNum > 1 ? `بخشنامه‌های مالیاتی - صفحه ${pageNum}` : "بخشنامه‌های مالیاتی",
    description: "جدیدترین بخشنامه‌های سازمان مالیاتی، توضیحات و دستورالعمل‌های اجرایی",
    alternates: {
      canonical: pageNum > 1 ? `${domains.primary}/circulars?page=${pageNum}` : `${domains.primary}/circulars`,
    },
    ...(pageNum > 1 && {
      openGraph: {
        title: `بخشنامه‌های مالیاتی - صفحه ${pageNum}`,
        url: `${domains.primary}/circulars?page=${pageNum}`,
      },
    }),
    ...(pageNum > 1 && pageNum > 1 && {
      other: {
        "link": [
          ...(pageNum > 1 ? [{ rel: "prev", href: `${domains.primary}/circulars?page=${pageNum - 1}` }] : []),
        ],
      },
    }),
  };
}

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
    <div className="min-h-screen">
      <ItemListSchema
        name="بخشنامه‌های مالیاتی نیک محاسب سرو"
        items={circulars.map((c) => ({
          name: c.title,
          url: `/circulars/${c.slug}`,
        }))}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-accent-yellow py-16 lg:py-24">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm mb-6">
            <FileText className="h-4 w-4 text-accent-green" />
            <span className="text-sm text-white/90">به‌روز باشید</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            بخشنامه‌های مالیاتی
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            جدیدترین بخشنامه‌های صادر شده توسط سازمان مالیاتی ایران
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-yellow/20">
                <AlertCircle className="h-6 w-6 text-accent-yellow" />
              </div>
              <div>
                <h2 className="mb-2 font-bold text-primary-navy">درباره بخشنامه‌ها</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  در این بخش جدیدترین بخشنامه‌های صادر شده توسط سازمان مالیاتی ایران را مطالعه کنید. این بخشنامه‌ها شامل دستورالعمل‌های اجرایی، توضیحات و راهنمایی‌های مربوط به قوانین مالیاتی هستند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="pb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
            <div className="flex flex-col gap-4 sm:flex-row">
              <form className="flex-1" method="get" action="/circulars">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q ?? ""}
                    placeholder="جستجو در بخشنامه‌ها..."
                    className="w-full rounded-xl border border-border bg-surface-card py-3 pl-4 pr-12 text-sm text-text focus:border-accent-yellow focus:outline-none focus:ring-2 focus:ring-accent-yellow/20"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-yellow transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
                {category && <input type="hidden" name="category" value={category} />}
              </form>

              <form method="get" action="/circulars">
                <div className="flex items-center gap-2">
                  <select
                    name="category"
                    defaultValue={category ?? ""}
                    className="rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-text focus:border-accent-yellow focus:outline-none focus:ring-2 focus:ring-accent-yellow/20"
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
                    className="rounded-xl bg-accent-yellow px-6 py-3 text-sm font-medium text-white hover:bg-accent-yellow/90 transition-colors"
                  >
                    فیلتر
                  </button>
                </div>
                {q && <input type="hidden" name="q" value={q} />}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Circulars List */}
      <div className="pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          {circulars.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
              <FileText className="mx-auto h-16 w-16 text-text-muted mb-4" />
              <p className="text-lg text-text-muted">
                {q || category ? "بخشنامه‌ای با این مشخصات یافت نشد." : "بخشنامه‌ای یافت نشد."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {circulars.map((c) => (
                  <div key={c.id} className="group rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-yellow/50 hover:shadow-xl hover:shadow-accent-yellow/10 hover:-translate-y-1 overflow-hidden">
                    <div className="p-6">
                      {c.category && (
                        <span className="inline-block rounded-full bg-accent-yellow/20 px-3 py-1 text-xs text-accent-yellow mb-3">
                          {c.category.name}
                        </span>
                      )}
                      <h3 className="mb-2 text-lg font-bold text-primary-navy line-clamp-1">{c.title}</h3>
                      {c.number && (
                        <p className="text-sm text-text-muted mb-2">شماره: {c.number}</p>
                      )}
                      {c.summary && (
                        <p className="text-sm text-text-muted line-clamp-2 mb-4">{c.summary}</p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-text-muted">
                          {toJalali(c.date ?? c.createdAt)}
                        </span>
                        <div className="flex gap-2">
                          {c.file && (
                            <a href={c.file} download className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-background hover:bg-accent-yellow/20 transition-colors">
                              <Download className="h-4 w-4 text-accent-yellow" />
                            </a>
                          )}
                          <Link href={`/circulars/${c.slug}`} className="inline-flex h-8 items-center gap-1 rounded-lg bg-accent-yellow px-3 text-xs font-medium text-white hover:bg-accent-yellow/90 transition-colors">
                            <span>مشاهده</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Pagination
                  current={current}
                  pages={pages}
                  total={total}
                  basePath="/circulars"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
