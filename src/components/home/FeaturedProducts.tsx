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
        // Get featured products from the API service - limit to 4 items
        const featuredProducts = await productService.getFeaturedProducts(4);
        console.log('API Response - Featured Products:', featuredProducts);
        
        // Transform API products to match our UI component needs
        const transformedProducts: UIProduct[] = featuredProducts.map(product => {
          // Parse image_urls if it exists
          let imageUrl = '/globe.svg'; // Default fallback image
          
          if (product.image_urls) {
            // Handle both string and array formats
            if (typeof product.image_urls === 'string') {
              try {
                // Try to parse as JSON string
                const imageUrls = JSON.parse(product.image_urls);
                if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                  imageUrl = imageUrls[0]; // Use the first image
                } else if (typeof imageUrls === 'string') {
                  // Handle case where it's a JSON string but not an array
                  imageUrl = imageUrls;
                }
              } catch (e) {
                // If parsing fails, use the string directly
                console.log('Using image_urls directly as string:', product.image_urls);
                imageUrl = product.image_urls;
              }
            } else if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
              // Handle case where it's already an array
              imageUrl = product.image_urls[0];
            }
          } else if (product.image_url) {
            // Fallback to image_url if it exists
            imageUrl = product.image_url;
          }
          
          return {
            id: product.id,
            name: product.name,
            image: imageUrl,
            slug: product.slug || `product-${product.id}`, // Provide a fallback for slug if undefined
            price: product.price,
            minOrder: 1, // Default min order
            seller: product.brand || 'Unknown Seller',
            location: 'India' // Default location
          };
        });
        
        // Ensure we only show 4 items maximum
        const limitedProducts = transformedProducts.slice(0, 4);
        console.log('Transformed Featured Products:', limitedProducts);
        setProducts(limitedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [productService]);

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
                {/* {product.seller} */}
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
          <div className="px-4 pb-4 flex space-x-2">
            <a 
              href={`https://wa.me/8800412138?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 bg-opacity-20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:bg-green-600 hover:bg-opacity-30 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 flex items-center justify-center"
              aria-label={`Contact via WhatsApp for ${product.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
            <button 
              className="flex-1 bg-primary bg-opacity-20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:bg-primary hover:bg-opacity-30 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality would go here
                alert(`Added ${product.name} to cart`);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
