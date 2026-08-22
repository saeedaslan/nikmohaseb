import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, PhoneCall, Send, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import type { ComponentType } from "react";
import { companyName, companyDescription, navLinks, contactInfo } from "@/lib/nav";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
      <circle cx="12" cy="11.5" r="3.5" />
      <circle cx="17" cy="7" r="1" />
    </svg>
  );
}

const social: { icon: ComponentType<{ className?: string }>; label: string; href: string }[] = [
  { icon: PhoneCall, label: "تماس تلفیاتی", href: `tel:${contactInfo.phones[0].replace(/-/g, "")}` },
  { icon: Mail, label: "ایمیل", href: `mailto:${contactInfo.email}` },
  { icon: Send, label: "تلگرام", href: contactInfo.social.telegram },
  { icon: InstagramIcon, label: "اینستاگرام", href: contactInfo.social.instagram },
];

const services = [
  { label: "مشاوره مالیاتی", href: "/services" },
  { label: "حسابداری و حسابرسی", href: "/services" },
  { label: "مشاوره مالی", href: "/services" },
  { label: "ثبت شرکت", href: "/services" },
  { label: "ارزش افزوده", href: "/services" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-card to-surface-background" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-accent-green via-accent-yellow to-accent-green" />

      <div className="relative">
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt={companyName}
                  width={140}
                  height={36}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
                {companyDescription}
              </p>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  شبکه‌های اجتماعی
                </h4>
                <div className="flex items-center gap-2">
                  {social.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-surface-card text-text-muted transition-all duration-200 hover:border-accent-green hover:bg-accent-green hover:text-white hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5"
                    >
                      <s.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border/60 bg-surface-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-green/10">
                    <Clock className="h-5 w-5 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">ساعات کاری</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {contactInfo.workingHours.weekdays}
                      <br />
                      {contactInfo.workingHours.thursday}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-sm font-bold text-text">دسترسی سریع</h3>
              <ul className="space-y-3">
                {navLinks.slice(0, 6).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent-green"
                    >
                      <ArrowLeft className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-5 text-sm font-bold text-text">خدمات ما</h3>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className="group inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent-green"
                    >
                      <ArrowLeft className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="mb-5 text-sm font-bold text-text">تماس با ما</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-green/10">
                    <MapPin className="h-4 w-4 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text">آدرس</p>
                    <p className="mt-1 text-sm text-text-muted leading-5">
                      {contactInfo.address}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-green/10">
                    <PhoneCall className="h-4 w-4 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text">تلفن</p>
                    {contactInfo.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/-/g, "")}`} className="mt-1 block text-sm text-text-muted hover:text-accent-green">
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-green/10">
                    <Mail className="h-4 w-4 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text">ایمیل</p>
                    <a href={`mailto:${contactInfo.email}`} className="mt-1 block text-sm text-text-muted hover:text-accent-green">
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/25"
                >
                  درخواست مشاوره رایگان
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-border/60">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-text-muted">
                © {new Date().getFullYear()} {companyName}. تمامی حقوق محفوظ است.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/about" className="text-xs text-text-muted hover:text-accent-green">
                  درباره ما
                </Link>
                <span className="text-border">|</span>
                <Link href="/contact" className="text-xs text-text-muted hover:text-accent-green">
                  تماس با ما
                </Link>
                <span className="text-border">|</span>
                <Link href="/faqs" className="text-xs text-text-muted hover:text-accent-green">
                  سؤالات متداول
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
