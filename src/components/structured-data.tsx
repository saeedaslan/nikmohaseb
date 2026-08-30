import { contactInfo, companyName, domains } from "@/lib/nav";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: companyName,
    description: "خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت در تهران",
    url: domains.primary,
    logo: `${domains.primary}/images/logo.png`,
    image: `${domains.primary}/og.png`,
    telephone: contactInfo.phones[0],
    email: contactInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.address,
      addressLocality: "تهران",
      addressRegion: "تهران",
      postalCode: "",
      addressCountry: "IR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "35.7839",
      longitude: "51.4608",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Thursday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [contactInfo.social.instagram, contactInfo.social.telegram, domains.secondary],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "تهران",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${domains.primary}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  slug,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  author?: string;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${domains.primary}/og.png`,
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
    author: {
      "@type": "Person",
      name: author || companyName,
    },
    publisher: {
      "@type": "Organization",
      name: companyName,
      logo: {
        "@type": "ImageObject",
        url: `${domains.primary}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${domains.primary}/articles/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  image,
  slug,
}: {
  name: string;
  description: string;
  image?: string;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    image: image || `${domains.primary}/og.png`,
    url: `${domains.primary}/services/${slug}`,
    provider: {
      "@type": "AccountingService",
      name: companyName,
      url: domains.primary,
    },
    areaServed: {
      "@type": "City",
      name: "تهران",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function GovernmentServiceSchema({
  title,
  datePublished,
  issuer,
  number,
  slug,
}: {
  title: string;
  datePublished: Date;
  issuer?: string;
  number?: string;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: title,
    datePublished: datePublished.toISOString(),
    areaServed: { "@type": "Country", name: "Iran" },
    url: `${domains.primary}/circulars/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
