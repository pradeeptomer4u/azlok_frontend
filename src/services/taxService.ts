import { apiRequest } from '../utils/apiRequest';

// Define types for tax rate data
export interface TaxRate {
  id: number;
  category_id: number;
  category_name: string;
  hsn_code: string;
  region_code: string;
  region_name: string;
  tax_percentage: number;
  is_default: boolean;
  effective_from: string;
  effective_to?: string;
}

// Define tax calculation request and response interfaces
export interface TaxCalculationRequest {
  product_id: number;
  quantity: number;
  buyer_state: string;
  seller_state: string;
}

export interface TaxCalculationResponse {
  product_id: number;
  tax_percentage: number;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  is_tax_inclusive: boolean;
  hsn_code: string;
  price_with_tax: number;
  price_without_tax: number;
}

/**
 * Get all tax rates
 * @returns Promise with tax rates
 */
export const getTaxRates = async (): Promise<TaxRate[]> => {
  try {
    return await apiRequest<TaxRate[]>('/api/tax/rates');
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    // Return empty array instead of throwing to handle null case gracefully
    return [];
  }
};

/**
 * Get tax rates by category
 * @param categoryId - Category ID to filter by
 * @returns Promise with filtered tax rates
 */
export const getTaxRatesByCategory = async (categoryId: number): Promise<TaxRate[]> => {
  if (categoryId === null || categoryId === undefined) {
    console.error('Invalid category ID provided');
    return [];
  }
  
  try {
    return await apiRequest<TaxRate[]>(`/api/tax/rates?category=${categoryId}`);
  } catch (error) {
    console.error(`Error fetching tax rates for category ${categoryId}:`, error);
    return [];
  }
};

/**
 * Get tax rates by region
 * @param regionCode - Region code to filter by
 * @returns Promise with filtered tax rates
 */
export const getTaxRatesByRegion = async (regionCode: string): Promise<TaxRate[]> => {
  if (!regionCode) {
    console.error('Invalid region code provided');
    return [];
  }
  
  try {
    return await apiRequest<TaxRate[]>(`/api/tax/rates?region=${regionCode}`);
  } catch (error) {
    console.error(`Error fetching tax rates for region ${regionCode}:`, error);
    return [];
  }
};

/**
 * Calculate tax for a product using API
 * @param request - Tax calculation request object
 * @returns Promise with tax calculation response
 */
export const calculateTaxApi = async (request: TaxCalculationRequest): Promise<TaxCalculationResponse | null> => {
  if (!request.product_id || !request.buyer_state || !request.seller_state) {
    console.error('Invalid tax calculation request parameters');
    return null;
  }
  
  try {
    return await apiRequest<TaxCalculationResponse>('/api/tax/calculate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  } catch (error) {
    console.error('Error calculating tax:', error);
    return null;
  }
};

/**
 * Calculate tax locally (fallback function)
 * @param price - Base price
 * @param quantity - Quantity
 * @param taxPercentage - Tax percentage
 * @param buyerState - Buyer's state code
 * @param sellerState - Seller's state code (defaults to 'MH')
 * @returns Tax calculation result
 */
export const calculateTax = (
  price: number,
  quantity: number = 1,
  taxPercentage: number = 0,
  buyerState: string = '',
  sellerState: string = 'MH'
): {
  basePrice: number;
  taxAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalPrice: number;
} => {
  // Handle null/undefined values with defaults
  const safePrice = price || 0;
  const safeQuantity = quantity || 1;
  const safeTaxPercentage = taxPercentage || 0;
  const safeBuyerState = buyerState || '';
  const safeSellerState = sellerState || 'MH';
  
  const basePrice = safePrice * safeQuantity;
  const taxAmount = basePrice * (safeTaxPercentage / 100);
  const totalPrice = basePrice + taxAmount;
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (safeBuyerState === safeSellerState) {
    // Intra-state: Split into CGST and SGST
    cgst = taxAmount / 2;
    sgst = taxAmount / 2;
  } else {
    // Inter-state: Full amount as IGST
    igst = taxAmount;
  }
  
  return {
    basePrice,
    taxAmount,
    cgst,
    sgst,
    igst,
    totalPrice
  };
};
