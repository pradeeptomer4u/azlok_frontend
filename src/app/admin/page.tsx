'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for the dashboard
const mockStats = {
  totalUsers: 1248,
  totalProducts: 3567,
  totalOrders: 892,
  totalRevenue: 1245789,
  pendingApprovals: 24,
  activeUsers: 876,
  recentOrders: [
    { id: 'ORD-9385', customer: 'Acme Corp', date: '2023-11-15', total: 12500, status: 'completed' },
    { id: 'ORD-9384', customer: 'XYZ Industries', date: '2023-11-15', total: 8750, status: 'processing' },
    { id: 'ORD-9383', customer: 'Global Traders', date: '2023-11-14', total: 5200, status: 'processing' },
    { id: 'ORD-9382', customer: 'Tech Solutions', date: '2023-11-14', total: 9300, status: 'completed' },
    { id: 'ORD-9381', customer: 'Mega Distributors', date: '2023-11-13', total: 15800, status: 'pending' },
  ],
  topProducts: [
    { id: 1, name: 'Industrial Machinery Part XYZ', sales: 145, revenue: 1812500 },
    { id: 2, name: 'Heavy Duty Electric Motor', sales: 98, revenue: 980000 },
    { id: 3, name: 'Precision Measuring Tool', sales: 87, revenue: 435000 },
    { id: 4, name: 'Industrial Safety Equipment', sales: 76, revenue: 380000 },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 850000 },
    { month: 'Feb', revenue: 920000 },
    { month: 'Mar', revenue: 880000 },
    { month: 'Apr', revenue: 950000 },
    { month: 'May', revenue: 1050000 },
    { month: 'Jun', revenue: 980000 },
    { month: 'Jul', revenue: 1100000 },
    { month: 'Aug', revenue: 1200000 },
    { month: 'Sep', revenue: 1150000 },
    { month: 'Oct', revenue: 1300000 },
    { month: 'Nov', revenue: 1250000 },
    { month: 'Dec', revenue: 0 }, // Current month
  ]
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{mockStats.totalUsers}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{mockStats.totalProducts}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              8%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{mockStats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              15%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(mockStats.totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              23%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Pending Approvals</h3>
              <p className="text-gray-500 text-sm">Products waiting for review</p>
            </div>
            <span className="text-2xl font-bold text-yellow-500">{mockStats.pendingApprovals}</span>
          </div>
          <div className="mt-4">
            <Link href="/admin/products/approvals" className="text-sm text-primary hover:text-primary-dark font-medium">
              Review Products →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Active Users</h3>
              <p className="text-gray-500 text-sm">Users active in last 30 days</p>
            </div>
            <span className="text-2xl font-bold text-green-500">{mockStats.activeUsers}</span>
          </div>
          <div className="mt-4">
            <Link href="/admin/users" className="text-sm text-primary hover:text-primary-dark font-medium">
              View All Users →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <p className="text-gray-500 text-sm">Common administrative tasks</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/admin/products/add" className="text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center">
              Add Product
            </Link>
            <Link href="/admin/categories/add" className="text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center">
              Add Category
            </Link>
            <Link href="/admin/users/add" className="text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center">
              Add User
            </Link>
            <Link href="/admin/reports" className="text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center">
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-primary hover:text-primary-dark font-medium">
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockStats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:text-primary-dark">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Top Selling Products</h3>
            <Link href="/admin/products" className="text-sm text-primary hover:text-primary-dark font-medium">
              View All Products
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockStats.topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales} units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/products/${product.id}`} className="text-primary hover:text-primary-dark">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
