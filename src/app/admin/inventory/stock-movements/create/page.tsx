'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import inventoryService from '../../../../../services/inventoryService';

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  unit_of_measure: string;
  current_stock: number;
}

interface PackagedProduct {
  id: number;
  product_name: string;
  packaging_size: string;
  weight_value: number;
  weight_unit: string;
  current_stock: number;
}

interface StockMovementItem {
  id: string; // Unique ID for the form
  item_id: number;
  item_name: string; // For display purposes
  item_type: 'raw_material' | 'packaged_product';
  quantity: number;
  unit_of_measure: string;
  current_stock: number;
}

export default function CreateStockMovementPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawMaterials, setRawMaterials] = useState<InventoryItem[]>([]);
  const [packagedProducts, setPackagedProducts] = useState<PackagedProduct[]>([]);
  const [movementType, setMovementType] = useState<string>('adjustment');
  const [movementDate, setMovementDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [referenceType, setReferenceType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [stockMovementItems, setStockMovementItems] = useState<StockMovementItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Movement type options
  const movementTypes = [
    { value: 'adjustment', label: 'Stock Adjustment' },
    { value: 'transfer', label: 'Stock Transfer' },
    { value: 'return', label: 'Return to Supplier' },
    { value: 'write_off', label: 'Write Off' },
    { value: 'production', label: 'Production Consumption' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        // Fetch raw materials
        const rawMaterialsResponse = await inventoryService.getInventoryItems({ is_raw_material: true }) as { data: InventoryItem[] };
        if (rawMaterialsResponse && rawMaterialsResponse.data && Array.isArray(rawMaterialsResponse.data)) {
          setRawMaterials(rawMaterialsResponse.data);
        } else {
          console.error('Invalid response format from raw materials API');
          setRawMaterials([]);
        }

        // Fetch packaged products
        const packagedProductsResponse = await inventoryService.getPackagedProducts() as { data: PackagedProduct[] };
        if (packagedProductsResponse && packagedProductsResponse.data && Array.isArray(packagedProductsResponse.data)) {
          setPackagedProducts(packagedProductsResponse.data);
        } else {
          console.error('Invalid response format from packaged products API');
          setPackagedProducts([]);
        }
      } catch (err) {
        console.error('Error fetching inventory items:', err);
        setRawMaterials([]);
        setPackagedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const addRawMaterialToMovement = (item: InventoryItem) => {
    const newItem: StockMovementItem = {
      id: `item_${Date.now()}`, // Generate a unique ID
      item_id: item.id,
      item_name: `${item.code} - ${item.name}`,
      item_type: 'raw_material',
      quantity: 0,
      unit_of_measure: item.unit_of_measure,
      current_stock: item.current_stock
    };
    
    setStockMovementItems([...stockMovementItems, newItem]);
  };

  const addPackagedProductToMovement = (product: PackagedProduct) => {
    const newItem: StockMovementItem = {
      id: `item_${Date.now()}`, // Generate a unique ID
      item_id: product.id,
      item_name: `${product.product_name} (${product.packaging_size})`,
      item_type: 'packaged_product',
      quantity: 0,
      unit_of_measure: product.weight_unit,
      current_stock: product.current_stock
    };
    
    setStockMovementItems([...stockMovementItems, newItem]);
  };

  const updateStockMovementItem = (id: string, field: keyof StockMovementItem, value: any) => {
    setStockMovementItems(stockMovementItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeStockMovementItem = (id: string) => {
    setStockMovementItems(stockMovementItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stockMovementItems.length === 0) {
      setError('Please add at least one item to the stock movement');
      return;
    }
    
    // Validate quantities
    const invalidItems = stockMovementItems.filter(item => {
      // For certain movement types, we need to ensure quantity is not greater than current stock
      if (['adjustment', 'transfer', 'return', 'write_off', 'production'].includes(movementType)) {
        // If quantity is negative, it's an addition, so no validation needed
        if (item.quantity < 0) return false;
        
        // If quantity is positive, it's a reduction, so validate against current stock
        return item.quantity > item.current_stock;
      }
      return false;
    });
    
    if (invalidItems.length > 0) {
      setError(`One or more items have quantities exceeding current stock. Please adjust the quantities.`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const stockMovementData = {
        movement_type: movementType,
        movement_date: movementDate,
        reference_number: referenceNumber,
        reference_type: referenceType,
        notes: notes,
        items: stockMovementItems.map(item => ({
          item_id: item.item_id,
          item_type: item.item_type,
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure
        }))
      };
      
      const response = await inventoryService.createStockMovement(stockMovementData) as { success: boolean, data?: any };
      
      if (response && response.success) {
        router.push('/admin/inventory/stock-movements');
      } else {
        throw new Error('Failed to create stock movement');
      }
    } catch (err: any) {
      console.error('Error creating stock movement:', err);
      setError(err.message || 'Failed to create stock movement');
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
        <h1 className="text-2xl font-bold">Create Stock Movement</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Movement Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Movement Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="movement_type" className="block text-sm font-medium text-gray-700 mb-1">
                Movement Type <span className="text-red-500">*</span>
              </label>
              <select
                id="movement_type"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                {movementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="movement_date" className="block text-sm font-medium text-gray-700 mb-1">
                Movement Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="movement_date"
                value={movementDate}
                onChange={(e) => setMovementDate(e.target.value)}
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
                <option value="gate_pass">Gate Pass</option>
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
            
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add any additional notes or explanation for this stock movement"
              />
            </div>
          </div>
        </div>
        
        {/* Movement Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Movement Items</h2>
          
          {/* Add Item */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="add_raw_material" className="block text-sm font-medium text-gray-700 mb-1">
                Add Raw Material
              </label>
              <select
                id="add_raw_material"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={(e) => {
                  const selectedItemId = parseInt(e.target.value);
                  if (selectedItemId) {
                    const selectedItem = rawMaterials.find(item => item.id === selectedItemId);
                    if (selectedItem) {
                      addRawMaterialToMovement(selectedItem);
                      e.target.value = ''; // Reset select after adding
                    }
                  }
                }}
              >
                <option value="">Select Raw Material</option>
                {rawMaterials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.name} ({item.current_stock} {item.unit_of_measure})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="add_packaged_product" className="block text-sm font-medium text-gray-700 mb-1">
                Add Packaged Product
              </label>
              <select
                id="add_packaged_product"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={(e) => {
                  const selectedProductId = parseInt(e.target.value);
                  if (selectedProductId) {
                    const selectedProduct = packagedProducts.find(product => product.id === selectedProductId);
                    if (selectedProduct) {
                      addPackagedProductToMovement(selectedProduct);
                      e.target.value = ''; // Reset select after adding
                    }
                  }
                }}
              >
                <option value="">Select Packaged Product</option>
                {packagedProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name} ({product.packaging_size}) - {product.current_stock} units
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
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockMovementItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.item_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.item_type === 'raw_material' ? 'Raw Material' : 'Packaged Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.current_stock} {item.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-500">
                          {movementType === 'adjustment' && (
                            <span>Use negative for additions</span>
                          )}
                        </span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateStockMovementItem(item.id, 'quantity', parseFloat(e.target.value))}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                          required
                          step="0.01"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeStockMovementItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {stockMovementItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items added to the stock movement
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Help Text */}
          {movementType === 'adjustment' && stockMovementItems.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> For stock adjustments, use positive numbers to decrease stock (e.g., for damage, loss) and negative numbers to increase stock (e.g., for found items, corrections).
              </p>
            </div>
          )}
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
            disabled={isSubmitting || stockMovementItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Stock Movement'}
          </button>
        </div>
      </form>
    </div>
  );
}
