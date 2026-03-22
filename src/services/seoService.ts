import { apiRequest } from '../utils/apiRequest';

export type SeoPageType = 'homepage' | 'product' | 'category' | 'blog';

export interface SeoSettings {
  id?: number;
  page_type: SeoPageType;
  identifier?: string; // slug for product/category/blog; undefined for homepage
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
}

const seoService = {
  /** Fetch SEO settings for a specific page */
  get: async (page_type: SeoPageType, identifier?: string): Promise<SeoSettings | null> => {
    const params = new URLSearchParams({ page_type });
    if (identifier) params.set('identifier', identifier);
    const result = await apiRequest<SeoSettings>(`/api/seo/?${params}`);
    // apiRequest returns {} on 404 — treat as null
    return result && Object.keys(result).length > 0 ? result : null;
  },

  /** List all SEO settings (admin use) */
  list: async (): Promise<SeoSettings[]> => {
    const result = await apiRequest<SeoSettings[]>('/api/seo/all');
    return Array.isArray(result) ? result : [];
  },

  /** Create or update SEO settings (upsert) */
  save: async (data: SeoSettings): Promise<SeoSettings | null> => {
    const result = await apiRequest<SeoSettings>('/api/seo/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result && Object.keys(result).length > 0 ? result : null;
  },

  /** Delete SEO settings by id */
  delete: async (id: number): Promise<boolean> => {
    await apiRequest(`/api/seo/${id}`, { method: 'DELETE' });
    return true;
  },

  /**
   * Server-side fetch (used in generateMetadata) — does NOT require localStorage.
   * Returns null if the backend is unavailable or returns nothing.
   */
  getServerSide: async (
    page_type: SeoPageType,
    identifier?: string
  ): Promise<SeoSettings | null> => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const params = new URLSearchParams({ page_type });
      if (identifier) params.set('identifier', identifier);
      const res = await fetch(`${apiBase}/api/seo/?${params}`, {
        next: { revalidate: 60 }, // cache for 60 seconds
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data && Object.keys(data).length > 0 ? data : null;
    } catch {
      return null;
    }
  },
};

export default seoService;