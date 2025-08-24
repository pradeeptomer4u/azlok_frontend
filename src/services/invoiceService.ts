import { apiRequest } from '../utils/apiRequest';
import { Invoice, InvoiceDetail, InvoiceListResponse } from '../types/invoice';

export const invoiceService = {
  // Get all invoices for the current user
  async getInvoices(page = 1, limit = 10, status?: string): Promise<InvoiceListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', ((page - 1) * limit).toString());
      queryParams.append('limit', limit.toString());
      if (status) queryParams.append('status', status);
      
      const response = await apiRequest<InvoiceListResponse>(`/api/invoices?${queryParams.toString()}`);
      return response || { invoices: [], total: 0, page, size: limit, pages: 0 };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { invoices: [], total: 0, page, size: limit, pages: 0 };
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
  async generateInvoice(orderId: number): Promise<Invoice | null> {
    try {
      const response = await apiRequest<Invoice>(`/api/invoices/generate/${orderId}`, {
        method: 'POST',
      });
      return response || null;
    } catch (error) {
      console.error(`Error generating invoice for order ID ${orderId}:`, error);
      return null;
    }
  },

  // Download invoice PDF
  async downloadInvoicePdf(id: number): Promise<Blob | null> {
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
  openInvoicePdf(id: number): void {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';
    window.open(`${API_URL}/api/invoices/${id}/pdf`, '_blank');
  },

  // Helper function to download invoice PDF
  async saveInvoicePdf(id: number, fileName?: string): Promise<boolean> {
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
