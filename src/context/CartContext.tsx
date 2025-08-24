'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateOrderTax, OrderTaxCalculationRequest, OrderTaxCalculationResponse } from '../utils/taxService';

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  seller: string;
  seller_id?: number;
  minOrder: number;
  tax_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  is_tax_inclusive?: boolean;
  hsn_code?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  totalPrice: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  shippingAmount: number;
  shippingTaxAmount: number;
  updateShippingAmount: (amount: number) => void;
  setBuyerState: (state: string) => void;
  setSellerState: (state: string) => void;
  calculateTaxes: () => Promise<void>;
  taxCalculationLoading: boolean;
  taxCalculationError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [shippingTaxAmount, setShippingTaxAmount] = useState(0);
  const [buyerState, setBuyerState] = useState<string>('');
  const [sellerState, setSellerState] = useState<string>('');
  const [taxCalculationLoading, setTaxCalculationLoading] = useState(false);
  const [taxCalculationError, setTaxCalculationError] = useState<string | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('azlok-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setItems([]);
      }
    }
  }, []);

  // Update localStorage and calculate totals whenever items change
  useEffect(() => {
    localStorage.setItem('azlok-cart', JSON.stringify(items));
    
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setItemCount(count);
    setSubtotal(subtotalPrice);
    
    // Calculate total with taxes
    const totalWithTaxes = subtotalPrice + taxAmount + shippingAmount + shippingTaxAmount;
    setTotalPrice(totalWithTaxes);
  }, [items, taxAmount, shippingAmount, shippingTaxAmount]);
  
  // Calculate taxes whenever items or shipping amount changes
  useEffect(() => {
    if (items.length > 0) {
      calculateTaxes();
    } else {
      // Reset tax values when cart is empty
      setTaxAmount(0);
      setCgstAmount(0);
      setSgstAmount(0);
      setIgstAmount(0);
      setShippingTaxAmount(0);
    }
  }, [items.length, shippingAmount, buyerState, sellerState]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setTaxAmount(0);
    setCgstAmount(0);
    setSgstAmount(0);
    setIgstAmount(0);
    setShippingAmount(0);
    setShippingTaxAmount(0);
  };
  
  const updateShippingAmount = (amount: number) => {
    setShippingAmount(amount);
  };
  
  const calculateTaxes = async () => {
    if (items.length === 0) return;
    
    setTaxCalculationLoading(true);
    setTaxCalculationError(null);
    
    try {
      const request: OrderTaxCalculationRequest = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        buyer_state: buyerState,
        seller_state: sellerState,
        shipping_amount: shippingAmount,
        apply_tax_to_shipping: true
      };
      
      const response = await calculateOrderTax(request);
      
      // Update tax amounts
      setTaxAmount(response.total_tax_amount);
      setCgstAmount(response.total_cgst_amount);
      setSgstAmount(response.total_sgst_amount);
      setIgstAmount(response.total_igst_amount);
      setShippingTaxAmount(response.shipping_tax_amount);
      
      // Update items with tax information
      setItems(prevItems => {
        return prevItems.map(item => {
          const itemWithTax = response.items.find(i => i.product_id === item.id);
          if (itemWithTax) {
            return {
              ...item,
              tax_amount: itemWithTax.unit_tax,
              cgst_amount: itemWithTax.unit_cgst,
              sgst_amount: itemWithTax.unit_sgst,
              igst_amount: itemWithTax.unit_igst,
              hsn_code: itemWithTax.hsn_code
            };
          }
          return item;
        });
      });
      
    } catch (error) {
      console.error('Error calculating taxes:', error);
      setTaxCalculationError('Failed to calculate taxes. Please try again.');
    } finally {
      setTaxCalculationLoading(false);
    }
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
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
    taxCalculationError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
