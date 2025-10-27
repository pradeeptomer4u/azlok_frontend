'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateOrderTaxPublic, OrderTaxCalculationRequest } from '../utils/taxService';

export interface CartItem {
  id: number;
  cart_item_id?: number; // ID from the cart API for update/delete operations
  product_id: number; // The actual product ID
  name: string;
  image: string;
  price: number;
  quantity: number;
  seller: string;
  seller_id?: number;
  minOrder?: number; // Make this optional since it might not be provided by the API
  tax_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  is_tax_inclusive?: boolean;
  hsn_code?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void> | void;
  removeItem: (id: number) => Promise<void> | void;
  updateQuantity: (id: number, quantity: number) => Promise<void> | void;
  clearCart: () => Promise<void> | void;
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
  isAuthenticated: boolean;
  syncCartWithBackend: () => Promise<void>;
  fetchCartSummary: (shippingMethodId?: number) => Promise<void>;
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
  const [syncingCart, setSyncingCart] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('azlok-token');
      setIsAuthenticated(!!token);
    };
    
    // Check on initial load
    checkAuth();
    
    // Set up event listener for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for auth changes within the same window
    window.addEventListener('azlok-auth-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('azlok-auth-change', handleStorageChange);
    };
  }, []);

  // Sync cart with backend API
  const syncCartWithBackend = async () => {
    if (!isAuthenticated) return;
    
    try {
      setSyncingCart(true);
      
      // Get local cart items to sync
      const localCart = JSON.parse(localStorage.getItem('azlok-cart') || '[]');
      
      // If local cart has items, sync them to backend
      if (localCart.length > 0) {
        for (const item of localCart) {
          await addToCartAPI(item.product_id, item.quantity);
        }
      }
      
      // Get updated cart from backend
      await fetchCartFromAPI();
      
      // Get cart summary with tax and shipping calculations
      // Use shipping method ID 1 (Free) as default, will be updated when user selects shipping method
      await fetchCartSummary(1);
      
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    } finally {
      setSyncingCart(false);
    }
  };
  
  // Fetch cart from API
  const fetchCartFromAPI = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && Array.isArray(data.items)) {
          // Transform API response to match CartItem format
          const cartItems: CartItem[] = data.items.map((item: any) => ({
            id: item.id, // Use cart item ID for operations like update/delete
            cart_item_id: item.id, // Store the cart item ID separately
            product_id: item.product_id,
            name: item.product?.name || 'Product Name',
            price: item.product?.price || 0,
            quantity: item.quantity,
            image: item.product?.image_urls?.[0] || '/globe.svg',
            tax_amount: item.product?.tax_rate ? (item.product.price * item.product.tax_rate / 100) : 0,
            is_tax_inclusive: item.product?.is_tax_inclusive || false,
            hsn_code: item.product?.hsn_code || '',
            seller: item.product?.seller?.business_name || 'Unknown Seller'
          }));
          
          setItems(cartItems);
          
          // Update localStorage with the synced cart
          localStorage.setItem('azlok-cart', JSON.stringify(cartItems));
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart from API:', error);
    }
  };
  
  // Add item to cart via API
  const addToCartAPI = async (productId: number, quantity: number) => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        })
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('azlok-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Sync cart when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      syncCartWithBackend();
    }
  }, [isAuthenticated]);

  // Update cart in localStorage and calculate totals whenever items change
  useEffect(() => {
    // Only update localStorage if not authenticated or if we're not currently syncing
    if (!isAuthenticated || !syncingCart) {
      localStorage.setItem('azlok-cart', JSON.stringify(items));
    }
    
    // Calculate item count and subtotal
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setItemCount(count);
    setSubtotal(subtotalPrice);

    // Calculate total with taxes
    const totalWithTaxes = subtotalPrice + taxAmount + shippingAmount + shippingTaxAmount;
    setTotalPrice(totalWithTaxes);
  }, [items, taxAmount, shippingAmount, shippingTaxAmount, isAuthenticated, syncingCart]);

  // Calculate taxes whenever items or shipping amount changes
  // useEffect(() => {
  //   if (items.length > 0) {
  //     calculateTaxes();
  //   } else {
  //     // Reset tax values when cart is empty
  //     setTaxAmount(0);
  //     setCgstAmount(0);
  //     setSgstAmount(0);
  //     setIgstAmount(0);
  //     setShippingTaxAmount(0);
  //   }
  // }, [items.length, shippingAmount, buyerState, sellerState]);

  const addToCart = async (item: CartItem) => {
    // If user is authenticated, use API
    if (isAuthenticated) {
      const success = await addToCartAPI(item.id, item.quantity);
      if (success) {
        // Refresh cart from API to ensure consistency
        await fetchCartFromAPI();
        // Get updated cart summary with shipping method ID 1 (Free) as default
        await fetchCartSummary(1);
        return;
      }
      // If API call fails, fall back to local cart
    }
    
    // For unauthenticated users or if API call failed
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart via API
  const removeItemAPI = async (cartItemId: number) => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  };
  
  // Update item quantity via API
  const updateQuantityAPI = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        },
        body: JSON.stringify({ quantity })
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const removeItem = async (id: number) => {
    try {
      // If user is authenticated, use API
      if (isAuthenticated) {
        // Find the item to get its cart_item_id
        const item = items.find(item => item.id === id);
        if (!item) {
          return;
        }
        
        const cartItemId = item?.cart_item_id || id;
        
        const success = await removeItemAPI(cartItemId);
        if (success) {
          // Refresh cart from API
          await fetchCartFromAPI();
          // Get updated cart summary with shipping method ID 1 (Free) as default
          await fetchCartSummary(1);
          return;
        } else {
          console.error('API call to remove item failed');
        }
        // If API call fails, fall back to local cart
      }
      
      // For unauthenticated users or if API call failed
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      // Ensure we still update the local state even if there's an error
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(id);
        return;
      }
      
      // If user is authenticated, use API
      if (isAuthenticated) {
        // Find the item to get its cart_item_id
        const item = items.find(item => item.id === id);
        if (!item) {
          console.error(`Item with ID ${id} not found in cart`);
          return;
        }
        
        const cartItemId = item?.cart_item_id || id;
        
        const success = await updateQuantityAPI(cartItemId, quantity);
        if (success) {
          // Refresh cart from API
          await fetchCartFromAPI();
          // Get updated cart summary with shipping method ID 1 (Free) as default
          await fetchCartSummary(1);
          return;
        } else {
          console.error('API call to update quantity failed');
        }
        // If API call fails, fall back to local cart
      }
      
      // For unauthenticated users or if API call failed
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      // Ensure we still update the local state even if there's an error
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart via API
  const clearCartAPI = async () => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to clear cart via API:', error);
      return false;
    }
  };

  const clearCart = async () => {
    // If user is authenticated, use API
    if (isAuthenticated) {
      const success = await clearCartAPI();
      if (success) {
        // Reset local cart state
        setItems([]);
        setTaxAmount(0);
        setCgstAmount(0);
        setSgstAmount(0);
        setIgstAmount(0);
        setShippingAmount(0);
        setShippingTaxAmount(0);
        // No need to fetch cart summary since cart is empty
        return;
      }
      // If API call fails, fall back to local cart clear
    }
    
    // For unauthenticated users or if API call failed
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
    // Note: We're not calling fetchCartSummary here anymore
    // The shipping method ID mapping is handled in the CartSummary component
  };
  
  /**
   * Fetch cart summary with shipping and tax calculations
   * @param shippingMethodId The ID of the shipping method (1=Free, 2=Standard, 3=Express, 4=Premium)
   */
  const fetchCartSummary = async (shippingMethodId: number = 1) => {
    if (!isAuthenticated || items.length === 0) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart-summary/?shipping_method_id=${shippingMethodId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('azlok-token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update state with summary values
        setSubtotal(data.subtotal || 0);
        setShippingAmount(data.shipping_amount || 0);
        setTaxAmount(data.tax_amount || 0);
        setCgstAmount(data.cgst_amount || 0);
        setSgstAmount(data.sgst_amount || 0);
        setIgstAmount(data.igst_amount || 0);
        setShippingTaxAmount(data.shipping_tax_amount || 0);
        setTotalPrice(data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart summary:', error);
    }
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
      
      const response = await calculateOrderTaxPublic(request);
      
      // Update tax amounts
      setTaxAmount(response.total_tax_amount);
      setCgstAmount(response.total_cgst_amount);
      setSgstAmount(response.total_sgst_amount);
      setIgstAmount(response.total_igst_amount);
      setShippingTaxAmount(response.shipping_tax_amount);
      
      // Update items with tax information
      setItems(prevItems => {
        return prevItems.map(item => {
          const itemWithTax = response.items.find((i: { product_id: number }) => i.product_id === item.id);
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
      
      // Set a more specific error message if it's a 401 authentication error
      if (error instanceof Error && error.message.includes('401')) {
        setTaxCalculationError('Authentication required for tax calculation. Please log in to see accurate tax information.');
      } else {
        setTaxCalculationError('Failed to calculate taxes. Please try again later.');
      }
      
      // Reset tax values when calculation fails
      setTaxAmount(0);
      setCgstAmount(0);
      setSgstAmount(0);
      setIgstAmount(0);
      setShippingTaxAmount(0);
    } finally {
      setTaxCalculationLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    addItem: addToCart, // Use addToCart as addItem for backward compatibility
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
    taxCalculationError,
    isAuthenticated, // Expose authentication status
    syncCartWithBackend, // Expose sync function for manual triggering
    fetchCartSummary // Expose cart summary function
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
