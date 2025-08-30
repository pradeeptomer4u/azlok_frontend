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
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              India&apos;s Leading <span className="text-blue-600">B2B Marketplace</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Connect with thousands of verified suppliers and buyers across India
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search products"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
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
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  aria-label="Search"
                >
                  Search
                </button>
              </form>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 items-center">
              <span className="text-gray-500 font-medium">Popular:</span>
              <Link href="/search?q=electronics" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Electronics
              </Link>
              <Link href="/search?q=textiles" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Textiles
              </Link>
              <Link href="/search?q=machinery" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Machinery
              </Link>
              <Link href="/search?q=furniture" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Furniture
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <Image
                src="/globe.svg"
                alt="Global B2B Marketplace"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-orange-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-30 animate-pulse delay-500"></div>
    </section>
  );
};

export default HeroSection;
