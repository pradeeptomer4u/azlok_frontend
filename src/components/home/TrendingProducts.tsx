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
  views: number;
}

const TrendingProducts = () => {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bestseller products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get bestseller products from the API service - limit to 4 items
        const bestsellers = await productService.getBestsellers(4);
        console.log('API Response - Bestsellers:', bestsellers);
        
        // Transform API products to match our UI component needs
        const transformedProducts: UIProduct[] = bestsellers.map((product, index) => {
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
            slug: product.slug || product.sku || `product-${product.id}`, // Ensure slug is always a string
            price: product.price,
            minOrder: 1, // Default min order
            seller: product.brand || 'Unknown Seller',
            location: 'India', // Default location
            views: 1000 - (index * 100) // Simulate view count based on position
          };
        });
        
        // Ensure we only show 4 items maximum
        const limitedProducts = transformedProducts.slice(0, 4);
        console.log('Transformed Products:', limitedProducts);
        setProducts(limitedProducts);
      } catch (error) {
        console.error('Error fetching trending products:', error);
        setError('Failed to load trending products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [productService]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide">
            Loading trending products...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="text-center max-w-md p-8 bg-[#defce8] rounded-xl shadow-lg border border-red-100">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-['Montserrat',sans-serif] mb-6">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-6 rounded-full font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-200/40 flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="text-center max-w-md p-8 bg-[#defce8] rounded-xl shadow-lg border border-gray-100">
          <div className="text-gray-400 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide">
            No trending products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: UIProduct) => (
        <div key={product.id} className="bg-[#defce8]/90 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:scale-[1.02] group">
          <Link href={`/products/${product.slug}`}>
            <div className="relative">
              <div className="relative h-48 bg-white overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-300/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-300/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute top-2 right-2 bg-gradient-to-r from-secondary to-secondary/80 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md transform -rotate-2 group-hover:rotate-0 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-medium tracking-wide">Trending</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-gradient-to-r from-gray-800/70 to-gray-700/70 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-sm group-hover:shadow transition-shadow duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {product.views}
              </div>
            </div>
            <div className="p-4 relative">
              {/* Subtle decorative element */}
              <div className="absolute -top-6 right-4 w-12 h-12 bg-green-100/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="font-['Playfair_Display',serif] font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2 h-12 relative z-10">
                {product.name}
              </h3>
              <p className="text-primary font-bold mt-2 font-['Montserrat',sans-serif] tracking-tight">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide">
                Min. Order: {product.minOrder} units
              </p>
            </div>
          </Link>
          <div className="px-4 pb-4 flex space-x-2 relative mt-auto">
            {/* Decorative wave pattern */}
            <div className="absolute -top-6 left-0 right-0 h-6 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
                <path fill="#4ade80" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
            <a 
              href={`https://wa.me/8800412138?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 flex items-center justify-center shadow-sm hover:shadow group relative overflow-hidden"
              aria-label={`Contact via WhatsApp for ${product.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
            <button 
              className="flex-1 bg-gradient-to-r from-primary/20 to-primary/20 text-gray-800 py-1.5 sm:py-2 rounded-md hover:from-primary/30 hover:to-primary/30 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center shadow-sm hover:shadow group relative overflow-hidden"
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
            {/* Add subtle hover effect for buttons */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-300/0 via-green-400/20 to-green-300/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingProducts;
