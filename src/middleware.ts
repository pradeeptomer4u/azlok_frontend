import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = "edge";

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add X-Robots-Tag header
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // We'll handle canonical URLs in the HTML instead of headers
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add Content-Security-Policy header for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://api.azlok.com https://www.google-analytics.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://checkout.razorpay.com;"
    );
  }

  return response;
}

// Only run middleware on the main domain - not on API routes or static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
