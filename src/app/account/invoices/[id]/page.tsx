'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InvoiceDetail, InvoiceStatus } from '@/types/invoice';
import invoiceService from '@/services/invoiceService';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Breadcrumb, Spinner, Badge, Button } from '@/components/ui';

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-200 text-gray-800',
  issued: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  partially_paid: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-500 text-white',
  refunded: 'bg-teal-100 text-teal-800',
};

const InvoiceDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [params.id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoiceById(parseInt(params.id));
      setInvoice(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoice details. Please try again later.');
      setLoading(false);
      console.error('Error fetching invoice details:', err);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoice) return;
    
    try {
      setDownloading(true);
      await invoiceService.saveInvoicePdf(invoice.id, `invoice_${invoice.invoice_number}.pdf`);
      setDownloading(false);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again later.');
      setDownloading(false);
    }
  };

  const handleBackToInvoices = () => {
    router.push('/account/invoices');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {error || 'Invoice not found'}
        </div>
        <Button onClick={handleBackToInvoices}>Back to Invoices</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'My Account', href: '/account' },
          { label: 'Invoices', href: '/account/invoices' },
          { label: `Invoice ${invoice.invoice_number}`, href: `/account/invoices/${invoice.id}` },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoice_number}</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleBackToInvoices} variant="outline">
            Back to Invoices
          </Button>
          <Button 
            onClick={handleDownloadInvoice} 
            disabled={downloading}
            className="flex items-center"
          >
            {downloading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Invoice Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Created on {formatDate(invoice.created_at)}
              </p>
            </div>
            <Badge className={`${statusColors[invoice.status]} text-sm font-medium px-3 py-1 rounded-full`}>
              {invoice.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Invoice Information</h3>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Invoice Number:</span>
                <span className="text-sm font-medium text-gray-900">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Issue Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {invoice.issue_date ? formatDate(invoice.issue_date) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Due Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                </span>
              </div>
              {invoice.order && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order Number:</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.order.order_number}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Amount:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount Paid:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount_paid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount Due:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount_due)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Billing & Shipping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bill To</h4>
              <div className="text-sm text-gray-900">
                <p className="font-medium">{invoice.user.full_name}</p>
                <p>{invoice.billing_address.street}</p>
                <p>
                  {invoice.billing_address.city}, {invoice.billing_address.state} {invoice.billing_address.postal_code}
                </p>
                <p>{invoice.billing_address.country}</p>
                <p className="mt-2">{invoice.user.email}</p>
                <p>{invoice.user.phone}</p>
              </div>
            </div>

            {invoice.shipping_address && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Ship To</h4>
                <div className="text-sm text-gray-900">
                  <p className="font-medium">{invoice.user.full_name}</p>
                  <p>{invoice.shipping_address.street}</p>
                  <p>
                    {invoice.shipping_address.city}, {invoice.shipping_address.state}{' '}
                    {invoice.shipping_address.postal_code}
                  </p>
                  <p>{invoice.shipping_address.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Invoice Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  HSN/SAC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tax
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.line_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.hsn_code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.tax_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-5 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.tax_amount)}</span>
                  </div>
                )}
                {invoice.cgst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">CGST:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.cgst_amount)}</span>
                  </div>
                )}
                {invoice.sgst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">SGST:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.sgst_amount)}</span>
                  </div>
                )}
                {invoice.igst_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">IGST:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.igst_amount)}</span>
                  </div>
                )}
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Discount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      -{formatCurrency(invoice.discount_amount)}
                    </span>
                  </div>
                )}
                {invoice.shipping_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.shipping_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Total:</span>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                </div>
                {invoice.amount_paid > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount Paid:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount_paid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Balance Due:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount_due)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(invoice.notes || invoice.terms || invoice.payment_instructions) && (
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          {invoice.notes && (
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h3>
              <p className="text-sm text-gray-600">{invoice.terms}</p>
            </div>
          )}
          {invoice.payment_instructions && (
            <div className="px-6 py-5">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Instructions</h3>
              <p className="text-sm text-gray-600">{invoice.payment_instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;
