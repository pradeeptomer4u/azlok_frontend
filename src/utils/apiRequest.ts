/**
 * API request utility for making HTTP requests to the backend
 */

// Base URL for API requests - use relative URLs by default for Next.js API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Generic API request function
 * @param endpoint - API endpoint path
 * @param options - Request options
 * @returns Promise with response data
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // If endpoint is a full URL, use it directly, otherwise prepend the base URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Get JWT token from localStorage
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('azlok-token');
  }
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Merge options
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    console.log(`API Request: ${url}`);
    const response = await fetch(url, requestOptions);
    console.log(`API Response status: ${response.status} ${response.statusText}`);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Try to parse error response, but don't fail if it's not JSON
      const errorData = await response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          return { message: text };
        }
      }).catch(() => ({}));
      
      // For 404 errors on search endpoint, return empty result without error logging
      // This is because the search API might not be available in development
      if (response.status === 404 && endpoint.includes('/api/products/search')) {
        console.log(`Search API not found (404), returning empty result`);
        return {} as T;
      }
      
      console.error(`API error response for ${endpoint} (${response.status}):`, errorData || 'No error details available');
      // Return empty result instead of throwing to prevent app crashes
      return {} as T;
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const data = await response.json();
    console.log(`API Response data for ${endpoint}:`, data);
    return data as T;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
    // Return empty result instead of throwing to prevent app crashes
    return {} as T;
  }
};
