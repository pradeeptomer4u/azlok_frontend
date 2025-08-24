import { apiRequest } from '../utils/apiRequest';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: number;
}

// Category API service
const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiRequest<Category[]>('/api/categories/all');
      return response || [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  },
  
  // Get top-level categories (no parent)
  getTopCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiRequest<Category[]>('/api/categories');
      return response || [];
    } catch (error) {
      console.error('Error fetching top categories:', error);
      return [];
    }
  },
  
  // Get subcategories by parent ID
  getSubcategories: async (parentId: number): Promise<Category[]> => {
    try {
      const response = await apiRequest<Category[]>(`/api/categories?parent_id=${parentId}`);
      return response || [];
    } catch (error) {
      console.error(`Error fetching subcategories for parent ID ${parentId}:`, error);
      return [];
    }
  },
  
  // Get a single category by ID
  getCategoryById: async (id: number): Promise<Category | null> => {
    try {
      const response = await apiRequest<Category>(`/api/categories/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },
  
  // Get category with product count
  getCategoriesWithProductCount: async (): Promise<Category[]> => {
    try {
      // Use a dedicated endpoint that includes product counts
      const response = await apiRequest<Category[]>('/api/categories/with-product-count');
      return response || [];
    } catch (error) {
      console.error('Error fetching categories with product count:', error);
      return [];
    }
  }
};

export default categoryService;
