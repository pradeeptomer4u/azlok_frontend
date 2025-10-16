'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilePdf, FaFileInvoice } from 'react-icons/fa';
import inventoryService from '../../../../services/inventoryService';
import Pagination from '../../../../components/admin/common/Pagination';
import DeleteConfirmModal from '../../../../components/admin/common/DeleteConfirmModal';

interface Invoice {
  id: number;
  invoice_number: string;
  company_id: number;
  company_name: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams?.get('status') || null);
  const [dateFilter, setDateFilter] = useState<string | null>(searchParams?.get('date') || null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, searchTerm, statusFilter, dateFilter, searchParams]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter
      };
      
      const response = await inventoryService.getInvoices(params) as { data: Invoice[], meta: { total: number } };
      
      if (response && response.data) {
        setInvoices(response.data);
        if (response.meta && typeof response.meta.total === 'number') {
          setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
        } else {
          setTotalPages(1);
        }
      } else {
        setInvoices([]);
        setTotalPages(1);
        console.error('Invalid response format from invoices API');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
      setInvoices([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    // Update URL with search term
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    router.push(`/admin/inventory/invoices?${params.toString()}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setStatusFilter(value || null);
    } else if (name === 'date') {
      setDateFilter(value || null);
    }
    
    setCurrentPage(1);
    
    // Update URL with filters
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    router.push(`/admin/inventory/invoices?${params.toString()}`);
  };

  const handleDeleteClick = (id: number) => {
    setInvoiceToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (invoiceToDelete) {
      try {
        const response = await inventoryService.deleteInvoice(invoiceToDelete) as { success?: boolean };
        
        if (response && response.success) {
          setInvoices(invoices.filter(invoice => invoice.id !== invoiceToDelete));
          setShowDeleteModal(false);
          setInvoiceToDelete(null);
        } else {
          throw new Error('Failed to delete invoice');
        }
      } catch (err: any) {
        console.error('Error deleting invoice:', err);
        setError(err.message || 'Failed to delete invoice');
      }
    }
  };

  const handlePrintInvoice = async (id: number) => {
    try {
      const response = await inventoryService.printInvoice(id) as { data: any };
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Open PDF in new window or download
      const pdfUrl = response.data.pdf_url;
      window.open(pdfUrl, '_blank');
    } catch (err: any) {
      console.error('Error printing invoice:', err);
      setError(err.message || 'Failed to print invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/admin/inventory/invoices/create" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium flex items-center">
          <FaPlus className="mr-2" />
          Create New Invoice
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter || ''}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date"
              name="date"
              value={dateFilter || ''}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/inventory/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                          <FaEye className="inline" title="View Details" />
                        </Link>
                        
                        <button
                          onClick={() => handlePrintInvoice(invoice.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Print Invoice"
                        >
                          <FaFilePdf className="inline" />
                        </button>
                        
                        {invoice.status === 'draft' && (
                          <>
                            <Link href={`/admin/inventory/invoices/${invoice.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                              <FaEdit className="inline" title="Edit" />
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteClick(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash className="inline" />
                            </button>
                          </>
                        )}
                        
                        {invoice.status === 'sent' && (
                          <button
                            onClick={() => {
                              // Mark as paid functionality
                              // This would typically call an API endpoint
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Paid"
                          >
                            <FaFileInvoice className="inline" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </div>
  );
}
