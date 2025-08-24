import React from 'react';
import Head from 'next/head';

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    currency?: string;
    image: string;
    url: string;
    sku?: string;
    brand?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    reviewCount?: number;
    reviewRating?: number;
  };
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

interface OrganizationStructuredDataProps {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  // Define the type for structured data with optional aggregateRating
  type ProductStructuredData = {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    image: string;
    sku: string;
    mpn: string;
    brand: {
      '@type': string;
      name: string;
    };
    offers: {
      '@type': string;
      url: string;
      priceCurrency: string;
      price: number;
      priceValidUntil: string;
      availability: string;
    };
    aggregateRating?: {
      '@type': string;
      ratingValue: number;
      reviewCount: number;
    };
  };

  const structuredData: ProductStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || `SKU-${product.id}`,
    mpn: `MPN-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Marketplace',
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    },
  };

  // Add review data if available
  if (product.reviewCount && product.reviewRating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.reviewRating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export const OrganizationStructuredData: React.FC<OrganizationStructuredDataProps> = ({ 
  name, 
  url, 
  logo, 
  sameAs = [] 
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export const LocalBusinessStructuredData: React.FC<{
  name: string;
  url: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  priceRange: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
}> = ({ name, url, logo, address, telephone, priceRange, geo }) => {
  // Define the type for local business structured data with optional geo
  type LocalBusinessData = {
    '@context': string;
    '@type': string;
    name: string;
    url: string;
    logo: string;
    telephone: string;
    priceRange: string;
    address: {
      '@type': string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geo?: {
      '@type': string;
      latitude: number;
      longitude: number;
    };
  };

  const structuredData: LocalBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url,
    logo,
    telephone,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
  };

  if (geo) {
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};
