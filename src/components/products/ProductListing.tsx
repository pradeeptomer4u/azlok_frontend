'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Using direct import with type assertion
// @ts-expect-error - Temporary fix for module resolution
import ProductCard from './ProductCard';
import { calculateProductTax, TaxCalculationRequest, TaxCalculationResponse } from '../../utils/taxService';
import productService, { Product as ApiProduct, ProductFilters } from '../../services/productService';

// Define the Product type that combines API data with UI-specific fields
type Product = ApiProduct & {
  image: string;
  slug: string;
  minOrder?: number;
  seller?: string;
  location?: string;
  category_name?: string;
  isVerified?: boolean;
};

interface ProductListingProps {
  categorySlug?: string;
}

const ProductListing = ({ categorySlug }: ProductListingProps = {}) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsWithTax, setProductsWithTax] = useState<any[]>([]);
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
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const verifiedOnly = searchParams.get('verified') === 'true';
        const taxInclusiveOnly = searchParams.get('taxInclusive') === 'true';
        const maxTaxRate = searchParams.get('maxTaxRate');
        const searchQuery = searchParams.get('q');
        const sort = searchParams.get('sort') || sortBy;
        const state = searchParams.get('state') || buyerState;
        
        // Build API filters
        const filters: ProductFilters = {
          page: 1,
          size: 50, // Fetch more products to allow for client-side filtering
          search: searchQuery || undefined,
          min_price: minPrice ? Number(minPrice) : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined
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
        
        // Apply category filter from props (for category pages)
        if (categorySlug) {
          // We need to find the category_id from the slug
          // For now, we'll pass the slug as search term
          filters.search = categorySlug;
        }
        // Apply category filter from URL params
        else if (category) {
          filters.search = category;
        }
        
        // Fetch products from API
        const response = await productService.getAllProducts(filters);
        
        // Transform API products to match our UI component needs
        const transformedProducts = response.items.map(product => ({
          ...product,
          image: product.image_url || '/globe.svg', // Fallback to placeholder
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          category: product.category_name || 'uncategorized',
          isVerified: true, // Default all API products to verified
          minOrder: 1,
          seller: 'Azlok Enterprises',
          location: 'Mumbai, India'
        }));
        
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
  }, [searchParams, categorySlug]);
  
  // Function to fetch tax information for products
  const fetchTaxInformation = async (productsList: any[], state: string, taxInclusiveOnly?: boolean, maxTaxRate?: string) => {
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
    <div>
      <TaxLoadingIndicator />
      
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">{displayProducts.length} Products Found</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, displayProducts.length)} of {displayProducts.length} products</p>
        </div>
        <div className="mt-3 sm:mt-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          {/* State selection for tax calculation */}
          <div className="flex items-center">
            <label htmlFor="state" className="mr-2 text-gray-700 text-sm">Your State:</label>
            <select
              id="state"
              value={buyerState}
              onChange={(e) => {
                setBuyerState(e.target.value);
                // Re-fetch tax information when state changes
                const taxInclusiveParam = searchParams.get('taxInclusive') === 'true';
                const maxTaxRateParam = searchParams.get('maxTaxRate') || undefined;
                fetchTaxInformation(products, e.target.value, taxInclusiveParam, maxTaxRateParam);
              }}
              className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-grow sm:flex-grow-0"
              aria-label="Select your state for tax calculation"
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
            <ProductCard key={product.id} product={product} />
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
