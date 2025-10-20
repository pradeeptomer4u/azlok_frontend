'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import inventoryService from '../../../../../services/inventoryService';

export const runtime = "edge";

interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  unit_of_measure: string;
  current_stock: number;
}

interface OrderItem {
  id: string; // Unique ID for the form
  inventory_item_id: number;
  name: string; // For display purposes
  quantity: number;
  unit_price: number;
  tax_rate: number;
  unit_of_measure: string;
  total: number;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedItemId = searchParams?.get('item_id') ? parseInt(searchParams.get('item_id')!) : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [billingAddress, setBillingAddress] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate subtotal, tax, and grand total
  const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0);
  const grandTotal = subtotal + taxAmount;

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await inventoryService.getSuppliers() as { data: Supplier[] };
        if (response && response.data && Array.isArray(response.data)) {
          setSuppliers(response.data);
        } else {
          console.error('Invalid response format from suppliers API');
          setSuppliers([]);
        }
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setSuppliers([]);
      }
    };

    const fetchInventoryItems = async () => {
      try {
        const response = await inventoryService.getInventoryItems({ is_raw_material: true }) as { data: InventoryItem[] };
        if (response && response.data && Array.isArray(response.data)) {
          setInventoryItems(response.data);
          
          // If an item_id was provided in the URL, add it to the order items
          if (preselectedItemId) {
            const selectedItem = response.data.find(item => item.id === preselectedItemId);
            if (selectedItem) {
              addItemToOrder(selectedItem);
            }
          }
        } else {
          console.error('Invalid response format from inventory items API');
          setInventoryItems([]);
        }
      } catch (err) {
        console.error('Error fetching inventory items:', err);
        setInventoryItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
    fetchInventoryItems();
  }, [preselectedItemId]);

  const addItemToOrder = (item: InventoryItem) => {
    const newItem: OrderItem = {
      id: `item_${Date.now()}`, // Generate a unique ID
      inventory_item_id: item.id,
      name: item.name,
      quantity: 1,
      unit_price: 0,
      tax_rate: 18, // Default to 18% GST
      unit_of_measure: item.unit_of_measure,
      total: 0
    };
    
    setOrderItems([...orderItems, newItem]);
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      setError('Please select a supplier');
      return;
    }
    
    if (orderItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create purchase order data object that matches the CreatePurchaseOrderInput interface
      const purchaseOrderData = {
        supplier_id: selectedSupplier,
        order_date: orderDate,
        expected_delivery_date: expectedDeliveryDate,
        delivery_address: shippingAddress, // Using shipping_address as delivery_address
        status: 'pending' as const, // Required field with literal type
        payment_terms: paymentTerms,
        notes: notes,
        items: orderItems.map(item => ({
          inventory_item_id: item.inventory_item_id,
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          discount_amount: 0, // Default value for required field
          hsn_code: '' // Default empty string for optional field
        }))
      };
      
      const response = await inventoryService.createPurchaseOrder(purchaseOrderData) as { success: boolean, data?: any };
      
      if (response && response.success) {
        router.push(`/admin/inventory/purchase-orders/${response.data.id}`);
      } else {
        throw new Error('Failed to create purchase order');
      }
    } catch (err: any) {
      console.error('Error creating purchase order:', err);
      setError(err.message || 'Failed to create purchase order');
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
        <h1 className="text-2xl font-bold">Create Purchase Order</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Supplier Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Supplier Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                id="supplier"
                value={selectedSupplier || ''}
                onChange={(e) => setSelectedSupplier(e.target.value ? parseInt(e.target.value) : null)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 mb-1">
                Order Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="order_date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expected_delivery_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expected_delivery_date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                id="payment_terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Net 30 days"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shipping_address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="billing_address"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          
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
                  const selectedItemId = parseInt(e.target.value);
                  if (selectedItemId) {
                    const selectedItem = inventoryItems.find(item => item.id === selectedItemId);
                    if (selectedItem) {
                      addItemToOrder(selectedItem);
                      e.target.value = ''; // Reset select after adding
                    }
                  }
                }}
              >
                <option value="">Select Item</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.name}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Rate (%)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateOrderItem(item.id, 'unit_price', parseFloat(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.tax_rate}
                        onChange={(e) => updateOrderItem(item.id, 'tax_rate', parseFloat(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeOrderItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items added to the order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Order Summary */}
          {orderItems.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Tax:</span>
                    <span className="text-sm font-medium text-gray-900">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">Grand Total:</span>
                    <span className="text-base font-medium text-gray-900">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
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
              placeholder="Add any additional notes or instructions for the supplier"
            />
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
            {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
