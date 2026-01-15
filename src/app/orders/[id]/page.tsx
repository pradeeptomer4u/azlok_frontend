'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import orderService, { Order } from '../../../services/orderService';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;
      
      setIsLoading(true);
      try {
        const data = await orderService.getOrderById(parseInt(orderId));
        if (data) {
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  if (authLoading || isLoading) {
    return (
      <div className="container-custom mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || error || !order) {
    return (
      <div className="container-custom mx-auto py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Order not found'}
        </div>
        <Link href="/orders" className="inline-block mt-4 text-green-600 hover:text-green-700">
          ← Back to Orders
        </Link>
      </div>
    );
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
        <Link href="/orders" className="text-green-600 hover:text-green-700 font-['Montserrat',sans-serif]">
          ← Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-['Playfair_Display',serif]">
              Order #{order.order_number}
            </h1>
            <p className="text-gray-600 mt-1 font-['Montserrat',sans-serif]">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 font-['Montserrat',sans-serif]">Shipping Address</h3>
            <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
              {order.shipping_address.full_name}<br />
              {order.shipping_address.address_line1}<br />
              {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
              {order.shipping_address.city}, {order.shipping_address.state}<br />
              {order.shipping_address.zip_code}<br />
              {order.shipping_address.phone_number}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 font-['Montserrat',sans-serif]">Payment Information</h3>
            <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
              <span className="font-medium">Method:</span> {order.payment_method}<br />
              <span className="font-medium">Status:</span> <span className="capitalize">{order.payment_status || 'Pending'}</span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 font-['Montserrat',sans-serif]">Delivery Information</h3>
            <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
              <span className="font-medium">Method:</span> {order.shipping_method}<br />
              {order.tracking_number && (
                <><span className="font-medium">Tracking:</span> {order.tracking_number}<br /></>
              )}
              {order.estimated_delivery && (
                <><span className="font-medium">Est. Delivery:</span> {new Date(order.estimated_delivery).toLocaleDateString('en-IN')}</>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif]">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <img
                src={item.product_image || '/placeholder.png'}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 font-['Montserrat',sans-serif]">{item.product_name}</h3>
                <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">Price: ₹{item.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 font-['Montserrat',sans-serif]">₹{item.total_price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif]">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600 font-['Montserrat',sans-serif]">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-['Montserrat',sans-serif]">
            <span>Tax</span>
            <span>₹{order.tax_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-['Montserrat',sans-serif]">
            <span>Shipping</span>
            <span>₹{order.shipping_cost.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600 font-['Montserrat',sans-serif]">
              <span>Discount</span>
              <span>-₹{order.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold text-gray-800 border-t border-gray-200 pt-2 font-['Montserrat',sans-serif]">
            <span>Total</span>
            <span>₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {order.tracking_number && (
        <div className="mt-6 text-center">
          <Link
            href={`/track?order=${order.order_number}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-['Montserrat',sans-serif]"
          >
            Track This Order
          </Link>
        </div>
      )}
    </div>
  );
}
