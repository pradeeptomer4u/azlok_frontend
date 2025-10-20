'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RazorpayCheckout from '../../../../components/payments/RazorpayCheckout';
import { ErrorAlert } from '../../../../components/ui/ErrorAlert';
import { Spinner } from '../../../../components/ui/Spinner';

export const runtime = "edge";

// Use a more flexible interface that can handle any fields from the API
interface OrderDetails {
  id: number;
  [key: string]: any; // Allow any fields that the API returns
}

function RazorpayCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing. Please go back to checkout.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Use a try-catch block to handle potential fetch errors
        try {
          // Use relative path or environment variable for API URL
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
          const response = await fetch(`${apiBaseUrl}/orders/${orderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('azlok-token') || ''}`
            }
          });
          
          if (!response.ok) {
            console.error(`API call failed to fetch order details: ${response.status}`);
            setError(`Unable to fetch order details: ${response.statusText}. Please try again.`);
            setLoading(false);
            return;
          }
          
          const data = await response.json();
          console.log('Order details:', data);
          
          // Use only data from API, no fallbacks
          if (!data || !data.id) {
            setError('Invalid order data received. Please try again.');
            return;
          }
          
          // Use exactly what the API returns
          setOrderDetails(data);
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          setError('Error fetching order details. Please try again.');
        }
      } catch (err) {
        console.error('Error in order details logic:', err);
        setError('Failed to process order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  
  // We'll use orderDetails directly instead of extracting the amount

  const handleSuccess = (paymentId: string) => {
    try {
      setIsSuccess(true);
      setPaymentId(paymentId);
      
      // Update payment status and redirect to order confirmation page
      if (orderId) {
        // Show success message for a moment before redirecting
        setTimeout(() => {
          try {
            router.push(`/order-confirmation?orderId=${orderId}&payment_id=${paymentId}`);
          } catch (redirectError) {
            console.error('Error during redirect:', redirectError);
            // Fallback to window.location if router fails
            window.location.href = `/order-confirmation?orderId=${orderId}&payment_id=${paymentId}`;
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error in success handler:', error);
      setError('Payment was successful, but there was an error processing the result.');
    }
  };

  const handleError = (errorMessage: string) => {
    try {
      console.error('Payment error:', errorMessage);
      setError(errorMessage || 'An error occurred during payment processing');
    } catch (error) {
      console.error('Error in error handler:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {loading ? 'Loading Order Details...' : 
         orderDetails && orderDetails.total_amount ? 
         `Complete Your Payment - ₹${Number(orderDetails.total_amount).toFixed(2)}` : 
         'Complete Your Payment'}
      </h1>
      
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
          <span className="ml-3 text-lg">Loading order details...</span>
        </div>
      )}
      
      {!loading && isSuccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Payment successful! Your payment ID is: <span className="font-medium">{paymentId}</span>
              </p>
            </div>
          </div>
        </div>
      ) : !loading && orderDetails ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Order Summary</h2>
            {orderDetails.subtotal_amount !== undefined && (
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>₹{Number(orderDetails.subtotal_amount).toFixed(2)}</span>
              </div>
            )}
            {orderDetails.shipping !== undefined && (
              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>₹{Number(orderDetails.shipping).toFixed(2)}</span>
              </div>
            )}
            {orderDetails.tax_amount !== undefined && (
              <div className="flex justify-between py-2 border-b">
                <span>Tax</span>
                <span>₹{Number(orderDetails.tax_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>₹{Number(orderDetails.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            {/* Wrap Razorpay component in error boundary */}
            <div className="razorpay-container">
              {orderDetails && orderDetails.total_amount > 0 ? (
                <RazorpayCheckout 
                  amount={orderDetails.total_amount}
                  currency="INR"
                  orderId={orderDetails.id}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
                  <p>Unable to determine payment amount from the order details. Please try again.</p>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Return to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !loading && !error ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600 py-8">
            No order details found. Please go back to checkout and try again.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors"
          >
            Return to Checkout
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function RazorpayCheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /><span className="ml-3 text-lg">Loading...</span></div>}>
      <RazorpayCheckoutContent />
    </Suspense>
  );
}
