'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import blogService, { Blog } from '../../services/blogService';
import Spinner from '../../components/ui/Spinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

interface BlogListClientProps {
  initialBlogs: Blog[];
  initialTotalPages: number;
}

export default function BlogListClient({ initialBlogs, initialTotalPages }: BlogListClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);

  useEffect(() => {
    // Page 1 is server-rendered — only refetch when user paginates.
    if (currentPage === 1) return;
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await blogService.getBlogs(currentPage, 9, undefined, 'published', 'published_date', 'desc');
        setBlogs(response.blogs);
        setTotalPages(response.pages);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="bg-gradient-to-b from-[#defce8]/90 to-[#defce8]/70 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-green-100/90 to-green-50/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-200/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/5 via-transparent to-transparent"></div>
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-green-300/30 to-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-56 h-56 bg-gradient-to-r from-orange-300/10 to-yellow-200/10 rounded-full blur-3xl animate-float2"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <motion.h1 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-green-800 mb-4 font-['Playfair_Display',serif]">
            Azlok Blog
          </motion.h1>
          <motion.div {...fadeInUp} transition={{ delay: 0.1, duration: 0.5 }} className="h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p {...fadeInUp} transition={{ delay: 0.2, duration: 0.5 }} className="text-lg text-green-700 max-w-2xl mx-auto font-light">
            Latest news, insights, and updates from Azlok
          </motion.p>
        </div>

        {error && <ErrorAlert message={error} />}
        {loading && <div className="flex justify-center my-8"><Spinner /></div>}

        {!loading && blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No blog posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-100/50 group"
              >
                {blog.featured_image && (
                  <div className="relative h-52 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-green-600/90 text-white text-xs font-medium px-2 py-1 rounded-md z-20">
                      {formatDate(blog.published_date)}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-green-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{blog.excerpt}</p>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-green-100">
                    <div className="text-sm text-gray-500 font-medium">
                      By {blog.author?.full_name || 'Azlok Team'}
                    </div>
                    <Link href={`/blog/${blog.slug}`} className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center group/link">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full mr-2 flex items-center ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="text-sm text-green-800 font-medium mx-4 bg-white/70 px-4 py-2 rounded-full">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full ml-2 flex items-center ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-300'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
