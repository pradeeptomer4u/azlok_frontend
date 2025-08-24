import { apiRequest } from '../utils/apiRequest';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: number;
  category_name?: string;
  brand?: string;
  stock_quantity: number;
  image_url?: string;
  rating?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  sku: string;
  weight?: number;
  dimensions?: string;
  hsn_code?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: number;
  brand?: string;
  stock_quantity: number;
  image_url?: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  sku: string;
  weight?: number;
  dimensions?: string;
  hsn_code?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: number;
}


export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ProductFilters {
  category_id?: number;
  brand?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

// Product API service
const productService = {
  // Get all products with optional filtering
  getAllProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiRequest<ProductsResponse>(endpoint);
      return response || { items: [], total: 0, page: 1, size: 10, pages: 0 };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { items: [], total: 0, page: 1, size: 10, pages: 0 };
    }
  },
  
  // Get a single product by ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const response = await apiRequest<Product>(`/api/products/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    try {
      const response = await apiRequest<ProductsResponse>(`/api/products?is_featured=true&size=${limit}`);
      return response?.items || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
  
  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    try {
      const response = await apiRequest<ProductsResponse>(`/api/products?is_new=true&size=${limit}`);
      return response?.items || [];
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },
  
  // Get bestsellers
  getBestsellers: async (limit: number = 8): Promise<Product[]> => {
    try {
      const response = await apiRequest<ProductsResponse>(`/api/products?is_bestseller=true&size=${limit}`);
      return response?.items || [];
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      return [];
    }
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId: number, limit: number = 12): Promise<Product[]> => {
    try {
      const response = await apiRequest<ProductsResponse>(`/api/products?category_id=${categoryId}&size=${limit}`);
      return response?.items || [];
    } catch (error) {
      console.error(`Error fetching products for category ID ${categoryId}:`, error);
      return [];
    }
  },
  
  // Search products
  searchProducts: async (query: string, limit: number = 12): Promise<Product[]> => {
    try {
      const response = await apiRequest<ProductsResponse>(`/api/products?search=${encodeURIComponent(query)}&size=${limit}`);
      return response?.items || [];
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      return [];
    }
  },
  
  // Create a new product
  createProduct: async (productData: CreateProductInput): Promise<Product | null> => {
    try {
      const response = await apiRequest<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return response || null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },
  
  // Update an existing product
  updateProduct: async (productData: UpdateProductInput): Promise<Product | null> => {
    try {
      const response = await apiRequest<Product>(`/api/products/${productData.id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      return response || null;
    } catch (error) {
      console.error(`Error updating product with ID ${productData.id}:`, error);
      return null;
    }
  },
  
  // Delete a product
  deleteProduct: async (id: number): Promise<boolean> => {
    try {
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      return false;
    }
  },
  
  // Get seller's products
  getSellerProducts: async (sellerId: number, filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/sellers/${sellerId}/products${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiRequest<ProductsResponse>(endpoint);
      return response || { items: [], total: 0, page: 1, size: 10, pages: 0 };
    } catch (error) {
      console.error(`Error fetching products for seller ID ${sellerId}:`, error);
      return { items: [], total: 0, page: 1, size: 10, pages: 0 };
    }
  }
};

export default productService;
