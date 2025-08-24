import { apiRequest } from '../utils/apiRequest';

// Seller dashboard data interface
export interface SellerDashboardData {
  id: number;
  name: string;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  completedOrders: number;
}

// Order interface
export interface Order {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
}

// Dashboard service
const dashboardService = {
  // Get seller dashboard data
  getSellerDashboardData: async (sellerId: number): Promise<SellerDashboardData | null> => {
    if (!sellerId) {
      console.error('Invalid seller ID provided');
      return null;
    }
    
    try {
      return await apiRequest<SellerDashboardData>(`/api/seller/${sellerId}/dashboard`);
    } catch (error) {
      console.error(`Error fetching dashboard data for seller ${sellerId}:`, error);
      return null;
    }
  },
  
  // Get recent orders for a seller
  getSellerRecentOrders: async (sellerId: number, limit: number = 10): Promise<Order[]> => {
    if (!sellerId) {
      console.error('Invalid seller ID provided');
      return [];
    }
    
    try {
      return await apiRequest<Order[]>(`/api/seller/${sellerId}/orders/recent?limit=${limit || 10}`);
    } catch (error) {
      console.error(`Error fetching recent orders for seller ${sellerId}:`, error);
      return [];
    }
  },
  
  // Get all orders for a seller
  getSellerAllOrders: async (sellerId: number, page: number = 1, limit: number = 20): Promise<Order[]> => {
    if (!sellerId) {
      console.error('Invalid seller ID provided');
      return [];
    }
    
    const safePage = page || 1;
    const safeLimit = limit || 20;
    
    try {
      return await apiRequest<Order[]>(`/api/seller/${sellerId}/orders?page=${safePage}&limit=${safeLimit}`);
    } catch (error) {
      console.error(`Error fetching all orders for seller ${sellerId}:`, error);
      return [];
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    if (!orderId) {
      console.error('Invalid order ID provided');
      return null;
    }
    
    try {
      return await apiRequest<Order>(`/api/orders/${orderId}`);
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }
};

export default dashboardService;
