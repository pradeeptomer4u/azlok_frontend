/**
 * User Service - Handles all user-related API calls
 */

import { apiRequest } from '../utils/apiRequest';

// User interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingInfo: {
    gstin: string;
    panNumber: string;
    bankName: string;
    accountNumber: string;
  };
  activity: BuyerActivity | SellerActivity;
}

export interface BuyerActivity {
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue: number;
  recentOrders: {
    id: string;
    date: string;
    amount: number;
    status: string;
  }[];
}

export interface SellerActivity {
  productsCount: number;
  salesCount: number;
  totalRevenue: number;
  lastSaleDate: string;
  topProducts: {
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }[];
}

export interface UserFilters {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse {
  items: User[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * Get all users with pagination and filtering
 */
export const getUsers = async (filters: UserFilters = {}): Promise<UserResponse | null> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<UserResponse>(`/api/users${queryString}`);
    
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

/**
 * Get a single user by ID
 */
export const getUserById = async (id: number | string): Promise<User | null> => {
  try {
    const response = await apiRequest<User>(`/api/users/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await apiRequest<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (id: number | string, userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number | string): Promise<boolean> => {
  try {
    await apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
};

/**
 * Update user status (activate/deactivate)
 */
export const updateUserStatus = async (id: number | string, status: 'active' | 'inactive'): Promise<boolean> => {
  try {
    await apiRequest(`/api/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return true;
  } catch (error) {
    console.error(`Error updating status for user with ID ${id}:`, error);
    return false;
  }
};

/**
 * Get user activity (orders for buyers, sales for sellers)
 */
export const getUserActivity = async (id: number | string): Promise<BuyerActivity | SellerActivity | null> => {
  try {
    const response = await apiRequest<BuyerActivity | SellerActivity>(`/api/users/${id}/activity`);
    return response;
  } catch (error) {
    console.error(`Error fetching activity for user with ID ${id}:`, error);
    return null;
  }
};
