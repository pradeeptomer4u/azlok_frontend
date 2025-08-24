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
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Merge options
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, requestOptions);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
    return data as T;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};
