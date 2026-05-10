import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.azlok.com';
const API_URL = 'https://api.azlok.com';

type ApiSlug = { slug?: string; updated_at?: string | null; created_at?: string };

async function fetchSlugs(path: string): Promise<ApiSlug[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/product-faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/shipping`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/returns`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const [products, categories] = await Promise.all([
    fetchSlugs('/api/products/'),
    fetchSlugs('/api/categories/'),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : (p.created_at ? new Date(p.created_at) : now),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/categories/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : (c.created_at ? new Date(c.created_at) : now),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
