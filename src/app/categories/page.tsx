'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';
import axios from 'axios';

// Define Category type
interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

// Mock data for categories - will be replaced with API data
const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    image: '/globe.svg',
    slug: 'electronics',
    productCount: 1245
  },
  {
    id: 2,
    name: 'Clothing & Textiles',
    image: '/globe.svg',
    slug: 'clothing-textiles',
    productCount: 876
  },
  {
    id: 3,
    name: 'Machinery',
    image: '/globe.svg',
    slug: 'machinery',
    productCount: 543
  },
  {
    id: 4,
    name: 'Furniture',
    image: '/globe.svg',
    slug: 'furniture',
    productCount: 321
  },
  {
    id: 5,
    name: 'Food & Beverages',
    image: '/globe.svg',
    slug: 'food-beverages',
    productCount: 654
  },
  {
    id: 6,
    name: 'Chemicals',
    image: '/globe.svg',
    slug: 'chemicals',
    productCount: 432
  },
  {
    id: 7,
    name: 'Construction',
    image: '/globe.svg',
    slug: 'construction',
    productCount: 765
  },
  {
    id: 8,
    name: 'Automotive',
    image: '/globe.svg',
    slug: 'automotive',
    productCount: 543
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch from the API
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        // setCategories(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setCategories(mockCategories);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
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
