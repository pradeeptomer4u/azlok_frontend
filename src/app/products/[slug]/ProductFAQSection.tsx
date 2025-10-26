'use client';

import React from 'react';
import ProductFAQ from '@/components/products/ProductFAQ';

interface ProductFAQSectionProps {
  slug: string | undefined;
  showLanguageToggle?: boolean;
}

/**
 * ProductFAQSection component to be included in product detail pages
 * Positioned above the tabs with advanced graphics
 */
export default function ProductFAQSection({ slug, showLanguageToggle = true }: ProductFAQSectionProps) {
  // If slug is undefined, don't render anything
  if (!slug) return null;
  
  return (
    <ProductFAQ 
      product={slug}
      slug={slug}
      title=""
      subtitle=""
      showLanguageToggle={false}
      className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[#dbf9e1]/60 relative overflow-hidden w-full"
    />
  );
}
