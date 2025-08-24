'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would navigate to search results
    console.log('Searching for:', searchQuery, 'in category:', category);
    // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&category=${category}`;
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 py-6 md:py-12">
      <div className="container-custom mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4">
              India&apos;s Leading B2C Marketplace
            </h1>
            <p className="text-lg sm:text-xl mb-4 md:mb-8">
              Connect with thousands of verified suppliers and buyers across India
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 md:p-3 shadow-lg max-w-xl mx-auto md:mx-0">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full p-2 md:p-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search products"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <select
                    className="w-full p-2 md:p-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white border border-gray-200"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Select category"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing & Textiles</option>
                    <option value="machinery">Machinery</option>
                    <option value="furniture">Furniture</option>
                    <option value="food">Food & Beverages</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-secondary text-white p-2 md:p-3 rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  aria-label="Search"
                >
                  Search
                </button>
              </form>
            </div>
            
            <div className="mt-4 md:mt-6 flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
              <span className="text-gray-600 text-sm md:text-base">Popular:</span>
              <Link href="/search?q=electronics" className="text-primary hover:text-primary-dark hover:underline text-sm md:text-base">
                Electronics
              </Link>
              <Link href="/search?q=textiles" className="text-primary hover:text-primary-dark hover:underline text-sm md:text-base">
                Textiles
              </Link>
              <Link href="/search?q=machinery" className="text-primary hover:text-primary-dark hover:underline text-sm md:text-base">
                Machinery
              </Link>
              <Link href="/search?q=furniture" className="text-primary hover:text-primary-dark hover:underline text-sm md:text-base">
                Furniture
              </Link>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
              <Image
                src="/globe.svg"
                alt="Global B2B Marketplace"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.65,118.92,150.86,113.91,214.65,107.21,275.18,100.86,293.09,83,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
