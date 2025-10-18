'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import checkoutService, {
  ShippingAddress,
  PaymentMethod,
  ShippingMethod,
  CheckoutSummary,
  OrderRequest
} from '../../services/checkoutService';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import ShippingAddressSection from '../../components/checkout/ShippingAddressSection';
import PaymentMethodSection from '../../components/checkout/PaymentMethodSection';
import ShippingMethodSection from '../../components/checkout/ShippingMethodSection';
import OrderSummarySection from '../../components/checkout/OrderSummarySection';
import razorpayService, { RazorpayOptions, RazorpaySuccessResponse } from '../../services/razorpayService';
import { createPayment } from '../../services/paymentService';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, clearCart, subtotal, taxAmount } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Section-specific error messages
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentMethodError, setPaymentMethodError] = useState<string | null>(null);
  const [shippingMethodError, setShippingMethodError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // Selected options
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<number | null>(null);
  
  // Placing order
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    
    checkAuthAndLoadCheckoutData();
  }, []);

  useEffect(() => {
    if (selectedShippingMethodId) {
      updateCheckoutSummary();
    }
  }, [selectedShippingMethodId]);

  const checkAuthAndLoadCheckoutData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (authLoading) {
        return; // Wait for auth to load
      }
      
      if (items.length === 0) {
        setError('Your cart is empty. Please add items before checkout.');
        router.push('/cart');
        return;
      }
      
      // Continue loading checkout data if authenticated
      if (isAuthenticated) {
        // Load addresses
        console.log('Loading shipping addresses...');
        const addressesResponse = await checkoutService.getShippingAddresses();
        
        // Handle addresses
        if (addressesResponse.error) {
          console.error('Error loading addresses:', addressesResponse.error);
          setAddresses([]);
          setAddressError(addressesResponse.error);
        } else {
          setAddresses(addressesResponse.data);
          setAddressError(null);
          // Set defaults if available
          if (addressesResponse.data.length > 0) {
            setSelectedAddressId(addressesResponse.data[0].id);
          }
        }
        
        // Load payment methods
        console.log('Loading payment methods...');
        const paymentMethodsResponse = await checkoutService.getPaymentMethods();
        
        // Handle payment methods
        if (paymentMethodsResponse.error) {
          console.error('Error loading payment methods:', paymentMethodsResponse.error);
          setPaymentMethods([]);
          setPaymentMethodError(paymentMethodsResponse.error);
        } else {
          setPaymentMethods(paymentMethodsResponse.data);
          setPaymentMethodError(null);
          // Set default payment method
          if (paymentMethodsResponse.data.length > 0) {
            const defaultPayment = paymentMethodsResponse.data.find(pm => pm.is_default) || paymentMethodsResponse.data[0];
            setSelectedPaymentMethodId(defaultPayment.id);
          }
        }
        
        // Load shipping methods
        console.log('Loading shipping methods...');
        const shippingMethodsResponse = await checkoutService.getShippingMethods();
        
        // Handle shipping methods
        if (shippingMethodsResponse.error) {
          console.error('Error loading shipping methods:', shippingMethodsResponse.error);
          setShippingMethods([]);
          setShippingMethodError(shippingMethodsResponse.error);
        } else {
          setShippingMethods(shippingMethodsResponse.data);
          setShippingMethodError(null);
          // Set default shipping method
          if (shippingMethodsResponse.data.length > 0) {
            setSelectedShippingMethodId(shippingMethodsResponse.data[0].id);
            
            // Call checkout summary
            console.log('Loading checkout summary...');
            await updateCheckoutSummary();
          }
        }
      } else {
        // Not authenticated
        setError('Please sign in to proceed with checkout.');
        router.push('/login?redirect=/checkout');
      }
    } catch (err) {
      console.error('Error loading checkout data:', err);
      setError('Failed to load checkout information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCheckoutSummary = async () => {
    if (!selectedShippingMethodId) return;
    
    try {
      // Calculate subtotal from cart items
      const itemsSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      console.log('Calculated subtotal from items:', itemsSubtotal);
      
      // Direct API call to cart summary
      const response = await fetch(`https://api.azlok.com/api/cart-summary/?shipping_method_id=${selectedShippingMethodId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        }
      });
      
      if (!response.ok) {
        console.error('Error updating checkout summary');
        setSummaryError('Failed to calculate checkout summary');
        return;
      }
      
      const data = await response.json();
      console.log('Cart summary API response:', data);
      
      // Create summary from API response
      const apiSummary: CheckoutSummary = {
        subtotal: data.subtotal || itemsSubtotal,
        shipping: data.shipping_amount || 0,
        tax: data.tax_amount || 0,
        total: data.total || (itemsSubtotal + data.shipping_amount + data.tax_amount)
      };
      
      console.log('API checkout summary:', apiSummary);
      setSummary(apiSummary);
      setSummaryError(null);
    } catch (err) {
      console.error('Error updating checkout summary:', err);
      setSummaryError('Failed to calculate checkout summary');
    }
  };

  const handleAddAddress = async (address: ShippingAddress) => {
    try {
      setLoading(true);
      const response = await checkoutService.addShippingAddress(address);
      
      if (response.error) {
        console.error('Error adding address:', response.error);
        setAddressError(response.error);
      } else if (response.data) {
        // Successfully added the address
        setAddresses([...addresses, response.data]);
        setSelectedAddressId(response.data.id);
        setAddressError(null);
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setAddressError('Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // State for payment result modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  
  // Load Razorpay SDK on component mount
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  
  useEffect(() => {
    const loadRazorpaySDK = async () => {
      try {
        const loaded = await razorpayService.loadRazorpaySDK();
        setIsSDKLoaded(loaded);
        if (!loaded) {
          console.error('Failed to load Razorpay SDK');
        }
      } catch (err) {
        console.error('Error loading Razorpay SDK:', err);
      }
    };

    loadRazorpaySDK();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethodId || !selectedShippingMethodId) {
      setError('Please select shipping address, payment method, and shipping method.');
      return;
    }
    
    try {
      setPlacingOrder(true);
      
      const orderRequest: OrderRequest = {
        shipping_address_id: selectedAddressId,
        shipping_method_id: selectedShippingMethodId,
        payment_method_id: selectedPaymentMethodId
      };
      
      // Step 1: Create the order first
      const orderResponse = await checkoutService.placeOrder(orderRequest);
      
      if (orderResponse.error) {
        console.error('Error placing order:', orderResponse.error);
        setError(orderResponse.error);
        return;
      } 
      
      if (!orderResponse.orderId) {
        setError('Failed to place order. Please try again.');
        return;
      }
      
      // Step 2: Order created successfully
      const orderId = orderResponse.orderId;
      console.log('Order created successfully with ID:', orderId);
      
      // Always use Razorpay regardless of selected payment method
      // This ensures Razorpay is always called after order creation
      
      // Only proceed if SDK is loaded
      if (!isSDKLoaded) {
        setError('Payment gateway is not available. Please try again later.');
        return;
      }
      
      // Calculate total amount from summary
      const amount = summary?.total || 0;
      
      try {
        // Step 3: Create Razorpay order
        const razorpayOrderResponse = await razorpayService.createOrder({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${orderId}`,
          notes: {
            order_id: orderId.toString()
          }
        });

        if (!razorpayOrderResponse || !razorpayOrderResponse.id) {
          throw new Error('Failed to create payment order');
        }
        
        // Step 4: Configure Razorpay options
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: razorpayOrderResponse.amount,
          currency: razorpayOrderResponse.currency,
          name: 'Azlok',
          description: `Order #${orderId}`,
          image: '/logo.png',
          order_id: razorpayOrderResponse.id,
          handler: function(response) {
            console.log('Razorpay handler called with response:', response);
            
            // Immediately show the modal with loading state
            setError(null);
            setPaymentSuccess(true);
            setPaymentId(response.razorpay_payment_id || '');
            setShowPaymentModal(true);
            
            // Process payment verification and recording asynchronously
            (async function() {
              try {
                console.log('Starting payment verification...');
                // Step 5: Verify payment
                const isVerified = await razorpayService.verifyPayment({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                });
                
                console.log('Payment verification result:', isVerified);

                if (!isVerified) {
                  throw new Error('Payment verification failed');
                }

                // Step 6: Create payment record
                console.log('Creating payment record...');
                const payment = await createPayment({
                  amount: amount,
                  currency: 'INR',
                  order_id: orderId,
                  payment_method_id: 2, // Razorpay payment method ID
                  gateway: 'razorpay',
                  description: `Payment for Order #${orderId}`,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  is_installment: false,
                  is_recurring: false,
                  metadata: {
                    payment_date: new Date().toISOString(),
                    status: 'paid',
                    gateway_order_id: response.razorpay_order_id
                  }
                });
                
                console.log('Payment record created:', payment);

                // Clear cart
                clearCart();
                console.log('Cart cleared, payment flow complete!');
              } catch (err) {
                console.error('Error in payment processing:', err);
                // Update modal to show error
                setPaymentSuccess(false);
              } finally {
                setPlacingOrder(false);
              }
            })();
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: ''
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: function() {
              console.log('Razorpay modal dismissed');
              // Show our own modal with payment cancelled message
              setPaymentSuccess(false);
              setShowPaymentModal(true);
              setPlacingOrder(false);
            }
          }
        };

        // Step 7: Open Razorpay checkout
        razorpayService.openCheckout(options);
      } catch (err) {
        console.error('Error initiating payment:', err);
        setError('Failed to initiate payment. Please try again.');
        setPlacingOrder(false);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Spinner size="lg" />
        <p className="text-lg mt-4">Loading checkout information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <ErrorAlert message={error} />
        <Button onClick={() => router.push('/cart')} className="mt-4">
          Return to Cart
        </Button>
      </div>
    );
  }
  
  // Function to handle modal close and redirect to home page
  const handleCloseModal = () => {
    setShowPaymentModal(false);
    // Redirect to home page
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Payment Result Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl transform transition-all">
            <div className="text-center">
              {paymentSuccess ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  {paymentId && (
                    <p className="text-sm text-gray-500 mb-6">Payment ID: {paymentId}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-6">We couldn&apos;t process your payment. Please try again.</p>
                </>
              )}
              <button
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ShippingAddressSection 
            addresses={addresses} 
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            onAddAddress={handleAddAddress}
            error={addressError}
          />
          
          <PaymentMethodSection 
            paymentMethods={paymentMethods} 
            selectedPaymentMethodId={selectedPaymentMethodId}
            setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            error={paymentMethodError}
          />
          
          <ShippingMethodSection 
            shippingMethods={shippingMethods} 
            selectedShippingMethodId={selectedShippingMethodId}
            setSelectedShippingMethodId={setSelectedShippingMethodId}
            error={shippingMethodError}
          />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummarySection 
            items={items}
            summary={summary}
            error={summaryError}
            placingOrder={placingOrder}
            onPlaceOrder={handlePlaceOrder}
            isDisabled={!selectedAddressId || !selectedPaymentMethodId || !selectedShippingMethodId}
            selectedShippingMethodId={selectedShippingMethodId}
          />
        </div>
      </div>
    </div>
  );
}
