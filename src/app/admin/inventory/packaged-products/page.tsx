'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import inventoryService, { PackagedProduct } from '../../../../services/inventoryService';

export const runtime = "edge";

export default function PackagedProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams?.get('filter') || null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [packagedProducts, setPackagedProducts] = useState<PackagedProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [products, setProducts] = useState<{id: number, name: string}[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [packagingSizes] = useState([
    { value: 'SIZE_50G', label: '50g' },
    { value: 'SIZE_100G', label: '100g' },
    { value: 'SIZE_500G', label: '500g' },
    { value: 'SIZE_1KG', label: '1kg' }
  ]);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Assuming there's a products API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) {
          console.error('Failed to fetch products:', response.status);
          setProducts([]); // Set empty array on error
          return;
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          console.error('Invalid products data format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPackagedProducts = async () => {
      try {
        setIsLoading(true);
        
        const params: any = {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (selectedProduct) {
          params.product_id = selectedProduct;
        }
        
        if (selectedSize) {
          params.packaging_size = selectedSize;
        }
        
        if (filter === 'low') {
          params.stock_status = 'low';
        } else if (filter === 'critical') {
          params.stock_status = 'critical';
        }
        
        const response = await inventoryService.getPackagedProducts(params) as { data: PackagedProduct[], meta: { total: number } };
        // Check if response and its properties exist before using them
        if (response && response.data) {
          setPackagedProducts(response.data);
          // Check if meta exists and has total property
          if (response.meta && typeof response.meta.total === 'number') {
            setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
          } else {
            setTotalPages(1); // Default to 1 page if meta data is missing
          }
        } else {
          // Handle empty or invalid response
          setPackagedProducts([]);
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error('Error fetching packaged products:', err);
        setError(err.message || 'Failed to load packaged products');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPackagedProducts();
  }, [currentPage, searchTerm, selectedProduct, selectedSize, filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this packaged product?')) {
      try {
        const response = await inventoryService.deletePackagedProduct(id) as { success?: boolean };
        if (response && response.success) {
          setPackagedProducts(packagedProducts.filter(item => item.id !== id));
        } else {
          throw new Error('Failed to delete packaged product');
        }
      } catch (err: any) {
        console.error('Error deleting packaged product:', err);
        alert(err.message || 'Failed to delete packaged product');
      }
    }
  };

  const formatPackagingSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      'SIZE_50G': '50g',
      'SIZE_100G': '100g',
      'SIZE_500G': '500g',
      'SIZE_1KG': '1kg'
    };
    
    return sizeMap[size] || size;
  };

  if (isLoading && packagedProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Packaged Products</h1>
        <Link 
          href="/admin/inventory/packaged-products/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Add Packaged Product
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by product name or barcode"
            />
          </div>
          
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              id="product"
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="packaging_size" className="block text-sm font-medium text-gray-700 mb-1">
              Packaging Size
            </label>
            <select
              id="packaging_size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Sizes</option>
              {packagingSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              id="filter"
              value={filter || ''}
              onChange={(e) => {
                const newFilter = e.target.value;
                const params = new URLSearchParams(searchParams?.toString() || '');
                
                if (newFilter) {
                  params.set('filter', newFilter);
                } else {
                  params.delete('filter');
                }
                
                router.push(`/admin/inventory/packaged-products?${params.toString()}`);
              }}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical Stock</option>
            </select>
          </div>
          
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Packaged Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packaging Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packagedProducts.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPackagingSize(item.packaging_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.weight_value} {item.weight_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.barcode || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.current_stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reorder_level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.current_stock <= item.min_stock_level ? 'bg-red-100 text-red-800' : 
                        item.current_stock <= item.reorder_level ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {item.current_stock <= item.min_stock_level ? 'Critical' : 
                       item.current_stock <= item.reorder_level ? 'Low' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/inventory/packaged-products/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </Link>
                    <Link href={`/admin/inventory/packaged-products/edit/${item.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {packagedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No packaged products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
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
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, packagedProducts.length + (currentPage - 1) * itemsPerPage)}
                  </span>{' '}
                  of <span className="font-medium">{packagedProducts.length + (currentPage - 1) * itemsPerPage}</span> results
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
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === totalPages
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
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
