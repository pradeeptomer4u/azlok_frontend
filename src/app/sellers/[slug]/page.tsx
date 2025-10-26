'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import sellerService, { Seller } from '../../../services/sellerService';
import { Product } from '../../../types/product';
import MetaTags from '../../../components/SEO/MetaTags';

export default function SellerDetailPage() {
  const params = useParams();
  const slug = params?.slug as string || '';
  
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get seller by slug
        const sellerData = await sellerService.getSellerBySlug(slug);
        
        if (!sellerData) {
          setError('Seller not found');
          setIsLoading(false);
          return;
        }
        
        setSeller({
          ...sellerData,
          name: sellerData.business_name || sellerData.full_name,
          location: sellerData.region || (sellerData.business_address?.city ? 
            `${sellerData.business_address.city}, ${sellerData.business_address.country || 'India'}` : 
            'India'),
          member_since: sellerData.joined_date ? new Date(sellerData.joined_date).getFullYear().toString() : '2023'
        });
        
        // Get seller products if seller ID is available
        if (sellerData.id) {
          const sellerProductsResponse = await sellerService.getSellerProducts(sellerData.id);
          setProducts(sellerProductsResponse.products);
        }
      } catch (error) {
        console.error('Error fetching seller details:', error);
        setError('Failed to load seller details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchSellerDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Seller not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the seller you&apos;re looking for.
          </p>
          <Link 
            href="/brands" 
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            View All Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <MetaTags
        title={`${seller.name} - Azlok`}
        description={`Shop quality products from ${seller.name} on Azlok. ${seller.product_count || 'Many'} products available.`}
        keywords={`${seller.name}, brand, seller, products, online shopping`}
        ogType="website"
        ogUrl={`/sellers/${slug}`}
        ogImage={seller.image_url || '/logo.png'}
        canonicalUrl={`/sellers/${slug}`}
      />
      
      {/* Seller Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative h-32 w-32 bg-gray-50 rounded-full overflow-hidden flex items-center justify-center shadow-md">
              <Image
                src={seller.image_url || '/globe.svg'}
                alt={`${seller.name} logo`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 128px"
                priority
              />
              {seller.verified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                {seller.verified && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
                )}
              </div>
              
              <div className="mt-2 flex items-center justify-center md:justify-start text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {seller.location}
              </div>
              
              <div className="mt-1 flex items-center justify-center md:justify-start">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${i < Math.floor(seller.rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-gray-600">{seller.rating || 4.5}</span>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <span className="text-gray-600">
                  <strong>{seller.product_count || 0}</strong> Products
                </span>
                <span className="text-gray-600">Member since <strong>{seller.member_since}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seller Products */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products by {seller.name}</h2>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No products available from this seller at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-50">
                  <Image
                    src={
                      Array.isArray(product.image_url) && product.image_url.length > 0
                        ? product.image_url[0]
                        : typeof product.image_url === 'string'
                          ? product.image_url
                          : product.image || '/globe.svg'
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        {Math.round((1 - product.price / product.original_price) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
