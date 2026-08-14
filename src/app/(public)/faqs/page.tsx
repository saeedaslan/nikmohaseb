import { prisma } from "@/lib/prisma";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export const metadata = {
  title: "سؤالات متداول | نیک محاسب سرو",
  description: "سؤالات متداول مالی و مالیاتی",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-accent-yellow" />
            <h1 className="text-3xl font-bold text-primary-navy">سؤالات متداول</h1>
            <HelpCircle className="h-6 w-6 text-accent-yellow" />
          </div>
          <p className="text-sm text-text-muted">
            پاسخ به سؤالات متداول درباره مشاوره مالی و مالیاتی
          </p>
        </div>

        {faqs.length === 0 ? (
          <p className="py-12 text-center text-text-muted">
            سؤال متداولی یافت نشد.
          </p>
        ) : (
          <FaqAccordion faqs={faqs} />
        )}
      </div>
    </section>
  );
}
