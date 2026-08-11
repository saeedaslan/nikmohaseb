import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ServiceIcon } from "./service-icon";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    summary?: string | null;
    icon?: string | null;
    image?: string | null;
    slug: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group flex flex-col bg-[#1a3a33] text-white dark:bg-[#1a3a33] border-[#2e5a4f]">
      {service.image ? (
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-t-xl bg-[#2e5a4f]">
            <ServiceIcon slug={service.slug} className="h-12 w-12 text-gray-300" />
          </div>
      )}
      <CardHeader>
        <CardTitle className="text-right">{service.title}</CardTitle>
        {service.summary && (
          <CardDescription className="text-white/70 line-clamp-2">
            {service.summary}
          </CardDescription>
        )}
      </CardHeader>
      <div className="mt-auto p-6 pt-0">
          <Link
            href={`/services/${service.slug}`}
            className="flex items-center justify-end gap-1 text-sm font-medium text-gray-300 hover:text-gray-200 hover:underline"
          >
          مطالعه بیشتر
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
