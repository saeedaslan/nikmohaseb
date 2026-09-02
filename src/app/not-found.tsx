import Link from "next/link";
import { Home, ArrowRight, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { domains } from "@/lib/nav";

export const metadata = {
  title: "صفحه یافت نشد | نیک محاسب سرو",
  description: "صفحه مورد نظر شما یافت نشد. لطفاً از لینک‌های زیر استفاده کنید.",
  robots: {
    index: false,
    follow: true,
  },
};

const quickLinks = [
  { label: "خدمات حسابداری", href: "/services" },
  { label: "مقالات مالیاتی", href: "/articles" },
  { label: "بخشنامه‌ها", href: "/circulars" },
  { label: "قوانین", href: "/laws" },
  { label: "سؤالات متداول", href: "/faqs" },
  { label: "تماس با ما", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-background via-white to-surface-background">
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="relative mb-8">
          <span className="text-[150px] font-extrabold text-primary-navy/10 leading-none select-none">
            ۴۰۴
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-accent-green/10 p-6">
              <Search className="h-16 w-16 text-accent-green" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-primary-navy lg:text-4xl">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-text-muted">
          متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا حذف شده است.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/contact">
              <Phone className="h-4 w-4" />
              تماس با ما
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold text-text-muted">
            یا از لینک‌های زیر استفاده کنید
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-sm text-text transition-all hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
              >
                {link.label}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-white/50 p-6 backdrop-blur-sm">
          <p className="text-sm text-text-muted">
            اگر فکر می‌کنید این یک خطاست، لطفاً با ما تماس بگیرید:
          </p>
          <a
            href={`mailto:info@${domains.primary.replace("https://", "")}`}
            className="mt-2 inline-block text-accent-green hover:underline"
          >
            info@nikmohaseb.ir
          </a>
        </div>
      </div>
    </div>
  );
}
