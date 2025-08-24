'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sellerService, { Seller } from '../../services/sellerService';

// Define the UI Seller type for display
interface UISeller {
  id: number;
  name: string;
  image: string;
  slug: string;
  location: string;
  productCount: number;
  rating: number;
  verified: boolean;
  memberSince: string;
}

const SellerShowcase = () => {
  const [sellers, setSellers] = useState<UISeller[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sellers from the API
  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get top sellers from the API service
        const apiSellers = await sellerService.getTopSellers(4);
        
        // Transform API sellers to match our UI component needs
        const transformedSellers: UISeller[] = apiSellers.map((seller, index) => ({
          id: seller.id,
          name: seller.name,
          image: seller.image_url || '/globe.svg', // Use image or fallback
          slug: seller.slug,
          location: seller.location || `City ${index + 1}, India`, // Use location or fallback
          productCount: 40 + (index * 20), // Simulate product count
          rating: seller.rating || 4.5 + (Math.random() * 0.5), // Use rating or generate one
          verified: seller.verified !== undefined ? seller.verified : true, // Use verified status or default to true
          memberSince: seller.member_since || (2018 + index).toString() // Use member since or generate one
        }));
        
        setSellers(transformedSellers);
      } catch (error) {
        console.error('Error fetching top sellers:', error);
        setError('Failed to load sellers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellers();
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
  
  if (sellers.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No sellers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sellers.map((seller) => (
        <Link 
          href={`/sellers/${seller.slug}`} 
          key={seller.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-40 bg-gray-50 flex items-center justify-center">
            <div className="relative h-24 w-24">
              <Image
                src={seller.image}
                alt={seller.name}
                fill
                className="object-contain"
              />
            </div>
            {seller.verified && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 hover:text-primary transition-colors">
              {seller.name}
            </h3>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {seller.location}
            </div>
            <div className="mt-1 flex items-center text-sm">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${i < Math.floor(seller.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-gray-600">{seller.rating}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-600">{seller.productCount} Products</span>
              <span className="text-gray-600">Since {seller.memberSince}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SellerShowcase;
