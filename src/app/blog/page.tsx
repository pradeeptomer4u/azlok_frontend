import type { Metadata } from 'next';
import blogService from '../../services/blogService';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog - Azlok',
  description: 'Latest news, insights, and updates from Azlok. Read our blog for information on organic products, sustainability, and more.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog - Azlok',
    description: 'Latest news, insights, and updates from Azlok.',
    url: '/blog',
    siteName: 'Azlok',
    images: [{ url: '/images/blog/blog-banner.jpg', width: 1200, height: 630, alt: 'Azlok Blog' }],
    type: 'website',
  },
};

export default async function BlogListingPage() {
  // Server-fetch first page so SSR HTML carries the blog cards (titles + images)
  // — crawlers see the article list instead of the empty client-side shell.
  let initialBlogs: Awaited<ReturnType<typeof blogService.getBlogs>>['blogs'] = [];
  let initialTotalPages = 1;
  try {
    const res = await blogService.getBlogs(1, 9, undefined, 'published', 'published_date', 'desc');
    initialBlogs = res.blogs;
    initialTotalPages = res.pages;
  } catch (e) {
    console.error('Error fetching initial blogs:', e);
  }

  return <BlogListClient initialBlogs={initialBlogs} initialTotalPages={initialTotalPages} />;
}
