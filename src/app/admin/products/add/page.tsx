'use client';

import ProductForm from '../../../../components/admin/ProductForm';
import Link from 'next/link';

export default function AddProductPage() {
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
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600">Create a new product in your catalog</p>
        </div>
      </div>
      
      <ProductForm />
    </div>
  );
}
