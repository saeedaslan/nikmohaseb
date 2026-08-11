import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "جزئیات خدمت | نیک محاسب سرو",
  description: "جزئیات خدمات حسابداری و مالیاتی",
};

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  if (!services.length) return [{ slug: "__placeholder__" }];
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(decodeURIComponent(slug));

  if (!service) notFound();

  return (
    <article className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-navy">{service.title}</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/services">بازگشت</Link>
          </Button>
        </div>

        {service.image && (
          <img
            src={service.image}
            alt={service.title}
            className="mb-6 h-56 w-full rounded-lg object-cover"
          />
        )}

        {service.summary && (
          <p className="mb-4 text-lg text-accent-green">{service.summary}</p>
        )}

        {service.content ? (
          <div
            className="prose max-w-none"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        ) : (
          <p className="text-text-muted">توضیح تکمیلی در دسترس نیست.</p>
        )}
      </div>
    </article>
  );
}
