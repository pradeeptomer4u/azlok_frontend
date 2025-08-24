'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductListing from '../../../components/products/ProductListing';
import MetaTags from '../../../components/SEO/MetaTags';
import { BreadcrumbStructuredData } from '../../../components/SEO/StructuredData';
import axios from 'axios';

// Mock categories data - will be replaced with API data
const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    image: '/globe.svg',
    slug: 'electronics',
    productCount: 1245,
    description: 'Browse our wide range of electronic products including smartphones, laptops, and home appliances.'
  },
  {
    id: 2,
    name: 'Clothing & Textiles',
    image: '/globe.svg',
    slug: 'clothing-textiles',
    productCount: 876,
    description: 'Discover the latest fashion trends and high-quality textiles for all your needs.'
  },
  {
    id: 3,
    name: 'Machinery',
    image: '/globe.svg',
    slug: 'machinery',
    productCount: 543,
    description: 'Find industrial machinery and equipment for manufacturing and production.'
  },
  {
    id: 4,
    name: 'Furniture',
    image: '/globe.svg',
    slug: 'furniture',
    productCount: 321,
    description: 'Explore our collection of furniture for home, office, and outdoor spaces.'
  },
  {
    id: 5,
    name: 'Food & Beverages',
    image: '/globe.svg',
    slug: 'food-beverages',
    productCount: 654,
    description: 'Quality food products and beverages from trusted brands and suppliers.'
  },
  {
    id: 6,
    name: 'Chemicals',
    image: '/globe.svg',
    slug: 'chemicals',
    productCount: 432,
    description: 'Industrial chemicals and compounds for various applications and industries.'
  },
  {
    id: 7,
    name: 'Construction',
    image: '/globe.svg',
    slug: 'construction',
    productCount: 765,
    description: 'Construction materials, tools, and equipment for building projects of all sizes.'
  },
  {
    id: 8,
    name: 'Automotive',
    image: '/globe.svg',
    slug: 'automotive',
    productCount: 543,
    description: 'Automotive parts, accessories, and tools for vehicles of all types.'
  }
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch from the API
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}`);
        // setCategory(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          const foundCategory = mockCategories.find(cat => cat.slug === slug);
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError('Category not found');
          }
          setIsLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category. Please try again later.');
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container-custom mx-auto py-10">
        <div className="bg-red-50 p-6 rounded-md text-red-600 text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p>{error || 'Category not found'}</p>
          <a href="/categories" className="text-primary hover:underline mt-4 inline-block">
            Browse all categories
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

      <div className="container-custom mx-auto py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-4 text-sm">
          <a href="/" className="text-gray-500 hover:text-primary">Home</a>
          <span className="mx-2 text-gray-500">/</span>
          <a href="/categories" className="text-gray-500 hover:text-primary">Categories</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-primary">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
          <p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
        </div>

        {/* Product Listing */}
        <ProductListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
