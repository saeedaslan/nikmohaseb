import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/queries";
import { CircularForm } from "@/components/admin/circular-form";

export const metadata = {
  title: "ویرایش بخشنامه | ادمین | نیک محاسب سرو",
};

export default async function EditCircularPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const circular = await prisma.circular.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  });
  if (!circular) notFound();

  const categories = await getAllCategories();
  const catOpts = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش بخشنامه «{circular.title}»
      </h1>
      <CircularForm
        circular={circular}
        categories={catOpts}
        existingImages={circular.images.map((img) => ({
          url: img.url,
          filename: img.filename,
          alt: img.alt,
        }))}
      />
    </div>
  );
}
