import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/layout/header";
import DashboardContent from "@/components/layout/dashboard-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-surface-background p-4">
          <div className="text-center">
            <p className="mb-4 text-text-muted">
              برای دسترسی به این بخش وارد شوید.
            </p>
            <Button asChild variant="primary">
              <Link href="/login?callbackUrl=/dashboard">ورود / ثبت‌نام</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <DashboardContent>{children}</DashboardContent>
    </>
  );
}
