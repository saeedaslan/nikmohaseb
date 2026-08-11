import { prisma as db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import { getAllCategories } from "@/lib/queries";

export const metadata = {
  title: "ویرایش خدمت | ادمین | نیک محاسب سرو",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();

  const categories = await getAllCategories();
  const options = categories
    .filter((c) => c.type === "SERVICE")
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش خدمت «{service.title}»
      </h1>
      <ServiceForm service={service} categories={options} />
    </div>
  );
}