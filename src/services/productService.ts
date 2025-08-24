import apiRequest from './api';

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
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },
  
  // Get a single product by ID
  getProductById: async (id: number): Promise<Product> => {
    return apiRequest(`/products/${id}`);
  },
  
  // Get featured products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    return apiRequest(`/products?is_featured=true&size=${limit}`).then(res => res.items);
  },
  
  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    return apiRequest(`/products?is_new=true&size=${limit}`).then(res => res.items);
  },
  
  // Get bestsellers
  getBestsellers: async (limit: number = 8): Promise<Product[]> => {
    return apiRequest(`/products?is_bestseller=true&size=${limit}`).then(res => res.items);
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId: number, limit: number = 12): Promise<Product[]> => {
    return apiRequest(`/products?category_id=${categoryId}&size=${limit}`).then(res => res.items);
  },
  
  // Search products
  searchProducts: async (query: string, limit: number = 12): Promise<Product[]> => {
    return apiRequest(`/products?search=${encodeURIComponent(query)}&size=${limit}`).then(res => res.items);
  },
  
  // Create a new product
  createProduct: async (productData: CreateProductInput): Promise<Product> => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  
  // Update an existing product
  updateProduct: async (productData: UpdateProductInput): Promise<Product> => {
    return apiRequest(`/products/${productData.id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  
  // Delete a product
  deleteProduct: async (id: number): Promise<void> => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
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
    const endpoint = `/sellers/${sellerId}/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  }
};

export default productService;
