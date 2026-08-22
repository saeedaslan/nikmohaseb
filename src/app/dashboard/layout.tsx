import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import DashboardContent from "@/components/layout/dashboard-content";

export const dynamic = "force-dynamic";

export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <DashboardContent>{children}</DashboardContent>
    </>
  );
}
