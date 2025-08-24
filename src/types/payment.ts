export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  PARTIALLY_PAID = 'partially_paid',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  COD = 'cash_on_delivery',
  EMI = 'emi',
  BANK_TRANSFER = 'bank_transfer'
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
  SETTLEMENT = 'settlement',
  FEE = 'fee'
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  method_type: PaymentMethodType;
  provider: string;
  is_default: boolean;
  is_active: boolean;
  last_used?: string;
  
  // Card details
  card_last_four?: string;
  card_expiry_month?: string;
  card_expiry_year?: string;
  card_holder_name?: string;
  
  // UPI details
  upi_id?: string;
  
  // Bank details
  bank_name?: string;
  account_last_four?: string;
  account_holder_name?: string;
  
  // Wallet details
  wallet_provider?: string;
  wallet_id?: string;
  
  // Metadata
  token?: string;
  token_expiry?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface PaymentMethodCreate {
  method_type: PaymentMethodType;
  provider: string;
  is_default?: boolean;
  
  // Optional fields based on payment method type
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

export interface PaymentMethodUpdate {
  is_default?: boolean;
  is_active?: boolean;
  card_expiry_month?: string;
  card_expiry_year?: string;
  card_holder_name?: string;
  upi_id?: string;
  bank_name?: string;
  account_holder_name?: string;
  wallet_provider?: string;
  wallet_id?: string;
}

export interface Transaction {
  id: number;
  transaction_reference: string;
  payment_id?: number;
  user_id: number;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: string;
  gateway?: string;
  gateway_transaction_id?: string;
  gateway_response?: Record<string, unknown>;
  description?: string;
  metadata?: Record<string, unknown>;
  transaction_date: string;
  created_at: string;
}

export interface TransactionCreate {
  transaction_type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
  payment_id?: number;
  gateway?: string;
  gateway_transaction_id?: string;
  gateway_response?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface InstallmentPlan {
  id: number;
  order_id: number;
  user_id: number;
  total_amount: number;
  number_of_installments: number;
  installment_frequency: string;
  interest_rate: number;
  processing_fee: number;
  start_date: string;
  end_date?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface InstallmentPlanCreate {
  order_id: number;
  total_amount: number;
  number_of_installments: number;
  installment_frequency: string;
  interest_rate?: number;
  processing_fee?: number;
  start_date: string;
}

export interface Payment {
  id: number;
  payment_reference: string;
  order_id?: number;
  user_id: number;
  payment_method_id?: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_date?: string;
  due_date?: string;
  description?: string;
  
  // Payment gateway details
  gateway?: string;
  gateway_payment_id?: string;
  gateway_response?: Record<string, unknown>;
  
  // For installment payments
  is_installment: boolean;
  installment_plan_id?: number;
  installment_number?: number;
  
  // For recurring payments
  is_recurring: boolean;
  recurring_schedule?: string;
  next_payment_date?: string;
  
  // For refunds
  refunded_amount: number;
  refund_reason?: string;
  
  // Metadata
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  
  // Relationships
  user?: { id: number; name?: string; email?: string };
  order?: { id: number; total_amount?: number; status?: string };
  payment_method?: PaymentMethod;
  transactions?: Transaction[];
}

export interface PaymentCreate {
  amount: number;
  currency?: string;
  description?: string;
  order_id?: number;
  payment_method_id?: number;
  gateway?: string;
  due_date?: string;
  
  // For installment payments
  is_installment?: boolean;
  installment_plan_id?: number;
  installment_number?: number;
  
  // For recurring payments
  is_recurring?: boolean;
  recurring_schedule?: string;
  
  // Additional metadata
  metadata?: Record<string, unknown>;
}

export interface PaymentUpdate {
  status?: PaymentStatus;
  payment_date?: string;
  due_date?: string;
  description?: string;
  gateway_payment_id?: string;
  gateway_response?: Record<string, unknown>;
  refunded_amount?: number;
  refund_reason?: string;
  next_payment_date?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaymentSummary {
  total_payments: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  refunded_amount: number;
  failed_amount: number;
  currency: string;
  payment_status_counts: Record<string, number>;
  recent_payments: Payment[];
}

export interface PaymentFilters {
  status?: PaymentStatus;
  order_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}

export interface TransactionFilters {
  payment_id?: number;
  transaction_type?: TransactionType;
  start_date?: string;
  end_date?: string;
}
