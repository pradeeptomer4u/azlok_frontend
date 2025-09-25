import axios from 'axios';
import { fetchApi } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface TaxCalculationRequest {
  product_id: number;
  quantity?: number;
  region?: string;
  buyer_state?: string;
  seller_state?: string;
}

export interface TaxCalculationItem {
  product_id: number;
  quantity: number;
}

export interface OrderTaxCalculationRequest {
  items: TaxCalculationItem[];
  region?: string;
  buyer_state?: string;
  seller_state?: string;
  shipping_amount?: number;
  apply_tax_to_shipping?: boolean;
}

export interface TaxCalculationResponse {
  product_id: number;
  product_name: string;
  base_price: number;
  price_without_tax: number;
  tax_percentage: number;
  tax_amount: number;
  price_with_tax: number;
  is_tax_inclusive: boolean;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  hsn_code?: string;
}

export interface OrderTaxCalculationResponse {
  subtotal: number;
  shipping_amount: number;
  shipping_tax_amount: number;
  total_tax_amount: number;
  total_cgst_amount: number;
  total_sgst_amount: number;
  total_igst_amount: number;
  total_amount: number;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    unit_tax: number;
    unit_cgst: number;
    unit_sgst: number;
    unit_igst: number;
    item_total: number;
    hsn_code?: string;
  }>;
}

export interface TaxRate {
  id: number;
  tax_type: string;
  rate: number;
  category_id?: number;
  category_name?: string;
  region?: string;
  is_active: boolean;
  effective_from: string;
  effective_to?: string;
  hsn_code?: string;
}

export interface MarginSetting {
  id: number;
  margin_percentage: number;
  product_id?: number;
  product_name?: string;
  category_id?: number;
  category_name?: string;
  seller_id?: number;
  seller_name?: string;
  region?: string;
  is_active: boolean;
}

// Function to calculate tax for a single product
export const calculateProductTax = async (
  request: TaxCalculationRequest
): Promise<TaxCalculationResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/tax/calculate-tax`, request);
    return response.data;
  } catch (error) {
    console.error('Error calculating product tax:', error);
    throw error;
  }
};

// Function to calculate tax for an entire order
export const calculateOrderTax = async (
  request: OrderTaxCalculationRequest
): Promise<OrderTaxCalculationResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/tax/calculate-order-tax`, request);
    return response.data;
  } catch (error) {
    console.error('Error calculating order tax:', error);
    throw error;
  }
};

// Function to calculate tax for an entire order without authentication
// This is used for cart page where user might not be logged in
export const calculateOrderTaxPublic = async (
  request: OrderTaxCalculationRequest
): Promise<OrderTaxCalculationResponse> => {
  try {
    const response = await fetchApi('/api/tax/calculate-order-tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      // If API returns error, throw it to be caught by the caller
      const errorText = await response.text();
      console.error('Tax calculation API error:', response.status, errorText);
      throw new Error(`Tax calculation failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calculating order tax (public):', error);
    throw error;
  }
};

// Function to get tax rates
export const getTaxRates = async (
  taxType?: string,
  region?: string,
  categoryId?: number,
  isActive: boolean = true
): Promise<TaxRate[]> => {
  try {
    let url = `${API_URL}/api/tax/tax-rates?is_active=${isActive}`;
    
    if (taxType) url += `&tax_type=${taxType}`;
    if (region) url += `&region=${region}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    throw error;
  }
};

// Function to get margin settings
export const getMarginSettings = async (
  productId?: number,
  categoryId?: number,
  sellerId?: number,
  region?: string,
  isActive: boolean = true
): Promise<MarginSetting[]> => {
  try {
    let url = `${API_URL}/api/tax/margin-settings?is_active=${isActive}`;
    
    if (productId) url += `&product_id=${productId}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    if (sellerId) url += `&seller_id=${sellerId}`;
    if (region) url += `&region=${region}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching margin settings:', error);
    throw error;
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format tax percentage
export const formatTaxPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};
