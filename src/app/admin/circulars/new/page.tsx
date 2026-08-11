import { getAllCategories } from "@/lib/queries";
import { CircularForm } from "@/components/admin/circular-form";

export const metadata = {
  title: "بخشنامه جدید | ادمین | نیک محاسب سرو",
};

export default async function NewCircularPage() {
  const categories = await getAllCategories();
  const catOpts = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">بخشنامه جدید</h1>
      <CircularForm categories={catOpts} />
    </div>
  );
}
