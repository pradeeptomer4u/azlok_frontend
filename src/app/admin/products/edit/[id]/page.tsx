'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../../components/admin/ProductForm';
import Link from 'next/link';
import axios from 'axios';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        if (!params?.id) {
          throw new Error('Product ID not found');
        }
        
        const productId = parseInt(params.id as string);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Fetch product from API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.data) {
          throw new Error('Product not found');
        }
        
        // Process image_urls if it's a string
        if (response.data.image_urls && typeof response.data.image_urls === 'string') {
          try {
            response.data.image_urls = JSON.parse(response.data.image_urls);
          } catch (e) {
            response.data.image_urls = [];
          }
        }
        
        // Format product data for the form
        const productData = {
          id: response.data.id,
          name: response.data.name,
          sku: response.data.sku,
          price: response.data.price,
          stock: response.data.stock_quantity,
          category: response.data.categories?.length > 0 ? response.data.categories[0].name : '',
          category_ids: response.data.categories?.map((cat: any) => cat.id) || [],
          status: response.data.approval_status,
          seller: response.data.seller?.full_name || 'Unknown',
          image: response.data.image_urls?.[0] || '/logo.png',
          description: response.data.description,
          features: response.data.features || [],
          specifications: response.data.specifications || [],
          images: response.data.image_urls || []
        };
        
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || 'Failed to load product. Please try again.');
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
