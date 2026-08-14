import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FaqForm } from "@/components/admin/faq-form";

export const metadata = {
  title: "ویرایش سؤال | ادمین | نیک محاسب سرو",
};

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({
    where: { id },
  });
  if (!faq) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش سؤال «{faq.question}»
      </h1>
      <FaqForm faq={faq} />
    </div>
  );
}
