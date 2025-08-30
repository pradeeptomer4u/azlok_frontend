'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import searchService, { SearchResults } from '../../services/searchService';
import { Product } from '../../types/product';
import MetaTags from '../../components/SEO/MetaTags';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const category = searchParams?.get('category') || 'all';
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Define pageSize
  
  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults(null);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Mock data for testing
        const mockProducts: any[] = [
          {
            id: 1,
            name: 'Industrial Supplies - Sample Product 1',
            description: 'High-quality industrial supplies for manufacturing',
            price: 1299,
            rating: 4.5,
            image_url: '/globe.svg',
            category: 'Industrial',
            discount_percent: 10
          },
          {
            id: 2,
            name: 'Industrial Equipment - Sample Product 2',
            description: 'Professional industrial equipment for factories',
            price: 2499,
            rating: 4.2,
            image_url: '/globe.svg',
            category: 'Industrial',
            discount_percent: 5
          },
          {
            id: 3,
            name: 'Industrial Tools - Sample Product 3',
            description: 'Durable industrial tools for various applications',
            price: 999,
            rating: 4.8,
            image_url: '/globe.svg',
            category: 'Industrial',
            discount_percent: 15
          }
        ];
        
        const mockResults = {
          items: mockProducts.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
          ),
          total: mockProducts.length,
          page: currentPage,
          size: pageSize,
          pages: 1,
          query: query
        };
        
        setResults(mockResults as unknown as SearchResults);
        
        /* Uncomment when backend is working
        const results = await searchService.searchProducts(
          query,
          categoryId ? parseInt(categoryId) : undefined,
          currentPage,
          pageSize
        );
        setResults(results);
        */
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, category, currentPage, pageSize]);
  
  // Helper function to map category string to ID (in a real app, this would come from an API)
  const getCategoryId = (categoryName: string): number | undefined => {
    const categoryMap: Record<string, number> = {
      'electronics': 1,
      'clothing': 2,
      'machinery': 3,
      'furniture': 4,
      'food': 5
    };
    
    return categoryMap[categoryName];
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <MetaTags
        title={`Search results for "${query}" - Azlok`}
        description={`Browse search results for ${query} on Azlok marketplace`}
        keywords={`search, ${query}, products, marketplace`}
        ogType="website"
        ogUrl={`/search?q=${encodeURIComponent(query)}`}
        ogImage="/logo.png"
        canonicalUrl={`/search?q=${encodeURIComponent(query)}`}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
        
        {/* Search status */}
        {query && results && !isLoading && (
          <p className="text-gray-600 mb-6">
            Found {results.total} {results.total === 1 ? 'result' : 'results'}
            {category !== 'all' ? ` in ${category}` : ''}
          </p>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="flex justify-center items-center h-60">
            <div className="text-red-500 text-center">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* No results */}
        {!isLoading && !error && results && results.items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-500 max-w-md">
              Try using different keywords or browse our categories.
            </p>
            <Link href="/" className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
        
        {/* Search results */}
        {!isLoading && !error && results && results.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.items.map((product: Product) => (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-50">
                  <Image
                    src={product.image_url || product.image || '/globe.svg'}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 line-through mr-2">
                        ₹{product.original_price.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        {Math.round((1 - product.price / product.original_price) * 100)}% off
                      </p>
                    </div>
                  )}
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs text-gray-600">{product.rating || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && !error && results && results.pages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              
              {[...Array(results.pages)].map((_, i) => {
                const page = i + 1;
                // Show current page, first, last, and pages around current
                if (
                  page === 1 || 
                  page === results.pages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < results.pages - 2)
                ) {
                  return <span key={page} className="px-1">...</span>;
                } else {
                  return null;
                }
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === results.pages}
                className={`px-3 py-2 rounded-md ${
                  currentPage === results.pages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
