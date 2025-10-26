import { apiRequest } from '../utils/apiRequest';
import { Product, Category } from '../types/product';

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
  image_url?: string[] | string; // Can be either an array of strings or a single string
  image_urls?: string[]; // From API response
  price: number;
  category?: string;
  categories?: Category[]; // From API response
  description?: string;
  slug?: string;
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
      let url = `/api/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
      
      if (category_id) {
        url += `&category_id=${category_id}`;
      }
      
      console.log(`Sending search request to: ${url}`);
      const response = await apiRequest<SearchResults>(url);
      
      // Check if response has the expected structure
      if (response && typeof response === 'object') {
        // If response is empty object (which happens on API error)
        if (Object.keys(response).length === 0) {
          console.log('Empty response from search API');
          return { items: [], total: 0, page, size, pages: 0, query };
        }
        
        // If response has items array
        if (Array.isArray(response.items)) {
          console.log(`Search API returned ${response.items.length} results`);
          return response;
        } else {
          console.warn('Search API returned invalid response structure:', response);
          return { items: [], total: 0, page, size, pages: 0, query };
        }
      } else {
        console.warn('Search API returned non-object response:', response);
        return { items: [], total: 0, page, size, pages: 0, query };
      }
    } catch (error) {
      console.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
      return { items: [], total: 0, page, size, pages: 0, query };
    }
  }
};

export default searchService;
