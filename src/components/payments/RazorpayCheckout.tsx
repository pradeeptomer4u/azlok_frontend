'use client';

import { useState, useEffect } from 'react';
import razorpayService, { RazorpayOptions, RazorpaySuccessResponse } from '../../services/razorpayService';
import { createPayment } from '../../services/paymentService';
import { Button } from '../ui/Button';
import { ErrorAlert } from '../ui/ErrorAlert';

interface RazorpayCheckoutProps {
  amount: number;
  currency?: string;
  orderId?: number;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function RazorpayCheckout({
  amount,
  currency = 'INR',
  orderId,
  onSuccess,
  onError
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // Load Razorpay SDK on component mount
  useEffect(() => {
    const loadSDK = async () => {
      try {
        const loaded = await razorpayService.loadRazorpaySDK();
        setIsSDKLoaded(loaded);
        if (!loaded) {
          setError('Failed to load Razorpay SDK. Please try again later.');
        }
      } catch (err) {
        setError('Failed to load Razorpay SDK. Please try again later.');
        console.error('Error loading Razorpay SDK:', err);
      }
    };

    loadSDK();
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Razorpay order
      const orderResponse = await razorpayService.createOrder({
        amount: amount, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          order_id: orderId ? orderId.toString() : ''
        }
      });

      if (!orderResponse || !orderResponse.id) {
        throw new Error('Failed to create Razorpay order');
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SGPt4X2kAL4DhN',
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Azlok',
        description: 'Purchase from Azlok',
        image: '/logo.png',
        order_id: orderResponse.id,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Verify payment
            const isVerified = await razorpayService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (!isVerified) {
              throw new Error('Payment verification failed');
            }

            // Create payment record matching backend schema
            const payment = await createPayment({
              amount,
              currency,
              order_id: orderId,
              payment_method_id: 2, // Assuming 2 is Razorpay payment method ID
              gateway: 'razorpay',
              description: 'Payment via Razorpay',
              // Razorpay specific fields
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              // Default values for required fields
              is_installment: false,
              is_recurring: false,
              // Store additional data in metadata
              metadata: {
                payment_date: new Date().toISOString(),
                status: 'paid',
                gateway_order_id: response.razorpay_order_id
              }
            });

            if (!payment) {
              throw new Error('Failed to record payment');
            }

            // Call success callback
            if (onSuccess) {
              onSuccess(response.razorpay_payment_id);
            }
          } catch (err) {
            console.error('Error processing payment:', err);
            if (onError) {
              onError('Payment processing failed. Please try again.');
            }
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      razorpayService.openCheckout(options);
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError('Failed to initiate payment. Please try again.');
      if (onError) {
        onError('Failed to initiate payment. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && <ErrorAlert message={error} />}
      <Button
        onClick={handlePayment}
        disabled={isLoading || !isSDKLoaded}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? 'Processing...' : 'Pay with Razorpay'}
      </Button>
    </div>
  );
}
