'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '@/utils/taxService';

const CartSummary = () => {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    totalPrice, 
    taxAmount, 
    cgstAmount, 
    sgstAmount, 
    igstAmount, 
    shippingAmount, 
    shippingTaxAmount,
    updateShippingAmount,
    setBuyerState,
    setSellerState,
    calculateTaxes,
    taxCalculationLoading,
    taxCalculationError,
    clearCart,
    fetchCartSummary,
    isAuthenticated
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedBuyerState, setSelectedBuyerState] = useState('');
  const [selectedSellerState, setSelectedSellerState] = useState('');

  // Calculate final total
  const shipping = shippingAmount || (items.length > 0 ? 15 : 0);
  const total = totalPrice - couponDiscount;
  
  // Fetch cart summary on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      // Map shipping amount to shipping method ID
      const shippingMethodId = shipping === 0 ? 1 : 
                              shipping === 15 ? 2 : 
                              shipping === 30 ? 3 : 4;
      fetchCartSummary(shippingMethodId);
    }
  }, [isAuthenticated, items.length, shipping, fetchCartSummary]);
  
  // Update shipping amount when it changes
  const handleShippingChange = (amount: number) => {
    updateShippingAmount(amount);
  };
  
  // Handle state selection for tax calculation
  const handleBuyerStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedBuyerState(state);
    setBuyerState(state);
  };
  
  const handleSellerStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedSellerState(state);
    setSellerState(state);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Simulate API call to validate coupon
    setCouponError('');
    setIsProcessing(true);
    
    setTimeout(() => {
      // Mock coupon validation
      if (couponCode.toUpperCase() === 'AZLOK10') {
        const discount = subtotal * 0.1; // 10% discount
        setCouponDiscount(discount);
        setCouponError('');
      } else {
        setCouponDiscount(0);
        setCouponError('Invalid coupon code');
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Redirect to checkout page
    router.push('/checkout');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">

      
      {/* Coupon Section */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80]/10 to-[#38bdf8]/10 rounded-lg blur-sm"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Apply Coupon
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80]"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isProcessing}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 text-sm font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying
                  </span>
                ) : 'Apply'}
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            {couponDiscount > 0 && <p className="text-green-600 text-xs mt-2 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Coupon applied successfully!</p>}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none font-medium"
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span>Proceed to Checkout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </button>
        
        <button
          onClick={clearCart}
          className="w-full bg-white text-gray-600 border border-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          disabled={items.length === 0 || isProcessing}
        >
          Clear Cart
        </button>
      </div>
      
      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2c7a4c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-gray-500 mt-1">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1d6fb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs text-gray-500 mt-1">100% Authentic</span>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-xs text-gray-500 mt-1">Easy Returns</span>
          </div>
        </div>
      </div>
      
      {/* Terms */}
      <div className="mt-6 text-xs text-center text-gray-500">
        <p>By proceeding to checkout, you agree to our <a href="#" className="text-[#1d6fb8] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1d6fb8] hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default CartSummary;
