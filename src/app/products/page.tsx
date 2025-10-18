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
    <div className="min-h-screen py-4 sm:py-6 md:py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-orange-200/5 rounded-full blur-3xl animate-float2"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"></div>
        
        {/* Unique decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-[#5dc285]/10 rotate-45 opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-[#5dc285]/10 rounded-full opacity-15 animate-spin-slow"></div>
      </div>
      
      <div className="container-custom mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold mb-4 sm:mb-6 text-green-800 relative inline-block">
          Products
          <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
        </h1>
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button 
            className="w-full flex items-center justify-center bg-gradient-to-r from-[#dbf9e1]/70 to-[#dbf9e1]/50 text-[#5dc285] py-2 px-4 rounded-md hover:from-[#dbf9e1]/80 hover:to-[#dbf9e1]/60 transition-all duration-300 shadow-sm hover:shadow border border-[#5dc285]/20 relative overflow-hidden group"
            onClick={() => {
              const filterElement = document.getElementById('product-filters');
              if (filterElement) {
                filterElement.classList.toggle('hidden');
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5dc285]/0 via-[#5dc285]/5 to-[#5dc285]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5dc285]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-['Montserrat',sans-serif] font-medium">Filter Products</span>
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
