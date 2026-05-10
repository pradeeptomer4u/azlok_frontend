import blogService from '../../../services/blogService';
import productService from '../../../services/productService';
import seoService from '../../../services/seoService';
import BlogDetailClient from '../../../components/blog/BlogDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch blog data and admin SEO settings in parallel (server-side)
  const [blog, adminSeo] = await Promise.all([
    blogService.getBlogBySlug(slug).catch(() => null),
    seoService.getServerSide('blog', slug),
  ]);

  const defaultTitle = blog ? `${blog.title} - Azlok Blog` : `${slug.replace(/-/g, ' ')} - Azlok Blog`;
  const defaultDescription = blog?.excerpt || (blog ? `Read about ${blog.title} on the Azlok blog.` : 'Read this article on the Azlok blog.');
  const defaultImage = (typeof blog?.featured_image === 'string' ? blog.featured_image : null) || '/home_page_banner.png';
  const canonicalPath = adminSeo?.canonical_url || `/blog/${slug}`;
  const ogImage = adminSeo?.og_image || defaultImage;

  return {
    title: adminSeo?.title || defaultTitle,
    description: adminSeo?.description || defaultDescription,
    keywords: adminSeo?.keywords || (blog?.tags?.join(', ') ?? undefined),
    robots: adminSeo?.robots,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: adminSeo?.og_title || adminSeo?.title || defaultTitle,
      description: adminSeo?.og_description || adminSeo?.description || defaultDescription,
      url: `/blog/${slug}`,
      siteName: 'Azlok',
      images: [{ url: ogImage, width: 1200, height: 630, alt: blog?.title || slug }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: adminSeo?.og_title || adminSeo?.title || defaultTitle,
      description: adminSeo?.og_description || adminSeo?.description || defaultDescription,
      images: [ogImage],
      creator: '@azlok',
      site: '@azlok',
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Server-fetch the blog so the SSR HTML carries the article body, image,
  // and title — generateMetadata also fetches it; both calls share the
  // request-level cache so this is a single network request.
  const blog = await blogService.getBlogBySlug(slug).catch(() => null);

  // If the blog has no featured products, fetch trending products server-side
  // so the sidebar renders real items in SSR HTML (was showing "No products
  // to display" to crawlers because the fallback fetch only ran on client).
  const needsTrending = !blog?.featured_products || blog.featured_products.length === 0;
  const initialTrendingProducts = needsTrending
    ? await productService.getBestsellers(5).catch(() => [])
    : [];

  return (
    <BlogDetailClient
      slug={slug}
      initialBlog={blog}
      initialTrendingProducts={initialTrendingProducts}
    />
  );
}