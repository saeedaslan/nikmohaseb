import { getCurrentUser } from "@/lib/auth";
import { TicketForm } from "@/components/tickets/ticket-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "تماس با ما | نیک محاسب سرو",
  description: "تماس با شرکت نیک محاسب سرو",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-navy">تماس با ما</h1>
          <p className="mt-3 text-sm text-text-muted">
            با ما در ارتباط باشید یا درخواست مشاوره خود را ثبت کنید
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4 text-right">
            <h2 className="text-lg font-semibold text-primary-navy">
              اطلاعات تماس
            </h2>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span>سعادت اباد بلوار سعادت اباد بالاتر از میدان کاج برج مادر پلاک ۱۳۳ طبقه ۱۰ واحد ۱۹</span>
              <MapPin className="h-4 w-4 text-accent-green" />
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span>info@nikmohaseb.ir</span>
              <Mail className="h-4 w-4 text-accent-green" />
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span>۰۲۱-۸۲۸۸۰۱۱۱۳</span>
              <Phone className="h-4 w-4 text-accent-green" />
            </div>
          </div>

          <div>
            {user ? (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-primary-navy">
                  ثبت درخواست مشاوره / تیکت
                </h2>
                <p className="mb-4 text-sm text-text-muted">
                  برای ثبت درخواست مشاوره، فرم زیر را تکمیل کنید.
                </p>
                <TicketForm redirectTo="/dashboard/tickets" />
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="mb-4 text-sm text-text-muted">
                  برای ثبت درخواست مشاوره، ابتدا وارد حساب کاربری خود شوید.
                </p>
                <Button asChild variant="primary">
                  <Link href="/login?callbackUrl=/contact">ورود / ثبت‌نام</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
