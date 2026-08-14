import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/queries";
import { LawForm } from "@/components/admin/law-form";

export const metadata = {
  title: "ویرایش قانون | ادمین | نیک محاسب سرو",
};

export default async function EditLawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const law = await prisma.law.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!law) notFound();

  const categories = await getAllCategories();
  const catOpts = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش قانون «{law.title}»
      </h1>
      <LawForm law={law} categories={catOpts} />
    </div>
  );
}
