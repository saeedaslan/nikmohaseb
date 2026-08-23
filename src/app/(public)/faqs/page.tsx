import { prisma } from "@/lib/prisma";
import { HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQSchema } from "@/components/structured-data";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "سؤالات متداول",
  description: "پاسخ به سؤالات متداول درباره مشاوره مالی، مالیاتی، حسابداری و ثبت شرکت. راهنمای کامل برای کسب‌وکارها.",
  alternates: {
    canonical: `${domains.primary}/faqs`,
  },
};

export const revalidate = 60;

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const faqSchemaData = faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <section className="py-12">
      <FAQSchema faqs={faqSchemaData} />
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
