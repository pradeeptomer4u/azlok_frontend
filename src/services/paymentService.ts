import axios from 'axios';
import { 
  Payment, 
  PaymentCreate, 
  PaymentUpdate, 
  PaymentMethod, 
  PaymentMethodCreate, 
  PaymentMethodUpdate,
  Transaction,
  TransactionCreate,
  InstallmentPlan,
  InstallmentPlanCreate,
  PaymentListResponse,
  PaymentSummary,
  PaymentFilters,
  TransactionFilters
} from '../types/payment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

// Payment Methods API
export const getPaymentMethods = async (activeOnly: boolean = true): Promise<PaymentMethod[]> => {
  const response = await axios.get(`${API_URL}/payments/methods`, {
    headers: getAuthHeader(),
    params: { active_only: activeOnly }
  });
  return response.data;
};

export const getPaymentMethod = async (id: number): Promise<PaymentMethod> => {
  const response = await axios.get(`${API_URL}/payments/methods/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createPaymentMethod = async (paymentMethod: PaymentMethodCreate): Promise<PaymentMethod> => {
  const response = await axios.post(`${API_URL}/payments/methods`, paymentMethod, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updatePaymentMethod = async (id: number, paymentMethod: PaymentMethodUpdate): Promise<PaymentMethod> => {
  const response = await axios.put(`${API_URL}/payments/methods/${id}`, paymentMethod, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/payments/methods/${id}`, {
    headers: getAuthHeader()
  });
};

// Payments API
export const getPayments = async (filters: PaymentFilters = {}): Promise<PaymentListResponse> => {
  const response = await axios.get(`${API_URL}/payments`, {
    headers: getAuthHeader(),
    params: filters
  });
  return response.data;
};

export const getPayment = async (id: number): Promise<Payment> => {
  const response = await axios.get(`${API_URL}/payments/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createPayment = async (payment: PaymentCreate): Promise<Payment> => {
  const response = await axios.post(`${API_URL}/payments`, payment, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updatePayment = async (id: number, payment: PaymentUpdate): Promise<Payment> => {
  const response = await axios.put(`${API_URL}/payments/${id}`, payment, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const refundPayment = async (id: number, amount: number, reason?: string): Promise<Payment> => {
  const response = await axios.post(`${API_URL}/payments/${id}/refund`, null, {
    headers: getAuthHeader(),
    params: { amount, reason }
  });
  return response.data;
};

export const getPaymentSummary = async (startDate?: string, endDate?: string): Promise<PaymentSummary> => {
  const response = await axios.get(`${API_URL}/payments/summary`, {
    headers: getAuthHeader(),
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data;
};

// Transactions API
export const getTransactions = async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/payments/transactions`, {
    headers: getAuthHeader(),
    params: filters
  });
  return response.data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await axios.get(`${API_URL}/payments/transactions/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Installment Plans API
export const getInstallmentPlans = async (status?: string): Promise<InstallmentPlan[]> => {
  const response = await axios.get(`${API_URL}/payments/installment-plans`, {
    headers: getAuthHeader(),
    params: { status }
  });
  return response.data;
};

export const getInstallmentPlan = async (id: number): Promise<InstallmentPlan> => {
  const response = await axios.get(`${API_URL}/payments/installment-plans/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createInstallmentPlan = async (plan: InstallmentPlanCreate): Promise<InstallmentPlan> => {
  const response = await axios.post(`${API_URL}/payments/installment-plans`, plan, {
    headers: getAuthHeader()
  });
  return response.data;
};
