'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import orderService, { Order } from '../../services/orderService';
import Link from 'next/link';

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    ordersPlaced: 0,
    activeOrders: 0,
    savedProducts: 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const data = await orderService.getOrders();
        setOrders(data);
        
        // Calculate stats
        const activeStatuses = ['pending', 'processing', 'shipped'];
        setStats({
          ordersPlaced: data.length,
          activeOrders: data.filter(order => activeStatuses.includes(order.status.toLowerCase())).length,
          savedProducts: 0 // TODO: Implement saved products API
        });
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

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
                  <span className="font-medium">{stats.ordersPlaced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Orders</span>
                  <span className="font-medium">{stats.activeOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved Products</span>
                  <span className="font-medium">{stats.savedProducts}</span>
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
            {orders.length > 0 ? (
              orders.slice(0, 3).map((order) => {
                const timeAgo = getTimeAgo(new Date(order.created_at));
                return (
                  <div key={order.id} className="border-l-4 border-primary pl-3 py-1">
                    <p className="text-sm font-medium">
                      Order #{order.order_number} - {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
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
