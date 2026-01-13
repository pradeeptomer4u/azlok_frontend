'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';
import type { Invoice } from '@/types/invoice';
import { formatDate, formatCurrency } from '@/utils/formatters';

// This is a mock implementation - in a real app, you would fetch from your API
const fetchRecentOrders = async (): Promise<Order[]> => {
  // Placeholder for API call
  return [];
};

const fetchRecentInvoices = async (): Promise<Invoice[]> => {
  // Placeholder for API call
  // Mock data that matches the Invoice interface
  return [];
};

const AccountDashboard = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [orders, invoices] = await Promise.all([
          fetchRecentOrders(),
          fetchRecentInvoices(),
        ]);
        
        setRecentOrders(orders);
        setRecentInvoices(invoices);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <Link 
              href="/account/orders" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Loading recent orders...</p>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent orders found.</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
            <Link 
              href="/account/invoices" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Loading recent invoices...</p>
            ) : recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">Invoice #{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-500">{formatDate(invoice.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                      <p className="text-sm text-gray-500">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent invoices found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">My Profile</h3>
            <p className="text-sm text-gray-500 mb-4">Update your information. Change your preferences.</p>
            <Link 
              href="/account/profile" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Methods</h3>
            <p className="text-sm text-gray-500 mb-4">Manage payment methods. View transactions.</p>
            <Link 
              href="/account/payments" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Manage Payments
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">My Addresses</h3>
            <p className="text-sm text-gray-500 mb-4">Manage shipping addresses. Manage billing addresses.</p>
            <Link 
              href="/account/addresses" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Manage Addresses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
