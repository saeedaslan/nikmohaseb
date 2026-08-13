import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "جزئیات خدمت | نیک محاسب سرو",
  description: "جزئیات خدمات حسابداری و مالیاتی",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(decodeURIComponent(slug));

  if (!service) notFound();

  return (
    <article className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-1 text-sm text-primary-navy hover:text-accent-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>بازگشت به خدمات</span>
        </Link>

        <h1 className="mb-6 text-right text-3xl font-extrabold text-primary-navy sm:text-4xl">
          {service.title}
        </h1>

        {service.summary && (
          <p className="mb-6 text-lg text-primary-navy">{service.summary}</p>
        )}

        {service.image && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        )}

        {service.content ? (
          <div
            className="article-content"
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
