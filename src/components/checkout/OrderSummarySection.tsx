'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '../../context/CartContext';
import { CheckoutSummary } from '../../services/checkoutService';
import { Button } from '../../components/ui/Button';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Spinner } from '../../components/ui/Spinner';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

interface OrderSummarySectionProps {
  items: CartItem[];
  summary: CheckoutSummary | null;
  error: string | null;
  placingOrder: boolean;
  onPlaceOrder: () => void;
  isDisabled: boolean;
  selectedShippingMethodId?: number | null;
}

export default function OrderSummarySection({
  items,
  summary: propSummary,
  error: propError,
  placingOrder,
  onPlaceOrder,
  isDisabled,
  selectedShippingMethodId
}: OrderSummarySectionProps) {
  const { isAuthenticated } = useAuth();
  const [cartSummary, setCartSummary] = useState<CheckoutSummary | null>(propSummary);
  const [error, setError] = useState<string | null>(propError);
  const [loading, setLoading] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Calculate the actual subtotal from cart items
  const calculatedSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Fetch cart summary directly from API
  useEffect(() => {
    const fetchCartSummary = async () => {
      if (!isAuthenticated || items.length === 0) return;
      
      // Don't fetch if no shipping method is selected
      if (!selectedShippingMethodId) return;
      
      try {
        setLoading(true);
        // Use the selected shipping method ID
        const response = await fetch(`https://api.azlok.com/api/cart-summary/?shipping_method_id=${selectedShippingMethodId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartSummary({
            subtotal: data.subtotal_amount || data.subtotal || calculatedSubtotal,
            shipping: data.shipping_cost || data.shipping || 0,
            tax: data.tax_amount || data.tax || 0,
            total: data.total_amount || data.total || calculatedSubtotal
          });
          setError(null);
        } else {
          console.error('Failed to fetch cart summary');
          setError('Failed to fetch cart summary');
        }
      } catch (err) {
        console.error('Error fetching cart summary:', err);
        setError('Error fetching cart summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartSummary();
  }, [isAuthenticated, items, selectedShippingMethodId]);
  
  // Use API-fetched summary or fallback to calculated values
  const summary = cartSummary || propSummary;
  const calculatedTotal = calculatedSubtotal + 
    (summary ? summary.shipping : 0) + 
    (summary ? summary.tax : 0);

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Order Summary</h3>
        <p className="text-sm text-gray-500">Review your order details</p>
      </div>
      
      <div className="p-4 space-y-4">
        {error && <ErrorAlert message={error} />}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Spinner size="md" />
            <span className="ml-2">Loading summary...</span>
          </div>
        )}
        
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(summary?.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{summary ? formatPrice(summary.shipping) : '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{summary ? formatPrice(summary.tax) : '—'}</span>
          </div>
          <div className="flex justify-between font-medium text-base pt-2 border-t">
            <span>Total</span>
            <span>{summary ? formatPrice(summary.total) : formatPrice(calculatedTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPlaceOrder();
          }}
          disabled={isDisabled || placingOrder || loading || !summary}
          className="w-full bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium touch-manipulation active:scale-95 text-base sm:text-lg"
        >
          {placingOrder ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
}
