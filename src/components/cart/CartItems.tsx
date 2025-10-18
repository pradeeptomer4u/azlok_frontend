'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '../../context/CartContext';
import { formatCurrency } from '@/utils/taxService';

const CartItems = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const [isRemoving, setIsRemoving] = useState<number | null>(null);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = async (id: number) => {
    setIsRemoving(id);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    removeItem(id);
    setIsRemoving(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="py-6 flex flex-col sm:flex-row">
            <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden relative mb-4 sm:mb-0">
              <Image
                src={item.image || '/globe.svg'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 sm:ml-6 flex flex-col">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900">{item.name || 'Product Name'}</h3>
                <p className="text-sm text-gray-500">Seller: {item.seller || 'Unknown Seller'}</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(item.price)}</p>
              </div>
              
              {item.minOrder && <p className="mt-1 text-sm text-gray-500">Min. Order: {item.minOrder} units</p>}
              {item.hsn_code && <p className="mt-1 text-sm text-gray-500">HSN Code: {item.hsn_code}</p>}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    disabled={item.quantity <= (item.minOrder || 1)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  disabled={isRemoving === item.id}
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
              
              <div className="mt-2 space-y-1">
                <div className="text-sm text-gray-700">
                  Subtotal: {formatCurrency(item.price * item.quantity)}
                </div>
                {item.tax_amount !== undefined && (
                  <div className="text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Tax Amount:</span>
                      <span>{formatCurrency(item.tax_amount * item.quantity)}</span>
                    </div>
                    {item.cgst_amount !== undefined && item.cgst_amount > 0 && (
                      <div className="flex justify-between">
                        <span>CGST:</span>
                        <span>{formatCurrency(item.cgst_amount * item.quantity)}</span>
                      </div>
                    )}
                    {item.sgst_amount !== undefined && item.sgst_amount > 0 && (
                      <div className="flex justify-between">
                        <span>SGST:</span>
                        <span>{formatCurrency(item.sgst_amount * item.quantity)}</span>
                      </div>
                    )}
                    {item.igst_amount !== undefined && item.igst_amount > 0 && (
                      <div className="flex justify-between">
                        <span>IGST:</span>
                        <span>{formatCurrency(item.igst_amount * item.quantity)}</span>
                      </div>
                    )}
                    {item.is_tax_inclusive !== undefined && (
                      <div className="text-xs italic">
                        {item.is_tax_inclusive ? 'Price is inclusive of all taxes' : 'Price is exclusive of taxes'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItems;
