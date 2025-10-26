'use client';

import React from 'react';
import Head from 'next/head';

interface CanonicalUrlProps {
  url: string;
  baseUrl?: string;
}

/**
 * CanonicalUrl component that adds a canonical URL to the page
 * This helps search engines understand the preferred URL for a page
 * and avoid duplicate content issues
 */
export default function CanonicalUrl({
  url,
  baseUrl = 'https://www.azlok.com'
}: CanonicalUrlProps) {
  // Ensure URL starts with a slash if it's a relative path
  const path = url.startsWith('/') ? url : `/${url}`;
  
  // Create the full canonical URL
  const canonicalUrl = url.startsWith('http') ? url : `${baseUrl}${path}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
