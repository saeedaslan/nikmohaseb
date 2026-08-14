import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toJalali } from "@/lib/jalali";
import type { Law } from "@/lib/queries";

const lawTypeLabel: Record<string, string> = {
  DIRECT_TAX: "مالیات مستقیم",
  VAT: "مالیات ارزش افزوده",
  OTHER: "سایر",
};

export async function LawsSection({ laws }: { laws: Law[] }) {
  return (
    <section className="bg-surface-card py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary-navy dark:text-primary-navy-light sm:text-3xl">
          <FileText className="h-6 w-6 text-accent-yellow" />
          <span>آخرین قوانین</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-text-muted sm:text-base">
          قوانین مالی و مالیاتی منتشر شده
        </p>

        {laws.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            قانونی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {laws.map((l) => (
              <Card key={l.id} className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent-yellow" />
                    <span className="text-xs text-accent-yellow">
                      {lawTypeLabel[l.type ?? "OTHER"] ?? l.type}
                    </span>
                  </div>
                  {l.category && (
                    <span className="text-xs text-accent-green">
                      {l.category.name}
                    </span>
                  )}
                  <CardTitle className="text-right">{l.title}</CardTitle>
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
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/laws/${l.slug}`}>مشاهده</Link>
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
