import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ServiceSchema } from "@/components/structured-data";
import { domains } from "@/lib/nav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug: decodeURIComponent(slug), published: true },
    select: { title: true, summary: true, slug: true },
  });

  if (!service) return {};

  return {
    title: service.title,
    description: service.summary || `خدمات ${service.title} - نیک محاسب سرو`,
    alternates: {
      canonical: `${domains.primary}/services/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.summary || undefined,
      type: "website",
      url: `${domains.primary}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(decodeURIComponent(slug));

  if (!service || !service.published) notFound();

  return (
    <article className="py-12">
      <ServiceSchema
        name={service.title}
        description={service.summary || `خدمات ${service.title}`}
        image={service.image || undefined}
        slug={service.slug}
      />
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
