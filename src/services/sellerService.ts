import apiRequest from './api';

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
    return apiRequest('/sellers');
  },
  
  // Get top sellers
  getTopSellers: async (limit: number = 4): Promise<Seller[]> => {
    return apiRequest(`/sellers/top?limit=${limit}`);
  },
  
  // Get seller by ID
  getSellerById: async (id: number): Promise<Seller> => {
    return apiRequest(`/sellers/${id}`);
  },
  
  // Get seller by slug
  getSellerBySlug: async (slug: string): Promise<Seller> => {
    return apiRequest(`/sellers/slug/${slug}`);
  },
  
  // Get seller products
  getSellerProducts: async (sellerId: number, page: number = 1, limit: number = 10): Promise<any> => {
    return apiRequest(`/sellers/${sellerId}/products?page=${page}&limit=${limit}`);
  }
};

export default sellerService;
