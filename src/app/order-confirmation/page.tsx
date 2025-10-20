'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, ShoppingBag, Truck, Clock, CreditCard, Banknote } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/card';
import Link from 'next/link';
import orderService from '../../services/orderService';
import RazorpayCheckout from '../../components/payments/RazorpayCheckout';

export const runtime = "edge";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || null;
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<'razorpay' | 'cod' | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
      {/* <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl mb-2">Thank you for your purchase</p>
        <p className="text-muted-foreground">
          Order #{orderId} has been placed successfully.
          {orderDetails?.email && ` A confirmation email has been sent to ${orderDetails.email}.`}
        </p>
      </div> */}
      
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
              <span>{orderDetails?.subtotal ? formatPrice(orderDetails.subtotal_amount) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{orderDetails?.shipping_cost ? formatPrice(orderDetails.shipping_amount) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{orderDetails?.tax_amount ? formatPrice(orderDetails.tax_amount) : '—'}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <span>Total</span>
              <span>{orderDetails?.total_amount ? formatPrice(orderDetails.total_amount) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm pt-4 border-t">
              <span>Payment Method</span>
              <span>
                {orderDetails?.payment_method === 'razorpay' && 'Razorpay'}
                {orderDetails?.payment_method === 'cash_on_delivery' && 'Cash on Delivery'}
                {!orderDetails?.payment_method && '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Status</span>
              <span>
                {orderDetails?.payment_status === 'paid' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                )}
                {orderDetails?.payment_status === 'pending' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
                {orderDetails?.payment_status === 'failed' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Failed
                  </span>
                )}
                {orderDetails?.payment_status === 'refunded' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Refunded
                  </span>
                )}
                {!orderDetails?.payment_status && '—'}
              </span>
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
      
      {showPaymentOptions && orderDetails?.payment_status !== 'paid' && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
            
            {paymentError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                </div>
              </div>
            )}
            
            {paymentSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Payment successful! Thank you for your order.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Razorpay Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${selectedPayment === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('razorpay')}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Pay with Razorpay</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">Pay securely using credit/debit card, UPI, or net banking</p>
              </div>
              
              {/* Cash on Delivery Option */}
              {/* <div 
                className={`border rounded-lg p-4 cursor-pointer ${selectedPayment === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => setSelectedPayment('cod')}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Banknote className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium">Pay on Delivery</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">Pay with cash or UPI when your order is delivered</p>
              </div> */}
            </div>
            
            <div className="mt-6">
              {selectedPayment === 'razorpay' && (
                <RazorpayCheckout 
                  amount={orderDetails?.total_amount || 0}
                  currency="INR"
                  orderId={orderDetails?.id}
                  onSuccess={async (paymentId) => {
                    try {
                      // Update order payment status
                      const updated = await orderService.updatePaymentStatus(parseInt(orderId!), {
                        payment_status: 'paid',
                        payment_method: 'razorpay',
                        payment_id: paymentId,
                        payment_details: {
                          payment_type: 'online',
                          gateway: 'razorpay'
                        }
                      });
                      
                      if (updated) {
                        setPaymentSuccess(true);
                        setShowPaymentOptions(false);
                        
                        // Update local order details
                        setOrderDetails({
                          ...orderDetails,
                          payment_status: 'paid',
                          payment_method: 'razorpay'
                        });
                      } else {
                        setPaymentError('Failed to update payment status. Please contact support.');
                      }
                    } catch (err) {
                      console.error('Error updating payment status:', err);
                      setPaymentError('An error occurred while processing your payment. Please contact support.');
                    }
                  }}
                  onError={(error) => {
                    setPaymentError(error);
                  }}
                />
              )}
              
              {selectedPayment === 'cod' && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={async () => {
                    try {
                      // Update order payment status
                      const updated = await orderService.updatePaymentStatus(parseInt(orderId!), {
                        payment_status: 'pending',
                        payment_method: 'cash_on_delivery',
                        payment_details: {
                          payment_type: 'cod'
                        }
                      });
                      
                      if (updated) {
                        setPaymentSuccess(true);
                        setShowPaymentOptions(false);
                        
                        // Update local order details
                        setOrderDetails({
                          ...orderDetails,
                          payment_status: 'pending',
                          payment_method: 'cash_on_delivery'
                        });
                      } else {
                        setPaymentError('Failed to update payment status. Please contact support.');
                      }
                    } catch (err) {
                      console.error('Error updating payment status:', err);
                      setPaymentError('An error occurred while processing your request. Please contact support.');
                    }
                  }}
                >
                  Confirm Cash on Delivery
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
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
