import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login/',
          '/register/',
          '/cart/',
          '/checkout/',
          '/api/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://www.azlok.com/sitemap.xml',
  }
}
