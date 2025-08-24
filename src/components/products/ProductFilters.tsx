'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Mock data for categories - in a real app, this would come from an API
const mockCategories = [
  { id: 1, name: 'Machinery', slug: 'machinery', count: 156 },
  { id: 2, name: 'Textiles', slug: 'textiles', count: 89 },
  { id: 3, name: 'Electronics', slug: 'electronics', count: 124 },
  { id: 4, name: 'Appliances', slug: 'appliances', count: 67 },
  { id: 5, name: 'Food', slug: 'food', count: 45 },
  { id: 6, name: 'Furniture', slug: 'furniture', count: 38 },
  { id: 7, name: 'Safety', slug: 'safety', count: 29 },
  { id: 8, name: 'Chemicals', slug: 'chemicals', count: 52 },
  { id: 9, name: 'Energy', slug: 'energy', count: 31 },
  { id: 10, name: 'Automotive', slug: 'automotive', count: 78 },
  { id: 11, name: 'Construction', slug: 'construction', count: 63 },
  { id: 12, name: 'Packaging', slug: 'packaging', count: 42 }
];

const ProductFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [taxInclusiveOnly, setTaxInclusiveOnly] = useState(searchParams.get('taxInclusive') === 'true');
  const [maxTaxRate, setMaxTaxRate] = useState(searchParams.get('maxTaxRate') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // In a real implementation, we would fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Simulating API call
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        // setCategories(data);
        
        // Using mock data for now
        setTimeout(() => {
          setCategories(mockCategories);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update URL with filters
  const updateFilters = (filters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove each filter parameter
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // In a real app with Next.js, we would use router.push
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateFilters({ category });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    
    // Only update URL when user stops typing (debounce)
    const timer = setTimeout(() => {
      updateFilters({
        minPrice: newPriceRange.min,
        maxPrice: newPriceRange.max
      });
    }, 500);
    
    return () => clearTimeout(timer);
  };

  const handleVerifiedChange = (checked: boolean) => {
    setVerifiedOnly(checked);
    updateFilters({ verified: checked ? 'true' : null });
  };

  const handleTaxInclusiveChange = (checked: boolean) => {
    setTaxInclusiveOnly(checked);
    updateFilters({ taxInclusive: checked ? 'true' : null });
  };

  const handleMaxTaxRateChange = (value: string) => {
    setMaxTaxRate(value);
    
    // Only update URL when user stops typing (debounce)
    const timer = setTimeout(() => {
      updateFilters({ maxTaxRate: value || null });
    }, 500);
    
    return () => clearTimeout(timer);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: '', max: '' });
    setVerifiedOnly(false);
    setTaxInclusiveOnly(false);
    setMaxTaxRate('');
    router.push(pathname);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <>
      {/* Mobile Filter Toggle - Removed from here as it's now in the parent component */}
      
      {/* Filter Sidebar - Hidden on mobile unless toggled */}
      <div className="sticky top-4">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-5">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs sm:text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Categories</h4>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-5 sm:h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 sm:space-y-2 max-h-40 sm:max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                <div 
                  className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded text-sm sm:text-base ${!selectedCategory ? 'font-medium text-primary' : ''}`}
                  onClick={() => handleCategoryChange(null)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={!selectedCategory}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryChange(null)}
                >
                  <span>All Categories</span>
                </div>
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded text-sm sm:text-base ${selectedCategory === category.slug ? 'font-medium text-primary' : ''}`}
                    onClick={() => handleCategoryChange(category.slug)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedCategory === category.slug}
                    onKeyDown={(e) => e.key === 'Enter' && handleCategoryChange(category.slug)}
                  >
                    <span>{category.name}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">{category.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Price Range (₹)</h4>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Minimum price"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {/* Verified Suppliers Filter */}
          <div className="mb-4 sm:mb-6">
            <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => handleVerifiedChange(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-label="Show only verified suppliers"
              />
              <span>Verified Suppliers Only</span>
            </label>
          </div>

          {/* Tax Filters */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Tax Options</h4>
            
            {/* Tax Inclusive Filter */}
            <div className="mb-2">
              <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={taxInclusiveOnly}
                  onChange={(e) => handleTaxInclusiveChange(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5 sm:h-4 sm:w-4"
                  aria-label="Show only tax inclusive products"
                />
                <span>Tax Inclusive Products Only</span>
              </label>
            </div>
            
            {/* Max Tax Rate Filter */}
            <div className="mt-3">
              <label className="block text-sm mb-1">Maximum Tax Rate (%)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={maxTaxRate}
                onChange={(e) => handleMaxTaxRateChange(e.target.value)}
                min="0"
                max="28"
                className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Maximum tax rate percentage"
              />
              <p className="text-xs text-gray-500 mt-1">Filter products with GST rate up to this percentage</p>
            </div>
          </div>

          {/* Location Filter (could be expanded in a real app) */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Location</h4>
            <select
              className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue=""
              aria-label="Filter by location"
            >
              <option value="">All of India</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="chennai">Chennai</option>
              <option value="kolkata">Kolkata</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="ahmedabad">Ahmedabad</option>
            </select>
          </div>

          {/* Apply Filters Button (Mobile Only) */}
          <div className="mt-4 sm:mt-6 lg:hidden">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-primary text-white py-1.5 sm:py-2 rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Apply filters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
