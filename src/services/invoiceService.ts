import axios from 'axios';
import { Invoice, InvoiceDetail, InvoiceListResponse } from '../types/invoice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const invoiceService = {
  // Get all invoices for the current user
  async getInvoices(page = 1, limit = 10, status?: string): Promise<InvoiceListResponse> {
    const response = await axios.get(`${API_URL}/invoices`, {
      params: { skip: (page - 1) * limit, limit, status },
      withCredentials: true,
    });
    return response.data;
  },

  // Get a specific invoice by ID
  async getInvoiceById(id: number): Promise<InvoiceDetail> {
    const response = await axios.get(`${API_URL}/invoices/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Generate an invoice from an order
  async generateInvoice(orderId: number): Promise<Invoice> {
    const response = await axios.post(`${API_URL}/invoices/generate/${orderId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  },

  // Download invoice PDF
  async downloadInvoicePdf(id: number): Promise<Blob> {
    const response = await axios.get(`${API_URL}/invoices/${id}/pdf`, {
      withCredentials: true,
      responseType: 'blob',
    });
    return response.data;
  },

  // Helper function to open invoice PDF in a new tab
  openInvoicePdf(id: number): void {
    window.open(`${API_URL}/invoices/${id}/pdf`, '_blank');
  },

  // Helper function to download invoice PDF
  async saveInvoicePdf(id: number, fileName?: string): Promise<void> {
    const blob = await this.downloadInvoicePdf(id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default invoiceService;
