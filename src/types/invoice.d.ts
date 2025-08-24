import { User } from './user';
import { Order } from './order';
import { Product } from './product';

export type InvoiceStatus = 
  | 'draft'
  | 'issued'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export interface InvoiceLineItem {
  id: number;
  invoice_id: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  hsn_code?: string;
  created_at: string;
  product?: Product;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id?: number;
  user_id: number;
  seller_id?: number;
  issue_date?: string;
  due_date?: string;
  status: InvoiceStatus;
  
  // Financial details
  subtotal: number;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  discount_amount: number;
  shipping_amount: number;
  adjustment_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  
  // Address details
  billing_address: Record<string, any>;
  shipping_address?: Record<string, any>;
  
  // Additional details
  notes?: string;
  terms?: string;
  payment_instructions?: string;
  file_url?: string;
  invoice_metadata?: Record<string, any>;
  
  created_at: string;
  updated_at?: string;
}

export interface InvoiceDetail extends Invoice {
  user: User;
  seller?: User;
  order?: Order;
  line_items: InvoiceLineItem[];
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface InvoiceSummary {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  currency: string;
  status_counts: Record<string, number>;
  recent_invoices: Invoice[];
}
