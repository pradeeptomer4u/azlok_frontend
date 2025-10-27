'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '../../context/CartContext';
import { formatCurrency } from '@/utils/taxService';

const CartItems = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      try {
        // Force the event to be processed in the next tick to avoid React state update conflicts
        setTimeout(() => {
          updateQuantity(id, newQuantity);
        }, 0);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      setIsRemoving(id);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force the event to be processed in the next tick to avoid React state update conflicts
      setTimeout(async () => {
        try {
          await removeItem(id);
        } catch (innerError) {
          console.error('Error in removeItem:', innerError);
        } finally {
          setIsRemoving(null);
        }
      }, 0);
    } catch (error) {
      setIsRemoving(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 font-['Playfair_Display',serif]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">
            Your Items
          </span>
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="space-y-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4ade80]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row">
              {/* Product Image with hover effect */}
              <div className="relative w-full sm:w-40 h-40 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 via-transparent to-[#38bdf8]/5"></div>
                <Image
                  src={item.image || '/globe.svg'}
                  alt={item.name}
                  fill
                  className={`object-cover transition-transform duration-700 ${hoveredItem === item.id ? 'scale-110' : 'scale-100'}`}
                />
                {item.is_tax_inclusive && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Tax Inclusive
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex-1 p-4 sm:p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#2c7a4c] transition-colors">
                      {item.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#1d6fb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {item.seller || 'Unknown Seller'}
                    </p>
                    {item.hsn_code && (
                      <p className="text-xs text-gray-500 mt-1">
                        HSN: {item.hsn_code}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-medium text-[#2c7a4c]">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      per unit
                    </p>
                  </div>
                </div>
                
                {/* Quantity Controls and Remove Button */}
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-3">Quantity:</span>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuantityChange(item.id, item.quantity - 1);
                        }}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 active:bg-gray-200 z-10"
                        disabled={item.quantity <= (item.minOrder || 1)}
                        type="button"
                        aria-label="Decrease quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 text-gray-700 font-medium bg-white">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuantityChange(item.id, item.quantity + 1);
                        }}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 active:bg-gray-200 z-10"
                        type="button"
                        aria-label="Increase quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center justify-center sm:justify-start px-4 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/30 active:bg-red-100 z-10"
                    disabled={isRemoving === item.id}
                    type="button"
                    aria-label="Remove item"
                  >
                    {isRemoving === item.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Removing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Price Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                    <span className="text-lg font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  
                  {item.tax_amount !== undefined && item.tax_amount > 0 && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Tax Amount:</span>
                        <span>{formatCurrency(item.tax_amount * item.quantity)}</span>
                      </div>
                      
                      <div className="space-y-1">
                        {item.cgst_amount !== undefined && item.cgst_amount > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>CGST:</span>
                            <span>{formatCurrency(item.cgst_amount * item.quantity)}</span>
                          </div>
                        )}
                        {item.sgst_amount !== undefined && item.sgst_amount > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>SGST:</span>
                            <span>{formatCurrency(item.sgst_amount * item.quantity)}</span>
                          </div>
                        )}
                        {item.igst_amount !== undefined && item.igst_amount > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>IGST:</span>
                            <span>{formatCurrency(item.igst_amount * item.quantity)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  );
};

export default CartItems;
