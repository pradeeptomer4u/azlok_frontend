/**
 * API request utility for making HTTP requests to the backend
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    console.log(`API Request: ${url}`, requestOptions);
    const response = await fetch(url, requestOptions);
    console.log(`API Response status: ${response.status} ${response.statusText}`);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error response:`, errorData);
      throw new Error(
        errorData.detail || `API request failed with status ${response.status}`
      );
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
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};
