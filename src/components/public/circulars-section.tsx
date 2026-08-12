import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Circular } from "@/lib/queries";

export async function CircularsSection({ circulars }: { circulars: Circular[] }) {
  return (
    <section className="bg-surface-card py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl">
          <FileDown className="h-6 w-6 text-accent-yellow" />
          <span>آخرین بخشنامه‌ها</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-text-muted sm:text-base">
          بخشنامه‌های مالی و مالیاتی منتشر شده
        </p>

        {circulars.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            بخشنامه‌ای یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {circulars.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <CardHeader>
                  {c.category && (
                    <span className="text-xs text-accent-yellow">
                      {c.category.name}
                    </span>
                  )}
                  <CardTitle className="text-right">{c.title}</CardTitle>
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
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/circulars/${c.slug}`}>مشاهده</Link>
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
