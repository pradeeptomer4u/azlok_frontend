'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import ProductListSchema from '../SEO/ProductListSchema';

// Define Category type
interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

export default function CategoryListClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories with product counts from API
        const apiCategories = await categoryService.getCategoriesWithProductCount();
        
        // Also fetch some featured products for the schema
        const featuredProductsData = await productService.getFeaturedProducts(8);
        setFeaturedProducts(featuredProductsData);
        
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#4ade80] border-r-[#38bdf8] border-b-[#f472b6] border-l-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-red-600 text-center shadow-md border border-red-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Add Product List Schema for SEO */}
      {featuredProducts.length > 0 && (
        <ProductListSchema 
          products={featuredProducts} 
          listType="CollectionPage" 
          listName="Product Categories"
        />
      )}
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
    </>
  );
}
