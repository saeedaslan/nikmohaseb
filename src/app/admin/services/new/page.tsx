import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import { getAllCategories } from "@/lib/queries";

export const metadata = {
  title: "خدمت جدید | ادمین | نیک محاسب سرو",
};

export default async function NewServicePage() {
  const categories = await getAllCategories();
  const options = categories
    .filter((c) => c.type === "SERVICE")
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">خدمت جدید</h1>
      <ServiceForm categories={options} />
    </div>
  );
}