'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import inventoryService from '../../../../../services/inventoryService';

interface Company {
  id: number;
  name: string;
  gst_number: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst_number?: string;
}

interface Product {
  id: number;
  name: string;
  hsn_code?: string;
  cgst_rate?: number;
  sgst_rate?: number;
  igst_rate?: number;
  cess_rate?: number;
}

interface InvoiceItem {
  id: string; // Unique ID for the form
  product_id: number;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  hsn_code: string;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  cess_rate: number;
  discount: number;
  amount: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [termsAndConditions, setTermsAndConditions] = useState<string>('');
  const [isInterStateSale, setIsInterStateSale] = useState<boolean>(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate subtotal, tax, and grand total
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const cgstAmount = isInterStateSale ? 0 : invoiceItems.reduce((sum, item) => sum + (item.amount * item.cgst_rate / 100), 0);
  const sgstAmount = isInterStateSale ? 0 : invoiceItems.reduce((sum, item) => sum + (item.amount * item.sgst_rate / 100), 0);
  const igstAmount = isInterStateSale ? invoiceItems.reduce((sum, item) => sum + (item.amount * item.igst_rate / 100), 0) : 0;
  const cessAmount = invoiceItems.reduce((sum, item) => sum + (item.amount * item.cess_rate / 100), 0);
  const totalTax = cgstAmount + sgstAmount + igstAmount + cessAmount;
  const grandTotal = subtotal + totalTax;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch companies
        const companiesResponse = await inventoryService.getCompanies() as { data: Company[] };
        if (companiesResponse && companiesResponse.data) {
          setCompanies(companiesResponse.data);
        } else {
          console.error('Invalid response format from companies API');
          setCompanies([]);
        }
        
        // Fetch customers
        const customersResponse = await inventoryService.getCustomers() as { data: Customer[] };
        if (customersResponse && customersResponse.data) {
          setCustomers(customersResponse.data);
        } else {
          console.error('Invalid response format from customers API');
          setCustomers([]);
        }
        
        // Fetch products
        const productsResponse = await inventoryService.getProducts() as { data: Product[] };
        if (productsResponse && productsResponse.data) {
          setProducts(productsResponse.data);
        } else {
          console.error('Invalid response format from products API');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Generate a unique invoice number
    generateInvoiceNumber();
    
    // Set default due date (30 days from today)
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
  }, []);

  // Generate a unique invoice number based on date and random string
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    setInvoiceNumber(`INV-${year}${month}-${random}`);
  };

  const addItemToInvoice = (product: Product) => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`, // Generate a unique ID
      product_id: product.id,
      product_name: product.name,
      description: product.name,
      quantity: 1,
      unit_price: 0,
      hsn_code: product.hsn_code || '',
      cgst_rate: product.cgst_rate || 0,
      sgst_rate: product.sgst_rate || 0,
      igst_rate: product.igst_rate || 0,
      cess_rate: product.cess_rate || 0,
      discount: 0,
      amount: 0
    };
    
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if quantity, unit_price, or discount changes
        if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
          const discountAmount = updatedItem.unit_price * updatedItem.quantity * (updatedItem.discount / 100);
          updatedItem.amount = updatedItem.unit_price * updatedItem.quantity - discountAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) {
      setError('Please select a company');
      return;
    }
    
    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }
    
    if (invoiceItems.length === 0) {
      setError('Please add at least one item to the invoice');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create invoice data object that matches the CreateInvoiceInput interface
      const invoiceData = {
        company_id: selectedCompany,
        customer_id: selectedCustomer,
        invoice_date: invoiceDate,
        due_date: dueDate,
        status: 'draft' as 'draft', // Using type assertion to match the literal type
        notes: notes,
        terms: termsAndConditions,
        items: invoiceItems.map(item => ({
          product_id: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          hsn_code: item.hsn_code,
          cgst_rate: item.cgst_rate,
          sgst_rate: item.sgst_rate,
          igst_rate: item.igst_rate,
          cess_rate: item.cess_rate,
          discount: item.discount,
          amount: item.amount
        }))
      };
      
      const response = await inventoryService.createInvoice(invoiceData) as { success: boolean, data?: any };
      
      if (response && response.success) {
        router.push(`/admin/inventory/invoices/${response.data.id}`);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError(err.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Invoice</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Invoice Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <select
                id="company"
                value={selectedCompany || ''}
                onChange={(e) => setSelectedCompany(e.target.value ? parseInt(e.target.value) : null)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                id="customer"
                value={selectedCustomer || ''}
                onChange={(e) => setSelectedCustomer(e.target.value ? parseInt(e.target.value) : null)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="invoice_number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="invoice_date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="due_date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="flex items-center h-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_inter_state"
                  checked={isInterStateSale}
                  onChange={(e) => setIsInterStateSale(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_inter_state" className="ml-2 block text-sm text-gray-900">
                  Inter-State Sale (IGST applicable)
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
          
          {/* Add Item */}
          <div className="mb-4">
            <label htmlFor="add_item" className="block text-sm font-medium text-gray-700 mb-1">
              Add Item
            </label>
            <div className="flex space-x-2">
              <select
                id="add_item"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={(e) => {
                  const selectedProductId = parseInt(e.target.value);
                  if (selectedProductId) {
                    const selectedProduct = products.find(product => product.id === selectedProductId);
                    if (selectedProduct) {
                      addItemToInvoice(selectedProduct);
                      e.target.value = ''; // Reset select after adding
                    }
                  }
                }}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HSN
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax %
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disc %
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.hsn_code}
                        onChange={(e) => updateInvoiceItem(item.id, 'hsn_code', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-16 sm:text-sm border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-16 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateInvoiceItem(item.id, 'unit_price', parseFloat(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isInterStateSale ? 
                        `IGST: ${item.igst_rate}%` : 
                        `CGST: ${item.cgst_rate}%, SGST: ${item.sgst_rate}%`}
                      {item.cess_rate > 0 && `, Cess: ${item.cess_rate}%`}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateInvoiceItem(item.id, 'discount', parseFloat(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-16 sm:text-sm border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeInvoiceItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {invoiceItems.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-center text-sm text-gray-500">
                      No items added to the invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Invoice Summary */}
          {invoiceItems.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {!isInterStateSale && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">CGST:</span>
                        <span className="text-sm font-medium text-gray-900">₹{cgstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">SGST:</span>
                        <span className="text-sm font-medium text-gray-900">₹{sgstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  {isInterStateSale && (
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-500">IGST:</span>
                      <span className="text-sm font-medium text-gray-900">₹{igstAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cessAmount > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-500">Cess:</span>
                      <span className="text-sm font-medium text-gray-900">₹{cessAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">Grand Total:</span>
                    <span className="text-base font-medium text-gray-900">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notes & Terms */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add any notes for the customer"
              />
            </div>
            
            <div>
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
                Terms and Conditions
              </label>
              <textarea
                id="terms"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                rows={4}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add terms and conditions"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}
