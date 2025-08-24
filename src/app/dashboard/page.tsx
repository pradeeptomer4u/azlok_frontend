'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container-custom mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container-custom mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border border-gray-200">
            <img 
              src={user.avatar || '/globe.svg'} 
              alt={user.name} 
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            {user.role === 'buyer' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders Placed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Orders</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved Products</span>
                  <span className="font-medium">24</span>
                </div>
              </>
            )}
            {user.role === 'seller' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products Listed</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders Received</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Approvals</span>
                  <span className="font-medium">5</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-3 py-1">
              <p className="text-sm font-medium">Order #12345 was shipped</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-3 py-1">
              <p className="text-sm font-medium">Added new product to cart</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-3 py-1">
              <p className="text-sm font-medium">Updated account information</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user.role === 'buyer' && (
              <>
                <Link href="/orders" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors">
                  View Orders
                </Link>
                <Link href="/products" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors">
                  Browse Products
                </Link>
                <Link href="/profile" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors">
                  Edit Profile
                </Link>
              </>
            )}
            {user.role === 'seller' && (
              <>
                <Link href="/seller/products" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors">
                  Manage Products
                </Link>
                <Link href="/seller/orders" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors">
                  View Orders
                </Link>
                <Link href="/seller/add-product" className="block w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark rounded-md text-center transition-colors">
                  Add New Product
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
