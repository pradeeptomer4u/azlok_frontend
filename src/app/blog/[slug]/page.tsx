'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Spinner from '../../../components/ui/Spinner';
import { ErrorAlert } from '../../../components/ui/ErrorAlert';
import blogService, { Blog } from '../../../services/blogService';
import productService, { Product } from '../../../services/productService';
import MetaTags from '../../../components/SEO/MetaTags';

export default function BlogDetailPage() {
  const params = useParams();
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
  
  // Animation settings
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
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
    <>
      <MetaTags
        title={`${blog.title} - Azlok Blog`}
        description={blog.excerpt || `Read about ${blog.title} on the Azlok Enterprises blog.`}
        ogType="article"
        ogUrl={`/blog/${blog.slug}`}
        ogImage={blog.featured_image || '/images/blog/blog-banner.jpg'}
        canonicalUrl={`/blog/${blog.slug}`}
      />
      
      <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
        {/* Advanced background graphics */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-orange-200/5 rounded-full blur-3xl animate-float2"></div>
          
          {/* Decorative geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"></div>
        </div>
        
        <div className="container-custom mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap mb-4 sm:mb-6 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
            <span className="mx-1 sm:mx-2 text-gray-500">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-primary">Blog</Link>
            <span className="mx-1 sm:mx-2 text-gray-500">/</span>
            <span className="text-gray-800 truncate max-w-[180px] xs:max-w-none" title={blog.title}>{blog.title}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            {/* Main content - Left side on desktop, bottom on mobile */}
            <div className="lg:w-2/3 order-2 lg:order-1">
              {/* Blog header */}
              {/* Blog Overview */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-green-100/50 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
                
                <motion.div 
                  {...fadeInUp}
                  className="relative z-10"
                >
                  <Link 
                    href="/blog"
                    className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-flex items-center group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1 transform transition-transform duration-300 group-hover:-translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                  </Link>
                  <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-3 sm:mb-4 relative z-10">{blog.title}</h1>
                  
                  <div className="flex flex-wrap items-center mb-3 sm:mb-4">
                    <div className="flex items-center mr-3 sm:mr-4 relative group/author">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-green-100/30 blur-md rounded-full opacity-0 group-hover/author:opacity-100 transition-opacity duration-300"></div>
                      
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">By {blog.author?.full_name || 'Azlok Team'}</span>
                    </div>
                    <span className="text-gray-500 hidden xs:inline">|</span>
                    <div className="flex items-center ml-0 xs:ml-3 sm:ml-4 mt-1 xs:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-light">{formatDate(blog.published_date)}</span>
                    </div>
                  </div>
                </motion.div>

              {/* Featured image */}
              {blog.featured_image && (
                <div className="relative h-64 xs:h-72 sm:h-80 bg-white rounded-lg mb-3 sm:mb-4 shadow-sm overflow-hidden group/image border border-green-100/50">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-300/30 rounded-tl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-300/30 rounded-br-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  
                  <Image
                    src={blog.featured_image}
                    alt={blog.title}
                    fill
                    className="object-cover p-0 transition-transform duration-500 group-hover/image:scale-105"
                    priority
                  />
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-100/0 via-green-100/10 to-green-100/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}

              {/* Blog content */}
              <div className="mb-4 sm:mb-6 bg-[#defce8]/30 p-4 sm:p-6 rounded-lg border border-green-100/50 shadow-sm">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-green-800 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg font-['Montserrat',sans-serif]"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-green-100/50 relative overflow-hidden group">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                  
                  <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Related Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors duration-300 cursor-pointer border border-green-200/50 hover:shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar - Right side on desktop, top on mobile */}
            <div className="lg:w-1/3 order-1 lg:order-2 mb-8 lg:mb-0 relative">
              <motion.div 
                className="lg:sticky lg:top-24 self-start"
                {...fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ position: 'sticky', top: '6rem' }}
              >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-green-100/50 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
                
                <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="font-['Playfair_Display',serif]">
                    {blog.featured_products && blog.featured_products.length > 0 
                      ? 'Featured Products' 
                      : 'Trending Products'}
                  </span>
                </h3>

                {/* Loading spinner for products */}
                {loadingProducts && (
                  <div className="flex justify-center my-8">
                    <Spinner />
                  </div>
                )}

                {/* Products list */}
                {!loadingProducts && sidebarProducts.length === 0 ? (
                  <p className="text-gray-500 text-sm font-['Montserrat',sans-serif]">No products to display</p>
                ) : (
                  <div className="space-y-4 relative z-10">
                    {sidebarProducts.map((product) => (
                      <Link 
                        key={product.id}
                        href={`/products/${product.slug || product.id}`}
                        className="flex items-center p-3 bg-white/90 rounded-lg hover:shadow-md transition-all duration-300 group/product border border-green-100/50 hover:border-green-200/70 relative overflow-hidden"
                      >
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/30 to-green-50/0 opacity-0 group-hover/product:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm border border-green-100/50">
                          {!!product.image_urls ? (
                            <Image
                              src={Array.isArray(product.image_urls) ? product.image_urls[0] : product.image_urls}
                              alt={product.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="group-hover/product:scale-110 transition-transform duration-500 p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Corner accent */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-300/30 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="ml-4 flex-grow relative z-10">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover/product:text-green-700 transition-colors duration-300 font-['Montserrat',sans-serif]">{product.name}</h4>
                          <p className="text-green-600 font-medium mt-1 font-['Montserrat',sans-serif] text-sm">
                            <span className="font-bold">₹{product.price}</span>
                          </p>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="ml-2 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Product action buttons */}
                {sidebarProducts.length > 0 && (
                  <div className="mt-6 relative z-10">
                    <div className="flex space-x-2">
                      <a 
                        href={`https://wa.me/918800412138?text=Hi, I'm interested in ${encodeURIComponent(sidebarProducts[0]?.name || 'your products')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-green-500/80 to-green-600/80 text-white py-2 px-4 rounded-md hover:from-green-600/90 hover:to-green-700/90 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md flex items-center justify-center group/btn"
                        aria-label="Contact via WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        <span className="font-['Montserrat',sans-serif]">WhatsApp</span>
                      </a>
                      <button 
                        className="flex-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 py-2 px-4 rounded-md hover:from-green-200 hover:to-green-300 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-sm hover:shadow-md flex items-center justify-center group/btn"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart functionality would go here
                          alert(`Added ${sidebarProducts[0]?.name || 'product'} to cart`);
                        }}
                        aria-label="Add to cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-['Montserrat',sans-serif]">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}