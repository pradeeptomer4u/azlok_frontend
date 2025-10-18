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

// Cache for categories to reduce API calls
let categoriesCache: {
  data: Category[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Category API service
const categoryService = {
  // Get all categories with caching
  getAllCategories: async (forceRefresh = false): Promise<Category[]> => {
    // Return cached data if available and not expired
    if (
      !forceRefresh &&
      categoriesCache && 
      categoriesCache.data.length > 0 && 
      Date.now() - categoriesCache.timestamp < CACHE_DURATION
    ) {
      console.log('Using cached categories data');
      return categoriesCache.data;
    }
    
    try {
      // Try the primary API endpoint
      try {
        const response = await apiRequest<Category[]>('/api/categories/all');
        if (response && Array.isArray(response) && response.length > 0) {
          // Update cache
          categoriesCache = {
            data: response,
            timestamp: Date.now()
          };
          return response;
        }
      } catch (primaryError) {
        console.warn('Primary categories endpoint failed, trying fallback:', primaryError);
      }
      
      // Fallback to alternative endpoint
      const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories/`);
      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      if (fallbackData && Array.isArray(fallbackData)) {
        // Update cache
        categoriesCache = {
          data: fallbackData,
          timestamp: Date.now()
        };
        return fallbackData;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      // Return cached data even if expired as a last resort
      return categoriesCache?.data || [];
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
      
      // Sort categories by product count in descending order
      const sortedCategories = transformedCategories.sort((a, b) => 
        (b.product_count || 0) - (a.product_count || 0)
      );
      
      return sortedCategories;
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
  },
  
  // Get a single category by slug
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      // First try to use cached data if available
      if (categoriesCache && categoriesCache.data.length > 0) {
        const cachedCategory = categoriesCache.data.find(cat => cat.slug === slug);
        if (cachedCategory) {
          console.log('Found category by slug in cache:', slug);
          return cachedCategory;
        }
      }
      
      // If not in cache, fetch all categories and find the one with matching slug
      const allCategories = await categoryService.getAllCategories();
      const foundCategory = allCategories.find(cat => cat.slug === slug);
      
      if (foundCategory) {
        return foundCategory;
      }
      
      // Try with normalized slug
      const normalizedSlug = slug.toLowerCase().trim();
      return allCategories.find(cat => 
        cat.slug.toLowerCase() === normalizedSlug ||
        cat.name.toLowerCase() === normalizedSlug
      ) || null;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      return null;
    }
  }
};

export default categoryService;
