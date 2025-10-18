'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';

// Define Category type
interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories with product counts from API
        const apiCategories = await categoryService.getCategoriesWithProductCount();
        
        // Transform API categories to match UI interface
        const transformedCategories: Category[] = apiCategories.map((category) => ({
          id: category.id,
          name: category.name,
          image: category.image_url || '/globe.svg',
          slug: category.slug,
          productCount: category.product_count || 0
        }));
        
        setCategories(transformedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fdfb] py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="All Categories - Azlok"
        description="Browse all product categories available at Azlok. Find electronics, clothing, furniture, and more."
        keywords="categories, product categories, shopping categories, electronics, clothing, furniture"
        ogType="website"
        ogUrl="/categories"
        ogImage="/logo.png"
        canonicalUrl="/categories"
      />
      
      {/* Organization Structured Data */}
      <OrganizationStructuredData
        name="Azlok"
        url="https://azlok.com"
        logo="/logo.png"
        sameAs={[
          "https://www.linkedin.com/in/azlok/",
          "https://www.youtube.com/@Azlok_Pvt_Ltd",
          "https://x.com/Azlok_Pvt_Ltd",
          "https://www.instagram.com/azlok.pvt.ltd"
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

      <div className="container-custom mx-auto relative z-10">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4ade80]/20 to-[#38bdf8]/20 p-8 shadow-lg">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4ade80]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#38bdf8]/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Playfair_Display',serif]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">From Earth to Your Home</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl font-['Montserrat',sans-serif]">
              Browse authentic products sourced directly from local farmers and artisanal manufacturers. Experience the difference that comes from supporting real people and their craft.
            </p>
            <div className="mt-4 italic text-sm text-gray-500 border-l-2 border-[#4ade80] pl-3 max-w-xl">
              <span className="font-medium text-[#2c7a4c]">"</span> I've been using Azlok products for years. Knowing that my purchase supports local farmers and craftspeople makes every item special. The quality speaks for itself! <span className="font-medium text-[#2c7a4c]">"</span>
              <span className="block mt-1 text-right font-medium">— Priya S., Loyal Customer</span>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
              <circle cx="40" cy="40" r="30" stroke="#4ade80" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="40" cy="40" r="20" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="40" cy="40" r="10" fill="#f472b6" fillOpacity="0.2" />
            </svg>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#4ade80] border-r-[#38bdf8] border-b-[#f472b6] border-l-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center shadow-md border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link 
                href={`/categories/${category.slug}`} 
                key={category.id}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#4ade80]/10 h-full flex flex-col transform hover:translate-y-[-8px] group relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#4ade80]/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#38bdf8]/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative h-48 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#4ade80" strokeWidth="0.5" opacity="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#smallGrid)" />
                      </svg>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-[#38bdf8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-110 z-10"
                    />
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/0 via-[#4ade80]/0 to-[#4ade80]/0 group-hover:from-[#4ade80]/5 group-hover:via-[#38bdf8]/5 group-hover:to-[#f472b6]/5 transition-all duration-700"></div>
                  </div>
                  
                  <div className="p-5 text-center relative flex-grow flex flex-col justify-between">
                    {/* Subtle decorative element */}
                    <div className="absolute -top-6 right-6 w-12 h-12 bg-[#4ade80]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div>
                      <h3 className="font-['Playfair_Display',serif] font-semibold text-gray-800 group-hover:text-[#2c7a4c] transition-colors duration-300 text-lg mb-2 relative">
                        {category.name}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#4ade80] to-transparent group-hover:w-2/3 transition-all duration-500"></div>
                      </h3>
                      
                      <p className="text-sm text-gray-500 font-['Montserrat',sans-serif]">
                        {category.productCount} products
                      </p>
                    </div>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center text-xs font-medium text-[#2c7a4c] bg-[#4ade80]/10 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Explore
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
