import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-text-muted">
            برای دسترسی به این بخش وارد شوید.
          </p>
          <Button asChild variant="primary">
            <Link href="/login?callbackUrl=/dashboard">ورود / ثبت‌نام</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
