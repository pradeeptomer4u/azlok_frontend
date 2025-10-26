'use client';

import React from 'react';
import Script from 'next/script';

interface BreadcrumbItem {
  name: string;
  item: string;
  position: number;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

/**
 * BreadcrumbSchema component that adds JSON-LD structured data for breadcrumbs
 * This helps search engines understand the page hierarchy and improves rich results
 */
export default function BreadcrumbSchema({
  items,
  baseUrl = 'https://www.azlok.com'
}: BreadcrumbSchemaProps) {
  
  // Ensure all items have absolute URLs
  const processedItems = items.map(item => ({
    ...item,
    item: item.item.startsWith('http') ? item.item : `${baseUrl}${item.item}`
  }));
  
  // Build the schema object
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': processedItems.map(item => ({
      '@type': 'ListItem',
      'position': item.position,
      'name': item.name,
      'item': item.item
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
