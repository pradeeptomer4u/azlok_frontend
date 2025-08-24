export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
}

export interface InvoiceDetail extends Invoice {
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  notes?: string;
  payment_terms?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
