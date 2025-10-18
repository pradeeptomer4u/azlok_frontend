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
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] py-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#4ade80]/10 to-transparent rounded-br-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#38bdf8]/10 to-transparent rounded-tl-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-tr from-[#f472b6]/10 to-transparent rounded-full blur-2xl"></div>
      
      {/* Animated floating shapes */}
      <div className="absolute top-20 right-1/4 w-8 h-8 border border-[#4ade80]/30 rounded-full opacity-60 animate-float-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 border border-[#38bdf8]/30 rounded-md rotate-45 opacity-40 animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/5 w-6 h-6 border border-[#f472b6]/30 rounded-md rotate-12 opacity-50 animate-float-fast"></div>
      
      {/* Payment Result Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-fade-in">
            <div className="text-center">
              {paymentSuccess ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/20 mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-pulse-slow bg-green-400/20"></div>
                    <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Playfair_Display',serif]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                      Payment Successful!
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  {paymentId && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                      <p className="text-sm text-gray-500">Payment ID: <span className="font-mono font-medium">{paymentId}</span></p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-500/20 to-red-400/20 mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-pulse-slow bg-red-400/20"></div>
                    <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Playfair_Display',serif]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                      Payment Failed
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6">We couldn&apos;t process your payment. Please try again.</p>
                </>
              )}
              <button
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-base font-medium text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c7a4c] transition-all transform hover:-translate-y-0.5"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-['Playfair_Display',serif]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">
              Secure Checkout
            </span>
          </h1>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2c7a4c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="ml-1 text-sm text-gray-600">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1d6fb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="ml-1 text-sm text-gray-600">100% Authentic</span>
            </div>
          </div>
        </div>
        
        {/* Checkout Progress Steps */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2c7a4c] text-white flex items-center justify-center font-medium">
                1
              </div>
              <span className="text-xs mt-1 text-gray-600">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className="h-full bg-[#2c7a4c] w-full"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2c7a4c] text-white flex items-center justify-center font-medium">
                2
              </div>
              <span className="text-xs mt-1 text-gray-600">Payment</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className="h-full bg-[#2c7a4c] w-0"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">
                3
              </div>
              <span className="text-xs mt-1 text-gray-600">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 animate-slide-up">
            {/* Shipping Address Section with enhanced styling */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4ade80]/10 to-[#38bdf8]/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#2c7a4c]/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2c7a4c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
                </div>
              </div>
              <div className="p-6">
                <ShippingAddressSection 
                  addresses={addresses} 
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  onAddAddress={handleAddAddress}
                  error={addressError}
                />
              </div>
            </div>
            
            {/* Payment Method Section with enhanced styling */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4ade80]/10 to-[#38bdf8]/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1d6fb8]/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1d6fb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                </div>
              </div>
              <div className="p-6">
                <PaymentMethodSection 
                  paymentMethods={paymentMethods} 
                  selectedPaymentMethodId={selectedPaymentMethodId}
                  setSelectedPaymentMethodId={setSelectedPaymentMethodId}
                  error={paymentMethodError}
                />
              </div>
            </div>
            
            {/* Shipping Method Section with enhanced styling */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4ade80]/10 to-[#38bdf8]/10 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Method</h2>
                </div>
              </div>
              <div className="p-6">
                <ShippingMethodSection 
                  shippingMethods={shippingMethods} 
                  selectedShippingMethodId={selectedShippingMethodId}
                  setSelectedShippingMethodId={setSelectedShippingMethodId}
                  error={shippingMethodError}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 animate-slide-left">
            <div className="sticky top-24">
              <OrderSummarySection 
                items={items}
                summary={summary}
                error={summaryError}
                placingOrder={placingOrder}
                onPlaceOrder={handlePlaceOrder}
                isDisabled={!selectedAddressId || !selectedPaymentMethodId || !selectedShippingMethodId}
                selectedShippingMethodId={selectedShippingMethodId}
              />
              
              {/* Trust Badges */}
              <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2c7a4c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1d6fb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Authentic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f472b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Support Farmers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
