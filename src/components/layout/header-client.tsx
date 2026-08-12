"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { navLinks, companyName } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/toggle";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export function HeaderClient({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface-card/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-primary-navy">
          <Image
            src="/images/logo.png"
            alt={companyName}
            width={200}
            height={50}
            priority
            className="h-12 w-auto"
          />
          <span className="hidden sm:inline">{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                 "text-sm font-medium transition-colors hover:text-accent-yellow",
                pathname === link.href
                  ? "text-accent-yellow"
                  : "text-text",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Button asChild variant="accent" size="sm">
              <Link href="/login" className="text-sm">ورود / ثبت‌نام</Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="منو"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden animate-fade-in-up">
          <nav className="flex flex-col gap-1 border-t border-border/60 bg-surface-card px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                "py-2 text-sm font-medium transition-colors hover:text-accent-yellow",
                pathname === link.href ? "text-accent-yellow" : "text-text",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        <div className="border-t border-border/60 px-4 py-3 space-y-3">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
            >
              خروج ({user?.name?.split(" ")[0]})
            </Button>
          ) : (
            <Button asChild variant="accent" size="sm" className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>ورود / ثبت‌نام</Link>
            </Button>
          )}
        </div>
        </div>
      )}
    </header>
  );
}

function UserMenu({
  user,
  onSignOut,
}: {
  user: SessionUser;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const href = user.role === "ADMIN" ? "/admin" : "/dashboard";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
         className="flex items-center gap-2 text-sm font-medium text-text hover:text-accent-yellow"
      >
        {user.image ? (
          <img src={user.image} alt={user.name ?? ""} className="h-8 w-8 rounded-full" />
        ) : (
          <User className="h-5 w-5" />
        )}
        <span>{user.name?.split(" ")[0] ?? "حساب من"}</span>
      </button>
      {open && (
        <div
          className="absolute top-10 mt-1 w-48 space-y-1 rounded-md border border-border bg-surface-card p-2 shadow-lg"
          onClick={() => setOpen(false)}
        >
          <Link
            href={href}
            className="block rounded px-3 py-2 text-sm text-text hover:bg-surface-background"
          >
            پنل من
          </Link>
          <button
            onClick={onSignOut}
            className="w-full rounded px-3 py-2 text-start text-sm text-text hover:bg-surface-background"
          >
            خروج
          </button>
        </div>
      )}
    </div>
  );
}
