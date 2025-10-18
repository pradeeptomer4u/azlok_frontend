'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import categoryService from '../../services/categoryService';

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
          image: category.image_url || `/images/categories/${category.slug}.jpg` || '/images/category-placeholder.svg',
          slug: category.slug,
          productCount: category.product_count || 0
        }));
        
        // If no categories are returned, add some fallback categories
        if (transformedCategories.length === 0) {
          const fallbackCategories: UICategory[] = [
            {
              id: 1,
              name: 'Spices',
              image: '/images/categories/spices.jpg',
              slug: 'spices',
              productCount: 5
            },
            {
              id: 2,
              name: 'Organic Cereals',
              image: '/images/categories/cereals.jpg',
              slug: 'organic-cereals',
              productCount: 4
            },
            {
              id: 3,
              name: 'Indian Masalas',
              image: '/images/categories/masalas.jpg',
              slug: 'indian-masalas',
              productCount: 2
            },
            {
              id: 4,
              name: 'Essential Oils',
              image: '/images/categories/oils.jpg',
              slug: 'essential-oils',
              productCount: 1
            }
          ];
          setCategories(fallbackCategories);
          return;
        }
        
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg border border-green-100 hover:border-green-300">
              <div className="relative h-40 bg-green-50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover p-0"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  onError={(e) => {
                    console.error(`Failed to load image for category: ${category.name}`, e);
                    const imgElement = e.currentTarget as HTMLImageElement;
                    imgElement.src = '/images/category-placeholder.svg';
                  }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-green-600">
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-green-50 focus:outline-none border border-green-100 transition-all"
            aria-label="Previous categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-green-50 focus:outline-none border border-green-100 transition-all"
            aria-label="Next categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                currentSlide === index ? 'bg-green-600' : 'bg-gray-300'
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
