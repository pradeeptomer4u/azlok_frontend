'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, ShoppingBag, Truck, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/card';
import Link from 'next/link';
import orderService from '../../services/orderService';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || null;
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(parseInt(orderId));
        if (response) {
          setOrderDetails(response);
        } else {
          setError('Order not found. Please check your order history.');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <ShoppingBag className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/account/orders">View Your Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl mb-2">Thank you for your purchase</p>
        <p className="text-muted-foreground">
          Order #{orderId} has been placed successfully.
          {orderDetails?.email && ` A confirmation email has been sent to ${orderDetails.email}.`}
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {orderDetails?.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="bg-muted h-12 w-12 rounded flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{orderDetails?.subtotal ? formatPrice(orderDetails.subtotal) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{orderDetails?.shipping_cost ? formatPrice(orderDetails.shipping_cost) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{orderDetails?.tax_amount ? formatPrice(orderDetails.tax_amount) : '—'}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <span>Total</span>
              <span>{orderDetails?.total_amount ? formatPrice(orderDetails.total_amount) : '—'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold">Shipping Details</h3>
            </div>
            <p className="font-medium">{orderDetails?.shipping_address?.full_name || 'N/A'}</p>
            <p>{orderDetails?.shipping_address?.address_line1 || 'N/A'}</p>
            {orderDetails?.shipping_address?.address_line2 && <p>{orderDetails.shipping_address.address_line2}</p>}
            <p>
              {orderDetails?.shipping_address?.city || 'N/A'}, {orderDetails?.shipping_address?.state || 'N/A'} {orderDetails?.shipping_address?.zip_code || 'N/A'}
            </p>
            <p>{orderDetails?.shipping_address?.country || 'N/A'}</p>
            <p className="mt-2">{orderDetails?.shipping_address?.phone_number || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold">Delivery Information</h3>
            </div>
            <p className="font-medium">{orderDetails?.shipping_method || 'Standard Shipping'}</p>
            <p className="text-muted-foreground">
              Estimated delivery: {orderDetails?.estimated_delivery || '3-5 business days'}
            </p>
            {orderDetails?.tracking_number && (
              <p className="mt-2">
                Tracking #: <span className="font-medium">{orderDetails.tracking_number}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/account/orders">
            View Your Orders
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
