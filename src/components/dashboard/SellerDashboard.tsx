'use client';

import { useState, useEffect } from 'react';
import TaxSummaryDashboard from './TaxSummaryDashboard';
import ProductManagement from './ProductManagement';
import { formatCurrency } from '../../utils/taxService';
import dashboardService, { SellerDashboardData, Order } from '../../services/dashboardService';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerData, setSellerData] = useState<SellerDashboardData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Seller ID would typically come from authentication context
  const sellerId = 1;

  // Fetch seller dashboard data from the API service
  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get seller dashboard data from the service
        const dashboardData = await dashboardService.getSellerDashboardData(sellerId);
        const orders = await dashboardService.getSellerRecentOrders(sellerId, 5);
        
        setSellerData(dashboardData);
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  if (isLoading || !sellerData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>
      
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap focus:outline-none ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap focus:outline-none ${
              activeTab === 'orders'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap focus:outline-none ${
              activeTab === 'products'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap focus:outline-none ${
              activeTab === 'tax'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => setActiveTab('tax')}
          >
            Tax Summary
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div>
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                <p className="text-2xl font-bold text-gray-800">{sellerData.totalProducts}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-800">{sellerData.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(sellerData.revenue)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                <p className="text-2xl font-bold text-gray-800">{sellerData.pendingOrders}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(order.tax_amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">All Orders</h2>
            <p className="text-gray-600">Order management functionality will be implemented here.</p>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManagement sellerId={sellerId} />
        )}

        {activeTab === 'tax' && (
          <TaxSummaryDashboard orders={recentOrders} />
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
