import AdminLayout from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
