'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import inventoryService, { CreateInventoryItemInput } from '../../../../../services/inventoryService';

export default function CreateRawMaterialPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateInventoryItemInput>({
    name: '',
    code: '',
    description: '',
    category_id: 0,
    unit_of_measure: 'kilogram',
    min_stock_level: 0,
    max_stock_level: 0,
    reorder_level: 0,
    cost_price: 0,
    hsn_code: '',
    is_active: true,
    is_raw_material: true
  });
  
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assuming there's a categories API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
        
        // Set default category if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    
    if (formData.category_id <= 0) {
      newErrors.category_id = 'Category is required';
    }
    
    if (formData.min_stock_level < 0) {
      newErrors.min_stock_level = 'Minimum stock level cannot be negative';
    }
    
    if (formData.max_stock_level <= 0) {
      newErrors.max_stock_level = 'Maximum stock level must be greater than 0';
    }
    
    if (formData.reorder_level < 0) {
      newErrors.reorder_level = 'Reorder level cannot be negative';
    }
    
    if (formData.min_stock_level > formData.reorder_level) {
      newErrors.min_stock_level = 'Minimum stock level should be less than or equal to reorder level';
    }
    
    if (formData.reorder_level > formData.max_stock_level) {
      newErrors.reorder_level = 'Reorder level should be less than or equal to maximum stock level';
    }
    
    if (formData.cost_price < 0) {
      newErrors.cost_price = 'Cost price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await inventoryService.createInventoryItem(formData);
      router.push('/admin/inventory/raw-materials');
    } catch (err: any) {
      console.error('Error creating raw material:', err);
      
      // Handle API validation errors
      if (err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value as string;
        });
        
        setErrors(apiErrors);
      } else {
        alert(err.message || 'Failed to create raw material');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Raw Material</h1>
        <Link 
          href="/admin/inventory/raw-materials" 
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
        >
          Back to List
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            </div>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? 'border-red-300' : ''
                }`}
                placeholder="Enter raw material name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            {/* Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.code ? 'border-red-300' : ''
                }`}
                placeholder="Enter raw material code"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.category_id ? 'border-red-300' : ''
                }`}
              >
                <option value={0}>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>
            
            {/* Unit of Measure */}
            <div>
              <label htmlFor="unit_of_measure" className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <select
                id="unit_of_measure"
                name="unit_of_measure"
                value={formData.unit_of_measure}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="kilogram">Kilogram (kg)</option>
                <option value="gram">Gram (g)</option>
                <option value="liter">Liter (L)</option>
                <option value="milliliter">Milliliter (mL)</option>
                <option value="piece">Piece (pc)</option>
                <option value="packet">Packet (pkt)</option>
                <option value="box">Box</option>
                <option value="carton">Carton</option>
              </select>
            </div>
            
            {/* HSN Code */}
            <div>
              <label htmlFor="hsn_code" className="block text-sm font-medium text-gray-700 mb-1">
                HSN Code
              </label>
              <input
                type="text"
                id="hsn_code"
                name="hsn_code"
                value={formData.hsn_code}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter HSN code"
              />
            </div>
            
            {/* Cost Price */}
            <div>
              <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="cost_price"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  className={`pl-7 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.cost_price ? 'border-red-300' : ''
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.cost_price && <p className="mt-1 text-sm text-red-600">{errors.cost_price}</p>}
            </div>
            
            {/* Stock Levels */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Levels</h2>
            </div>
            
            {/* Min Stock Level */}
            <div>
              <label htmlFor="min_stock_level" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="min_stock_level"
                name="min_stock_level"
                value={formData.min_stock_level}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.min_stock_level ? 'border-red-300' : ''
                }`}
                placeholder="Enter minimum stock level"
                min="0"
                step="1"
              />
              {errors.min_stock_level && <p className="mt-1 text-sm text-red-600">{errors.min_stock_level}</p>}
            </div>
            
            {/* Reorder Level */}
            <div>
              <label htmlFor="reorder_level" className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="reorder_level"
                name="reorder_level"
                value={formData.reorder_level}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.reorder_level ? 'border-red-300' : ''
                }`}
                placeholder="Enter reorder level"
                min="0"
                step="1"
              />
              {errors.reorder_level && <p className="mt-1 text-sm text-red-600">{errors.reorder_level}</p>}
            </div>
            
            {/* Max Stock Level */}
            <div>
              <label htmlFor="max_stock_level" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Stock Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="max_stock_level"
                name="max_stock_level"
                value={formData.max_stock_level}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.max_stock_level ? 'border-red-300' : ''
                }`}
                placeholder="Enter maximum stock level"
                min="0"
                step="1"
              />
              {errors.max_stock_level && <p className="mt-1 text-sm text-red-600">{errors.max_stock_level}</p>}
            </div>
            
            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter raw material description"
              ></textarea>
            </div>
            
            {/* Active Status */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/inventory/raw-materials"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : 'Save Raw Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
