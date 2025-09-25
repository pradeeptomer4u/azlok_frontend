'use client';

import { CartItem } from '../../context/CartContext';
import { CheckoutSummary } from '../../services/checkoutService';
import { Button } from '../../components/ui/Button';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Spinner } from '../../components/ui/Spinner';
import Image from 'next/image';

interface OrderSummarySectionProps {
  items: CartItem[];
  summary: CheckoutSummary | null;
  error: string | null;
  placingOrder: boolean;
  onPlaceOrder: () => void;
  isDisabled: boolean;
}

export default function OrderSummarySection({
  items,
  summary,
  error,
  placingOrder,
  onPlaceOrder,
  isDisabled
}: OrderSummarySectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Calculate the actual subtotal from cart items
  const calculatedSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate the actual total
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
            <span>{formatPrice(calculatedSubtotal)}</span>
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
            <span>{formatPrice(calculatedTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button 
          className="w-full" 
          onClick={onPlaceOrder}
          disabled={isDisabled || placingOrder || !summary}
        >
          {placingOrder ? (
            <>
              <div className="mr-2 inline-block"><Spinner size="sm" /></div>
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </div>
  );
}
