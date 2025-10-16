export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Company {
  id: string;
  name: string;
  legal_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  gst_number: string;
  phone: string;
  email: string;
  logo_url?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  hsn_code?: string;
  cgst_rate?: number;
  sgst_rate?: number;
  igst_rate?: number;
  cess_rate?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  cess_amount?: number;
  total_tax_amount?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  company_id: string;
  company_name: string;
  customer_id: string;
  customer_name: string;
  billing_address: string;
  shipping_address: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  reference_number?: string;
  reference_type?: string;
  place_of_supply?: string;
  is_igst_applicable: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceDetail extends Invoice {
  company: Company;
  items: InvoiceItem[];
  subtotal: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  cess_amount: number;
  total_tax_amount: number;
  discount_amount: number;
  shipping_charges?: number;
  round_off?: number;
  notes?: string;
  payment_terms?: string;
  bank_details?: {
    account_name: string;
    account_number: string;
    bank_name: string;
    branch_name: string;
    ifsc_code: string;
  };
  terms_and_conditions?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateInvoiceInput {
  company_id: string;
  customer_id: string;
  billing_address: string;
  shipping_address: string;
  issue_date: string;
  due_date: string;
  reference_number?: string;
  reference_type?: string;
  place_of_supply?: string;
  is_igst_applicable: boolean;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    hsn_code?: string;
    cgst_rate?: number;
    sgst_rate?: number;
    igst_rate?: number;
    cess_rate?: number;
  }[];
  discount_amount?: number;
  shipping_charges?: number;
  notes?: string;
  payment_terms?: string;
  terms_and_conditions?: string;
}
