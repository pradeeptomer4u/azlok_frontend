'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import searchService, { AutocompleteResult } from '../../services/searchService';

const HeroSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const categoryParam = category !== 'all' ? `&category=${category}` : '';
      router.push(`/search?q=${encodeURIComponent(searchQuery)}${categoryParam}`);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    router.push(`/products/${suggestion.id}`);
  };

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      setShowSuggestions(true); // Always show suggestions when fetching
      console.log('Fetching suggestions for query:', searchQuery);
      try {
        const results = await searchService.getAutocompleteSuggestions(searchQuery);
        console.log('Received suggestions:', results);
        setSuggestions(results);
        // Force show suggestions even if results are empty
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              India&apos;s Leading <span className="text-blue-600">B2C Marketplace</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Connect with thousands of verified suppliers and buyers across India
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-2xl mx-auto lg:mx-0" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    aria-label="Search products"
                    autoComplete="off"
                  />
                  
                  {/* Autocomplete suggestions */}
                  {searchQuery.trim().length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-3 text-center text-gray-500">
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                          Loading...
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                          <div 
                            key={suggestion.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex-shrink-0 w-10 h-10 relative bg-gray-50 rounded overflow-hidden">
                              <Image 
                                src={suggestion.image || '/globe.svg'}
                                alt={suggestion.name}
                                fill
                                className="object-contain p-1"
                                sizes="40px"
                                unoptimized
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{suggestion.name}</p>
                              <p className="text-xs text-gray-500">{suggestion.category || 'Product'}</p>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">₹{suggestion.price.toLocaleString()}</div>
                          </div>
                        ))
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-3 text-center text-gray-500">No products found</div>
                      ) : null}
                    </div>
                  )}
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
              <Link href="/search?q=chemicals" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Chemicals
              </Link>
              <Link href="/search?q=essential+oils" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Essential Oils
              </Link>
              <Link href="/search?q=powder" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Powder
              </Link>
              <Link href="/search?q=spices" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                Spices
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <Image
                src="/home_page_banner.png"
                alt="Global B2C Marketplace"
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
