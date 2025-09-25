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
      
      const summaryResponse = await checkoutService.getCheckoutSummary(selectedShippingMethodId);
      
      if (summaryResponse.error) {
        console.error('Error updating checkout summary:', summaryResponse.error);
        setSummaryError(summaryResponse.error);
      } else if (summaryResponse.data) {
        // Calculate tax based on the correct subtotal (10% tax rate)
        const taxRate = 0.1; // 10%
        const calculatedTax = itemsSubtotal * taxRate;
        
        // Make sure we're using the correct subtotal from cart items
        const correctedSummary: CheckoutSummary = {
          subtotal: itemsSubtotal,
          shipping: summaryResponse.data.shipping || 0,
          tax: calculatedTax,
          // Recalculate total based on the correct subtotal and tax
          total: itemsSubtotal + (summaryResponse.data.shipping || 0) + calculatedTax
        };
        
        console.log('Corrected checkout summary:', correctedSummary);
        setSummary(correctedSummary);
        setSummaryError(null);
      }
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
      
      const orderResponse = await checkoutService.placeOrder(orderRequest);
      
      if (orderResponse.error) {
        console.error('Error placing order:', orderResponse.error);
        setError(orderResponse.error);
      } else if (orderResponse.orderId) {
        // Clear cart and redirect to order confirmation page
        clearCart();
        router.push(`/order-confirmation?orderId=${orderResponse.orderId}`);
      } else {
        setError('Failed to place order. Please try again.');
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
        <Button onClick={() => router.push('/cart')} className="mt-4">Return to Cart</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
          />
        </div>
      </div>
    </div>
  );
}
