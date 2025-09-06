'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blogService, { Blog } from '../../services/blogService';
import Spinner from '../../components/ui/Spinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Only fetch published blogs
        const response = await blogService.getBlogs(
          currentPage,
          9,
          undefined,
          'published',
          'published_date',
          'desc'
        );
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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Azlok Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest news, insights, and updates from Azlok Enterprises
          </p>
        </div>

        {/* Error message */}
        {error && <ErrorAlert message={error} />}

        {/* Loading spinner */}
        {loading && <div className="flex justify-center my-8"><Spinner /></div>}

        {/* Blog grid */}
        {!loading && blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No blog posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {blog.featured_image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(blog.published_date)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                      {blog.title}
                    </Link>
                  </h2>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      By {blog.author?.full_name || 'Azlok Team'}
                    </div>
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md mr-2 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <div className="text-sm text-gray-700 mx-4">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ml-2 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
  );
}
