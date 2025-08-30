import { apiRequest } from '../utils/apiRequest';
import { Product } from '../types/product';

export interface SearchResults {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
  query: string;
}

export interface AutocompleteResult {
  id: number;
  name: string;
  image?: string;
  image_url?: string;
  price: number;
  category?: string;
}

const searchService = {
  // Search products with query
  searchProducts: async (
    query: string,
    category_id?: number,
    page: number = 1,
    size: number = 20
  ): Promise<SearchResults> => {
    try {
      // Use our Next.js API route
      let url = `/api/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      
      if (category_id) {
        url += `&category_id=${category_id}`;
      }
      
      const response = await apiRequest<SearchResults>(url);
      return response || { items: [], total: 0, page, size, pages: 0, query };
    } catch (error) {
      console.error('Error searching products:', error);
      return { items: [], total: 0, page, size, pages: 0, query };
    }
  },
  
  // Get autocomplete suggestions
  getAutocompleteSuggestions: async (
    query: string,
    limit: number = 5
  ): Promise<AutocompleteResult[]> => {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    try {
      // Use our Next.js API route
      const url = `/api/search?query=${encodeURIComponent(query)}&size=${limit}`;
      console.log('Autocomplete request URL:', url);
      
      // Create mock data for testing
      const mockData: AutocompleteResult[] = [
        {
          id: 1,
          name: 'Industrial Supplies - Sample Product 1',
          image: '/globe.svg',
          price: 1299,
          category: 'Industrial'
        },
        {
          id: 2,
          name: 'Industrial Equipment - Sample Product 2',
          image: '/globe.svg',
          price: 2499,
          category: 'Industrial'
        },
        {
          id: 3,
          name: 'Industrial Tools - Sample Product 3',
          image: '/globe.svg',
          price: 999,
          category: 'Industrial'
        }
      ];
      
      // Return mock data for now
      console.log('Returning mock suggestions:', mockData);
      return mockData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      /* Uncomment this when backend is working
      const response = await apiRequest<SearchResults>(url);
      
      if (!response || !response.items) {
        return [];
      }
      
      // Transform to autocomplete results
      return response.items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image_url || item.image,
        price: item.price,
        category: item.category
      }));
      */
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }
};

export default searchService;
