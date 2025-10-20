import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://azlok.com';
  const currentDate = new Date();
  
  // Define routes
  const routes = [
    '',
    '/categories',
    '/products',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
