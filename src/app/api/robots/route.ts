import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Always generate a fresh robots.txt to ensure it's up to date
    const robotsContent = `# robots.txt — SEO-optimized for Azlok.com
# Generated on ${new Date().toISOString()}

# Explicit rules for major search engines
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /cart/
Disallow: /checkout/
Disallow: /wp-admin/
Disallow: /cgi-bin/
Disallow: /api/
Disallow: /private/
Disallow: /staging/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /cart/
Disallow: /checkout/
Disallow: /wp-admin/
Disallow: /api/
Disallow: /private/
Disallow: /staging/

# Generic rule for all other crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /cart/
Disallow: /checkout/
Disallow: /wp-admin/
Disallow: /cgi-bin/
Disallow: /api/
Disallow: /private/
Disallow: /staging/

# Disallow common parameter patterns that create duplicate content
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*sessionid=
Disallow: /*?*page=*&*

# Sitemap
Sitemap: https://www.azlok.com/sitemap.xml
Sitemap: https://www.azlok.com/sitemap-index.xml`;

    return new NextResponse(robotsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    
    // Fallback robots.txt content if there's an error
    const fallbackContent = `# robots.txt — SEO-optimized for Azlok.com
# Fallback version

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://www.azlok.com/sitemap.xml`;

    return new NextResponse(fallbackContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
