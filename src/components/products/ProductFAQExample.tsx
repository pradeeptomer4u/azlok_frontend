'use client';

import React from 'react';
import ProductFAQ from './ProductFAQ';

/**
 * Example component showing how to use the ProductFAQ component in a product page
 */
export default function ProductFAQExample() {
  return (
    <div className="max-w-4xl mx-auto my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Product FAQ Examples</h2>
      
      {/* Example for a spice product */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Turmeric Product FAQ</h3>
        <ProductFAQ 
          product="turmeric" 
          slug="turmeric-haldi-powder-100g"
        />
      </div>
      
      {/* Example for a chemical product */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Borax Product FAQ</h3>
        <ProductFAQ 
          product="borax" 
          slug="dr-tomar-borax-powder"
        />
      </div>
      
      {/* Usage with direct slug */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Using with slug directly</h3>
        <ProductFAQ 
          product="dr-tomar-borax-powder"
        />
      </div>
    </div>
  );
}
