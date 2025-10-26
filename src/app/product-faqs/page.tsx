'use client';

import React from 'react';
import ProductFAQExample from '@/components/products/ProductFAQExample';
import { CanonicalUrl } from '@/components/SEO';

export default function ProductFAQsPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <CanonicalUrl url="/product-faqs" />
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-900">
            Azlok Product FAQs
          </span>
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Explore our comprehensive FAQ sections for each product. These FAQs are dynamically generated
          and include structured data for better SEO.
        </p>
        
        <ProductFAQExample />
      </div>
    </div>
  );
}
