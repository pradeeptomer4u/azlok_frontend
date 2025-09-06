'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogForm from '../../../../../components/admin/BlogForm';
import Spinner from '../../../../../components/ui/Spinner';
import { ErrorAlert } from '../../../../../components/ui/ErrorAlert';
import blogService, { Blog } from '../../../../../services/blogService';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const blogId = params && typeof params.id === 'string' ? parseInt(params.id, 10) : undefined;

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }

      try {
        const blogData = await blogService.getAdminBlogById(blogId);
        if (blogData) {
          setBlog(blogData);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog data');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorAlert message={error} />
        <div className="mt-4">
          <button
            onClick={() => router.push('/admin/blogs')}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return blog && <BlogForm blogId={blogId} initialData={blog} />;
}
