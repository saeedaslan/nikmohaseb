import { Card } from "@/components/ui/card";

export const metadata = {
  title: "درباره ما | نیک محاسب سرو",
  description: "درباره شرکت نیک محاسب سرو",
};

export default function AboutPage() {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">
            درباره نیک محاسب سرو
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            مسیر یابی شما در امور مالی و مالیاتی
          </p>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 text-2xl font-extrabold text-primary-navy">
            نیک محاسب سرو
          </div>
          <p className="mx-auto max-w-2xl text-text">
            شرکت نیک محاسب سرو با تیمی متشکل از متخصصان حسابداری، مالیات و مشاوره
            مالی، خدمات جامع و تخصصی به کسب‌وکارها ارائه می‌دهد. هدف ما ارائه
            راه‌حل‌های عملی، قانونی و مؤثر است که به مشتریانمان کمک می‌کند تا در
            امور مالی و مالیاتی خود آرامش و اطمینان داشته باشند.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-2 text-primary-navy">درباره تیم ما</h3>
            <p className="text-sm text-text-muted">
              اعضای تیم ما شامل حسابدانان رسمی، کارشناسان مالیات و مشاوران مالی
              با سال‌ها تجربه فعالیت در شرکت‌های مختلف صنعتی و خدماتی هستند. ما
              با رویکردی تحلیلی و علمی، بهترین راه‌حل را برای هر چالش ارائه می‌دهیم.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="mb-2 text-primary-navy">ارزش‌های ما</h3>
            <ul className="space-y-1 text-sm text-text-muted">
              <li>✓ دقت و دقیق‌کردن جزئیات</li>
              <li>✓ شفافیت در ارتباط و گزارش‌گیری</li>
              <li>✓ احترام به حریم شخصی و اطلاعات مشتری</li>
              <li>✓ پیگیری مستمر تا رسیدن به نتیجه مطلوب</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
