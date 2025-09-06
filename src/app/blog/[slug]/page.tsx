'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '../../../components/ui/Spinner';
import { ErrorAlert } from '../../../components/ui/ErrorAlert';
import blogService, { Blog } from '../../../services/blogService';
import productService, { Product } from '../../../services/productService';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  const slug = params && typeof params.slug === 'string' ? params.slug : '';

  // Fetch blog post
  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError('Invalid blog slug');
        setLoading(false);
        return;
      }

      try {
        const blogData = await blogService.getBlogBySlug(slug);
        if (blogData) {
          setBlog(blogData);
          
          // If blog has no featured products, fetch trending products
          if (!blogData.featured_products || blogData.featured_products.length === 0) {
            fetchTrendingProducts();
          }
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to fetch blog data');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Fetch trending products if blog has no featured products
  const fetchTrendingProducts = async () => {
    setLoadingProducts(true);
    try {
      const products = await productService.getBestsellers(5);
      setTrendingProducts(products);
    } catch (err) {
      console.error('Error fetching trending products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorAlert message={error} />
        <div className="mt-8 text-center">
          <Link 
            href="/blog"
            className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
        <p className="text-gray-600 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link 
          href="/blog"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  // Determine which products to show in the sidebar
  const sidebarProducts = blog.featured_products && blog.featured_products.length > 0 
    ? blog.featured_products 
    : trendingProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Blog header */}
            <div className="mb-8">
              <Link 
                href="/blog"
                className="text-primary hover:text-primary-dark text-sm font-medium mb-4 inline-block"
              >
                ← Back to Blog
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <span className="mr-4">By {blog.author?.full_name || 'Azlok Team'}</span>
                <span>{formatDate(blog.published_date)}</span>
              </div>
            </div>

            {/* Featured image */}
            {blog.featured_image && (
              <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={blog.featured_image}
                  alt={blog.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            )}

            {/* Blog content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {blog.featured_products && blog.featured_products.length > 0 
                  ? 'Featured Products' 
                  : 'Trending Products'}
              </h3>

              {/* Loading spinner for products */}
              {loadingProducts && (
                <div className="flex justify-center my-8">
                  <Spinner />
                </div>
              )}

              {/* Products list */}
              {!loadingProducts && sidebarProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No products to display</p>
              ) : (
                <div className="space-y-4">
                  {sidebarProducts.map((product) => (
                    <Link 
                      key={product.id}
                      href={`/products/${product.slug || product.id}`}
                      className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              // @ts-ignore - fallback for image error
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                        <p className="text-primary font-medium mt-1">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Call to action */}
              <div className="mt-6">
                <Link 
                  href="/products"
                  className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Shop All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
