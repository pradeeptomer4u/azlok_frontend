'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Explicitly import the Invoice interface with amount property
import type { Invoice, InvoiceStatus } from '@/types/invoice';
import invoiceService from '@/services/invoiceService';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Breadcrumb, PaginationWrapper, Spinner, Badge, Button } from '@/components/ui';

const statusColors: Record<InvoiceStatus | string, string> = {
  draft: 'bg-gray-200 text-gray-800',
  pending: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  partially_paid: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-500 text-white',
  refunded: 'bg-teal-100 text-teal-800',
  issued: 'bg-blue-100 text-blue-800',
};

const InvoicesPage = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const pageSize = 10;

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoices(currentPage, pageSize, statusFilter || undefined);
      setInvoices(response.invoices);
      setTotalPages(response.pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoices. Please try again later.');
      setLoading(false);
      console.error('Error fetching invoices:', err);
    }
  };

  const handleViewInvoice = (id: string) => {
    router.push(`/account/invoices/${id}`);
  };

  const handleDownloadInvoice = async (id: string, invoiceNumber: string) => {
    try {
      await invoiceService.saveInvoicePdf(Number(id), `invoice_${invoiceNumber}.pdf`);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again later.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as InvoiceStatus | '');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'My Account', href: '/account' },
          { label: 'Invoices', href: '/account/invoices' },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
        <div className="flex items-center">
          <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {statusFilter
              ? `You don't have any invoices with status "${statusFilter}".`
              : "You don't have any invoices yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.issue_date ? formatDate(invoice.issue_date) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={`${statusColors[invoice.status]} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                        >
                          {invoice.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="link"
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => handleViewInvoice(invoice.id.toString())}
                        >
                          View
                        </Button>
                        <Button
                          variant="link"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleDownloadInvoice(invoice.id.toString(), invoice.invoice_number)}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <PaginationWrapper
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoicesPage;
