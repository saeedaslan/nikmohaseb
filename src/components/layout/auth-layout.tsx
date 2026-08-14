import type { ReactNode } from "react";
import Link from "next/link";
import { companyName } from "@/lib/nav";
import Header from "@/components/layout/header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-surface-background p-4">
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
    </>
  );
}
