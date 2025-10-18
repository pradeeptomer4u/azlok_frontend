'use client';

import { fetchWithAuth } from '../utils/api';

export interface ShippingAddress {
  id: number;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone_number: string;
  is_default?: boolean;
}

export interface PaymentMethod {
  id: number;
  method_type: string;
  provider: string;
  is_default: boolean;
  card_last_four?: string;
  card_expiry_month?: string;
  card_expiry_year?: string;
  card_holder_name?: string;
  upi_id?: string;
  bank_name?: string;
  account_last_four?: string;
  account_holder_name?: string;
  wallet_provider?: string;
  wallet_id?: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderRequest {
  shipping_address_id: number;
  shipping_method_id: number;
  payment_method_id: number;
  cart_id?: number;
}

export interface OrderResponse {
  order_id: number;
  id: number;
}

const checkoutService = {
  // Get user's saved shipping addresses
  getShippingAddresses: async (): Promise<{ data: ShippingAddress[], error: string | null }> => {
    try {
      // Make sure we're using the correct endpoint format with trailing slash
      const response = await fetchWithAuth('/api/users/addresses/');
      
      if (!response.ok) {
        let errorMessage = 'Unable to load your saved addresses.';
        
        if (response.status === 401) {
          errorMessage = 'Please log in to view your saved addresses.';
        } else if (response.status === 422) {
          // Try to parse the error response for more details
          try {
            const errorData = await response.json();
            if (errorData && errorData.detail) {
              const detail = errorData.detail;
              if (Array.isArray(detail) && detail.length > 0) {
                const firstError = detail[0];
                errorMessage = `Validation error: ${firstError.msg || 'Invalid data format'}`;
              } else if (typeof detail === 'string') {
                errorMessage = `Error: ${detail}`;
              }
            }
          } catch (parseError) {
            errorMessage = 'Invalid data format.';
          }
        } else if (response.status === 404) {
          errorMessage = 'Address service is not available. Please try again later.';
        } else if (response.status === 405) {
          errorMessage = 'Unable to load addresses due to server configuration.';
        }
        
        return { data: [], error: errorMessage };
      }
      
      const data = await response.json();
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
      return { data: [], error: 'Unable to load your saved addresses. Please try again later.' };
    }
  },

  // Add a new shipping address
  addShippingAddress: async (address: ShippingAddress): Promise<{ data: ShippingAddress | null, error: string | null }> => {
    try {
      // Create a properly formatted address object that matches the backend schema
      const addressData = {
        full_name: address.full_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        country: address.country,
        zip_code: address.zip_code,
        phone_number: address.phone_number,
        is_default: true
      };
      
      // Make sure we're using the correct endpoint format with trailing slash
      const response = await fetchWithAuth('/api/users/addresses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to add shipping address. Please try again.';
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            const detail = errorData.detail;
            if (Array.isArray(detail) && detail.length > 0) {
              const firstError = detail[0];
              errorMessage = `Validation error: ${firstError.msg || 'Invalid data format'}`;
              console.log('Validation error details:', firstError);
            } else if (typeof detail === 'string') {
              errorMessage = `Error: ${detail}`;
            }
          }
        } catch (parseError) {
          // If we can't parse the error response, use default messages
          if (response.status === 422) {
            errorMessage = 'Invalid address information. Please check your inputs.';
          } else if (response.status === 401) {
            errorMessage = 'You need to be logged in to add an address.';
          } else if (response.status === 404) {
            errorMessage = 'Address service is not available. Please try again later.';
          } else if (response.status === 405) {
            errorMessage = 'Unable to add address due to server configuration.';
          }
        }
        
        return { data: null, error: errorMessage };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding shipping address:', error);
      return { data: null, error: 'Failed to add shipping address. Please try again.' };
    }
  },

  // Update an existing shipping address
  updateShippingAddress: async (id: number, address: ShippingAddress): Promise<{ data: ShippingAddress | null, error: string | null }> => {
    try {
      // First get the user ID from the me endpoint
      const userResponse = await fetchWithAuth('/api/users/me');
      if (!userResponse.ok) {
        return { data: null, error: 'Failed to get user information. Please try again.' };
      }
      const userData = await userResponse.json();
      const userId = Number(userData.id);

      // Create a properly formatted address object that matches the backend schema
      const addressData = {
        user_id: userId,
        full_name: address.full_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        country: address.country,
        zip_code: address.zip_code,
        phone_number: address.phone_number,
        is_default: true
      };
      
      const response = await fetchWithAuth(`/api/users/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to update shipping address. Please try again.';
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            const detail = errorData.detail;
            if (Array.isArray(detail) && detail.length > 0) {
              const firstError = detail[0];
              errorMessage = `Validation error: ${firstError.msg || 'Invalid data format'}`;
            } else if (typeof detail === 'string') {
              errorMessage = `Error: ${detail}`;
            }
          }
        } catch (parseError) {
          // If we can't parse the error response, use default messages
          if (response.status === 422) {
            errorMessage = 'Invalid address information. Please check your inputs.';
          } else if (response.status === 404) {
            errorMessage = 'Address not found or service unavailable.';
          } else if (response.status === 401) {
            errorMessage = 'You need to be logged in to update an address.';
          } else if (response.status === 405) {
            errorMessage = 'Unable to update address due to server configuration.';
          }
        }
        
        return { data: null, error: errorMessage };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`Error updating shipping address with ID ${id}:`, error);
      return { data: null, error: 'Failed to update shipping address. Please try again.' };
    }
  },

  // Delete a shipping address
  deleteShippingAddress: async (id: number): Promise<{ success: boolean, error: string | null }> => {
    try {
      // First get the user ID from the me endpoint
      const userResponse = await fetchWithAuth('/api/users/me');
      if (!userResponse.ok) {
        return { success: false, error: 'Failed to get user information. Please try again.' };
      }
      const userData = await userResponse.json();
      const userId = Number(userData.id);
      
      const response = await fetchWithAuth(`/api/users/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete shipping address. Please try again.';
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            const detail = errorData.detail;
            if (Array.isArray(detail) && detail.length > 0) {
              const firstError = detail[0];
              errorMessage = `Validation error: ${firstError.msg || 'Invalid data format'}`;
            } else if (typeof detail === 'string') {
              errorMessage = `Error: ${detail}`;
            }
          }
        } catch (parseError) {
          // If we can't parse the error response, use default messages
          if (response.status === 404) {
            errorMessage = 'Address not found or service unavailable.';
          } else if (response.status === 401) {
            errorMessage = 'You need to be logged in to delete an address.';
          } else if (response.status === 403) {
            errorMessage = 'You do not have permission to delete this address.';
          } else if (response.status === 405) {
            errorMessage = 'Unable to delete address due to server configuration.';
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error(`Error deleting shipping address with ID ${id}:`, error);
      return { success: false, error: 'Failed to delete shipping address. Please try again.' };
    }
  },

  // Get available payment methods
  getPaymentMethods: async (): Promise<{ data: PaymentMethod[], error: string | null }> => {
    try {
      const response = await fetchWithAuth('/api/payment-methods/');
      
      if (!response.ok) {
        await response.json(); // Error details
        let errorMessage = 'Unable to load payment methods. Please try again.';
        
        if (response.status === 404) {
          errorMessage = 'Payment methods service is not available.';
        } else if (response.status === 401) {
          errorMessage = 'You need to be logged in to view payment methods.';
        } else if (response.status === 500) {
          errorMessage = 'Payment methods service encountered an internal error.';
        }
        
        // Return mock payment methods if API fails
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 2,
            method_type: 'razorpay',
            provider: 'Razorpay',
            is_default: true
          }
        ];
        
        return { data: mockPaymentMethods, error: null };
      }
      
      const data = await response.json();
      
      // Check if Razorpay payment method exists in the response
      const hasRazorpay = data.some((method: PaymentMethod) => method.method_type.toLowerCase() === 'razorpay');
      
      // If Razorpay is not in the response, add it
      if (!hasRazorpay) {
        data.push({
          id: data.length + 1,
          method_type: 'razorpay',
          provider: 'Razorpay',
          is_default: false
        });
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      
      // Return mock payment methods if API fails
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 2,
          method_type: 'razorpay',
          provider: 'Razorpay',
          is_default: true
        }
      ];
      
      return { data: mockPaymentMethods, error: null };
    }
  },

  // Get available shipping methods
  getShippingMethods: async (): Promise<{ data: ShippingMethod[], error: string | null }> => {
    try {
      const response = await fetchWithAuth('/api/shipping/');
      
      if (!response.ok) {
        await response.json(); // Error details
        let errorMessage = 'Unable to load shipping methods. Please try again.';
        
        if (response.status === 404) {
          errorMessage = 'Shipping methods service is not available.';
        } else if (response.status === 401) {
          errorMessage = 'You need to be logged in to view shipping methods.';
        }
        
        return { data: [], error: errorMessage };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      return { data: [], error: 'Unable to load shipping methods. Please try again later.' };
    }
  },

  // Get checkout summary
  getCheckoutSummary: async (shippingMethodId?: number): Promise<{ data: CheckoutSummary | null, error: string | null }> => {
    try {
      if (!shippingMethodId) {
        return { data: null, error: 'Shipping method ID is required.' };
      }
      
      const response = await fetchWithAuth(`/api/cart-summary/?shipping_method_id=${shippingMethodId}`);
      
      if (!response.ok) {
        await response.json(); // Error details
        let errorMessage = 'Unable to load checkout summary. Please try again.';
        
        if (response.status === 404) {
          errorMessage = 'Checkout summary service is not available.';
        } else if (response.status === 401) {
          errorMessage = 'You need to be logged in to view checkout summary.';
        }
        
        return { data: null, error: errorMessage };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching checkout summary:', error);
      return { data: null, error: 'Unable to load checkout summary. Please try again later.' };
    }
  },

  // Place an order
  placeOrder: async (orderRequest: OrderRequest): Promise<{ orderId: number | null, error: string | null, paymentMethod?: string, redirectUrl?: string }> => {
    try {
      // Check if payment method is Razorpay
      const isRazorpay = orderRequest.payment_method_id === 2; // ID 2 is Razorpay in our mock data
      
      const response = await fetchWithAuth('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest),
      });
      
      if (!response.ok) {
        await response.json(); // Error details
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (response.status === 422) {
          errorMessage = 'Invalid order information. Please check your inputs.';
        } else if (response.status === 401) {
          errorMessage = 'You need to be logged in to place an order.';
        }
        
        return { orderId: null, error: errorMessage };
      }
      
      const data = await response.json();
      
      // Handle both response formats (id or order_id)
      const orderId = data.id || data.order_id;
      if (orderId) {
        // If payment method is Razorpay, return additional info for redirect
        if (isRazorpay) {
          return { 
            orderId, 
            error: null, 
            paymentMethod: 'razorpay',
            redirectUrl: `/checkout/payment/razorpay?orderId=${orderId}`
          };
        }
        
        return { orderId, error: null };
      }
      
      return { orderId: null, error: 'Invalid response from order service' };
    } catch (error) {
      console.error('Error placing order:', error);
      return { orderId: null, error: 'Failed to place order. Please try again.' };
    }
  }
};

export default checkoutService;
