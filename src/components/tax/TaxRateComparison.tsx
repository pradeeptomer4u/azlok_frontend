'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatTaxPercentage } from '../../utils/taxService';
import { getTaxRates, TaxRate } from '../../services/taxService';

// TaxRate interface is now imported from taxService

interface TaxRateComparisonProps {
  initialCategories?: number[];
  initialRegions?: string[];
}

const TaxRateComparison = ({ initialCategories = [], initialRegions = [] }: TaxRateComparisonProps) => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [regions, setRegions] = useState<{code: string, name: string}[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialCategories);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(initialRegions);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleProduct, setSampleProduct] = useState({
    price: 10000,
    quantity: 1
  });
  interface ComparisonResult {
    category: string;
    region: string;
    hsn_code: string;
    tax_percentage: number;
    base_price: number;
    tax_amount: number;
    cgst: number;
    sgst: number;
    igst: number;
    total_price: number;
  }

  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);

  // Tax rates are now fetched from taxService

  // Fetch tax rates from taxService
  useEffect(() => {
    const fetchTaxRates = async () => {
      setIsLoading(true);
      try {
        // Get tax rates from service
        const rates = await getTaxRates();
        setTaxRates(rates);
        
        // Extract unique categories and regions for filters
        const uniqueCategories = Array.from(
          new Set(rates.map(rate => JSON.stringify({ id: rate.category_id, name: rate.category_name })))
        ).map(str => JSON.parse(str));
        
        const uniqueRegions = Array.from(
          new Set(rates.map(rate => JSON.stringify({ code: rate.region_code, name: rate.region_name })))
        ).map(str => JSON.parse(str));
        
        setCategories(uniqueCategories);
        setRegions(uniqueRegions);
      } catch (error) {
        console.error('Error fetching tax rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxRates();
  }, []);

  // Calculate tax comparison whenever selections or sample product changes
  useEffect(() => {
    if (selectedCategories.length === 0 || selectedRegions.length === 0) {
      setComparisonResults([]);
      return;
    }

    const results: ComparisonResult[] = [];

    // For each selected category
    selectedCategories.forEach(categoryId => {
      const categoryName = categories.find(c => c.id === categoryId)?.name || 'Unknown';
      
      // Get tax rates for this category
      const categoryRates = taxRates.filter(rate => rate.category_id === categoryId);
      
      // For each selected region
      selectedRegions.forEach(regionCode => {
        const regionName = regions.find(r => r.code === regionCode)?.name || 'Unknown';
        
        // Find the specific tax rate for this category and region
        let taxRate = categoryRates.find(rate => rate.region_code === regionCode);
        
        // If no specific rate for this region, use the default (ALL) rate
        if (!taxRate) {
          taxRate = categoryRates.find(rate => rate.region_code === 'ALL');
        }
        
        if (taxRate) {
          // Calculate tax amounts
          const basePrice = sampleProduct.price * sampleProduct.quantity;
          const taxAmount = basePrice * (taxRate.tax_percentage / 100);
          const totalPrice = basePrice + taxAmount;
          
          // Calculate CGST, SGST, IGST
          let cgst = 0;
          let sgst = 0;
          let igst = 0;
          
          // For simplicity, assume seller is in Maharashtra (MH)
          const sellerState = 'MH';
          
          if (regionCode === sellerState) {
            // Intra-state: Split into CGST and SGST
            cgst = taxAmount / 2;
            sgst = taxAmount / 2;
          } else {
            // Inter-state: Full amount as IGST
            igst = taxAmount;
          }
          
          results.push({
            category: categoryName,
            region: regionName,
            hsn_code: taxRate.hsn_code,
            tax_percentage: taxRate.tax_percentage,
            base_price: basePrice,
            tax_amount: taxAmount,
            cgst,
            sgst,
            igst,
            total_price: totalPrice
          });
        }
      });
    });
    
    setComparisonResults(results);
  }, [selectedCategories, selectedRegions, sampleProduct, taxRates, categories, regions]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleRegionChange = (regionCode: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionCode)) {
        return prev.filter(code => code !== regionCode);
      } else {
        return [...prev, regionCode];
      }
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSampleProduct(prev => ({ ...prev, price: value }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSampleProduct(prev => ({ ...prev, quantity: value }));
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
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-medium text-gray-800">Tax Rate Comparison</h2>
        <p className="text-sm text-gray-600 mt-1">
          Compare tax rates and calculations across different product categories and regions
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Categories Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Product Categories</h3>
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="flex items-center mb-2 last:mb-0">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Regions Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Regions</h3>
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
              {regions.map(region => (
                <div key={region.code} className="flex items-center mb-2 last:mb-0">
                  <input
                    type="checkbox"
                    id={`region-${region.code}`}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedRegions.includes(region.code)}
                    onChange={() => handleRegionChange(region.code)}
                  />
                  <label htmlFor={`region-${region.code}`} className="ml-2 text-sm text-gray-700">
                    {region.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sample Product Configuration */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Product Configuration</h3>
            <div className="border rounded-md p-3">
              <div className="mb-3">
                <label htmlFor="price" className="block text-xs text-gray-500 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sampleProduct.price}
                  onChange={handlePriceChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-xs text-gray-500 mb-1">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sampleProduct.quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  step="1"
                />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>Total Base Price: {formatCurrency(sampleProduct.price * sampleProduct.quantity)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comparison Results */}
        {comparisonResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HSN Code
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Rate
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CGST
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SGST
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IGST
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                      {result.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {result.region}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {result.hsn_code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatTaxPercentage(result.tax_percentage)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(result.base_price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(result.tax_amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(result.cgst)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(result.sgst)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(result.igst)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(result.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 text-center rounded-md">
            <p className="text-gray-600">
              {selectedCategories.length === 0 || selectedRegions.length === 0 
                ? "Please select at least one category and one region to compare tax rates" 
                : "No tax rates found for the selected combination"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxRateComparison;
