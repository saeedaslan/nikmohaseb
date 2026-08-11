import type { ReactNode } from "react";
import Link from "next/link";
import { companyName } from "@/lib/nav";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-primary-navy"
          >
            <span className="text-accent-green">◉</span>
            {companyName}
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
