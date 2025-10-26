'use client';

import React from 'react';
import Script from 'next/script';

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  organizationName?: string;
  organizationLogo?: string;
  imageUrl?: string;
  url?: string;
  keywords?: string[];
  category?: string;
}

/**
 * BlogPostingSchema component that adds JSON-LD structured data for blog posts and product descriptions
 * This helps search engines better understand and display content in search results
 */
export default function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName = 'Azlok Team',
  authorUrl = 'https://www.azlok.com/about',
  organizationName = 'Azlok',
  organizationLogo = 'https://www.azlok.com/logo.png',
  imageUrl,
  url,
  keywords = [],
  category = 'Product Information'
}: BlogPostingSchemaProps) {
  // Format dates to ISO format if they aren't already
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Check if already in ISO format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return new Date().toISOString();
    }
  };

  const formattedDatePublished = formatDate(datePublished);
  const formattedDateModified = dateModified ? formatDate(dateModified) : formattedDatePublished;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url || window.location.href
    },
    'headline': title,
    'description': description,
    'image': imageUrl ? [imageUrl] : undefined,
    'author': {
      '@type': 'Person',
      'name': authorName,
      'url': authorUrl
    },
    'publisher': {
      '@type': 'Organization',
      'name': organizationName,
      'logo': {
        '@type': 'ImageObject',
        'url': organizationLogo
      }
    },
    'datePublished': formattedDatePublished,
    'dateModified': formattedDateModified,
    'keywords': keywords.join(', '),
    'articleSection': category
  };

  return (
    <Script
      id="blog-posting-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
    />
  );
}
