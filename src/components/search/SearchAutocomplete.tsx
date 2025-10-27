'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import searchService, { AutocompleteResult } from '../../services/searchService';

// Helper function to get the image URL from a product
const getImageUrl = (product: AutocompleteResult): string => {
  // Default image if nothing is available
  const defaultImage = '/globe.svg';
  
  if (!product) return defaultImage;
  
  // Handle image_urls field (from API)
  if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    return product.image_urls[0] || defaultImage;
  }
  
  // Handle image_url as array
  if (product.image_url && Array.isArray(product.image_url) && product.image_url.length > 0) {
    return product.image_url[0] || defaultImage;
  }
  
  // Handle image_url as string
  if (product.image_url && typeof product.image_url === 'string') {
    return product.image_url;
  }
  
  // Fallback to image field
  if (product.image) {
    return product.image;
  }
  
  return defaultImage;
};

// Helper function to check if an image is external
const isExternalImage = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('https');
};

// Direct API call function to bypass the Next.js API route
const fetchDirectFromApi = async (searchQuery: string) => {
  try {
    const url = `https://api.azlok.com/api/products/search?query=${encodeURIComponent(searchQuery)}&page=1&size=20`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhemxva19hZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTk0MDg3MzEyM30.4TAbjU8BtP9TxwFbTSXwZ1IbUOlelscggK45g3eULuw'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

interface SearchAutocompleteProps {
  onSelect?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        
        // Try direct API call first
        const directApiData = await fetchDirectFromApi(query);
        
        if (directApiData && directApiData.results && directApiData.results.length > 0) {
          
          // Map the direct API response to match the expected structure
          const mappedSuggestions = directApiData.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            image_url: item.image_url,
            image_urls: item.image_urls,
            price: item.price,
            category: item.categories && item.categories.length > 0 ? item.categories[0].name : '',
            slug: item.slug,
            description: item.description
          }));
          
          setSuggestions(mappedSuggestions);
        } else {
          // Fallback to using the service if direct API call fails
          const results = await searchService.searchProducts(query);
                    
          // Check if results and items exist before setting suggestions
          if (results && Array.isArray(results.items)) {
            
            // Map the API response to match the expected structure
            const mappedSuggestions = results.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              image: item.image,
              image_url: item.image_url,
              image_urls: item.image_urls,
              price: item.price,
              category: item.categories && item.categories.length > 0 ? item.categories[0].name : '',
              slug: item.slug,
              description: item.description
            }));
            
            setSuggestions(mappedSuggestions);
          } else {
            setSuggestions([]);
          }
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      } else {
        handleSearch();
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      if (onSelect) onSelect();
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    // Use slug if available, otherwise use ID
    const path = suggestion.slug ? `/products/${suggestion.slug}` : `/products/${suggestion.id}`;
    router.push(path);
    setShowSuggestions(false);
    if (onSelect) onSelect();
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="relative w-full" style={{ zIndex: 99 }}>
      <div className="relative">
        {/* Input field with light green background */}
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          className="w-full py-3 pl-6 pr-16 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-green-200/70 text-gray-700 placeholder-gray-500 shadow-inner"
          autoComplete="off"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(4px)',
          }}
        />
        
        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          className="absolute inset-y-0 right-2 flex items-center"
          aria-label="Search"
        >
          <div className="bg-green-500 hover:bg-green-600 transition-colors rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Suggestions dropdown - rendered directly */}
      {showSuggestions && query.trim().length >= 2 && (
        <div 
          ref={suggestionsRef}
          className="fixed z-[99] bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto border border-gray-100"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'fadeIn 0.2s ease-out',
            position: 'fixed',
            width: inputRef.current ? inputRef.current.offsetWidth : 'auto',
            top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: inputRef.current ? inputRef.current.getBoundingClientRect().left : 0,
            maxHeight: '400px',
            overflowY: 'auto',
            pointerEvents: 'auto',
            zIndex: 999999
          }}
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-base text-gray-600 font-medium">Searching products...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={suggestion.id}
                    className={`px-4 py-4 hover:bg-green-50/30 cursor-pointer flex items-center transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                      highlightedIndex === index ? 'bg-green-50/30' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-white shadow-sm border border-gray-200">
                      {getImageUrl(suggestion) && (
                        <Image
                                              src={
                                                Array.isArray(suggestion.image_urls) && suggestion.image_urls.length > 0
                                                  ? suggestion.image_urls[0]
                                                  : typeof suggestion.image_urls === 'string'
                                                    ? suggestion.image_urls
                                                    : '/globe.svg'
                                              }
                                              alt={`${suggestion.name} search 1`}
                                              fill
                                              style={{ objectFit: 'cover' }}
                                            />
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="text-lg font-medium text-black-200 line-clamp-1">{suggestion.name}</p>
                      <p className="text-xl text-black-50 font-bold mt-1">{formatPrice(suggestion.price)}</p>
                    </div>
                    <div className="ml-4 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : query.trim().length >= 2 ? (
            <div>
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-3">No products found</h3>
                <p className="text-gray-500 mb-6 text-lg">
                  We couldn&apos;t find any products matching
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;