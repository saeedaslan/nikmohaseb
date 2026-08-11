"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  TicketPlus,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "خلاصه وضعیت", href: "/dashboard", icon: LayoutDashboard },
  { label: "تیکت‌های من", href: "/dashboard/tickets", icon: Ticket },
  { label: "ثبت تیکت جدید", href: "/dashboard/tickets/new", icon: TicketPlus },
  { label: "پروفایل", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 z-50 -translate-x-full md:translate-x-0 md:static md:flex",
          "transition-transform duration-200",
          sidebarOpen && "translate-x-0",
        )}
      >
        <div className="flex h-screen w-64 flex-col gap-2 overflow-y-auto border-l border-border/60 bg-surface-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-primary-navy">
              نیک محاسب سرو
            </span>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="بستن منو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent-green/15 text-accent-green"
                    : "text-text hover:bg-surface-background",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 flex h-14 items-center justify-between border-b border-border/60 bg-surface-card/80 px-4 backdrop-blur md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1 text-text hover:bg-surface-background"
            aria-label="منو"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-bold text-primary-navy">
            نیک محاسب سرو
          </span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
