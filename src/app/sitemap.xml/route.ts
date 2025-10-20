import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = "edge";

export async function GET() {
  try {
    // Read the static sitemap file
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapContent = fs.readFileSync(filePath, 'utf8');
    
    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap.xml:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
