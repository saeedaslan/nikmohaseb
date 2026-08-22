import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import DashboardContent from "@/components/layout/dashboard-content";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const dynamic = "force-dynamic";

export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Header />
      <DashboardContent>{children}</DashboardContent>
    </ErrorBoundary>
  );
}
