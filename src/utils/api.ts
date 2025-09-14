'use client';

/**
 * Utility function for making authenticated API requests
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get token from localStorage
  let token = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('azlok-token');
  }
  
  // Set up headers with authentication if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  // Construct the full URL (add base URL if it's a relative path)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Make the request with the updated options
  return fetch(fullUrl, {
    ...options,
    headers,
  });
}

/**
 * Utility function for making non-authenticated API requests
 */
export async function fetchApi(url: string, options: RequestInit = {}) {
  // Set up default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Construct the full URL (add base URL if it's a relative path)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Make the request with the updated options
  return fetch(fullUrl, {
    ...options,
    headers,
  });
}
