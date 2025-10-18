'use client';

import { apiRequest } from '../utils/apiRequest';
import { loadScript } from '../utils/loadScript';

/**
 * Interface for Razorpay order creation request
 */
export interface RazorpayOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  payment_capture?: boolean;
  order_id?: number | string; // Added order_id field
}

/**
 * Interface for Razorpay order response
 */
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Interface for Razorpay payment verification request
 */
export interface RazorpayVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Interface for Razorpay payment options
 */
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    animation?: boolean;
  };
}

/**
 * Interface for Razorpay success response
 */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Service for Razorpay integration
 */
const razorpayService = {
  /**
   * Load the Razorpay SDK
   */
  loadRazorpaySDK: async (): Promise<boolean> => {
    try {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      return true;
    } catch (error) {
      console.error('Failed to load Razorpay SDK:', error);
      return false;
    }
  },

  /**
   * Create a new Razorpay order
   * @param orderRequest - Order request data
   */
  createOrder: async (orderRequest: RazorpayOrderRequest): Promise<RazorpayOrderResponse | null> => {
    try {
      const response = await apiRequest<RazorpayOrderResponse>('/api/payments/razorpay/create-order', {
        method: 'POST',
        body: JSON.stringify(orderRequest)
      });
      return response || null;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return null;
    }
  },

  /**
   * Verify a Razorpay payment
   * @param verificationRequest - Payment verification data
   */
  verifyPayment: async (verificationRequest: RazorpayVerificationRequest): Promise<boolean> => {
    try {
      const response = await apiRequest<{ verified: boolean }>('/api/payments/razorpay/verify-payment', {
        method: 'POST',
        body: JSON.stringify(verificationRequest)
      });
      return response?.verified || false;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }
  },

  /**
   * Open Razorpay checkout modal
   * @param options - Razorpay options
   */
  openCheckout: (options: RazorpayOptions): void => {
    if (typeof window === 'undefined') {
      console.error('Cannot open Razorpay checkout on server side');
      return;
    }

    // Check if Razorpay is loaded
    if (!(window as any).Razorpay) {
      console.error('Razorpay SDK not loaded. Call loadRazorpaySDK first.');
      return;
    }

    try {
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay checkout:', error);
    }
  }
};

export default razorpayService;
