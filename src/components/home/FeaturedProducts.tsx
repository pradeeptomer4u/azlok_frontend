'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productService, { Product as ApiProduct } from '../../services/productService';

// Define the UI Product type for display
interface UIProduct {
  id: number;
  name: string;
  image: string;
  slug: string;
  price: number;
  minOrder: number;
  seller: string;
  location: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get featured products from the API service
        const featuredProducts = await productService.getFeaturedProducts();
        
        // Transform API products to match our UI component needs
        const transformedProducts: UIProduct[] = featuredProducts.map(product => ({
          id: product.id,
          name: product.name,
          image: product.image_url || '/globe.svg', // Use image or fallback
          slug: product.sku.toLowerCase().replace(/\s+/g, '-'), // Generate slug from SKU
          price: product.price,
          minOrder: 1, // Default min order
          seller: product.brand || 'Unknown Seller',
          location: 'India' // Default location
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
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
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: UIProduct) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/products/${product.slug}`}>
            <div className="relative h-48 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 hover:text-primary transition-colors line-clamp-2 h-12">
                {product.name}
              </h3>
              <p className="text-primary font-bold mt-2">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Min. Order: {product.minOrder} units
              </p>
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {product.seller}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {product.location}
              </div>
            </div>
          </Link>
          <div className="px-4 pb-4">
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
              Contact Supplier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
