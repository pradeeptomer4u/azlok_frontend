'use client';

import ProductListing from '@/components/products/ProductListing';
import ProductFilters from '@/components/products/ProductFilters';
import { Suspense } from 'react';

// Metadata needs to be in a separate file for client components
// This is just for reference, actual metadata should be in layout.tsx
const metadata = {
  title: 'Products | Azlok Enterprises',
  description: 'Browse our wide range of products from verified suppliers across India',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8">
      <div className="container-custom mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Products</h1>
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button 
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => {
              const filterElement = document.getElementById('product-filters');
              if (filterElement) {
                filterElement.classList.toggle('hidden');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Products
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div id="product-filters" className="w-full lg:w-1/4 hidden lg:block">
            <Suspense fallback={<div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-5 sm:h-6 bg-gray-200 rounded"></div>
              ))}
            </div>}>
              <ProductFilters />
            </Suspense>
          </div>
          
          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <Suspense fallback={<div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg p-4 h-64"></div>
              ))}
            </div>}>
              <ProductListing />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
