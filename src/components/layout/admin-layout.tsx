"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Ticket,
  Image as ImageIcon,
  FileText,
  ReceiptText,
  HelpCircle,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Library,
} from "lucide-react";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const nav = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard, color: "text-blue-500", badge: false },
  { label: "کاربران", href: "/admin/users", icon: Users, color: "text-purple-500", badge: false },
  { label: "تیکت‌ها", href: "/admin/tickets", icon: Ticket, color: "text-orange-500", badge: true },
  { label: "بنرها", href: "/admin/banners", icon: ImageIcon, color: "text-pink-500", badge: false },
  { label: "مقالات", href: "/admin/articles", icon: FileText, color: "text-green-500", badge: false },
  { label: "بخشنامه‌ها", href: "/admin/circulars", icon: ReceiptText, color: "text-yellow-500", badge: false },
  { label: "کتابخانه قوانین", href: "/admin/library", icon: Library, color: "text-emerald-500", badge: false },
  { label: "سؤالات متداول", href: "/admin/faqs", icon: HelpCircle, color: "text-cyan-500", badge: false },
  { label: "خدمات", href: "/admin/services", icon: Settings, color: "text-gray-500", badge: false },
];

const supportNav = [
  { label: "تیکت‌ها", href: "/admin/tickets", icon: Ticket, color: "text-orange-500", badge: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTicketCount, setNewTicketCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isSupport = role === "SUPPORT";
  const navItems = isSupport ? supportNav : nav;

  // Fetch new ticket count
  useEffect(() => {
    const fetchNewTickets = async () => {
      try {
        const res = await fetch("/api/admin/tickets/count");
        if (res.ok) {
          const data = await res.json();
          setNewTicketCount(data.count ?? 0);
        }
      } catch {
        // Silently fail
      }
    };

    fetchNewTickets();
    const interval = setInterval(fetchNewTickets, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-green border-t-transparent" />
          <p className="text-text-muted">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 transition-transform duration-300 md:translate-x-0 md:static md:flex",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-screen w-64 flex-col border-l border-border/60 bg-surface-card/95 backdrop-blur-xl">
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
            {navItems.map((link) => {
              const isActive = pathname === link.href;
              const showBadge = link.badge && newTicketCount > 0;
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
                      {newTicketCount > 99 ? "99+" : newTicketCount}
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
              onClick={() => signOut({ callbackUrl: "/login" })}
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
        {/* Header */}
        <header className="sticky top-0 flex h-16 items-center justify-between border-b border-border/60 bg-surface-card/80 backdrop-blur-xl px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden rounded-lg p-2 hover:bg-surface-background transition-colors"
              aria-label="منو"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-primary-navy">پنل مدیریت</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Link href="/admin/tickets" className="relative rounded-lg p-2 hover:bg-surface-background transition-colors">
              <Bell className="h-5 w-5 text-text-muted" />
              {newTicketCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white animate-pulse">
                  {newTicketCount > 99 ? "99+" : newTicketCount}
                </span>
              )}
            </Link>
            <span className="text-sm text-text-muted hidden sm:inline">{session?.user?.name}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green/20 text-accent-green font-bold text-sm">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
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
