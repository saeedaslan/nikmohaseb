import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/queries";

const defaultBanner = {
  title: "همراه مطمئن شما در امور مالی و مالیاتی",
  description:
    "خدمات تخصصی حسابداری، مالی، مالیاتی و مشاوره کسب‌وکار با نیک محاسب سرو",
  buttonText: "درخواست مشاوره",
  buttonLink: "/contact",
};

export async function Hero({ banner }: { banner: Banner | null }) {
  const data = banner ?? (defaultBanner as Banner);
  const imageSrc = data.image || "/images/hero.png";

  return (
    <section className="relative flex min-h-[60vh] min-h-[560px] items-center justify-center">
      {/* Cover image */}
      <Image
        src={imageSrc}
        alt={data.title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />

      {/* سورمه‌ی green melt overlay for legibility (پشت رنگی با نوشته سفید) */}
      <div className="absolute inset-0 bg-[#0b5f4f]/60" />

      {/* All text: white, neat, centered */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <p className="mb-3 text-sm font-medium tracking-wide text-white/85 sm:text-base">
          حسابداری، مالی، مالیاتی و مشاوره تخصصی کسب‌وکار
        </p>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          {data.title}
        </h1>
        {data.description && (
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/90 sm:text-lg">
            {data.description}
          </p>
        )}
        {data.buttonText && data.buttonLink && (
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0b5f4f] hover:bg-white/90"
            >
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
