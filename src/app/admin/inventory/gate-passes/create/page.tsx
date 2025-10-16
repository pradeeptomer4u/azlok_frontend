'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import inventoryService from '../../../../../services/inventoryService';

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  unit_of_measure: string;
}

interface GatePassItem {
  id: string; // Unique ID for the form
  inventory_item_id: number;
  item_name: string; // For display purposes
  quantity: number;
  unit_of_measure: string;
  description: string;
}

export default function CreateGatePassPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [passType, setPassType] = useState<'inward' | 'outward'>('outward');
  const [passDate, setPassDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [partyName, setPartyName] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [referenceType, setReferenceType] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [driverName, setDriverName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [gatePassItems, setGatePassItems] = useState<GatePassItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await inventoryService.getInventoryItems() as { data: InventoryItem[] };
        if (response && response.data && Array.isArray(response.data)) {
          setInventoryItems(response.data);
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

    fetchInventoryItems();
  }, []);

  const addItemToGatePass = (item: InventoryItem) => {
    const newItem: GatePassItem = {
      id: `item_${Date.now()}`, // Generate a unique ID
      inventory_item_id: item.id,
      item_name: item.name,
      quantity: 1,
      unit_of_measure: item.unit_of_measure,
      description: ''
    };
    
    setGatePassItems([...gatePassItems, newItem]);
  };

  const updateGatePassItem = (id: string, field: keyof GatePassItem, value: any) => {
    setGatePassItems(gatePassItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeGatePassItem = (id: string) => {
    setGatePassItems(gatePassItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (gatePassItems.length === 0) {
      setError('Please add at least one item to the gate pass');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const gatePassData = {
        pass_type: passType,
        pass_date: passDate,
        party_name: partyName,
        reference_number: referenceNumber,
        reference_type: referenceType,
        vehicle_number: vehicleNumber,
        driver_name: driverName,
        notes: notes,
        items: gatePassItems.map(item => ({
          inventory_item_id: item.inventory_item_id,
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure,
          description: item.description
        }))
      };
      
      const response = await inventoryService.createGatePass(gatePassData) as { success: boolean, data?: any };
      
      if (response && response.success) {
        router.push(`/admin/inventory/gate-passes/${response.data.id}`);
      } else {
        throw new Error('Failed to create gate pass');
      }
    } catch (err: any) {
      console.error('Error creating gate pass:', err);
      setError(err.message || 'Failed to create gate pass');
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
        <h1 className="text-2xl font-bold">Create Gate Pass</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Gate Pass Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gate Pass Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pass_type" className="block text-sm font-medium text-gray-700 mb-1">
                Pass Type <span className="text-red-500">*</span>
              </label>
              <select
                id="pass_type"
                value={passType}
                onChange={(e) => setPassType(e.target.value as 'inward' | 'outward')}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="inward">Inward</option>
                <option value="outward">Outward</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="pass_date" className="block text-sm font-medium text-gray-700 mb-1">
                Pass Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="pass_date"
                value={passDate}
                onChange={(e) => setPassDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="party_name" className="block text-sm font-medium text-gray-700 mb-1">
                Party Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="party_name"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reference_type" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Type
              </label>
              <select
                id="reference_type"
                value={referenceType}
                onChange={(e) => setReferenceType(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select Reference Type</option>
                <option value="purchase_order">Purchase Order</option>
                <option value="sales_order">Sales Order</option>
                <option value="production_batch">Production Batch</option>
                <option value="return_order">Return Order</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                id="reference_number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="vehicle_number" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehicle_number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="driver_name" className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                id="driver_name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Gate Pass Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gate Pass Items</h2>
          
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
                      addItemToGatePass(selectedItem);
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
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gatePassItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.item_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateGatePassItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateGatePassItem(item.id, 'description', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeGatePassItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {gatePassItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items added to the gate pass
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
              placeholder="Add any additional notes or instructions"
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
            {isSubmitting ? 'Creating...' : 'Create Gate Pass'}
          </button>
        </div>
      </form>
    </div>
  );
}
