import Script from "next/script";

interface OrganizationProps {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = "HARDCOREJOBS",
  url = "https://hardcorejobs.com",
  logo = "https://hardcorejobs.com/logo-icon.svg",
  sameAs = [
    "https://twitter.com/hardcorejobs",
    "https://linkedin.com/company/hardcorejobs",
  ],
}: OrganizationProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@hardcorejobs.com",
      contactType: "customer service",
    },
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteProps {
  name?: string;
  url?: string;
}

export function WebSiteJsonLd({
  name = "HARDCOREJOBS",
  url = "https://hardcorejobs.com",
}: WebSiteProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/jobs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface JobPostingProps {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  datePosted: string;
  employmentType?: string;
  remote?: boolean;
}

export function JobPostingJsonLd({
  id,
  title,
  description,
  company,
  location,
  salaryMin,
  salaryMax,
  datePosted,
  employmentType = "FULL_TIME",
  remote = false,
}: JobPostingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    identifier: {
      "@type": "PropertyValue",
      name: "HARDCOREJOBS",
      value: id,
    },
    datePosted,
    validThrough: new Date(
      new Date(datePosted).getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    },
    jobLocationType: remote ? "TELECOMMUTE" : undefined,
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: salaryMin,
        maxValue: salaryMax,
        unitText: "YEAR",
      },
    },
  };

  return (
    <Script
      id={`job-posting-jsonld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
