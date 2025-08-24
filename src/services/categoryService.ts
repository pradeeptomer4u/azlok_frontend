import apiRequest from './api';

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
    return apiRequest('/categories/all');
  },
  
  // Get top-level categories (no parent)
  getTopCategories: async (): Promise<Category[]> => {
    return apiRequest('/categories');
  },
  
  // Get subcategories by parent ID
  getSubcategories: async (parentId: number): Promise<Category[]> => {
    return apiRequest(`/categories?parent_id=${parentId}`);
  },
  
  // Get a single category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    return apiRequest(`/categories/${id}`);
  },
  
  // Get category with product count
  getCategoriesWithProductCount: async (): Promise<Category[]> => {
    // First get all categories
    const categories = await apiRequest('/categories/all');
    
    // For a real implementation, we would have an endpoint that returns product counts
    // This is a simplified version that doesn't make additional API calls
    return categories;
  }
};

export default categoryService;
