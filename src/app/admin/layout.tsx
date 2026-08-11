import { getCurrentUser } from "@/lib/auth";
import AdminLayout from "@/components/layout/admin-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Unauthorized } from "@/components/ui/unauthorized";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Button asChild variant="primary">
          <Link href="/login?callbackUrl=/admin">ورود به پنل ادمین</Link>
        </Button>
      </div>
    );
  }
  if (user.role !== "ADMIN") {
    return <Unauthorized />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
