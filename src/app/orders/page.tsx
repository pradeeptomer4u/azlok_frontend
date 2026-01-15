'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import orderService, { Order } from '../../services/orderService';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="container-custom mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container-custom mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 font-['Playfair_Display',serif]">My Orders</h1>
        <p className="text-gray-600 mt-2 font-['Montserrat',sans-serif]">View and track all your orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">No orders yet</h3>
          <p className="text-gray-600 mb-6 font-['Montserrat',sans-serif]">Start shopping to place your first order</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-['Montserrat',sans-serif]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 font-['Montserrat',sans-serif]">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-800 font-['Montserrat',sans-serif]">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">Payment Status</p>
                      <p className="text-lg font-semibold text-gray-800 font-['Montserrat',sans-serif] capitalize">
                        {order.payment_status || 'Pending'}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-['Montserrat',sans-serif]">Items ({order.items.length})</p>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.product_image || '/placeholder.png'}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 font-['Montserrat',sans-serif]">{item.product_name}</p>
                              <p className="text-xs text-gray-600 font-['Montserrat',sans-serif]">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 font-['Montserrat',sans-serif]">
                              ₹{item.total_price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
                            +{order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors font-['Montserrat',sans-serif]"
                    >
                      View Details
                    </Link>
                    {order.tracking_number && (
                      <Link
                        href={`/track?order=${order.order_number}`}
                        className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-['Montserrat',sans-serif]"
                      >
                        Track Order
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
