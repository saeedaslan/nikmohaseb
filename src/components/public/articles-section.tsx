import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Article } from "@/lib/queries";

export async function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent-green/10 px-4 py-1 text-xs font-medium text-accent-green">
            مقالات تخصصی
          </span>
          <h2 className="mb-3 text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl md:text-4xl">
            آخرین مقالات مالی
          </h2>
          <p className="mx-auto max-w-xl text-sm text-text-muted sm:text-base">
            مقالات و راهنمایی‌های مالی و مالیاتی
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="py-8 text-center text-text-muted">مقاله‌ای یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group block">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {a.image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-accent-green/10 to-accent-green/5">
                      <FileText className="h-12 w-12 text-accent-green/30" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {a.category && (
                      <span className="mb-2 inline-block text-xs font-medium text-accent-green">
                        {a.category.name}
                      </span>
                    )}
                    <h3 className="mb-2 text-lg font-semibold text-primary-navy">
                      {a.title}
                    </h3>
                    {a.summary && (
                      <p className="mb-4 flex-1 text-sm leading-6 text-text-muted">
                        {a.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {toJalali(a.publishedAt ?? a.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-green opacity-0 transition-opacity group-hover:opacity-100">
                        مطالعه
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-accent-green text-accent-green hover:bg-accent-green hover:text-white">
            <Link href="/articles">مشاهده همه مقالات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
