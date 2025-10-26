'use client';

import React from 'react';
import Script from 'next/script';

interface SocialProfile {
  platform: string;
  url: string;
}

interface OrganizationSchemaProps {
  name: string;
  alternateName?: string;
  url?: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  founders?: Array<{name: string, url?: string}>;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: Array<{
    telephone: string;
    contactType: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string | string[];
  }>;
  sameAs?: string[];
  priceRange?: string;
}

/**
 * OrganizationSchema component that adds JSON-LD structured data for the organization
 * This helps search engines understand the organization's details and improves rich results
 */
export default function OrganizationSchema({
  name,
  alternateName,
  url = 'https://www.azlok.com',
  logo = 'https://www.azlok.com/logo.png',
  description = "India's leading B2C marketplace connecting verified suppliers with businesses. Quality products, competitive pricing, fast delivery.",
  foundingDate = '2024',
  founders,
  address,
  contactPoint,
  sameAs = [
    'https://www.facebook.com/azlok',
    'https://www.instagram.com/azlok_official',
    'https://www.linkedin.com/company/azlok',
    'https://twitter.com/azlok_official'
  ],
  priceRange = '₹₹'
}: OrganizationSchemaProps) {
  
  // Build the schema object
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name,
    ...(alternateName && { alternateName }),
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 512,
      height: 512
    },
    description,
    ...(foundingDate && { foundingDate }),
    ...(founders && { 
      founder: founders.map(founder => ({
        '@type': 'Person',
        name: founder.name,
        ...(founder.url && { url: founder.url })
      }))
    }),
    ...(address && { 
      address: {
        '@type': 'PostalAddress',
        ...address
      }
    }),
    ...(contactPoint && { 
      contactPoint: contactPoint.map(point => ({
        '@type': 'ContactPoint',
        ...point,
        ...(point.availableLanguage && { 
          availableLanguage: Array.isArray(point.availableLanguage) 
            ? point.availableLanguage 
            : [point.availableLanguage]
        })
      }))
    }),
    ...(sameAs && { sameAs }),
    ...(priceRange && { priceRange })
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
