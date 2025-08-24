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
  name: string;
  slug: string;
  location?: string;
  image_url?: string;
  description?: string;
  rating?: number;
  verified?: boolean;
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
      return response || [];
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      return [];
    }
  },
  
  // Get seller by ID
  getSellerById: async (id: number): Promise<Seller | null> => {
    try {
      const response = await apiRequest<Seller>(`/api/sellers/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching seller with ID ${id}:`, error);
      return null;
    }
  },
  
  // Get seller by slug
  getSellerBySlug: async (slug: string): Promise<Seller | null> => {
    try {
      const response = await apiRequest<Seller>(`/api/sellers/slug/${slug}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching seller with slug ${slug}:`, error);
      return null;
    }
  },
  
  // Get seller products
  getSellerProducts: async (sellerId: number, page: number = 1, size: number = 10): Promise<SellerProductsResponse> => {
    try {
      const response = await apiRequest<SellerProductsResponse>(`/api/sellers/${sellerId}/products?page=${page}&size=${size}`);
      return response || { products: [], total: 0, page, size, pages: 0 };
    } catch (error) {
      console.error(`Error fetching products for seller ID ${sellerId}:`, error);
      return { products: [], total: 0, page, size, pages: 0 };
    }
  }
};

export default sellerService;
