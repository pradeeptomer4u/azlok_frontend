import { Metadata } from 'next';
import BlogForm from '../../../../components/admin/BlogForm';

export const metadata: Metadata = {
  title: 'Create Blog Post | Azlok Admin',
  description: 'Create a new blog post for Azlok website',
};

export default function NewBlogPage() {
  return <BlogForm />;
}
