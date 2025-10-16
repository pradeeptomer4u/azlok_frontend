import { apiRequest } from '../utils/apiRequest';
import { 
  Invoice, 
  InvoiceDetail, 
  InvoiceListResponse, 
  Company, 
  CompanyListResponse,
  CreateInvoiceInput
} from '../types/invoice';

export const invoiceService = {
  // Get all invoices for the current user
  async getInvoices(page = 1, limit = 10, status?: string, companyId?: string): Promise<InvoiceListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', ((page - 1) * limit).toString());
      queryParams.append('limit', limit.toString());
      if (status) queryParams.append('status', status);
      if (companyId) queryParams.append('company_id', companyId);
      
      const response = await apiRequest<InvoiceListResponse>(`/api/invoices?${queryParams.toString()}`);
      return response || { invoices: [], total: 0, page, size: limit, pages: 0 };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { invoices: [], total: 0, page, size: limit, pages: 0 };
    }
  },
  
  // Get all companies
  async getCompanies(page = 1, limit = 10): Promise<CompanyListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', ((page - 1) * limit).toString());
      queryParams.append('limit', limit.toString());
      
      const response = await apiRequest<CompanyListResponse>(`/api/companies?${queryParams.toString()}`);
      return response || { companies: [], total: 0, page, size: limit, pages: 0 };
    } catch (error) {
      console.error('Error fetching companies:', error);
      return { companies: [], total: 0, page, size: limit, pages: 0 };
    }
  },
  
  // Get a specific company by ID
  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const response = await apiRequest<Company>(`/api/companies/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return null;
    }
  },
  
  // Create a new company
  async createCompany(companyData: Omit<Company, 'id'>): Promise<Company | null> {
    try {
      const response = await apiRequest<Company>('/api/companies', {
        method: 'POST',
        body: JSON.stringify(companyData),
      });
      return response || null;
    } catch (error) {
      console.error('Error creating company:', error);
      return null;
    }
  },
  
  // Update an existing company
  async updateCompany(id: string, companyData: Partial<Company>): Promise<Company | null> {
    try {
      const response = await apiRequest<Company>(`/api/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(companyData),
      });
      return response || null;
    } catch (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      return null;
    }
  },

  // Get a specific invoice by ID
  async getInvoiceById(id: number): Promise<InvoiceDetail | null> {
    try {
      const response = await apiRequest<InvoiceDetail>(`/api/invoices/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      return null;
    }
  },

  // Generate an invoice from an order
  async generateInvoice(orderId: number, companyId: string): Promise<Invoice | null> {
    try {
      const response = await apiRequest<Invoice>(`/api/invoices/generate/${orderId}`, {
        method: 'POST',
        body: JSON.stringify({ company_id: companyId }),
      });
      return response || null;
    } catch (error) {
      console.error(`Error generating invoice for order ID ${orderId}:`, error);
      return null;
    }
  },
  
  // Create a custom invoice
  async createInvoice(invoiceData: CreateInvoiceInput): Promise<Invoice | null> {
    try {
      const response = await apiRequest<Invoice>('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      return response || null;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  },
  
  // Update an existing invoice
  async updateInvoice(id: string, invoiceData: Partial<CreateInvoiceInput>): Promise<Invoice | null> {
    try {
      const response = await apiRequest<Invoice>(`/api/invoices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceData),
      });
      return response || null;
    } catch (error) {
      console.error(`Error updating invoice with ID ${id}:`, error);
      return null;
    }
  },

  // Download invoice PDF
  async downloadInvoicePdf(id: string): Promise<Blob | null> {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';
      const response = await fetch(`${API_URL}/api/invoices/${id}/pdf`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Error downloading invoice PDF for ID ${id}:`, error);
      return null;
    }
  },

  // Helper function to open invoice PDF in a new tab
  openInvoicePdf(id: string): void {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';
    window.open(`${API_URL}/api/invoices/${id}/pdf`, '_blank');
  },

  // Helper function to download invoice PDF
  async saveInvoicePdf(id: string, fileName?: string): Promise<boolean> {
    try {
      const blob = await this.downloadInvoicePdf(id);
      if (!blob) return false;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `invoice_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error(`Error saving invoice PDF for ID ${id}:`, error);
      return false;
    }
  }
};

export default invoiceService;
