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

interface PackagingOption {
  id: string; // Unique ID for the form
  product_id: number;
  product_name: string; // For display purposes
  packaging_size: string;
  weight_value: number;
  weight_unit: string;
  barcode?: string;
  min_stock_level: number;
  reorder_level: number;
  max_stock_level: number;
  current_stock: number;
  unit_cost: number;
  selling_price: number;
}

export default function CreatePackagedProductPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [packagingOptions, setPackagingOptions] = useState<PackagingOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Packaging size options
  const packagingSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: '50g', label: '50g' },
    { value: '100g', label: '100g' },
    { value: '250g', label: '250g' },
    { value: '500g', label: '500g' },
    { value: '1kg', label: '1kg' },
    { value: '5kg', label: '5kg' },
    { value: '10kg', label: '10kg' },
    { value: 'custom', label: 'Custom' }
  ];

  // Weight units
  const weightUnits = [
    { value: 'g', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'pcs', label: 'Pieces' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) {
          console.error('Failed to fetch products:', response.status);
          setProducts([]);
          return;
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Invalid products data format');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addPackagingOption = () => {
    if (!selectedProduct) {
      setError('Please select a product first');
      return;
    }

    const selectedProductObj = products.find(p => p.id === selectedProduct);
    if (!selectedProductObj) {
      setError('Invalid product selected');
      return;
    }

    const newOption: PackagingOption = {
      id: `option_${Date.now()}`, // Generate a unique ID
      product_id: selectedProduct,
      product_name: selectedProductObj.name,
      packaging_size: '100g',
      weight_value: 100,
      weight_unit: 'g',
      barcode: '',
      min_stock_level: 10,
      reorder_level: 20,
      max_stock_level: 100,
      current_stock: 0,
      unit_cost: 0,
      selling_price: 0
    };
    
    setPackagingOptions([...packagingOptions, newOption]);
  };

  const updatePackagingOption = (id: string, field: keyof PackagingOption, value: any) => {
    setPackagingOptions(packagingOptions.map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    }));
  };

  const removePackagingOption = (id: string) => {
    setPackagingOptions(packagingOptions.filter(option => option.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }
    
    if (packagingOptions.length === 0) {
      setError('Please add at least one packaging option');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const createPromises = packagingOptions.map(option => {
        const packagedProductData = {
          product_id: option.product_id,
          packaging_size: option.packaging_size,
          weight_value: option.weight_value,
          weight_unit: option.weight_unit,
          items_per_package: 1, // Default value, adjust as needed
          barcode: option.barcode,
          min_stock_level: option.min_stock_level,
          reorder_level: option.reorder_level,
          is_active: true // Default to active
        };
        
        return inventoryService.createPackagedProduct(packagedProductData);
      });
      
      const results = await Promise.all(createPromises);
      
      // Check if all creations were successful
      const allSuccessful = results.every(result => result && (result as any).success);
      
      if (allSuccessful) {
        router.push('/admin/inventory/packaged-products');
      } else {
        throw new Error('Failed to create one or more packaged products');
      }
    } catch (err: any) {
      console.error('Error creating packaged products:', err);
      setError(err.message || 'Failed to create packaged products');
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
        <h1 className="text-2xl font-bold">Create Packaged Product</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Information</h2>
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              id="product"
              value={selectedProduct || ''}
              onChange={(e) => {
                const productId = e.target.value ? parseInt(e.target.value) : null;
                setSelectedProduct(productId);
                // Clear existing packaging options when product changes
                setPackagingOptions([]);
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
        </div>
        
        {/* Packaging Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Packaging Options</h2>
            <button
              type="button"
              onClick={addPackagingOption}
              disabled={!selectedProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Add Packaging Option
            </button>
          </div>
          
          {packagingOptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {selectedProduct ? 
                'Click "Add Packaging Option" to create a new packaging variant for this product' : 
                'Please select a product first to add packaging options'}
            </div>
          )}
          
          {packagingOptions.map((option, index) => (
            <div key={option.id} className="mb-8 border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Option {index + 1}: {option.product_name}
                </h3>
                <button
                  type="button"
                  onClick={() => removePackagingOption(option.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`packaging_size_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Packaging Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`packaging_size_${option.id}`}
                    value={option.packaging_size}
                    onChange={(e) => updatePackagingOption(option.id, 'packaging_size', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    {packagingSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor={`weight_value_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Weight/Quantity Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`weight_value_${option.id}`}
                    value={option.weight_value}
                    onChange={(e) => updatePackagingOption(option.id, 'weight_value', parseFloat(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor={`weight_unit_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`weight_unit_${option.id}`}
                    value={option.weight_unit}
                    onChange={(e) => updatePackagingOption(option.id, 'weight_unit', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    {weightUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor={`barcode_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    id={`barcode_${option.id}`}
                    value={option.barcode || ''}
                    onChange={(e) => updatePackagingOption(option.id, 'barcode', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor={`current_stock_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`current_stock_${option.id}`}
                    value={option.current_stock}
                    onChange={(e) => updatePackagingOption(option.id, 'current_stock', parseInt(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor={`min_stock_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`min_stock_${option.id}`}
                    value={option.min_stock_level}
                    onChange={(e) => updatePackagingOption(option.id, 'min_stock_level', parseInt(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor={`reorder_level_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Reorder Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`reorder_level_${option.id}`}
                    value={option.reorder_level}
                    onChange={(e) => updatePackagingOption(option.id, 'reorder_level', parseInt(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor={`max_stock_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Stock Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`max_stock_${option.id}`}
                    value={option.max_stock_level}
                    onChange={(e) => updatePackagingOption(option.id, 'max_stock_level', parseInt(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor={`unit_cost_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Cost (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`unit_cost_${option.id}`}
                    value={option.unit_cost}
                    onChange={(e) => updatePackagingOption(option.id, 'unit_cost', parseFloat(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor={`selling_price_${option.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`selling_price_${option.id}`}
                    value={option.selling_price}
                    onChange={(e) => updatePackagingOption(option.id, 'selling_price', parseFloat(e.target.value))}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ))}
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
            disabled={isSubmitting || packagingOptions.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Packaged Products'}
          </button>
        </div>
      </form>
    </div>
  );
}
