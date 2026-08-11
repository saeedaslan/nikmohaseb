import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BannerForm } from "@/components/admin/banner-form";

export const metadata = {
  title: "ویرایش بنر | ادمین | نیک محاسب سرو",
};

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-primary-navy">
        ویرایش بنر «{banner.title}»
      </h1>
      <BannerForm
        initialData={{
          id: banner.id,
          title: banner.title,
          description: banner.description ?? "",
          buttonText: banner.buttonText ?? "",
          buttonLink: banner.buttonLink ?? "",
          image: banner.image ?? "",
          active: banner.active,
          order: banner.order,
        }}
      />
    </div>
  );
}
