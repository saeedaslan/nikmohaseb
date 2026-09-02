import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Download, FileText, Scale, AlertCircle } from "lucide-react";
import { domains } from "@/lib/nav";
import { ItemListSchema } from "@/components/structured-data";

export const revalidate = 300;

export const metadata = {
  title: "قوانین مالی و مالیاتی",
  description: "جدیدترین قوانین مالیاتی، ارزش افزوده و مالیات مستقیم. اطلاعیه‌های رسمی و تشریحات کاربردی",
  alternates: {
    canonical: `${domains.primary}/laws`,
  },
};

const PAGE_SIZE = 12;

const typeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  DIRECT_TAX: { label: "مالیات مستقیم", color: "text-blue-600", bgColor: "bg-blue-100" },
  VAT: { label: "ارزش افزوده", color: "text-purple-600", bgColor: "bg-purple-100" },
  OTHER: { label: "سایر", color: "text-gray-600", bgColor: "bg-gray-100" },
};

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
    <div className="min-h-screen">
      <ItemListSchema
        name="قوانین مالی و مالیاتی نیک محاسب سرو"
        items={laws.map((l) => ({
          name: l.title,
          url: `/laws/${l.slug}`,
        }))}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-purple-600 py-16 lg:py-24">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm mb-6">
            <Scale className="h-4 w-4 text-accent-green" />
            <span className="text-sm text-white/90">قوانین و مقررات</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            قوانین مالی و مالیاتی
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            جدیدترین قوانین مالیاتی، ارزش افزوده و مالیات مستقیم
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="mb-2 font-bold text-primary-navy">درباره قوانین</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  در این بخش جدیدترین قوانین مالی و مالیاتی منتشر شده توسط مراجع قانونی را مطالعه کنید. این قوانین شامل مالیات مستقیم، مالیات بر ارزش افزوده و سایر مقررات مالی هستند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laws List */}
      <div className="pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          {laws.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
              <FileText className="mx-auto h-16 w-16 text-text-muted mb-4" />
              <p className="text-lg text-text-muted">قانونی یافت نشد.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {laws.map((l) => {
                  const type = typeConfig[l.type] || typeConfig.OTHER;
                  return (
                    <div key={l.id} className="group rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${type.bgColor} ${type.color}`}>
                            {type.label}
                          </span>
                        </div>
                        {l.category && (
                          <span className="inline-block rounded-full bg-accent-green/20 px-3 py-1 text-xs text-accent-green mb-3">
                            {l.category.name}
                          </span>
                        )}
                        <h3 className="mb-2 text-lg font-bold text-primary-navy line-clamp-1">{l.title}</h3>
                        {l.number && (
                          <p className="text-sm text-text-muted mb-2">شماره: {l.number}</p>
                        )}
                        {l.summary && (
                          <p className="text-sm text-text-muted line-clamp-2 mb-4">{l.summary}</p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <span className="text-xs text-text-muted">
                            {toJalali(l.date ?? l.createdAt)}
                          </span>
                          <div className="flex gap-2">
                            {l.file && (
                              <a href={l.file} download className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-background hover:bg-purple-100 transition-colors">
                                <Download className="h-4 w-4 text-purple-600" />
                              </a>
                            )}
                            <Link href={`/laws/${l.slug}`} className="inline-flex h-8 items-center gap-1 rounded-lg bg-purple-600 px-3 text-xs font-medium text-white hover:bg-purple-700 transition-colors">
                              <span>مشاهده</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <Pagination
                  current={current}
                  pages={pages}
                  total={total}
                  basePath="/laws"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
