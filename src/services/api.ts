// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for handling API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  return response.json();
};

// API request helper with default options
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  return handleResponse(response);
};

export default apiRequest;
