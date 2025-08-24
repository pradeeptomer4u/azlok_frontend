'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import CartItems from '../../components/cart/CartItems';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
            <p className="text-gray-600 mt-2">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <CartItems />
            </div>
            <div className="lg:w-1/3">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
