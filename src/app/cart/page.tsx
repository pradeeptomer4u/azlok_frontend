'use client';

import Link from 'next/link';
import CartItems from '../../components/cart/CartItems';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items } = useCart();

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

      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between animate-slide-down">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-['Playfair_Display',serif]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">
                Your Shopping Cart
              </span>
            </h1>
            <div className="hidden md:block">
              <Link href="/products" className="text-[#2c7a4c] hover:text-[#1d6fb8] transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {items.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100 animate-slide-up">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-[#4ade80]/10 rounded-full animate-pulse-slow"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mx-auto text-[#2c7a4c]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mt-6 text-gray-800 font-['Playfair_Display',serif]">
                Your cart is waiting to be filled
              </h2>
              <p className="text-gray-600 mt-3 max-w-md mx-auto">
                Discover our range of natural products sourced directly from farmers and artisans.
              </p>
              <Link href="/products" className="mt-8 inline-block bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <span className="flex items-center">
                  <span>Explore Products</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
              <div className="lg:w-2/3">
                <CartItems />
              </div>
              <div className="lg:w-1/3">
                {/* Cart Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 lg:sticky lg:top-24">
                  {/* Coupon Section */}
                  <div className="mb-6">
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
                          />
                          <button
                            type="button"
                            className="bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white px-4 py-2 rounded-lg hover:shadow-md transition-all text-sm font-medium touch-manipulation"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/checkout">
                      <button
                        type="button"
                        className="w-full bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium touch-manipulation active:scale-95"
                      >
                        <span className="flex items-center justify-center">
                          <span>Proceed to Checkout</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex justify-center space-x-6">
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
                        <span className="text-xs text-gray-500 mt-1">Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile continue shopping link */}
          {items.length > 0 && (
            <div className="md:hidden text-center mt-6 animate-fade-in">
              <Link href="/products" className="text-[#2c7a4c] hover:text-[#1d6fb8] transition-colors inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
