'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Deal {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  image: string;
  product_id: number;
  product_name: string;
  original_price: number;
  discounted_price: number;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/deals');
        setDeals(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals. Please try again later.');
        setLoading(false);
        
        // Fallback to mock data if API fails
        setDeals([
          {
            id: 1,
            title: 'Summer Sale',
            description: 'Get up to 30% off on all summer products',
            discount_percentage: 30,
            start_date: '2025-06-01',
            end_date: '2025-08-31',
            image: '/globe.svg',
            product_id: 1,
            product_name: 'Industrial Machinery Part XYZ',
            original_price: 1500,
            discounted_price: 1050
          },
          {
            id: 2,
            title: 'Clearance Sale',
            description: 'Huge discounts on selected items',
            discount_percentage: 40,
            start_date: '2025-08-15',
            end_date: '2025-09-15',
            image: '/globe.svg',
            product_id: 2,
            product_name: 'Premium Cotton Fabric',
            original_price: 800,
            discounted_price: 480
          },
          {
            id: 3,
            title: 'Flash Sale',
            description: 'Limited time offer - 25% off',
            discount_percentage: 25,
            start_date: '2025-08-20',
            end_date: '2025-08-27',
            image: '/globe.svg',
            product_id: 3,
            product_name: 'LED Panel Lights (Pack of 10)',
            original_price: 1200,
            discounted_price: 900
          }
        ]);
      }
    };

    fetchDeals();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="container-custom mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Special Deals & Offers</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 text-lg">No active deals at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <Image 
                  src={deal.image} 
                  alt={deal.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 bg-secondary text-gray-800 font-bold py-1 px-3 rounded-bl-lg">
                  {deal.discount_percentage}% OFF
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{deal.title}</h2>
                <p className="text-gray-600 mb-3">{deal.description}</p>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    Valid from {formatDate(deal.start_date)} to {formatDate(deal.end_date)}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {calculateDaysLeft(deal.end_date)} days left
                  </p>
                </div>
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <h3 className="font-medium text-gray-800">{deal.product_name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold text-primary">₹{deal.discounted_price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹{deal.original_price}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push(`/products/${deal.product_id}`)}
                  className="mt-4 w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors duration-300"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
