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
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching category with slug:', slug);
        
        // Get all categories and find the one with matching slug
        const allCategories = await categoryService.getAllCategories();
        console.log('All categories:', allCategories);
        
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
        } else {
          console.error('Category not found with slug:', slug);
          setError('Category not found');
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
  }, [slug, categoryService]);

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
          <Link href="/categories" className="text-primary hover:underline mt-4 inline-block">
            Browse all categories
          </Link>
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
          <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/categories" className="text-gray-500 hover:text-primary">Categories</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-primary">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
          {category.productCount !== undefined && (
            <p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
          )}
        </div>

        {/* Product Listing */}
        <ProductListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
