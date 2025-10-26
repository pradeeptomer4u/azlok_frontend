'use client';

import React from 'react';
import Script from 'next/script';

interface WebsiteSchemaProps {
  siteUrl?: string;
  siteName?: string;
  description?: string;
  searchUrl?: string;
  potentialActions?: Array<{
    target: string;
    queryInput: string;
    name?: string;
  }>;
}

/**
 * WebsiteSchema component that adds JSON-LD structured data for the website
 * This helps search engines understand the website structure and features
 */
export default function WebsiteSchema({
  siteUrl = 'https://www.azlok.com',
  siteName = 'Azlok',
  description = "India's leading B2C marketplace connecting verified suppliers with businesses. Quality products, competitive pricing, fast delivery.",
  searchUrl = 'https://www.azlok.com/search?q={search_term_string}',
  potentialActions = []
}: WebsiteSchemaProps) {
  
  // Default search action if none provided
  const defaultSearchAction = {
    target: searchUrl,
    queryInput: 'required name=search_term_string',
    name: 'Search Azlok'
  };
  
  // Combine provided actions with default search action
  const actions = potentialActions.length > 0 
    ? potentialActions 
    : [defaultSearchAction];
  
  // Build the schema object
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: description,
    inLanguage: 'en-IN',
    potentialAction: actions.map(action => ({
      '@type': 'SearchAction',
      target: action.target,
      'query-input': action.queryInput,
      ...(action.name && { name: action.name })
    }))
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
