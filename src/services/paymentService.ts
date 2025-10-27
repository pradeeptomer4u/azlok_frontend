import { apiRequest } from '../utils/apiRequest';
import { 
  Payment, 
  PaymentCreate, 
  PaymentUpdate, 
  PaymentMethod, 
  PaymentMethodCreate, 
  PaymentMethodUpdate,
  Transaction,
  InstallmentPlan,
  InstallmentPlanCreate,
  PaymentListResponse,
  PaymentSummary,
  PaymentFilters,
  TransactionFilters
} from '../types/payment';

// Payment Methods API
export const getPaymentMethods = async (activeOnly: boolean = true): Promise<PaymentMethod[]> => {
  try {
    const response = await apiRequest<PaymentMethod[]>(`/api/payments/methods?active_only=${activeOnly}`);
    return response || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const getPaymentMethod = async (id: number): Promise<PaymentMethod | null> => {
  try {
    const response = await apiRequest<PaymentMethod>(`/api/payments/methods/${id}`);
    return response || null;
  } catch (error) {
    console.error(`Error fetching payment method with ID ${id}:`, error);
    return null;
  }
};

export const createPaymentMethod = async (paymentMethod: PaymentMethodCreate): Promise<PaymentMethod | null> => {
  try {
    const response = await apiRequest<PaymentMethod>('/api/payments/methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethod)
    });
    return response || null;
  } catch (error) {
    console.error('Error creating payment method:', error);
    return null;
  }
};

export const updatePaymentMethod = async (id: number, paymentMethod: PaymentMethodUpdate): Promise<PaymentMethod | null> => {
  try {
    const response = await apiRequest<PaymentMethod>(`/api/payments/methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentMethod)
    });
    return response || null;
  } catch (error) {
    console.error(`Error updating payment method with ID ${id}:`, error);
    return null;
  }
};

export const deletePaymentMethod = async (id: number): Promise<boolean> => {
  try {
    await apiRequest(`/api/payments/methods/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error(`Error deleting payment method with ID ${id}:`, error);
    return false;
  }
};

// Payments API
export const getPayments = async (filters: PaymentFilters = {}): Promise<PaymentListResponse> => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await apiRequest<PaymentListResponse>(`/api/payments${queryString}`);
    
    return response || { 
      payments: [], 
      total: 0, 
      page: filters.page || 1, 
      size: filters.size || 10, 
      pages: 0 
    };
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { 
      payments: [], 
      total: 0, 
      page: filters.page || 1, 
      size: filters.size || 10, 
      pages: 0 
    };
  }
};

export const getPayment = async (id: number): Promise<Payment | null> => {
  try {
    const response = await apiRequest<Payment>(`/api/payments/${id}`);
    return response || null;
  } catch (error) {
    console.error(`Error fetching payment with ID ${id}:`, error);
    return null;
  }
};

export const createPayment = async (payment: PaymentCreate): Promise<Payment | null> => {
  try {
    // Prepare payment data according to backend schema
    const paymentData = {
      ...payment,
      // Ensure required fields have defaults
      is_installment: payment.is_installment ?? false,
      is_recurring: payment.is_recurring ?? false,
      
      // If Razorpay-specific fields are provided, add them to gateway_response
      ...(payment.razorpay_order_id || payment.razorpay_payment_id || payment.razorpay_signature ? {
        gateway_payment_id: payment.razorpay_payment_id,
        gateway_response: {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature
        }
      } : {})
    };
    
    
    const response = await apiRequest<Payment>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    
    return response || null;
  } catch (error) {
    console.error('Error creating payment:', error);
    return null;
  }
};

export const updatePayment = async (id: number, payment: PaymentUpdate): Promise<Payment | null> => {
  try {
    const response = await apiRequest<Payment>(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment)
    });
    return response || null;
  } catch (error) {
    console.error(`Error updating payment with ID ${id}:`, error);
    return null;
  }
};

export const refundPayment = async (id: number, amount: number, reason?: string): Promise<Payment | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('amount', amount.toString());
    if (reason) queryParams.append('reason', reason);
    
    const response = await apiRequest<Payment>(`/api/payments/${id}/refund?${queryParams.toString()}`, {
      method: 'POST'
    });
    return response || null;
  } catch (error) {
    console.error(`Error refunding payment with ID ${id}:`, error);
    return null;
  }
};

export const getPaymentSummary = async (startDate?: string, endDate?: string): Promise<PaymentSummary | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await apiRequest<PaymentSummary>(`/api/payments/summary${queryString}`);
    return response || null;
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return null;
  }
};

// Transactions API
export const getTransactions = async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await apiRequest<Transaction[]>(`/api/payments/transactions${queryString}`);
    return response || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  try {
    const response = await apiRequest<Transaction>(`/api/payments/transactions/${id}`);
    return response || null;
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error);
    return null;
  }
};

// Installment Plans API
export const getInstallmentPlans = async (status?: string): Promise<InstallmentPlan[]> => {
  try {
    const queryString = status ? `?status=${status}` : '';
    const response = await apiRequest<InstallmentPlan[]>(`/api/payments/installment-plans${queryString}`);
    return response || [];
  } catch (error) {
    console.error('Error fetching installment plans:', error);
    return [];
  }
};

export const getInstallmentPlan = async (id: number): Promise<InstallmentPlan | null> => {
  try {
    const response = await apiRequest<InstallmentPlan>(`/api/payments/installment-plans/${id}`);
    return response || null;
  } catch (error) {
    console.error(`Error fetching installment plan with ID ${id}:`, error);
    return null;
  }
};

export const createInstallmentPlan = async (plan: InstallmentPlanCreate): Promise<InstallmentPlan | null> => {
  try {
    const response = await apiRequest<InstallmentPlan>('/api/payments/installment-plans', {
      method: 'POST',
      body: JSON.stringify(plan)
    });
    return response || null;
  } catch (error) {
    console.error('Error creating installment plan:', error);
    return null;
  }
};
