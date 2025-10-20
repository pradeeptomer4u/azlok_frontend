import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Always read the static sitemap file first
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    let sitemapContent = '';
    
    try {
      sitemapContent = fs.readFileSync(filePath, 'utf8');
      // Return the static file content directly
      return new NextResponse(sitemapContent, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (readError) {
      console.error('Error reading sitemap file:', readError);
      
      // Generate a dynamic sitemap as fallback
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Main pages
      const mainPages = [
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: '/categories', priority: '0.8', changefreq: 'weekly' },
        { url: '/products', priority: '0.8', changefreq: 'daily' },
        { url: '/products/dr-tomar-stearic-acid-powder', priority: '0.8', changefreq: 'daily' },
        { url: '/products/azlok-zeera', priority: '0.8', changefreq: 'daily' },
        { url: '/products/lavender-essential-oil', priority: '0.8', changefreq: 'daily' },
        { url: '/products/alum-powder', priority: '0.8', changefreq: 'daily' },
        { url: '/products/turmeric-haldi-powder-100g', priority: '0.8', changefreq: 'daily' },
        { url: '/products/glycerine', priority: '0.8', changefreq: 'daily' },
        { url: '/products/oxalic-acid', priority: '0.8', changefreq: 'daily' },
        { url: '/products/dr-tomar-borax-powder', priority: '0.8', changefreq: 'daily' },
        { url: '/products/ipa', priority: '0.8', changefreq: 'daily' },
        { url: '/products/azlok-garam-masala-200-g', priority: '0.8', changefreq: 'daily' },
        { url: '/products/azlok-lal-mirchi-(red-chilli-powder)-100-g', priority: '0.8', changefreq: 'daily' },
        { url: '/products/azlok-coriander-(dhaniya)-powder-200-g-', priority: '0.8', changefreq: 'daily' },
        { url: '/about', priority: '0.7', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/faq', priority: '0.6', changefreq: 'monthly' },
        { url: '/terms', priority: '0.5', changefreq: 'monthly' },
        { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
        { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
        { url: '/returns', priority: '0.5', changefreq: 'monthly' },
      ];
      
      // Generate XML
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      
      // Add each page
      for (const page of mainPages) {
        sitemapContent += `  <url>
    <loc>https://azlok.com${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }
      
      sitemapContent += `</urlset>`;
    }
    
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
