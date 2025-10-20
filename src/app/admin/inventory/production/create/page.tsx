'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import inventoryService from '../../../../../services/inventoryService';

export const runtime = "edge";

interface Product {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

interface PackagedProduct {
  id: number;
  product_id: number;
  product_name: string;
  packaging_size: string;
  weight_value: number;
  weight_unit: string;
}

interface RawMaterial {
  id: number;
  name: string;
  code: string;
  unit_of_measure: string;
  current_stock: number;
}

interface ProductionMaterial {
  id: string; // Unique ID for the form
  raw_material_id: number;
  name: string; // For display purposes
  quantity: number;
  unit_of_measure: string;
  current_stock: number;
}

export default function CreateProductionBatchPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [packagedProducts, setPackagedProducts] = useState<PackagedProduct[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<number | null>(null);
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [plannedQuantity, setPlannedQuantity] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expectedEndDate, setExpectedEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [productionMaterials, setProductionMaterials] = useState<ProductionMaterial[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!productsResponse.ok) {
          console.error('Failed to fetch products:', productsResponse.status);
          setProducts([]);
        } else {
          const productsData = await productsResponse.json();
          if (Array.isArray(productsData)) {
            setProducts(productsData);
          } else {
            console.error('Invalid products data format');
            setProducts([]);
          }
        }
        
        // Fetch packaged products
        const packagedProductsResponse = await inventoryService.getPackagedProducts() as { data: PackagedProduct[] };
        if (packagedProductsResponse && packagedProductsResponse.data && Array.isArray(packagedProductsResponse.data)) {
          setPackagedProducts(packagedProductsResponse.data);
        } else {
          console.error('Invalid response format from packaged products API');
          setPackagedProducts([]);
        }
        
        // Fetch raw materials
        const rawMaterialsResponse = await inventoryService.getInventoryItems({ is_raw_material: true }) as { data: RawMaterial[] };
        if (rawMaterialsResponse && rawMaterialsResponse.data && Array.isArray(rawMaterialsResponse.data)) {
          setRawMaterials(rawMaterialsResponse.data);
        } else {
          console.error('Invalid response format from raw materials API');
          setRawMaterials([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Generate a unique batch number
    generateBatchNumber();
  }, []);

  // Generate a unique batch number based on date and random string
  const generateBatchNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    setBatchNumber(`PB-${year}${month}${day}-${random}`);
  };

  // Filter packaged products based on selected product
  const filteredPackagedProducts = selectedProduct
    ? packagedProducts.filter(item => item.product_id === selectedProduct)
    : [];

  const addMaterialToProduction = (material: RawMaterial) => {
    // Check if material is already added
    const existingMaterial = productionMaterials.find(item => item.raw_material_id === material.id);
    if (existingMaterial) {
      setError('This raw material is already added to the production batch');
      return;
    }
    
    const newMaterial: ProductionMaterial = {
      id: `material_${Date.now()}`, // Generate a unique ID
      raw_material_id: material.id,
      name: `${material.code} - ${material.name}`,
      quantity: 0,
      unit_of_measure: material.unit_of_measure,
      current_stock: material.current_stock
    };
    
    setProductionMaterials([...productionMaterials, newMaterial]);
  };

  const updateProductionMaterial = (id: string, field: keyof ProductionMaterial, value: any) => {
    setProductionMaterials(productionMaterials.map(material => {
      if (material.id === id) {
        return { ...material, [field]: value };
      }
      return material;
    }));
  };

  const removeProductionMaterial = (id: string) => {
    setProductionMaterials(productionMaterials.filter(material => material.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }
    
    if (!selectedPackaging) {
      setError('Please select a packaging option');
      return;
    }
    
    if (plannedQuantity <= 0) {
      setError('Planned quantity must be greater than zero');
      return;
    }
    
    if (productionMaterials.length === 0) {
      setError('Please add at least one raw material to the production batch');
      return;
    }
    
    // Check if any material has quantity = 0
    const invalidMaterials = productionMaterials.filter(material => material.quantity <= 0);
    if (invalidMaterials.length > 0) {
      setError('All materials must have a quantity greater than zero');
      return;
    }
    
    // Check if any material quantity exceeds current stock
    const insufficientMaterials = productionMaterials.filter(material => material.quantity > material.current_stock);
    if (insufficientMaterials.length > 0) {
      setError('Some materials have insufficient stock. Please adjust quantities.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const selectedPackagedProduct = packagedProducts.find(product => product.id === selectedPackaging);
      if (!selectedPackagedProduct) {
        throw new Error('Invalid packaged product selected');
      }
      
      // Create production batch data object that matches the CreateProductionBatchInput interface
      const productionBatchData = {
        product_id: selectedProduct, // Required by the interface
        bom_id: 1, // Using a placeholder value - in a real app, you would select a BOM
        planned_quantity: plannedQuantity,
        production_date: startDate, // Using start_date as production_date
        status: 'planned' as const, // Using as const to create a literal type
        notes: notes,
        packaged_items: [
          {
            packaged_product_id: selectedPackaging,
            quantity: plannedQuantity,
            notes: `Packaging: ${selectedPackagedProduct.packaging_size}`
          }
        ]
        // Note: materials are not part of the CreateProductionBatchInput interface
        // You would need to handle materials separately or update the API
      };
      
      const response = await inventoryService.createProductionBatch(productionBatchData) as { success: boolean, data?: any };
      
      if (response && response.success) {
        router.push(`/admin/inventory/production/${response.data.id}`);
      } else {
        throw new Error('Failed to create production batch');
      }
    } catch (err: any) {
      console.error('Error creating production batch:', err);
      setError(err.message || 'Failed to create production batch');
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
        <h1 className="text-2xl font-bold">Create Production Batch</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Batch Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="batch_number" className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="batch_number"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expected_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expected End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expected_end_date"
                value={expectedEndDate}
                onChange={(e) => setExpectedEndDate(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                Product <span className="text-red-500">*</span>
              </label>
              <select
                id="product"
                value={selectedProduct || ''}
                onChange={(e) => {
                  const productId = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedProduct(productId);
                  setSelectedPackaging(null); // Reset packaging when product changes
                }}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="packaging" className="block text-sm font-medium text-gray-700 mb-1">
                Packaging Option <span className="text-red-500">*</span>
              </label>
              <select
                id="packaging"
                value={selectedPackaging || ''}
                onChange={(e) => {
                  const packagingId = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedPackaging(packagingId);
                }}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
                disabled={!selectedProduct}
              >
                <option value="">Select Packaging</option>
                {filteredPackagedProducts.map((packaging) => (
                  <option key={packaging.id} value={packaging.id}>
                    {packaging.packaging_size} ({packaging.weight_value} {packaging.weight_unit})
                  </option>
                ))}
              </select>
              {selectedProduct && filteredPackagedProducts.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No packaging options available for this product. Please create a packaged product first.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="planned_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Planned Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="planned_quantity"
                value={plannedQuantity}
                onChange={(e) => setPlannedQuantity(parseInt(e.target.value))}
                min="1"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <input
                type="text"
                id="unit"
                value={selectedPackaging ? 
                  packagedProducts.find(p => p.id === selectedPackaging)?.weight_unit || '' : 
                  ''}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>
        
        {/* Raw Materials */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Raw Materials</h2>
          
          {/* Add Material */}
          <div className="mb-4">
            <label htmlFor="add_material" className="block text-sm font-medium text-gray-700 mb-1">
              Add Raw Material
            </label>
            <div className="flex space-x-2">
              <select
                id="add_material"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={(e) => {
                  const selectedMaterialId = parseInt(e.target.value);
                  if (selectedMaterialId) {
                    const selectedMaterial = rawMaterials.find(material => material.id === selectedMaterialId);
                    if (selectedMaterial) {
                      addMaterialToProduction(selectedMaterial);
                      e.target.value = ''; // Reset select after adding
                    }
                  }
                }}
              >
                <option value="">Select Raw Material</option>
                {rawMaterials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.code} - {material.name} ({material.current_stock} {material.unit_of_measure})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Materials Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Required
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
                {productionMaterials.map((material) => (
                  <tr key={material.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {material.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.current_stock} {material.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={material.quantity}
                        onChange={(e) => updateProductionMaterial(material.id, 'quantity', parseFloat(e.target.value))}
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md ${
                          material.quantity > material.current_stock ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {material.quantity > material.current_stock && (
                        <p className="mt-1 text-xs text-red-600">
                          Exceeds available stock
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeProductionMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {productionMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No materials added to the production batch
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
              placeholder="Add any additional notes or instructions for this production batch"
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
            {isSubmitting ? 'Creating...' : 'Create Production Batch'}
          </button>
        </div>
      </form>
    </div>
  );
}
