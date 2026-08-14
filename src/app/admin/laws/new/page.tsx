import { getAllCategories } from "@/lib/queries";
import { LawForm } from "@/components/admin/law-form";

export const metadata = {
  title: "قانون جدید | ادمین | نیک محاسب سرو",
};

export default async function NewLawPage() {
  const categories = await getAllCategories();
  const catOpts = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">قانون جدید</h1>
      <LawForm categories={catOpts} />
    </div>
  );
}
