import { apiRequest } from '../utils/apiRequest';
import { Product } from '../types/product';

export interface SellerProductsResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Seller {
  id: number;
  username: string;
  full_name: string;
  business_name: string;
  business_address?: Record<string, any>;
  region?: string;
  rating?: number;
  total_sales?: number;
  product_count?: number;
  joined_date?: string;
  verified?: boolean;
  image_url?: string;
  
  // Frontend display properties
  name?: string;
  slug?: string;
  location?: string;
  member_since?: string;
}

// Seller API service
const sellerService = {
  // Get all sellers
  getAllSellers: async (): Promise<Seller[]> => {
    try {
      const response = await apiRequest<Seller[]>('/api/sellers');
      return response || [];
    } catch (error) {
      console.error('Error fetching all sellers:', error);
      return [];
    }
  },
  
  // Get top sellers
  getTopSellers: async (limit: number = 4): Promise<Seller[]> => {
    try {
      const response = await apiRequest<Seller[]>(`/api/seller/top?size=${limit}`);
      
      // Transform backend seller format to frontend format
      return (response || []).map(seller => ({
        ...seller,
        name: seller.business_name || seller.full_name,
        slug: seller.username.replace('_', '-'),
        location: seller.region || (seller.business_address?.city ? 
          `${seller.business_address.city}, ${seller.business_address.country || 'India'}` : 
          'India'),
        member_since: seller.joined_date ? new Date(seller.joined_date).getFullYear().toString() : undefined
      }));
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      return [];
    }
  },
  
  // Get seller by ID
  getSellerById: async (id: number): Promise<Seller | null> => {
    try {
      const response = await apiRequest<Seller>(`/api/seller/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching seller by ID:', error);
      return null;
    }
  },
  
  // Get seller by slug
  getSellerBySlug: async (slug: string): Promise<Seller | null> => {
    try {
      // Convert slug to username format (replace hyphens with underscores)
      const formattedSlug = slug.replace(/-/g, '_');
      const response = await apiRequest<Seller>(`/api/seller/slug/${formattedSlug}`);
      return response;
    } catch (error) {
      console.error('Error fetching seller by slug:', error);
      return null;
    }
  },
  
  // Get seller products
  getSellerProducts: async (sellerId: number, page: number = 1, size: number = 12): Promise<SellerProductsResponse> => {
    try {
      const response = await apiRequest<Product[]>(`/api/products?seller_id=${sellerId}&page=${page}&size=${size}`);
      const products = response || [];
      return { 
        products, 
        total: products.length, 
        page, 
        size, 
        pages: Math.ceil(products.length / size) 
      };
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return { products: [], total: 0, page, size, pages: 0 };
    }
  }
};

export default sellerService;
