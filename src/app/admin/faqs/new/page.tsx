import { FaqForm } from "@/components/admin/faq-form";

export const metadata = {
  title: "سؤال جدید | ادمین | نیک محاسب سرو",
};

export default async function NewFaqPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">سؤال جدید</h1>
      <FaqForm />
    </div>
  );
}
