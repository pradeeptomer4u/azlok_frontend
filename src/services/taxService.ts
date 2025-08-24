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

// Mock tax rates data for simulation
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
  },
  {
    id: 9,
    category_id: 1,
    category_name: 'Electronics',
    hsn_code: '8517',
    region_code: 'KA',
    region_name: 'Karnataka',
    tax_percentage: 18,
    is_default: false,
    effective_from: '2023-01-01'
  },
  {
    id: 10,
    category_id: 2,
    category_name: 'Textiles',
    hsn_code: '5208',
    region_code: 'GJ',
    region_name: 'Gujarat',
    tax_percentage: 5,
    is_default: false,
    effective_from: '2023-01-01'
  },
  {
    id: 11,
    category_id: 3,
    category_name: 'Machinery',
    hsn_code: '8422',
    region_code: 'TN',
    region_name: 'Tamil Nadu',
    tax_percentage: 12,
    is_default: false,
    effective_from: '2023-01-01'
  },
  {
    id: 12,
    category_id: 7,
    category_name: 'Luxury Goods',
    hsn_code: '7113',
    region_code: 'ALL',
    region_name: 'All India',
    tax_percentage: 28,
    is_default: true,
    effective_from: '2023-01-01'
  }
];

/**
 * Get all tax rates
 * @returns Promise with tax rates
 */
export const getTaxRates = async (): Promise<TaxRate[]> => {
  try {
    // In a real implementation, this would call the API
    // return await apiRequest<TaxRate[]>('/api/tax/rates');
    
    // For now, simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTaxRates);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    throw error;
  }
};

/**
 * Get tax rates by category
 * @param categoryId - Category ID to filter by
 * @returns Promise with filtered tax rates
 */
export const getTaxRatesByCategory = async (categoryId: number): Promise<TaxRate[]> => {
  try {
    // In a real implementation, this would call the API with a filter
    // return await apiRequest<TaxRate[]>(`/api/tax/rates?category=${categoryId}`);
    
    // For now, filter the mock data
    const filteredRates = mockTaxRates.filter(rate => rate.category_id === categoryId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filteredRates);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching tax rates for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Get tax rates by region
 * @param regionCode - Region code to filter by
 * @returns Promise with filtered tax rates
 */
export const getTaxRatesByRegion = async (regionCode: string): Promise<TaxRate[]> => {
  try {
    // In a real implementation, this would call the API with a filter
    // return await apiRequest<TaxRate[]>(`/api/tax/rates?region=${regionCode}`);
    
    // For now, filter the mock data
    const filteredRates = mockTaxRates.filter(rate => 
      rate.region_code === regionCode || rate.region_code === 'ALL'
    );
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filteredRates);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching tax rates for region ${regionCode}:`, error);
    throw error;
  }
};

/**
 * Calculate tax for a product
 * @param price - Base price
 * @param quantity - Quantity
 * @param taxPercentage - Tax percentage
 * @param buyerState - Buyer's state code
 * @param sellerState - Seller's state code (defaults to 'MH')
 * @returns Tax calculation result
 */
export const calculateTax = (
  price: number,
  quantity: number,
  taxPercentage: number,
  buyerState: string,
  sellerState: string = 'MH'
) => {
  const basePrice = price * quantity;
  const taxAmount = basePrice * (taxPercentage / 100);
  const totalPrice = basePrice + taxAmount;
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (buyerState === sellerState) {
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
