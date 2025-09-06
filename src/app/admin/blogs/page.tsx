import { Metadata } from 'next';
import BlogManagement from '../../../components/dashboard/BlogManagement';

export const metadata: Metadata = {
  title: 'Blog Management | Azlok Admin',
  description: 'Manage blog posts for Azlok website',
};

export default function BlogsPage() {
  return <BlogManagement />;
}
