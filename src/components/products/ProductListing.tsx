'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import type { Product as ProductCardProduct } from '@/components/products/ProductCard';
import { calculateProductTax, TaxCalculationRequest } from '../../utils/taxService';
import productService, { Product as ApiProduct, ProductFilters } from '../../services/productService';
import ProductListSchema from '../SEO/ProductListSchema';

// Define the Product type that combines API data with UI-specific fields
type Product = ApiProduct & Omit<ProductCardProduct, 'id' | 'price' | 'rating'> & {
  category_name?: string;
};

interface ProductListingProps {
  categorySlug?: string;
}

const ProductListing = ({ categorySlug }: ProductListingProps = {}) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsWithTax, setProductsWithTax] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTaxLoading, setIsTaxLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [buyerState, setBuyerState] = useState('MH'); // Default to Maharashtra
  const productsPerPage = 8;

  // Fetch products from the API with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Get filter parameters from URL
        const category = searchParams?.get('category') ?? null;
        const minPrice = searchParams?.get('minPrice') ?? null;
        const maxPrice = searchParams?.get('maxPrice') ?? null;
        const taxInclusiveOnly = searchParams?.get('taxInclusive') === 'true';
        const maxTaxRate = searchParams?.get('maxTaxRate') ?? null;
        const searchQuery = searchParams?.get('q') ?? null;
        const sort = searchParams?.get('sort') ?? sortBy;
        const state = searchParams?.get('state') ?? buyerState;
        
        // Build API filters
        const filters: ProductFilters = {
          page: 1,
          size: 50, // Fetch more products to allow for client-side filtering
          search: searchQuery || '',
          min_price: minPrice ? Number(minPrice) : 0,
          max_price: maxPrice ? Number(maxPrice) : 99999999
        };
        
        // Handle sorting
        if (sort === 'price_asc') {
          filters.sort_by = 'price';
          filters.sort_order = 'asc';
        } else if (sort === 'price_desc') {
          filters.sort_by = 'price';
          filters.sort_order = 'desc';
        } else if (sort === 'rating') {
          filters.sort_by = 'rating';
          filters.sort_order = 'desc';
        }
        
        let fetchedProducts: any[] = [];
        
        // Apply category filter from props (for category pages)
        if (categorySlug) {
          // Use the new category slug filtering method
          fetchedProducts = await productService.getProductsByCategorySlug(categorySlug, 50);
        }
        // Apply category filter from URL params
        else if (category) {
          // Use category slug filtering method for URL category filter
          fetchedProducts = await productService.getProductsByCategorySlug(category, 50);
        }
        else {
          // Fetch all products
          const response = await productService.getProducts(filters);
          fetchedProducts = response.items || [];
        }
        
        // Check if we have products and handle undefined
        if (!fetchedProducts || !Array.isArray(fetchedProducts)) {
          console.warn('No products fetched or invalid format:', fetchedProducts);
          setProducts([]);
          setIsLoading(false);
          return;
        }

        // Transform API products to match our UI component needs
        const transformedProducts = fetchedProducts.map((product: ApiProduct) => ({
          ...product,
          image: Array.isArray(product.image_urls) ? product.image_urls[0] : 
                 typeof product.image_urls === 'string' ? JSON.parse(product.image_urls)[0] : 
                 product.image_url || '/globe.svg',
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          category: product.categories && product.categories.length > 0 ? 
                   product.categories[0].name : 'uncategorized',
          rating: product.rating || 0,
          isVerified: true,
          minOrder: 1,
          seller: product.seller?.business_name || product.seller?.full_name || 'Azlok Enterprises',
          location: product.seller?.region || 'Mumbai, India'
        })) as Product[];
        
        setSortBy(sort);
        setBuyerState(state);
        
        setProducts(transformedProducts);
        setIsLoading(false);
        
        // After setting products, fetch tax information
        fetchTaxInformation(transformedProducts, state, taxInclusiveOnly || false, maxTaxRate || undefined);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, categorySlug, sortBy]);
  
  // Function to fetch tax information for products
  const fetchTaxInformation = async (productsList: Product[], state: string, taxInclusiveOnly?: boolean, maxTaxRate?: string) => {
    setIsTaxLoading(true);
    try {
      // Create a copy of products to add tax information
      const productsWithTaxInfo = [...productsList];
      
      // For each product, fetch tax information
      const taxPromises = productsWithTaxInfo.map(async (product) => {
        try {
          const request: TaxCalculationRequest = {
            product_id: product.id,
            quantity: 1, // Default quantity
            buyer_state: state,
            seller_state: 'MH' // Default seller state to Maharashtra
          };
          
          const taxInfo = await calculateProductTax(request);
          
          // Add tax information to product
          return {
            ...product,
            tax_percentage: taxInfo.tax_percentage,
            tax_amount: taxInfo.tax_amount,
            cgst_amount: taxInfo.cgst_amount,
            sgst_amount: taxInfo.sgst_amount,
            igst_amount: taxInfo.igst_amount,
            is_tax_inclusive: taxInfo.is_tax_inclusive,
            hsn_code: taxInfo.hsn_code,
            price_with_tax: taxInfo.price_with_tax,
            price_without_tax: taxInfo.price_without_tax
          };
        } catch (error) {
          console.error(`Error fetching tax for product ${product.id}:`, error);
          return product; // Return original product if tax calculation fails
        }
      });
      
      // Wait for all tax calculations to complete
      const productsWithTaxResults = await Promise.all(taxPromises);
      
      // Apply tax-related filters if needed
      let filteredTaxProducts = [...productsWithTaxResults];
      
      // Filter by tax inclusive only
      if (taxInclusiveOnly) {
        filteredTaxProducts = filteredTaxProducts.filter(product => product.is_tax_inclusive);
      }
      
      // Filter by maximum tax rate
      if (maxTaxRate && !isNaN(Number(maxTaxRate))) {
        const maxRate = Number(maxTaxRate);
        filteredTaxProducts = filteredTaxProducts.filter(product => 
          !product.tax_percentage || product.tax_percentage <= maxRate
        );
      }
      
      setProductsWithTax(filteredTaxProducts);
      
      // This section has been replaced by the code above
    } catch (error) {
      console.error('Error fetching tax information:', error);
      setProductsWithTax(productsList); // Use original products if tax fetch fails
    } finally {
      setIsTaxLoading(false);
    }
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // Use products with tax if available, otherwise use original products
  const displayProducts = productsWithTax.length > 0 ? productsWithTax : products;
  const currentProducts = displayProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(displayProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    
    // Update the URL with the new sort parameter
    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    window.history.pushState({}, '', url);
    
    // The useEffect will handle re-fetching with the new sort parameter
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show a smaller loading indicator when fetching tax information
  const TaxLoadingIndicator = () => {
    if (!isTaxLoading) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center z-50">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
        <span className="text-sm text-gray-600">Calculating taxes...</span>
      </div>
    );
  };

  return (
    <div className="product-listing">
      {/* Add Product List Schema for SEO */}
      {products.length > 0 && (
        <ProductListSchema 
          products={products} 
          listType="ItemList" 
          listName={categorySlug ? `${categorySlug.replace(/-/g, ' ')} Products` : 'Product Listing'}
        />
      )}
      <TaxLoadingIndicator />
      
      <div className="relative bg-gradient-to-r from-[#dbf9e1]/80 to-[#dbf9e1]/40 rounded-lg p-4 sm:p-5 mb-6 sm:mb-8 shadow-sm overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#5dc285]/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#5dc285]/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 border border-[#5dc285]/20 rounded-full opacity-50"></div>
        <div className="absolute -left-4 top-1/4 w-8 h-8 border border-[#5dc285]/20 rounded-full opacity-30 animate-pulse-slow"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5dc285] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-['Playfair_Display',serif] font-semibold text-[#2c7a4c] relative inline-block">
                {displayProducts.length} Products Found
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#5dc285] to-transparent"></div>
              </h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 pl-7 font-['Montserrat',sans-serif]">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, displayProducts.length)} of {displayProducts.length} products
            </p>
            
            {/* Direct sourcing highlight */}
            <div className="mt-2 pl-7 flex items-center">
              <span className="inline-flex items-center text-xs font-medium text-[#d97706] bg-[#f59e0b]/10 px-2 py-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M3 16V6a3 3 0 013-3h12a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
                </svg>
                Artisanal
              </span>
              <span className="inline-flex items-center text-xs font-medium text-[#2c7a4c] bg-[#4ade80]/10 px-2 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Farm Fresh
              </span>
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 relative">
            {/* State selection for tax calculation */}
            <div className="relative group/select">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5dc285]/20 via-[#5dc285]/20 to-[#5dc285]/20 rounded-md blur opacity-0 group-hover/select:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <label htmlFor="state" className="block text-[#2c7a4c] text-xs font-medium mb-1 font-['Montserrat',sans-serif]">Your State</label>
                <select
                  id="state"
                  value={buyerState}
                  onChange={(e) => {
                    setBuyerState(e.target.value);
                    // Re-fetch tax information when state changes
                    const taxInclusiveParam = searchParams?.get('taxInclusive') === 'true';
                    const maxTaxRateParam = searchParams?.get('maxTaxRate') ?? undefined;
                    fetchTaxInformation(products, e.target.value, taxInclusiveParam, maxTaxRateParam);
                  }}
                  className="border border-[#5dc285]/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5dc285] bg-white/90 w-full sm:w-auto appearance-none pr-8 relative z-10"
                  aria-label="Select your state for tax calculation"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235dc285%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "0.6em auto" }}
                >
                  <option value="AP">Andhra Pradesh</option>
                  <option value="AR">Arunachal Pradesh</option>
                  <option value="AS">Assam</option>
                  <option value="BR">Bihar</option>
                  <option value="CG">Chhattisgarh</option>
                  <option value="GA">Goa</option>
                  <option value="GJ">Gujarat</option>
                  <option value="HR">Haryana</option>
                  <option value="HP">Himachal Pradesh</option>
                  <option value="JH">Jharkhand</option>
                  <option value="KA">Karnataka</option>
                  <option value="KL">Kerala</option>
                  <option value="MP">Madhya Pradesh</option>
                  <option value="MH">Maharashtra</option>
                  <option value="MN">Manipur</option>
                  <option value="ML">Meghalaya</option>
                  <option value="MZ">Mizoram</option>
                  <option value="NL">Nagaland</option>
                  <option value="OD">Odisha</option>
                  <option value="PB">Punjab</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="SK">Sikkim</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="TS">Telangana</option>
                  <option value="TR">Tripura</option>
                  <option value="UK">Uttarakhand</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="WB">West Bengal</option>
                  <option value="AN">Andaman and Nicobar Islands</option>
                  <option value="CH">Chandigarh</option>
                  <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="DL">Delhi</option>
                  <option value="JK">Jammu and Kashmir</option>
                  <option value="LA">Ladakh</option>
                  <option value="LD">Lakshadweep</option>
                  <option value="PY">Puducherry</option>
                </select>
              </div>
          </div>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700 text-sm">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-grow sm:flex-grow-0"
              aria-label="Sort products by"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-8 sm:py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold mt-3 sm:mt-4">No products found</h3>
          <p className="text-gray-600 text-sm mt-1 sm:mt-2">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {currentProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                rating: product.rating || 0, // Ensure rating is always a number
                minOrder: product.minOrder || 1,
                seller: product.seller || 'Unknown',
                location: product.location || 'Unknown',
                isVerified: product.isVerified || false,
                category: product.category_name || 'uncategorized'
              }} 
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <nav className="flex flex-wrap items-center" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-l-md border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Previous page"
            >
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">&larr;</span>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers with ellipsis
              // On mobile, show fewer page numbers
              const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
              const showOnMobile = 
                pageNumber === 1 ||
                pageNumber === totalPages ||
                pageNumber === currentPage;
              
              if (
                (isMobileView && showOnMobile) ||
                (!isMobileView && (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ))
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border-t border-b ${
                      currentPage === pageNumber
                        ? 'bg-primary bg-opacity-20 text-primary font-bold border-primary'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (!isMobileView && (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                )) ||
                (isMobileView && (
                  (pageNumber === currentPage - 1 && currentPage > 2) ||
                  (pageNumber === currentPage + 1 && currentPage < totalPages)
                ))
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border-t border-b bg-white text-gray-700"
                    aria-hidden="true"
                  >
                    &hellip;
                  </span>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-r-md border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Next page"
            >
              <span className="hidden xs:inline">Next</span>
              <span className="xs:hidden">&rarr;</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
