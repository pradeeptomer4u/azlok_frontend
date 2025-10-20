'use client';

import Link from 'next/link';
import CartItems from '../../components/cart/CartItems';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../context/CartContext';

export const runtime = "edge";

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
                <CartSummary />
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
