import { useState, useEffect } from 'react';
import axios from 'axios';

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  'og:type': string;
  'og:url': string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
  'twitter:card': string;
  'twitter:title': string;
  'twitter:description': string;
  'twitter:image': string;
}

interface UseSEOProps {
  pageType: 'home' | 'product' | 'category' | 'page';
  objectId?: number;
  fallbackTitle: string;
  fallbackDescription: string;
}

/**
 * Hook to fetch SEO meta tags from the API
 */
export const useSEO = ({
  pageType,
  objectId,
  fallbackTitle,
  fallbackDescription,
}: UseSEOProps) => {
  const [metaTags, setMetaTags] = useState<MetaTags>({
    title: fallbackTitle,
    description: fallbackDescription,
    keywords: 'marketplace, online shopping, ecommerce',
    'og:type': 'website',
    'og:url': '',
    'og:title': fallbackTitle,
    'og:description': fallbackDescription,
    'og:image': '/logo.png',
    'twitter:card': 'summary_large_image',
    'twitter:title': fallbackTitle,
    'twitter:description': fallbackDescription,
    'twitter:image': '/logo.png',
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setLoading(true);
        
        // Only fetch from API if we have a specific page type
        if (pageType === 'home' || (objectId && (pageType === 'product' || pageType === 'category'))) {
          const params: Record<string, string | number> = { page_type: pageType };
          
          if (objectId) {
            params.object_id = objectId;
          }
          
          const response = await axios.get('/api/meta-tags', { params });
          
          if (response.data) {
            setMetaTags(response.data);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching meta tags:', err);
        setError('Failed to fetch meta tags');
        setLoading(false);
      }
    };

    fetchMetaTags();
  }, [pageType, objectId]);

  return { metaTags, loading, error };
};

export default useSEO;
