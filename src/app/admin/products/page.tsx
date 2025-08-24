'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Industrial Machinery Part XYZ',
    sku: 'IMP-001',
    price: 12500,
    stock: 45,
    category: 'Machinery Parts',
    status: 'active',
    seller: 'ABC Manufacturing',
    image: '/logo.png'
  },
  {
    id: 2,
    name: 'Heavy Duty Electric Motor',
    sku: 'HDM-002',
    price: 10000,
    stock: 23,
    category: 'Electric Motors',
    status: 'active',
    seller: 'XYZ Industries',
    image: '/logo.png'
  },
  {
    id: 3,
    name: 'Precision Measuring Tool',
    sku: 'PMT-003',
    price: 5000,
    stock: 67,
    category: 'Measuring Tools',
    status: 'active',
    seller: 'Precision Tools Inc',
    image: '/logo.png'
  },
  {
    id: 4,
    name: 'Industrial Safety Equipment',
    sku: 'ISE-004',
    price: 5000,
    stock: 89,
    category: 'Safety Equipment',
    status: 'active',
    seller: 'SafetyFirst Ltd',
    image: '/logo.png'
  },
  {
    id: 5,
    name: 'Hydraulic Pump System',
    sku: 'HPS-005',
    price: 18500,
    stock: 12,
    category: 'Hydraulic Systems',
    status: 'pending',
    seller: 'FluidTech Solutions',
    image: '/logo.png'
  },
  {
    id: 6,
    name: 'Industrial Control Panel',
    sku: 'ICP-006',
    price: 8500,
    stock: 34,
    category: 'Control Systems',
    status: 'pending',
    seller: 'Control Systems Inc',
    image: '/logo.png'
  },
  {
    id: 7,
    name: 'Conveyor Belt System',
    sku: 'CBS-007',
    price: 22000,
    stock: 8,
    category: 'Material Handling',
    status: 'inactive',
    seller: 'ConveyTech Ltd',
    image: '/logo.png'
  },
  {
    id: 8,
    name: 'Industrial Air Compressor',
    sku: 'IAC-008',
    price: 15000,
    stock: 15,
    category: 'Pneumatic Systems',
    status: 'active',
    seller: 'AirPower Solutions',
    image: '/logo.png'
  },
  {
    id: 9,
    name: 'Welding Machine Pro',
    sku: 'WMP-009',
    price: 7500,
    stock: 28,
    category: 'Welding Equipment',
    status: 'active',
    seller: 'WeldTech Industries',
    image: '/logo.png'
  },
  {
    id: 10,
    name: 'Industrial Robotic Arm',
    sku: 'IRA-010',
    price: 85000,
    stock: 5,
    category: 'Robotics',
    status: 'pending',
    seller: 'RoboSystems Inc',
    image: '/logo.png'
  }
];

// Mock categories for filter
const mockCategories = [
  'All Categories',
  'Machinery Parts',
  'Electric Motors',
  'Measuring Tools',
  'Safety Equipment',
  'Hydraulic Systems',
  'Control Systems',
  'Material Handling',
  'Pneumatic Systems',
  'Welding Equipment',
  'Robotics'
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  
  const itemsPerPage = 10;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Filter and sort products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price_asc') {
      return a.price - b.price;
    } else if (sortBy === 'price_desc') {
      return b.price - a.price;
    } else if (sortBy === 'stock') {
      return b.stock - a.stock;
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle select all
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(product => product.id));
    }
    setIsSelectAll(!isSelectAll);
  };
  
  // Handle individual select
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;
    
    // In a real app, this would call an API
    alert(`${action} action on products: ${selectedProducts.join(', ')}`);
    
    // Reset selection
    setSelectedProducts([]);
    setIsSelectAll(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/admin/products/add" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by name or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {mockCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort"
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="stock">Stock (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-blue-700">{selectedProducts.length} products selected</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
            >
              Activate
            </button>
            <button 
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200"
            >
              Deactivate
            </button>
            <button 
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      checked={isSelectAll}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.seller}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}`} className="text-primary hover:text-primary-dark">
                        View
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
