import { getPublishedServices } from "@/lib/queries";
import { ServiceCard } from "@/components/public/service-card";
import { Briefcase } from "lucide-react";

export const metadata = {
  title: "خدمات | نیک محاسب سرو",
  description: "لیست خدمات حسابداری، مالی و مالیاتی نیک محاسب سرو",
};

export default async function ServicesPage() {
  const services = await getPublishedServices(50);

  return (
    <section className="py-12 bg-[#0b2a22] text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-3 flex items-center justify-center gap-2 text-3xl font-bold text-white">
            <Briefcase className="h-7 w-7 text-gray-300" />
            <span>خدمات نیک محاسب سرو</span>
          </h1>
          <p className="mt-3 text-sm text-white/70">
            ارائه خدمات جامع حسابداری، مالی، مالیاتی و مشاوره‌ای با بهره‌وری بالا
          </p>
        </div>

        {services.length === 0 ? (
          <p className="py-12 text-center text-white/70">
            در حال حاضر سرویسی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
