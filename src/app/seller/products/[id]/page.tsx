'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Industrial Machinery Part XYZ',
  sku: 'IMP-001',
  price: 12500,
  stock: 45,
  category: 'Machinery Parts',
  status: 'active',
  description: 'High-quality industrial machinery part designed for heavy-duty applications. Made from premium materials for durability and long-lasting performance.',
  features: [
    'Precision engineered for optimal performance',
    'Heat-treated steel construction',
    'Corrosion-resistant coating',
    'Compatible with major industrial machinery brands',
    'Meets ISO 9001 quality standards'
  ],
  specifications: {
    material: 'Hardened Steel',
    dimensions: '15cm x 8cm x 5cm',
    weight: '2.5 kg',
    tolerance: '±0.05mm',
    operatingTemp: '-20°C to 120°C',
    warranty: '1 year'
  },
  images: [
    '/logo.png',
    '/logo.png',
    '/logo.png',
    '/logo.png'
  ],
  sales: 45,
  revenue: 562500,
  createdAt: '2023-10-05',
  updatedAt: '2023-11-01',
  recentOrders: [
    { id: 'ORD-9385', customer: 'Acme Corp', date: '2023-11-15', quantity: 2, amount: 25000 },
    { id: 'ORD-9370', customer: 'Tech Solutions', date: '2023-11-08', quantity: 1, amount: 12500 },
    { id: 'ORD-9355', customer: 'Global Traders', date: '2023-11-01', quantity: 3, amount: 37500 }
  ],
  salesHistory: [
    { month: 'Jun', sales: 5 },
    { month: 'Jul', sales: 7 },
    { month: 'Aug', sales: 10 },
    { month: 'Sep', sales: 12 },
    { month: 'Oct', sales: 11 },
    { month: 'Nov', sales: 8 }
  ]
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, we'll just use the mock data
        setProduct(mockProduct);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle delete product
  const handleDeleteProduct = () => {
    // In a real app, this would be an API call
    alert(`Product ${params.id} deleted`);
    setShowDeleteModal(false);
    router.push('/seller/products');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error || 'Product not found'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/seller/products"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            &larr; Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link
            href="/seller/products"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            href={`/seller/products/edit/${params.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Product
          </button>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
            product.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`}>
          {product.status === 'active' ? 'Active' : 
           product.status === 'pending_approval' ? 'Pending Approval' : 
           'Out of Stock'}
        </span>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`${
              activeTab === 'sales'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sales & Performance
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4">
              <div className="relative h-64 w-full mb-4">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-full cursor-pointer border-2 rounded ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.price)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Stock</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.stock}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Sales</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.sales} units</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.revenue)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(product.createdAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Right Column - Product Details or Sales */}
        <div className="lg:col-span-2">
          {activeTab === 'details' ? (
            <>
              {/* Product Description */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              </div>
              
              {/* Product Features */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Product Specifications */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
                  <div className="border-t border-gray-200 mt-4">
                    <dl>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <div key={key} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                          <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sales Performance */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Performance</h3>
                  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                    <div className="flex items-end space-x-2 h-48 px-4">
                      {product.salesHistory.map((item: any) => (
                        <div key={item.month} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-primary rounded-t" 
                            style={{ height: `${(item.sales / Math.max(...product.salesHistory.map((i: any) => i.sales))) * 100}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                          <div className="text-xs font-medium">{item.sales}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                    <Link href="/seller/orders" className="text-sm font-medium text-primary hover:text-primary-dark">
                      View All Orders
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.recentOrders.map((order: any) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary hover:text-primary-dark">
                              <Link href={`/seller/orders/${order.id}`}>{order.id}</Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(order.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this product? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
