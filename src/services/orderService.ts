'use client';

import { fetchWithAuth } from '../utils/api';

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  shipping_address: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    phone_number: string;
  };
  shipping_method: string;
  payment_method: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total_price: number;
  tax_amount: number;
}

const orderService = {
  // Get all orders for the current user
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetchWithAuth('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  },

  // Get a specific order by ID
  getOrderById: async (id: number): Promise<Order | null> => {
    try {
      const response = await fetchWithAuth(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order #${id}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  },

  // Track an order by order number or tracking number
  trackOrder: async (orderIdentifier: string | number): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      // First, try to find the order by ID or order number using the dedicated tracking endpoint
      try {
        const trackEndpoint = `/api/orders/track/${orderIdentifier}`;
        const response = await fetchWithAuth(trackEndpoint);
        
        if (response.ok) {
          const orderData = await response.json();
          return { success: true, data: orderData };
        }
      } catch (orderTrackError: any) {
        console.log(`Order not found by tracking endpoint: ${orderTrackError?.message || 'Unknown error'}`);
      }
      
      // If that fails, try the regular order endpoint (requires authentication)
      try {
        const orderEndpoint = `/api/orders/${orderIdentifier}`;
        const response = await fetchWithAuth(orderEndpoint);
        
        if (response.ok) {
          const orderData = await response.json();
          return { success: true, data: orderData };
        }
      } catch (orderError: any) {
        console.log(`Order not found by order endpoint: ${orderError?.message || 'Unknown error'}`);
      }
      
      // If we get here, the order was not found by any method
      return { 
        success: false, 
        error: `Order #${orderIdentifier} not found. Please check your order number and try again.` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'An error occurred while tracking your order. Please try again later.' 
      };
    }
  },

  // Cancel an order
  cancelOrder: async (id: number): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`/api/orders/${id}/cancel`, {
        method: 'POST',
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id: number, paymentData: {
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    payment_id?: string;
    payment_details?: Record<string, any>;
  }): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`/api/orders/${id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

export default orderService;
