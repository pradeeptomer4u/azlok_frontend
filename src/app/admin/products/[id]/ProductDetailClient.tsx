'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import productService, { Product } from '../../../../services/productService';

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [salesData, setSalesData] = useState<any>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
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
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        const productId = parseInt(id);
        const productData = await productService.getProductById(productId);
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
        
        // Fetch sales data if available
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com'}/api/products/${productId}/sales`);
          if (response.ok) {
            const data = await response.json();
            setSalesData(data);
          }
        } catch (err) {
          console.error('Error fetching sales data:', err);
          // Set default sales data if API fails
          setSalesData({
            totalSales: 0,
            totalRevenue: 0,
            lastMonthSales: 0,
            lastMonthRevenue: 0
          });
        }
        
        // Fetch seller info if available
        if (productData.seller?.id) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com'}/api/sellers/${productData.seller.id}`);
            if (response.ok) {
              const data = await response.json();
              setSellerInfo(data);
            }
          } catch (err) {
            console.error('Error fetching seller info:', err);
            // Set default seller info if API fails
            setSellerInfo({
              id: productData.seller.id,
              name: productData.seller.business_name || productData.seller.full_name || 'Unknown Seller',
              email: 'Not available',
              phone: 'Not available',
              joinDate: 'Not available'
            });
          }
        }
      } catch (err) {
        setError('Failed to load product. Please try again.');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle delete product
  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        if (product) {
          const success = await productService.deleteProduct(product.id);
          if (success) {
            alert(`Product ${product.name} deleted successfully!`);
            router.push('/admin/products');
          } else {
            throw new Error('Failed to delete product');
          }
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
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

  // Parse image URLs if they're stored as a JSON string
  let imageUrls: string[] = [];
  if (product.image_urls) {
    if (typeof product.image_urls === 'string') {
      try {
        imageUrls = JSON.parse(product.image_urls);
      } catch (e) {
        imageUrls = [product.image_urls];
      }
    } else if (Array.isArray(product.image_urls)) {
      imageUrls = product.image_urls;
    }
  }
  
  // Add main image if available and not already in the array
  if (product.image_url && !imageUrls.includes(product.image_url)) {
    imageUrls.unshift(product.image_url);
  }
  
  // If no images are available, use a placeholder
  if (imageUrls.length === 0) {
    imageUrls = ['/logo.png'];
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
          ${product.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {product.is_featured ? 'Featured' : 'Standard'}
        </span>
        {product.is_new && (
          <span className="ml-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            New
          </span>
        )}
        {product.is_bestseller && (
          <span className="ml-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Bestseller
          </span>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Price</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(product.price)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className="text-xl font-bold mt-1">{product.stock_quantity} units</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="text-xl font-bold mt-1">{salesData?.totalSales || 0} units</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(salesData?.totalRevenue || 0)}</p>
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
                    src={imageUrls[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {imageUrls.map((image: string, index: number) => (
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
                      <p className="mt-1">{product.category_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created On</p>
                      <p className="mt-1">{formatDate(product.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="mt-1">{formatDate(product.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Seller</p>
                      <p className="mt-1">{product.seller?.business_name || product.seller?.full_name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">Brand</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{product.brand || 'Not specified'}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">Weight</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{product.weight ? `${product.weight} kg` : 'Not specified'}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">Dimensions</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{product.dimensions || 'Not specified'}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">HSN Code</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{product.hsn_code || 'Not specified'}</td>
                        </tr>
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
                    <p className="mt-1 text-lg font-medium">{sellerInfo?.name || product.seller?.business_name || product.seller?.full_name || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Seller ID</p>
                    <p className="mt-1">{sellerInfo?.id || product.seller?.id || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{sellerInfo?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{sellerInfo?.phone || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Region</p>
                    <p className="mt-1">{product.seller?.region || sellerInfo?.region || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="mt-1">{sellerInfo?.joinDate ? formatDate(sellerInfo.joinDate) : 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sales Data Tab */}
        {activeTab === 'sales' && (
          <div className="p-6">
            <div className="bg-white rounded-lg">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Units Sold</p>
                    <p className="mt-1 text-2xl font-bold">{salesData?.totalSales || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(salesData?.totalRevenue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Month Sales</p>
                    <p className="mt-1 text-xl">{salesData?.lastMonthSales || 0} units</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Month Revenue</p>
                    <p className="mt-1 text-xl">{formatCurrency(salesData?.lastMonthRevenue || 0)}</p>
                  </div>
                </div>
              </div>
              
              {!salesData && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                  <p>No sales data available for this product yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
