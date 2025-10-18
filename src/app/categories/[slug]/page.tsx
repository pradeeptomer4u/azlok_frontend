'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductListing from '../../../components/products/ProductListing';
import MetaTags from '../../../components/SEO/MetaTags';
import { BreadcrumbStructuredData } from '../../../components/SEO/StructuredData';
import categoryService, { Category } from '../../../services/categoryService';
import productService from '../../../services/productService';

// Interface for category with additional UI properties
interface UICategory extends Category {
  productCount?: number;
  image?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<UICategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async (retryCount = 0) => {
      setIsLoading(true);
      try {
        console.log('Fetching category with slug:', slug);
        
        // Get all categories and find the one with matching slug
        const allCategories = await categoryService.getAllCategories();
        console.log('All categories:', allCategories);
        
        // Check if we have categories data
        if (!allCategories || allCategories.length === 0) {
          // If no categories and we haven't retried too many times, retry
          if (retryCount < 3) {
            console.log(`No categories found, retrying (${retryCount + 1}/3)...`);
            setTimeout(() => fetchCategory(retryCount + 1), 1000); // Retry after 1 second
            return;
          } else {
            throw new Error('Failed to load categories after multiple attempts');
          }
        }
        
        const foundCategory = allCategories.find(cat => cat.slug === slug);
        
        if (foundCategory) {
          // Get product count for this category
          const categoryProducts = await productService.getProductsByCategorySlug(foundCategory.slug, 100);
          
          // Transform to UICategory
          const uiCategory: UICategory = {
            ...foundCategory,
            image: foundCategory.image_url || '/globe.svg',
            productCount: categoryProducts.length
          };
          
          console.log('Found category:', uiCategory);
          setCategory(uiCategory);
          setError(null); // Clear any previous errors
        } else {
          // Try to normalize the slug and search again
          const normalizedSlug = slug.toLowerCase().trim();
          const fuzzyMatch = allCategories.find(cat => 
            cat.slug.toLowerCase() === normalizedSlug ||
            cat.name.toLowerCase() === normalizedSlug
          );
          
          if (fuzzyMatch) {
            // Found a match with normalized slug
            const categoryProducts = await productService.getProductsByCategorySlug(fuzzyMatch.slug, 100);
            
            const uiCategory: UICategory = {
              ...fuzzyMatch,
              image: fuzzyMatch.image_url || '/globe.svg',
              productCount: categoryProducts.length
            };
            
            console.log('Found category with normalized slug:', uiCategory);
            setCategory(uiCategory);
            setError(null); // Clear any previous errors
          } else {
            console.error('Category not found with slug:', slug);
            setError('Category not found');
          }
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fdfb] flex justify-center items-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4ade80]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#38bdf8]/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#4ade80] border-r-[#38bdf8] border-b-[#f472b6] border-l-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"></div>
          </div>
          <p className="text-gray-600 mt-4 text-center font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fdfb] py-10">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4ade80]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#38bdf8]/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container-custom mx-auto py-10 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-red-100 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-['Playfair_Display',serif]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">Oops! {error || 'Category not found'}</span>
              </h1>
              
              <p className="text-gray-600 text-center mb-8 max-w-md">
                We couldn't find the category you're looking for. It might have been removed or renamed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/categories" className="px-6 py-3 bg-[#4ade80]/20 hover:bg-[#4ade80]/30 text-[#2c7a4c] rounded-lg flex items-center justify-center transition-colors duration-300 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Browse all categories
                </Link>
                
                <Link href="/" className="px-6 py-3 bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 text-[#1d6fb8] rounded-lg flex items-center justify-center transition-colors duration-300 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fdfb]">
      {/* SEO Meta Tags */}
      <MetaTags
        title={`${category.name} - Azlok`}
        description={category.description || `Browse ${category.name} products at Azlok. Find the best deals and quality items.`}
        keywords={`${category.name}, products, shopping, ${category.slug}, online shopping`}
        ogType="website"
        ogUrl={`/categories/${category.slug}`}
        ogImage={category.image || '/logo.png'}
        canonicalUrl={`/categories/${category.slug}`}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
          { name: category.name, url: `/categories/${category.slug}` }
        ]}
      />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4ade80]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#38bdf8]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-tr from-[#f472b6]/10 to-transparent rounded-full blur-2xl"></div>

      {/* Animated Floating Shapes */}
      <div className="absolute top-20 right-1/4 w-8 h-8 border border-[#4ade80]/30 rounded-full opacity-60 animate-float-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 border border-[#38bdf8]/30 rounded-md rotate-45 opacity-40 animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/5 w-6 h-6 border border-[#f472b6]/30 rounded-md rotate-12 opacity-50 animate-float-fast"></div>

      <div className="container-custom mx-auto py-6 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-4 text-sm bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
          <Link href="/" className="text-gray-600 hover:text-[#2c7a4c] transition-colors duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <span className="mx-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <Link href="/categories" className="text-gray-600 hover:text-[#2c7a4c] transition-colors duration-300">Categories</Link>
          <span className="mx-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="text-[#2c7a4c] font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4ade80]/20 to-[#38bdf8]/20 p-6 sm:p-8 shadow-lg">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4ade80]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#38bdf8]/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 font-['Playfair_Display',serif]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">{category.name}</span>
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl font-['Montserrat',sans-serif]">{category.description || `Discover our authentic ${category.name} products, sourced directly from local farmers and artisanal manufacturers. Each item carries the care and expertise of its maker.`}</p>
              {category.productCount !== undefined && (
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-[#2c7a4c] text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {category.productCount} products
                </div>
              )}
            </div>
            
            {/* Decorative Category Icon */}
            <div className="hidden md:block relative w-24 h-24">
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#4ade80]/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-2 border border-[#38bdf8]/20 rounded-full animate-spin-slow"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2c7a4c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4">
            <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
              <circle cx="40" cy="40" r="30" stroke="#4ade80" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="40" cy="40" r="20" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="40" cy="40" r="10" fill="#f472b6" fillOpacity="0.2" />
            </svg>
          </div>
        </div>

        {/* Product Listing with enhanced container */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          <ProductListing categorySlug={category.slug} />
        </div>
      </div>
    </div>
  );
}
