'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../../components/admin/ProductForm';
import Link from 'next/link';

// Mock product data for demo
const mockProductData = {
  1: {
    id: 1,
    name: 'Industrial Machinery Part XYZ',
    sku: 'IMP-001',
    price: 12500,
    stock: 45,
    category: 'Machinery Parts',
    status: 'active',
    seller: 'ABC Manufacturing',
    image: '/logo.png',
    description: 'High-quality industrial machinery part designed for heavy-duty applications. This component is built to withstand extreme conditions and provide reliable performance in industrial settings.',
    features: [
      'Durable construction with premium materials',
      'Precision engineered for perfect fit',
      'Heat and corrosion resistant',
      'Extended lifespan compared to standard parts'
    ],
    specifications: [
      { name: 'Material', value: 'Hardened Steel' },
      { name: 'Dimensions', value: '15cm x 8cm x 5cm' },
      { name: 'Weight', value: '2.5 kg' },
      { name: 'Operating Temperature', value: '-20°C to 180°C' }
    ],
    images: ['/logo.png', '/logo.png', '/logo.png']
  },
  2: {
    id: 2,
    name: 'Heavy Duty Electric Motor',
    sku: 'HDM-002',
    price: 10000,
    stock: 23,
    category: 'Electric Motors',
    status: 'active',
    seller: 'XYZ Industries',
    image: '/logo.png',
    description: 'Powerful electric motor designed for industrial applications requiring high torque and continuous operation. Energy efficient design with advanced cooling system.',
    features: [
      'High efficiency design',
      'Low noise operation',
      'Integrated cooling system',
      'Variable speed control compatibility'
    ],
    specifications: [
      { name: 'Power', value: '7.5 kW' },
      { name: 'Voltage', value: '380-415V, 3-phase' },
      { name: 'RPM', value: '1450' },
      { name: 'Protection Class', value: 'IP55' }
    ],
    images: ['/logo.png', '/logo.png']
  }
};

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        if (!params?.id) {
          throw new Error('Product ID not found');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const productId = parseInt(params.id as string);
        const productData = mockProductData[productId as keyof typeof mockProductData];
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product. Please try again.');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Product not found'}</span>
        <div className="mt-4">
          <Link 
            href="/admin/products" 
            className="text-red-700 underline hover:text-red-800"
          >
            Return to products list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link 
          href="/admin/products" 
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-600">{product.name} (SKU: {product.sku})</p>
        </div>
      </div>
      
      <ProductForm productId={product.id} initialData={product} />
    </div>
  );
}
