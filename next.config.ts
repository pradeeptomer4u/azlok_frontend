import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'pub-4f4e78fc0ec74271a702caabd7e4e13d.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  optimizeCss: {
      // Configure critters for CSS optimization
      minify: true,
      inlineFonts: false,
    },
  poweredByHeader: false,
  generateEtags: true,
  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // No rewrites needed as we're using static files
  
  // Headers for better SEO and security
  async headers() {
    return [
      // Headers for sitemap.xml
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      // Headers for sitemap-index.xml
      {
        source: '/sitemap-index.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      // Headers for robots.txt
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Ensure JavaScript files are served with the correct MIME type
      {
        source: '/(.*)\\.(js|jsx|ts|tsx)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
