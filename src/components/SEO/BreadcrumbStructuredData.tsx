'use client';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  // Pre-compute the JSON string to avoid hydration errors
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://azlok.com${item.url}`
    }))
  };
  
  // Convert to string outside of render to ensure consistency
  const jsonLdString = JSON.stringify(structuredData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
