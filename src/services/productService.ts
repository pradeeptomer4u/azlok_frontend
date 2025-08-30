import { apiRequest } from '../utils/apiRequest';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: number;
  category_name?: string;
  categories?: Array<{ id: number; name: string; slug: string }>;
  seller?: {
    id: number;
    full_name?: string;
    business_name?: string;
    region?: string;
  };
  brand?: string;
  stock_quantity: number;
  image_url?: string;
  image_urls?: string | string[]; // Can be JSON string array or actual string array
  rating?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  sku: string;
  slug?: string;
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
  // Get all products with optional filters
  getProducts: async (filters: ProductFilters = {}, page: number = 1, size: number = 20): Promise<ProductsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [key, value?.toString() || ''])
        )
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Backend returns array directly, not wrapped in items
      return { items: data || [], total: data?.length || 0, page, size, pages: 1 };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { items: [], total: 0, page, size, pages: 0 };
    }
  },

  // Get a single product by ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    try {
      console.log(`Requesting featured products: /api/products/?is_featured=true&size=${limit}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?is_featured=true&size=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Featured products response:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Search products by name or description
  searchProducts: async (query: string, page: number = 1, size: number = 20): Promise<Product[]> => {
    try {
      console.log(`Searching products: /api/products/?search=${query}&page=${page}&size=${size}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?search=${encodeURIComponent(query)}&page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Search products response:', data);
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products?is_new=true&size=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },
  
  // Get bestsellers
  getBestsellers: async (limit: number = 8): Promise<Product[]> => {
    try {
      console.log(`Requesting bestsellers: /api/products/?is_bestseller=true&size=${limit}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?is_bestseller=true&size=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Bestsellers API response:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      return [];
    }
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId: number, limit: number = 12): Promise<Product[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?category_id=${categoryId}&size=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Error fetching products for category ID ${categoryId}:`, error);
      return [];
    }
  },

  // Get products by category slug
  getProductsByCategorySlug: async (categorySlug: string, limit: number = 12): Promise<Product[]> => {
    try {
      // Get all products and filter by category slug
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/?size=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const allProducts = data || [];
      
      // Filter products by category slug
      const filteredProducts = allProducts.filter((product: Product) => 
        product.categories && product.categories.some(cat => cat.slug === categorySlug)
      );
      
      return filteredProducts;
    } catch (error) {
      console.error(`Error fetching products for category slug ${categorySlug}:`, error);
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
