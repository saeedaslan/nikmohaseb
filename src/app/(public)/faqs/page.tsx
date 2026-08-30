import { prisma } from "@/lib/prisma";
import { HelpCircle, MessageCircleQuestion, ArrowLeft } from "lucide-react";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQSchema } from "@/components/structured-data";
import { domains } from "@/lib/nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green py-16 lg:py-24">
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-green/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm mb-6">
            <MessageCircleQuestion className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm text-white/90">راهنما</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            سؤالات متداول
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            پاسخ به سؤالات متداول درباره مشاوره مالی و مالیاتی
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FAQSchema faqs={faqSchemaData} />

          {faqs.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-12 text-center shadow-lg backdrop-blur-lg">
              <HelpCircle className="mx-auto h-16 w-16 text-text-muted mb-4" />
              <p className="text-lg text-text-muted">سؤال متداولی یافت نشد.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
              <FaqAccordion faqs={faqs} />
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-navy via-primary-navy to-accent-green p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">سوال دیگری دارید؟</h2>
            <p className="mx-auto mb-6 max-w-xl text-white/70">
              برای دریافت مشاوره رایگان با تیم ما تماس بگیرید
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
