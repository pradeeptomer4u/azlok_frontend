'use client';

import { useState, useEffect } from 'react';
import { formatTaxPercentage } from '../../utils/taxService';

// Define types for tax rate data
interface TaxRate {
  id: number;
  category_id?: number;
  category_name?: string;
  hsn_code?: string;
  region_code?: string;
  region_name?: string;
  tax_percentage: number;
  is_default: boolean;
  effective_from: string;
  effective_to?: string;
}

interface BulkUpdateItem {
  id: number;
  selected: boolean;
  originalRate: number;
  newRate: number;
}

const BulkTaxRateUpdate = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [bulkItems, setBulkItems] = useState<BulkUpdateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [bulkUpdateRate, setBulkUpdateRate] = useState<number | ''>('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [regions, setRegions] = useState<{code: string, name: string}[]>([]);

  // Mock tax rates data
  const mockTaxRates: TaxRate[] = [
    {
      id: 1,
      category_id: 1,
      category_name: 'Electronics',
      hsn_code: '8517',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 18,
      is_default: true,
      effective_from: '2023-01-01'
    },
    {
      id: 2,
      category_id: 2,
      category_name: 'Textiles',
      hsn_code: '5208',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 5,
      is_default: true,
      effective_from: '2023-01-01'
    },
    {
      id: 3,
      category_id: 3,
      category_name: 'Machinery',
      hsn_code: '8422',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 12,
      is_default: true,
      effective_from: '2023-01-01'
    },
    {
      id: 4,
      category_id: 1,
      category_name: 'Electronics',
      hsn_code: '8517',
      region_code: 'MH',
      region_name: 'Maharashtra',
      tax_percentage: 18,
      is_default: false,
      effective_from: '2023-01-01'
    },
    {
      id: 5,
      category_id: 2,
      category_name: 'Textiles',
      hsn_code: '5208',
      region_code: 'MH',
      region_name: 'Maharashtra',
      tax_percentage: 5,
      is_default: false,
      effective_from: '2023-01-01'
    },
    {
      id: 6,
      category_id: 4,
      category_name: 'Furniture',
      hsn_code: '9403',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 18,
      is_default: true,
      effective_from: '2023-01-01'
    },
    {
      id: 7,
      category_id: 5,
      category_name: 'Pharmaceuticals',
      hsn_code: '3004',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 12,
      is_default: true,
      effective_from: '2023-01-01'
    },
    {
      id: 8,
      category_id: 6,
      category_name: 'Food Products',
      hsn_code: '2106',
      region_code: 'ALL',
      region_name: 'All India',
      tax_percentage: 5,
      is_default: true,
      effective_from: '2023-01-01'
    }
  ];

  // In a real app, we would fetch tax rates from an API
  useEffect(() => {
    const fetchTaxRates = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setTaxRates(mockTaxRates);
          
          // Extract unique categories and regions for filters
          const uniqueCategories = Array.from(
            new Set(mockTaxRates.map(rate => JSON.stringify({ id: rate.category_id, name: rate.category_name })))
          ).map(str => JSON.parse(str));
          
          const uniqueRegions = Array.from(
            new Set(mockTaxRates.map(rate => JSON.stringify({ code: rate.region_code, name: rate.region_name })))
          ).map(str => JSON.parse(str));
          
          setCategories(uniqueCategories);
          setRegions(uniqueRegions);
          
          // Initialize bulk update items
          const items = mockTaxRates.map(rate => ({
            id: rate.id,
            selected: false,
            originalRate: rate.tax_percentage,
            newRate: rate.tax_percentage
          }));
          setBulkItems(items);
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tax rates:', error);
        setIsLoading(false);
      }
    };

    fetchTaxRates();
  }, []);

  // Filter tax rates based on search criteria
  const filteredTaxRates = taxRates.filter(rate => {
    const searchMatch = filter === '' || 
      rate.category_name?.toLowerCase().includes(filter.toLowerCase()) ||
      rate.hsn_code?.toLowerCase().includes(filter.toLowerCase()) ||
      rate.region_name?.toLowerCase().includes(filter.toLowerCase());
    
    const categoryMatch = categoryFilter === '' || 
      rate.category_id?.toString() === categoryFilter;
    
    const regionMatch = regionFilter === '' || 
      rate.region_code === regionFilter;
    
    return searchMatch && categoryMatch && regionMatch;
  });

  // Handle checkbox selection for bulk update
  const handleSelectItem = (id: number) => {
    setBulkItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const allSelected = bulkItems.every(item => {
      const taxRate = taxRates.find(rate => rate.id === item.id);
      return !taxRate || item.selected;
    });
    
    setBulkItems(prevItems => 
      prevItems.map(item => {
        const taxRate = taxRates.find(rate => rate.id === item.id);
        if (!taxRate) return item;
        return { ...item, selected: !allSelected };
      })
    );
  };

  // Handle individual tax rate change
  const handleRateChange = (id: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
    
    setBulkItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, newRate: numValue } : item
      )
    );
  };

  // Handle bulk update rate change
  const handleBulkRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setBulkUpdateRate('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;
    setBulkUpdateRate(numValue);
  };

  // Apply bulk rate to selected items
  const applyBulkRate = () => {
    if (bulkUpdateRate === '') return;
    
    setBulkItems(prevItems => 
      prevItems.map(item => 
        item.selected ? { ...item, newRate: bulkUpdateRate as number } : item
      )
    );
  };

  // Submit bulk update
  const submitBulkUpdate = async () => {
    setUpdateSuccess(false);
    setUpdateError(null);
    
    const itemsToUpdate = bulkItems.filter(item => 
      item.selected && item.newRate !== item.originalRate
    );
    
    if (itemsToUpdate.length === 0) {
      setUpdateError('No changes to update');
      return;
    }
    
    try {
      // In a real app, we would send this to an API
      console.log('Updating tax rates:', itemsToUpdate);
      
      // Simulate API call
      setTimeout(() => {
        // Update the tax rates in our state
        const updatedTaxRates = taxRates.map(rate => {
          const updateItem = itemsToUpdate.find(item => item.id === rate.id);
          if (updateItem) {
            return { ...rate, tax_percentage: updateItem.newRate };
          }
          return rate;
        });
        
        setTaxRates(updatedTaxRates);
        
        // Reset bulk items with new original rates
        const newBulkItems = bulkItems.map(item => {
          const updateItem = itemsToUpdate.find(i => i.id === item.id);
          if (updateItem) {
            return { ...item, originalRate: updateItem.newRate, newRate: updateItem.newRate, selected: false };
          }
          return { ...item, selected: false };
        });
        
        setBulkItems(newBulkItems);
        setUpdateSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Error updating tax rates:', error);
      setUpdateError('Failed to update tax rates. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Bulk Tax Rate Update</h2>
      </div>
      
      <div className="p-4">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search by category, HSN code, region..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              id="region"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.code} value={region.code}>{region.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Bulk Update Controls */}
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="bulkRate" className="block text-sm font-medium text-gray-700 mb-1">Bulk Update Tax Rate (%)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="bulkRate"
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Rate %"
                  min="0"
                  max="100"
                  step="0.01"
                  value={bulkUpdateRate}
                  onChange={handleBulkRateChange}
                />
                <button
                  className="ml-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={applyBulkRate}
                  disabled={bulkUpdateRate === ''}
                >
                  Apply to Selected
                </button>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <button
                className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                onClick={submitBulkUpdate}
              >
                Update Tax Rates
              </button>
            </div>
          </div>
          
          {updateSuccess && (
            <div className="mt-2 text-sm text-green-600">
              Tax rates updated successfully!
            </div>
          )}
          
          {updateError && (
            <div className="mt-2 text-sm text-red-600">
              {updateError}
            </div>
          )}
        </div>
        
        {/* Tax Rates Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={bulkItems.length > 0 && bulkItems.every(item => {
                        const taxRate = filteredTaxRates.find(rate => rate.id === item.id);
                        return !taxRate || item.selected;
                      })}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HSN Code
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Rate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Rate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective From
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTaxRates.map((rate) => {
                const bulkItem = bulkItems.find(item => item.id === rate.id);
                return (
                  <tr key={rate.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={bulkItem?.selected || false}
                        onChange={() => handleSelectItem(rate.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {rate.category_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {rate.hsn_code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {rate.region_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatTaxPercentage(rate.tax_percentage)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className={`w-20 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          bulkItem && bulkItem.originalRate !== bulkItem.newRate ? 'bg-yellow-50 border-yellow-300' : ''
                        }`}
                        min="0"
                        max="100"
                        step="0.01"
                        value={bulkItem?.newRate || rate.tax_percentage}
                        onChange={(e) => handleRateChange(rate.id, e.target.value)}
                        disabled={!bulkItem?.selected}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {new Date(rate.effective_from).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              
              {filteredTaxRates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No tax rates found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkTaxRateUpdate;
