import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, PhoneCall, Send } from "lucide-react";
import type { ComponentType } from "react";
import { companyName, companyDescription, navLinks } from "@/lib/nav";

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
  { icon: PhoneCall, label: "تماس تلفیاتی", href: "tel:+9821828701113" },
  { icon: Mail, label: "ایمیل", href: "mailto:info@nikmohaseb.ir" },
  { icon: Send, label: "تلگرام", href: "https://t.me/nikmohaseb" },
  { icon: InstagramIcon, label: "اینستاگرام", href: "https://instagram.com/nikmohasebsarv" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt={companyName}
                width={120}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-primary-navy">
                {companyName}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              {companyDescription}
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {social.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent-green hover:bg-accent-green/10 hover:text-accent-green"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">صفحات</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accent-green" />
                <span>سعادت اباد بلوار سعادت اباد بالاتر از میدان کاج برج مادر پلاک ۱۳۳ طبقه ۱۰ واحد ۱۹</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent-green" />
                <a
                  href="mailto:info@nikmohaseb.ir"
                  className="hover:text-accent-green"
                >
                  info@nikmohaseb.ir
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-accent-green" />
                <a href="tel:+9821828701113" className="hover:text-accent-green">
                  ۰۲۱-۸۲۸۷۰۱۱۱۳
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-5 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} {companyName}. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
