import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { toJalali } from "@/lib/jalali";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { BookOpen, Calendar, ArrowLeft, Clock, Users } from "lucide-react";
import { domains } from "@/lib/nav";
import { ItemListSchema } from "@/components/structured-data";

export const revalidate = 300;

export const metadata = {
  title: "مقالات مالی و مالیاتی",
  description: "مقالات تخصصی حسابداری، مالیاتی، مشاوره مالی و حقوق دستمزد. راهنمای‌های کاربردی برای کسب‌وکارها",
  alternates: {
    canonical: `${domains.primary}/articles`,
  },
};

const PAGE_SIZE = 9;

const features = [
  { icon: BookOpen, title: "مقالات تخصصی", description: "محتوای کاربردی و به‌روز" },
  { icon: Users, title: "نویسندگان متخصص", description: "تیم حرفه‌ای حسابداری" },
  { icon: Clock, title: "به‌روزرسانی مداوم", description: "آخرین تغییرات قانونی" },
];

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
    <div className="min-h-screen">
      <ItemListSchema
        name="مقالات مالی و مالیاتی نیک محاسب سرو"
        items={articles.map((a) => ({
          name: a.title,
          url: `/articles/${a.slug}`,
          image: a.image || undefined,
        }))}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-blue-600 py-16 lg:py-24">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm mb-6">
            <BookOpen className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm text-white/90">مرجع آموزشی</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            مقالات مالی و مالیاتی
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            مقالات تخصصی حسابداری، مالیاتی، مشاوره مالی و حقوق دستمزد
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                   <div>
                     <h2 className="font-bold text-primary-navy">{feature.title}</h2>
                     <p className="text-sm text-text-muted">{feature.description}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {articles.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
              <BookOpen className="mx-auto h-16 w-16 text-text-muted mb-4" />
              <p className="text-lg text-text-muted">مقاله‌ای یافت نشد.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <div key={a.id} className="group rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 overflow-hidden">
                     {a.image ? (
                       <div className="relative h-48 w-full overflow-hidden">
                         <Image
                           src={a.image}
                           alt={a.title}
                           fill
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {a.category && (
                          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-navy">
                            {a.category.name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-300" />
                        {a.category && (
                          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-navy">
                            {a.category.name}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-bold text-primary-navy line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {a.title}
                      </h3>
                      {a.summary && (
                        <p className="text-sm text-text-muted line-clamp-2 mb-4">{a.summary}</p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Calendar className="h-3 w-3" />
                          <span>{toJalali(a.publishedAt ?? a.createdAt)}</span>
                        </div>
                        <Link 
                          href={`/articles/${a.slug}`} 
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          <span>مطالعه</span>
                          <ArrowLeft className="h-3 w-3" />
                        </Link>
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
                  basePath="/articles"
                />
              </div>
            </>
          )}

          {/* CTA Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-navy via-primary-navy to-blue-600 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">سوالی دارید؟</h2>
            <p className="mx-auto mb-6 max-w-xl text-white/70">
              برای دریافت مشاوره تخصصی با تیم ما تماس بگیرید
            </p>
            <Button asChild size="lg" className="bg-accent-green text-white hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/30 transition-all duration-300">
              <Link href="/contact" className="flex items-center gap-2">
                <span>تماس با ما</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
