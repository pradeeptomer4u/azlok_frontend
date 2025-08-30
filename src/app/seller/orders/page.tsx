'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Types for API responses
interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email: string;
    company_name: string;
  };
  order_date: string;
  status: string;
  total_amount: number;
  items_count: number;
  payment_status: string;
  payment_method: string;
  payment_details: Record<string, unknown>;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  tracking_number?: string;
  notes?: string;
  order_items?: OrderItem[];
}


// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const statusText = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {statusText[status as keyof typeof statusText]}
    </span>
  );
};

// Payment status badge component
const PaymentBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    refunded: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
  };
  
  const statusText = {
    paid: 'Paid',
    pending: 'Pending',
    refunded: 'Refunded',
    failed: 'Failed',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {statusText[status as keyof typeof statusText]}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  
  const ordersPerPage = 10;
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('azlok-token');
        
        if (!token) {
          console.error('No authentication token found');
          setIsLoading(false);
          return;
        }
        
        // Construct query parameters for filtering and sorting
        const queryParams = new URLSearchParams();
        if (statusFilter !== 'all') queryParams.append('status', statusFilter);
        if (paymentFilter !== 'all') queryParams.append('payment_status', paymentFilter);
        if (searchTerm) queryParams.append('search', searchTerm);
        
        // Add sorting
        let sortField = 'order_date';
        let sortOrder = 'desc';
        
        switch (sortBy) {
          case 'date_asc':
            sortField = 'order_date';
            sortOrder = 'asc';
            break;
          case 'date_desc':
            sortField = 'order_date';
            sortOrder = 'desc';
            break;
          case 'total_asc':
            sortField = 'total_amount';
            sortOrder = 'asc';
            break;
          case 'total_desc':
            sortField = 'total_amount';
            sortOrder = 'desc';
            break;
          case 'id_asc':
            sortField = 'order_number';
            sortOrder = 'asc';
            break;
          case 'id_desc':
            sortField = 'order_number';
            sortOrder = 'desc';
            break;
        }
        
        queryParams.append('sort_by', sortField);
        queryParams.append('sort_order', sortOrder);
        
        // Add pagination
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', ordersPerPage.toString());
        
        const response = await fetch(`/api/seller/orders?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setOrders(data.items || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, paymentFilter, sortBy]);
  
  // We're handling filtering, sorting, and pagination on the server side
  // so we don't need to do it client-side anymore
  const currentOrders = orders;
  
  // We'll need to get the total count from the API response in a real implementation
  // For now, we'll just use the current orders length for the mock data
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage + 1;
  const indexOfLastOrder = Math.min(indexOfFirstOrder + ordersPerPage - 1, orders.length);
  
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle payment filter change
  const handlePaymentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600">Manage and track your customer orders</p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Orders
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Order ID or Customer"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                id="status-filter"
                name="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="payment-filter"
                name="payment-filter"
                value={paymentFilter}
                onChange={handlePaymentFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                id="sort-by"
                name="sort-by"
                value={sortBy}
                onChange={handleSortChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="total_desc">Amount (High to Low)</option>
                <option value="total_asc">Amount (Low to High)</option>
                <option value="id_desc">Order ID (Desc)</option>
                <option value="id_asc">Order ID (Asc)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No orders match your current filters.
              </p>
            </div>
          ) : (
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
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/seller/orders/${order.id}`} className="text-primary hover:text-primary-dark">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {order.user?.company_name?.charAt(0) || order.user?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.user?.company_name || order.user?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => window.print()}
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastOrder > orders.length ? orders.length : indexOfLastOrder}
                  </span>{' '}
                  of <span className="font-medium">{orders.length}</span> orders
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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
