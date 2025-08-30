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
    <div className="min-h-screen py-10">
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
          "https://facebook.com/azlok",
          "https://twitter.com/azlok",
          "https://instagram.com/azlok"
        ]}
      />

      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Categories</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                href={`/categories/${category.slug}`} 
                key={category.id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
                  <div className="relative h-48 bg-gray-100">
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
        )}
      </div>
    </div>
  );
}
