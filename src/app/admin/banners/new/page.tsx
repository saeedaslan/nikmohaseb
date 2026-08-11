import { BannerForm } from "@/components/admin/banner-form";

export const metadata = {
  title: "بنر جدید | ادمین | نیک محاسب سرو",
};

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">بنر جدید</h1>
      <BannerForm />
    </div>
  );
}
