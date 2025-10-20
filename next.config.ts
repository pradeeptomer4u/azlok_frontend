import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Check if we're in production build
const isProd = process.env.NODE_ENV === 'production';

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
  // SEO and Performance Optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Enable experimental features for better SEO and performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // CSS optimization settings
    optimizeCss: true,
    // Memory optimization
    memoryBasedWorkersCount: true,
  },
  
  // Output in standalone mode for better compatibility with Cloudflare Pages
  output: 'standalone',
  
  // Disable source maps in production to reduce file sizes
  productionBrowserSourceMaps: false,
  
  // Optimize build for Cloudflare Pages
  swcMinify: true,
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

// Setup development platform for Cloudflare Pages
if (process.env.NODE_ENV === 'development') {
  // Using top-level await in a module
  const setupDevEnv = async () => {
    await setupDevPlatform();
  };
  
  // Execute but don't block module initialization
  setupDevEnv().catch(console.error);
}

export default nextConfig;
