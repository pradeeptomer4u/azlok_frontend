'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
    sellerInfo: {
      id: 101,
      name: 'ABC Manufacturing',
      email: 'contact@abcmanufacturing.com',
      phone: '+91 98765 43210',
      joinDate: '2022-05-15'
    },
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
    images: ['/logo.png', '/logo.png', '/logo.png'],
    createdAt: '2023-10-05',
    updatedAt: '2023-11-10',
    salesData: {
      totalSales: 128,
      totalRevenue: 1600000,
      lastMonthSales: 15,
      lastMonthRevenue: 187500
    }
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
    sellerInfo: {
      id: 102,
      name: 'XYZ Industries',
      email: 'info@xyzindustries.com',
      phone: '+91 98765 12345',
      joinDate: '2022-03-22'
    },
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
    images: ['/logo.png', '/logo.png'],
    createdAt: '2023-09-18',
    updatedAt: '2023-11-05',
    salesData: {
      totalSales: 98,
      totalRevenue: 980000,
      lastMonthSales: 12,
      lastMonthRevenue: 120000
    }
  }
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  
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
      month: 'long',
      day: 'numeric'
    });
  };
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const productId = parseInt(params.id);
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
  }, [params.id]);
  
  // Handle delete product
  const handleDeleteProduct = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      // In a real app, this would call an API
      alert(`Product ${product.name} deleted successfully!`);
      router.push('/admin/products');
    }
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
      {/* Header with actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/products" 
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            href={`/admin/products/edit/${product.id}`} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button 
            onClick={handleDeleteProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      {/* Product Status Badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
            product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Price</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(product.price)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className="text-xl font-bold mt-1">{product.stock} units</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="text-xl font-bold mt-1">{product.salesData.totalSales} units</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(product.salesData.totalRevenue)}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seller'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Seller Information
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sales'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sales Data
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Product Details Tab */}
        {activeTab === 'details' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                <div className="mb-4 h-64 bg-gray-100 rounded-md relative overflow-hidden">
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image: string, index: number) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-16 bg-gray-100 rounded-md relative overflow-hidden cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-primary' : ''
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
              
              {/* Product Info */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="mt-1">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created On</p>
                      <p className="mt-1">{formatDate(product.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="mt-1">{formatDate(product.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Seller</p>
                      <p className="mt-1">{product.seller}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        {product.specifications.map((spec: { name: string, value: string }, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{spec.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seller Information Tab */}
        {activeTab === 'seller' && (
          <div className="p-6">
            <div className="bg-white rounded-lg">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Seller Name</p>
                    <p className="mt-1 text-lg font-medium">{product.sellerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Seller ID</p>
                    <p className="mt-1">{product.sellerInfo.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{product.sellerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{product.sellerInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined On</p>
                    <p className="mt-1">{formatDate(product.sellerInfo.joinDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  href={`/admin/sellers/${product.sellerInfo.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View Seller Profile
                </Link>
                <Link 
                  href={`/admin/sellers/${product.sellerInfo.id}/products`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View All Products by Seller
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Sales Data Tab */}
        {activeTab === 'sales' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-2xl font-bold mt-1">{product.salesData.totalSales} units</p>
                  <p className="text-sm text-gray-500 mt-1">Lifetime</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(product.salesData.totalRevenue)}</p>
                  <p className="text-sm text-gray-500 mt-1">Lifetime</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Last Month Sales</p>
                  <p className="text-2xl font-bold mt-1">{product.salesData.lastMonthSales} units</p>
                  <p className="text-sm text-gray-500 mt-1">Previous 30 days</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Last Month Revenue</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(product.salesData.lastMonthRevenue)}</p>
                  <p className="text-sm text-gray-500 mt-1">Previous 30 days</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Performance</h3>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-center text-gray-500 py-8">Sales chart would be displayed here</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                <Link 
                  href={`/admin/products/${product.id}/orders`}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  View All Orders
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-9385</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Acme Corp</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 15, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price * 2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-9382</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tech Solutions</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 14, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Processing
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-9378</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Global Traders</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 12, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price * 3)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
