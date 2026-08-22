import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export const metadata = {
  title: "صفحه یافت نشد | نیک محاسب سرو",
  description: "صفحه مورد نظر شما یافت نشد.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-accent-green/20">۴۰۴</div>
      <h1 className="mb-3 text-2xl font-bold text-primary-navy">
        صفحه مورد نظر یافت نشد
      </h1>
      <p className="mb-8 max-w-md text-sm text-text-muted">
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild variant="primary">
          <Link href="/">
            <Home className="h-4 w-4" />
            بازگشت به خانه
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">
            تماس با ما
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
