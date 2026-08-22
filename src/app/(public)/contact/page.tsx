import { getCurrentUser } from "@/lib/auth";
import { TicketForm } from "@/components/tickets/ticket-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";
import { contactInfo } from "@/lib/nav";

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
              <span>{contactInfo.address}</span>
              <MapPin className="h-4 w-4 text-accent-green" />
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <a href={`mailto:${contactInfo.email}`} className="hover:text-accent-green">
                {contactInfo.email}
              </a>
              <Mail className="h-4 w-4 text-accent-green" />
            </div>
            {contactInfo.phones.map((phone) => (
              <div key={phone} className="flex items-center justify-end gap-2 text-sm">
                <a href={`tel:${phone.replace(/-/g, "")}`} className="hover:text-accent-green">
                  {phone}
                </a>
                <Phone className="h-4 w-4 text-accent-green" />
              </div>
            ))}
            <div className="mt-6 rounded-lg border border-border/60 bg-surface-card p-4">
              <h3 className="mb-2 text-sm font-medium text-text">ساعات کاری</h3>
              <p className="text-xs text-text-muted">{contactInfo.workingHours.weekdays}</p>
              <p className="text-xs text-text-muted">{contactInfo.workingHours.thursday}</p>
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
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-primary-navy">
                  ثبت درخواست مشاوره
                </h2>
                <p className="mb-4 text-sm text-text-muted">
                  برای ثبت درخواست مشاوره، ابتدا وارد حساب کاربری خود شوید.
                </p>
                <div className="space-y-3">
                  <Button asChild variant="primary" className="w-full">
                    <Link href="/login?callbackUrl=/contact">ورود به حساب کاربری</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register?callbackUrl=/contact">ثبت‌نام کاربر جدید</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
