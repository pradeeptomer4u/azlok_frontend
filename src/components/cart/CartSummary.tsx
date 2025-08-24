'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '@/utils/taxService';

const CartSummary = () => {
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
    clearCart 
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
    
    // Simulate checkout process
    setTimeout(() => {
      alert('Checkout functionality will be implemented in the next phase!');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border border-gray-300 rounded px-2 py-1"
              value={shipping}
              onChange={(e) => handleShippingChange(Number(e.target.value))}
            >
              <option value="0">Free Shipping</option>
              <option value="15">Standard Shipping (₹15)</option>
              <option value="30">Express Shipping (₹30)</option>
              <option value="50">Premium Shipping (₹50)</option>
            </select>
            {shippingTaxAmount > 0 && (
              <span className="text-xs text-gray-500">
                (Includes {formatCurrency(shippingTaxAmount)} tax)
              </span>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tax Amount</span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          
          {cgstAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>CGST</span>
              <span>{formatCurrency(cgstAmount)}</span>
            </div>
          )}
          
          {sgstAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>SGST</span>
              <span>{formatCurrency(sgstAmount)}</span>
            </div>
          )}
          
          {igstAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>IGST</span>
              <span>{formatCurrency(igstAmount)}</span>
            </div>
          )}
        </div>
        
        {/* State selection for tax calculation */}
        <div className="border-t border-gray-100 pt-2 pb-2">
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Your State (for tax calculation)</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
              value={selectedBuyerState}
              onChange={handleBuyerStateChange}
            >
              <option value="">Select State</option>
              <option value="AP">Andhra Pradesh</option>
              <option value="AR">Arunachal Pradesh</option>
              <option value="AS">Assam</option>
              <option value="BR">Bihar</option>
              <option value="CG">Chhattisgarh</option>
              <option value="GA">Goa</option>
              <option value="GJ">Gujarat</option>
              <option value="HR">Haryana</option>
              <option value="HP">Himachal Pradesh</option>
              <option value="JH">Jharkhand</option>
              <option value="KA">Karnataka</option>
              <option value="KL">Kerala</option>
              <option value="MP">Madhya Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="MN">Manipur</option>
              <option value="ML">Meghalaya</option>
              <option value="MZ">Mizoram</option>
              <option value="NL">Nagaland</option>
              <option value="OD">Odisha</option>
              <option value="PB">Punjab</option>
              <option value="RJ">Rajasthan</option>
              <option value="SK">Sikkim</option>
              <option value="TN">Tamil Nadu</option>
              <option value="TS">Telangana</option>
              <option value="TR">Tripura</option>
              <option value="UK">Uttarakhand</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="WB">West Bengal</option>
              <option value="AN">Andaman and Nicobar Islands</option>
              <option value="CH">Chandigarh</option>
              <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
              <option value="DL">Delhi</option>
              <option value="JK">Jammu and Kashmir</option>
              <option value="LA">Ladakh</option>
              <option value="LD">Lakshadweep</option>
              <option value="PY">Puducherry</option>
            </select>
          </div>
          
          <button
            onClick={() => calculateTaxes()}
            className="w-full bg-gray-100 text-gray-700 text-sm py-1 rounded hover:bg-gray-200 transition-colors"
            disabled={taxCalculationLoading}
          >
            {taxCalculationLoading ? 'Calculating...' : 'Recalculate Taxes'}
          </button>
          
          {taxCalculationError && (
            <p className="text-red-500 text-xs mt-1">{taxCalculationError}</p>
          )}
        </div>
        
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${couponDiscount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isProcessing}
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
        {couponDiscount > 0 && <p className="text-green-600 text-sm mt-1">Coupon applied successfully!</p>}
      </div>
      
      <div className="mt-6 space-y-3">
        <button
          onClick={handleCheckout}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
        </button>
        
        <button
          onClick={clearCart}
          className="w-full bg-white text-gray-600 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={items.length === 0 || isProcessing}
        >
          Clear Cart
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>By proceeding to checkout, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default CartSummary;
