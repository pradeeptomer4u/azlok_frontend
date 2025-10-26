'use client';

import React from 'react';
import Script from 'next/script';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQ[];
  url?: string;
  mainEntity?: string;
}

/**
 * FAQSchema component that adds JSON-LD structured data for FAQs
 * This helps search engines display FAQ rich results in search
 */
export default function FAQSchema({
  faqs,
  url = '',
  mainEntity = ''
}: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(url && { '@id': `${url}#faq` }),
    ...(mainEntity && { 'mainEntity': mainEntity }),
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
