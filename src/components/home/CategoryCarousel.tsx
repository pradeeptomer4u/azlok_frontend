'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import categoryService, { Category } from '../../services/categoryService';

// Define the UI Category type for display
interface UICategory {
  id: number;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

const CategoryCarousel = () => {
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get categories with product count from the API service
        const apiCategories = await categoryService.getCategoriesWithProductCount();
        
        // Transform API categories to match our UI component needs
        const transformedCategories: UICategory[] = apiCategories.map((category) => ({
          id: category.id,
          name: category.name,
          image: category.image_url || '/globe.svg', // Use image or fallback
          slug: category.slug,
          productCount: category.product_count || 0 // Use actual product count from API
        }));
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === Math.floor(categories.length / 4) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.floor(categories.length / 4) : prev - 1
    );
  };

  // Calculate visible categories based on current slide
  const visibleCategories = categories.slice(
    currentSlide * 4,
    currentSlide * 4 + 4
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
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
    );
  }
  
  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleCategories.map((category) => (
          <Link 
            href={`/categories/${category.slug}`} 
            key={category.id}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="relative h-40 bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.productCount} products
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {categories.length > 4 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Previous categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {categories.length > 4 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(categories.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 mx-1 rounded-full ${
                currentSlide === index ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;
