import { getCurrentUser } from "@/lib/auth";
import { TicketForm } from "@/components/tickets/ticket-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Clock, MessageSquare, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { contactInfo, domains } from "@/lib/nav";
import { ContactPageSchema } from "@/components/structured-data";

export const revalidate = 3600;

export const metadata = {
  title: "تماس با ما | نیک محاسب سرو",
  description: "تماس با نیک محاسب سرو - آدرس، تلفن و فرم درخواست مشاوره",
  alternates: {
    canonical: `${domains.primary}/contact`,
  },
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <ContactPageSchema />
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
            <MessageSquare className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm text-white/90">در ارتباط باشید</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white lg:text-5xl">
            تماس با ما
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            سوالی دارید یا نیاز به مشاوره دارید؟ تیم ما آمکان پاسخگویی است
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="relative -mt-12 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Address Card */}
            <div className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                <MapPin className="h-7 w-7 text-accent-green" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-primary-navy">آدرس</h2>
              <p className="text-sm text-text-muted leading-relaxed">{contactInfo.address}</p>
            </div>

            {/* Email Card */}
            <div className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                <Mail className="h-7 w-7 text-accent-green" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-primary-navy">ایمیل</h2>
              <a href={`mailto:${contactInfo.email}`} className="text-sm text-text-muted hover:text-accent-green transition-colors leading-relaxed">
                {contactInfo.email}
              </a>
            </div>

            {/* Phone Card */}
            <div className="group rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-accent-green/50 hover:shadow-xl hover:shadow-accent-green/10 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-7 w-7 text-accent-green" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-primary-navy">تلفن</h2>
              <div className="space-y-1">
                {contactInfo.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/-/g, "")}`} className="block text-sm text-text-muted hover:text-accent-green transition-colors">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Working Hours & Info */}
            <div className="space-y-6">
              {/* Working Hours Card */}
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/20">
                    <Clock className="h-6 w-6 text-accent-yellow" />
                  </div>
                  <h2 className="text-xl font-bold text-primary-navy">ساعات کاری</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-surface-background p-3">
                    <span className="text-sm text-text">شنبه تا چهارشنبه</span>
                    <span className="text-sm font-medium text-accent-green">{contactInfo.workingHours.weekdays}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface-background p-3">
                    <span className="text-sm text-text">پنجشنبه</span>
                    <span className="text-sm font-medium text-accent-yellow">{contactInfo.workingHours.thursday}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-accent-green/5 to-accent-green/10 p-6 shadow-lg backdrop-blur-lg">
                <h3 className="mb-4 text-lg font-bold text-primary-navy">چرا ما را انتخاب کنید؟</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                    <span className="text-sm text-text">مشاوره تخصصی و رایگان</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                    <span className="text-sm text-text">پاسخگویی سریع در کمتر از ۲۴ ساعت</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                    <span className="text-sm text-text">تیم متخصص با سال‌ها تجربه</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                    <span className="text-sm text-text">ضمانت کیفیت خدمات</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/20">
                      <Send className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary-navy">ثبت درخواست مشاوره</h2>
                      <p className="text-sm text-text-muted">فرم زیر را تکمیل کنید</p>
                    </div>
                  </div>
                  <TicketForm redirectTo="/dashboard/tickets" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/20">
                      <MessageSquare className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary-navy">ثبت درخواست مشاوره</h2>
                      <p className="text-sm text-text-muted">برای ثبت درخواست وارد شوید</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button asChild className="btn-shine w-full h-12 bg-accent-green text-white text-base font-medium rounded-xl hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/30 transition-all duration-300">
                      <Link href="/login?callbackUrl=/contact" className="flex items-center justify-center gap-2">
                        <span>ورود به حساب کاربری</span>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-12 text-base font-medium rounded-xl border-border hover:border-accent-green hover:text-accent-green transition-all duration-300">
                      <Link href="/register?callbackUrl=/contact" className="flex items-center justify-center gap-2">
                        <span>ثبت‌نام کاربر جدید</span>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
