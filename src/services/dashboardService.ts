import apiRequest from './api';

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

// Mock seller data - in a real app, this would come from an API
const mockSellerData: SellerDashboardData = {
  id: 1,
  name: 'ABC Manufacturing',
  totalProducts: 42,
  totalOrders: 156,
  revenue: 1250000,
  pendingOrders: 8,
  completedOrders: 148,
};

// Mock recent orders
const mockRecentOrders: Order[] = [
  {
    id: 'ORD-2025-1234',
    date: '2025-08-22',
    customer: 'XYZ Industries',
    amount: 45000,
    status: 'Delivered',
    tax_amount: 8100,
    cgst_amount: 4050,
    sgst_amount: 4050,
    igst_amount: 0,
  },
  {
    id: 'ORD-2025-1233',
    date: '2025-08-20',
    customer: 'PQR Enterprises',
    amount: 32000,
    status: 'Processing',
    tax_amount: 5760,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 5760,
  },
  {
    id: 'ORD-2025-1232',
    date: '2025-08-18',
    customer: 'LMN Corp',
    amount: 28500,
    status: 'Delivered',
    tax_amount: 5130,
    cgst_amount: 2565,
    sgst_amount: 2565,
    igst_amount: 0,
  },
  {
    id: 'ORD-2025-1231',
    date: '2025-08-15',
    customer: 'ABC Textiles',
    amount: 56000,
    status: 'Delivered',
    tax_amount: 10080,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 10080,
  },
];

// Dashboard service
const dashboardService = {
  // Get seller dashboard data
  getSellerDashboardData: async (sellerId: number): Promise<SellerDashboardData> => {
    // In a real implementation, this would be:
    // return apiRequest(`/seller/${sellerId}/dashboard`);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSellerData);
      }, 300);
    });
  },
  
  // Get recent orders for a seller
  getSellerRecentOrders: async (sellerId: number, limit: number = 10): Promise<Order[]> => {
    // In a real implementation, this would be:
    // return apiRequest(`/seller/${sellerId}/orders/recent?limit=${limit}`);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecentOrders.slice(0, limit));
      }, 300);
    });
  },
  
  // Get all orders for a seller
  getSellerAllOrders: async (sellerId: number, page: number = 1, limit: number = 20): Promise<Order[]> => {
    // In a real implementation, this would be:
    // return apiRequest(`/seller/${sellerId}/orders?page=${page}&limit=${limit}`);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecentOrders);
      }, 300);
    });
  },
  
  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    // In a real implementation, this would be:
    // return apiRequest(`/orders/${orderId}`);
    
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = mockRecentOrders.find(o => o.id === orderId);
        if (order) {
          resolve(order);
        } else {
          reject(new Error('Order not found'));
        }
      }, 300);
    });
  }
};

export default dashboardService;
