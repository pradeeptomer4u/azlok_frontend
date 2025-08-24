/**
 * This file is deprecated. Please use the apiRequest utility from '../utils/apiRequest' instead.
 * This file is kept for backward compatibility but will be removed in future versions.
 */

import { apiRequest as request } from '../utils/apiRequest';

// Re-export the apiRequest function for backward compatibility
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  console.warn('Warning: Using deprecated api.ts. Please update imports to use utils/apiRequest instead.');
  return request<T>(endpoint, options);
};

export default apiRequest;
