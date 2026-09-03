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
    knowsAbout: [
      "حسابداری",
      "مالیات",
      "مالیات بر درآمد",
      "مالیات بر ارزش افزوده",
      "حسابرسی",
      "حقوق دستمزد",
      "ثبت شرکت",
      "مشاوره مالی",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات حسابداری و مالیاتی",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "حسابداری شرکتی" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "مشاوره مالیاتی" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "مدیریت ارزش افزوده" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "حسابرسی" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "حقوق دستمزد" } },
      ],
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
      url: domains.primary,
    },
    publisher: {
      "@type": "Organization",
      name: companyName,
      logo: {
        "@type": "ImageObject",
        url: `${domains.primary}/images/logo.png`,
        width: 200,
        height: 200,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${domains.primary}/articles/${slug}`,
    },
    inLanguage: "fa-IR",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "Organization",
      name: companyName,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-content"],
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

export function ItemListSchema({
  items,
  name,
}: {
  items: { name: string; url: string; image?: string }[];
  name: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${domains.primary}${item.url}`,
      ...(item.image && { image: item.image.startsWith("http") ? item.image : `${domains.primary}${item.image}` }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SpeakableSchema({
  cssSelector,
  url,
}: {
  cssSelector: string[];
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
    inLanguage: "fa-IR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyName,
    description: "خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت در تهران",
    url: domains.primary,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${domains.primary}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `درباره ${companyName}`,
    description: "درباره تیم نیک محاسب سرو و خدمات حسابداری و مالیاتی",
    url: `${domains.primary}/about`,
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      url: domains.primary,
      logo: `${domains.primary}/images/logo.png`,
      description: "خدمات تخصصی حسابداری، مالیاتی، مشاوره مالی و ثبت شرکت در تهران",
      address: {
        "@type": "PostalAddress",
        streetAddress: contactInfo.address,
        addressLocality: "تهران",
        addressCountry: "IR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactInfo.phones[0],
        email: contactInfo.email,
        contactType: "customer service",
        availableLanguage: ["Persian"],
      },
    },
    inLanguage: "fa-IR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ContactPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `تماس با ${companyName}`,
    description: "راه‌های ارتباطی با نیک محاسب سرو",
    url: `${domains.primary}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      telephone: contactInfo.phones[0],
      email: contactInfo.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: contactInfo.address,
        addressLocality: "تهران",
        addressCountry: "IR",
      },
    },
    inLanguage: "fa-IR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LegislationSchema({
  title,
  description,
  datePublished,
  issuer,
  number,
  slug,
  path,
}: {
  title: string;
  description: string;
  datePublished: Date;
  issuer?: string;
  number?: string;
  slug: string;
  path?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: title,
    description,
    datePublished: datePublished.toISOString(),
    url: `${domains.primary}${path ?? `/laws/${slug}`}`,
    ...(issuer && { legislationPassedBy: { "@type": "Organization", name: issuer } }),
    ...(number && { legislationIdentifier: number }),
    inLanguage: "fa-IR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LibraryLawSchema({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  categoryTitle,
  articles,
}: {
  title: string;
  description: string;
  datePublished?: Date | null;
  dateModified?: Date | null;
  slug: string;
  categoryTitle: string;
  articles: { id: string; number: number; title: string | null; slug: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: title,
    description,
    url: `${domains.primary}/library/laws/${slug}`,
    legislationPassedBy: { "@type": "Organization", name: "مجلس شورای اسلامی" },
    inLanguage: "fa-IR",
    genre: categoryTitle,
    ...(datePublished && { datePublished: datePublished.toISOString() }),
    ...(dateModified && { dateModified: dateModified.toISOString() }),
    hasPart: articles.slice(0, 20).map((a) => ({
      "@type": "LegislationObject",
      identifier: String(a.number),
      name: a.title || `ماده ${a.number}`,
      url: `${domains.primary}/library/laws/${slug}/articles/${a.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LibraryArticleSchema({
  lawTitle,
  articleNumber,
  articleTitle,
  articleSlug,
  lawSlug,
  description,
  datePublished,
  dateModified,
}: {
  lawTitle: string;
  articleNumber: number;
  articleTitle: string | null;
  articleSlug: string;
  lawSlug: string;
  description: string;
  datePublished?: Date | null;
  dateModified?: Date | null;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${domains.primary}/library/laws/${lawSlug}/articles/${articleSlug}`,
    name: articleTitle
      ? `ماده ${articleNumber} - ${articleTitle}`
      : `ماده ${articleNumber}`,
    description,
    inLanguage: "fa-IR",
    isPartOf: {
      "@type": "Legislation",
      name: lawTitle,
      url: `${domains.primary}/library/laws/${lawSlug}`,
    },
    mainEntity: {
      "@type": "LegislationObject",
      identifier: String(articleNumber),
      name: articleTitle || `ماده ${articleNumber}`,
      url: `${domains.primary}/library/laws/${lawSlug}/articles/${articleSlug}`,
    },
    ...(datePublished && { datePublished: datePublished.toISOString() }),
    ...(dateModified && { dateModified: dateModified.toISOString() }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
