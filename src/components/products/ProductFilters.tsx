'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import categoryService from '../../services/categoryService';

interface FilterCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const ProductFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams?.get('category') || null);
  const [priceRange, setPriceRange] = useState({
    min: searchParams?.get('minPrice') || '',
    max: searchParams?.get('maxPrice') || ''
  });
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams?.get('verified') === 'true');
  const [taxInclusiveOnly, setTaxInclusiveOnly] = useState(searchParams?.get('taxInclusive') === 'true');
  const [maxTaxRate, setMaxTaxRate] = useState(searchParams?.get('maxTaxRate') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch categories with product counts from API
        const apiCategories = await categoryService.getCategoriesWithProductCount();
        
        // Transform API categories to match filter interface
        const transformedCategories: FilterCategory[] = apiCategories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: category.product_count || 0
        }));
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update URL with filters
  const updateFilters = (filters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
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
    router.push(pathname || '/');
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <>
      <div className="sticky top-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-4 md:p-5 border border-[#dbf9e1]/60 relative overflow-hidden group/filters">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#dbf9e1]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover/filters:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#dbf9e1]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover/filters:opacity-100 transition-opacity duration-700 delay-100"></div>
          <div className="flex justify-between items-center mb-3 sm:mb-4 relative z-10">
            <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold text-[#5dc285] relative inline-block">
              Filters
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs sm:text-sm text-[#5dc285] hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-opacity-50 focus:ring-offset-2 rounded-sm transition-colors duration-300 font-['Montserrat',sans-serif] font-medium"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <h4 className="font-['Montserrat',sans-serif] font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 border-l-2 border-[#5dc285] pl-2">Categories</h4>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-5 sm:h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 sm:space-y-2 max-h-40 sm:max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                <div 
                  className={`flex items-center justify-between cursor-pointer hover:bg-[#dbf9e1]/30 p-1.5 rounded text-sm sm:text-base transition-colors duration-300 ${!selectedCategory ? 'font-medium text-[#5dc285] bg-[#dbf9e1]/20' : 'font-light'}`}
                  onClick={() => handleCategoryChange(null)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={!selectedCategory}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryChange(null)}
                >
                  <span className="font-['Montserrat',sans-serif]">All Categories</span>
                </div>
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className={`flex items-center justify-between cursor-pointer hover:bg-[#dbf9e1]/30 p-1.5 rounded text-sm sm:text-base transition-colors duration-300 ${selectedCategory === category.slug ? 'font-medium text-[#5dc285] bg-[#dbf9e1]/20' : 'font-light'}`}
                    onClick={() => handleCategoryChange(category.slug)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedCategory === category.slug}
                    onKeyDown={(e) => e.key === 'Enter' && handleCategoryChange(category.slug)}
                  >
                    <span className="font-['Montserrat',sans-serif]">{category.name}</span>
                    <span className="text-[#5dc285] text-xs sm:text-sm bg-[#dbf9e1]/30 px-2 py-0.5 rounded-full font-['Montserrat',sans-serif]">{category.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <h4 className="font-['Montserrat',sans-serif] font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 border-l-2 border-[#5dc285] pl-2">Price Range (₹)</h4>
            <div className="flex space-x-2 bg-[#dbf9e1]/10 p-2 rounded-md border border-[#dbf9e1]/30">
              <div className="w-1/2 relative group/input">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/20 via-[#5dc285]/20 to-[#5dc285]/20 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full border border-[#dbf9e1]/50 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5dc285] bg-white/90 font-['Montserrat',sans-serif] relative z-10"
                  aria-label="Minimum price"
                />
              </div>
              <div className="w-1/2 relative group/input">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/20 via-[#5dc285]/20 to-[#5dc285]/20 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full border border-[#dbf9e1]/50 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5dc285] bg-white/90 font-['Montserrat',sans-serif] relative z-10"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {/* Verified Suppliers Filter */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <h4 className="font-['Montserrat',sans-serif] font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 border-l-2 border-[#5dc285] pl-2">Supplier Options</h4>
            <div className="bg-[#dbf9e1]/10 p-2 rounded-md border border-[#dbf9e1]/30">
              <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => handleVerifiedChange(e.target.checked)}
                    className="rounded text-[#5dc285] focus:ring-[#5dc285] h-3.5 w-3.5 sm:h-4 sm:w-4 border-[#5dc285]/30"
                    aria-label="Show only verified suppliers"
                  />
                  <div className="absolute -inset-1 bg-[#5dc285]/10 rounded-full scale-0 group-hover/check:scale-100 transition-transform duration-200"></div>
                </div>
                <span className="font-['Montserrat',sans-serif] font-light">Verified Suppliers Only</span>
              </label>
            </div>
          </div>

          {/* Tax Filters */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <h4 className="font-['Montserrat',sans-serif] font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 border-l-2 border-[#5dc285] pl-2">Tax Options</h4>
            
            <div className="bg-[#dbf9e1]/10 p-2 rounded-md border border-[#dbf9e1]/30">
              {/* Tax Inclusive Filter */}
              <div className="mb-3">
                <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base group/check">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={taxInclusiveOnly}
                      onChange={(e) => handleTaxInclusiveChange(e.target.checked)}
                      className="rounded text-[#5dc285] focus:ring-[#5dc285] h-3.5 w-3.5 sm:h-4 sm:w-4 border-[#5dc285]/30"
                      aria-label="Show only tax inclusive products"
                    />
                    <div className="absolute -inset-1 bg-[#5dc285]/10 rounded-full scale-0 group-hover/check:scale-100 transition-transform duration-200"></div>
                  </div>
                  <span className="font-['Montserrat',sans-serif] font-light">Tax Inclusive Products Only</span>
                </label>
              </div>
              
              {/* Max Tax Rate Filter */}
              <div className="mt-3">
                <label className="block text-sm mb-1 font-['Montserrat',sans-serif] font-medium text-gray-700">Maximum Tax Rate (%)</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/20 via-[#5dc285]/20 to-[#5dc285]/20 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="number"
                    placeholder="e.g. 18"
                    value={maxTaxRate}
                    onChange={(e) => handleMaxTaxRateChange(e.target.value)}
                    min="0"
                    max="28"
                    className="w-full border border-[#dbf9e1]/50 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5dc285] bg-white/90 font-['Montserrat',sans-serif] relative z-10"
                    aria-label="Maximum tax rate percentage"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 font-['Montserrat',sans-serif] italic">Filter products with GST rate up to this percentage</p>
              </div>
            </div>
          </div>

          {/* Location Filter (could be expanded in a real app) */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <h4 className="font-['Montserrat',sans-serif] font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-700 border-l-2 border-[#5dc285] pl-2">Location</h4>
            <div className="relative group/select">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/20 via-[#5dc285]/20 to-[#5dc285]/20 rounded-md blur opacity-0 group-hover/select:opacity-100 transition-opacity duration-300"></div>
              <select
                className="w-full border border-[#dbf9e1]/50 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5dc285] bg-white/90 font-['Montserrat',sans-serif] relative z-10 appearance-none pr-8"
                defaultValue=""
                aria-label="Filter by location"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235dc285%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "0.6em auto" }}
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
          <div className="mt-4 sm:mt-6 lg:hidden relative z-10">
            <div className="relative group/btn">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/30 via-[#5dc285]/30 to-[#5dc285]/30 rounded-md blur opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-[#5dc285] to-[#5dc285] text-white py-1.5 sm:py-2 rounded-md hover:from-[#5dc285]/90 hover:to-[#5dc285]/90 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-offset-2 shadow-sm hover:shadow relative z-10 font-['Montserrat',sans-serif] font-medium"
                aria-label="Apply filters"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductFilters;
