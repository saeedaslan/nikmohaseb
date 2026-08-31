"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  TicketPlus,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/toggle";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const nav = [
  { label: "خلاصه وضعیت", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500", badge: false },
  { label: "تیکت‌های من", href: "/dashboard/tickets", icon: Ticket, color: "text-orange-500", badge: true },
  { label: "ثبت تیکت جدید", href: "/dashboard/tickets/new", icon: TicketPlus, color: "text-green-500", badge: false },
  { label: "پروفایل", href: "/dashboard/profile", icon: User, color: "text-purple-500", badge: false },
];

export default function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Fetch unread ticket count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/dashboard/tickets/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count ?? 0);
        }
      } catch {
        // Silently fail
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-surface-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 transition-transform duration-300 md:translate-x-0 md:static md:flex",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-[calc(100vh-56px)] w-64 flex-col border-l border-border/60 bg-surface-card/95 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <span className="text-lg font-bold bg-gradient-to-l from-accent-green to-primary-navy bg-clip-text text-transparent">
              نیک محاسب سرو
            </span>
            <button
              className="md:hidden rounded-lg p-1 hover:bg-surface-background transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="بستن منو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {nav.map((link) => {
              const isActive = pathname === link.href;
              const showBadge = link.badge && unreadCount > 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent-green/15 text-accent-green shadow-sm shadow-accent-green/20"
                      : "text-text-muted hover:bg-surface-background hover:text-text",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={cn("h-5 w-5", isActive ? "text-accent-green" : link.color)} />
                    {link.label}
                  </div>
                  {showBadge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/20 text-accent-green font-bold">
                {session?.user?.name?.charAt(0) ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{session?.user?.name}</p>
                <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              خروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 flex h-14 items-center justify-between border-b border-border/60 bg-surface-card/80 backdrop-blur px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-surface-background transition-colors"
            aria-label="منو"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-bold text-primary-navy">نیک محاسب سرو</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
