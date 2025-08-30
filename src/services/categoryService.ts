import { apiRequest } from '../utils/apiRequest';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: number;
  product_count?: number;
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
      const response = await fetch('https://api.azlok.com/api/categories/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
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
  
  // Get categories with product count
  getCategoriesWithProductCount: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiCategories: Category[] = await response.json();
      
      // Get all products to calculate counts
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/`);
      const products = productsResponse.ok ? await productsResponse.json() : [];
      
      // Transform to categories with actual product count
      const transformedCategories = apiCategories.map((category) => {
        const productCount = products.filter((product: any) => 
          product.categories && product.categories.some((cat: any) => cat.slug === category.slug)
        ).length;
        
        return {
          ...category,
          product_count: productCount
        };
      });
      
      return transformedCategories;
    } catch (error) {
      console.error('Error fetching categories with product count:', error);
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
  }
};

export default categoryService;
