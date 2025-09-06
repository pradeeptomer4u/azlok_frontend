import { apiRequest } from '../utils/apiRequest';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  author?: {
    id: number;
    full_name: string;
    username: string;
  };
  status: 'draft' | 'published' | 'archived';
  published_date?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  views_count: number;
  featured_products?: Array<{
    id: number;
    name: string;
    price: number;
    image_url?: string;
    slug?: string;
  }>;
  created_at: string;
  updated_at?: string;
}

export interface CreateBlogInput {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
  published_date?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  featured_product_ids?: number[];
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  id: number;
  slug?: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Blog API service
const blogService = {
  // Get all blogs with optional filters
  getBlogs: async (
    page: number = 1,
    size: number = 10,
    search?: string,
    status?: string,
    sort_by?: string,
    sort_order?: 'asc' | 'desc'
  ): Promise<BlogsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        skip: ((page - 1) * size).toString(),
        limit: size.toString(),
      });

      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);
      if (sort_by) queryParams.append('sort_by', sort_by);
      if (sort_order) queryParams.append('sort_order', sort_order);

      const response = await apiRequest<BlogsResponse>(`/api/blogs/?${queryParams.toString()}`);
      return response || { blogs: [], total: 0, page, size, pages: 0 };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return { blogs: [], total: 0, page, size, pages: 0 };
    }
  },

  // Get all blogs for admin dashboard
  getAdminBlogs: async (
    page: number = 1,
    size: number = 10,
    search?: string,
    status?: string,
    sort_by?: string,
    sort_order?: 'asc' | 'desc'
  ): Promise<BlogsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        skip: ((page - 1) * size).toString(),
        limit: size.toString(),
      });

      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);
      if (sort_by) queryParams.append('sort_by', sort_by);
      if (sort_order) queryParams.append('sort_order', sort_order);

      const response = await apiRequest<BlogsResponse>(`/api/blogs/admin?${queryParams.toString()}`);
      return response || { blogs: [], total: 0, page, size, pages: 0 };
    } catch (error) {
      console.error('Error fetching admin blogs:', error);
      return { blogs: [], total: 0, page, size, pages: 0 };
    }
  },

  // Get a single blog by slug
  getBlogBySlug: async (slug: string): Promise<Blog | null> => {
    try {
      const response = await apiRequest<Blog>(`/api/blogs/${slug}`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching blog with slug ${slug}:`, error);
      return null;
    }
  },

  // Get a single blog by ID for admin
  getAdminBlogById: async (id: number): Promise<Blog | null> => {
    try {
      const response = await apiRequest<Blog>(`/api/blogs/${id}/admin`);
      return response || null;
    } catch (error) {
      console.error(`Error fetching admin blog with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new blog
  createBlog: async (blogData: CreateBlogInput): Promise<Blog | null> => {
    try {
      const response = await apiRequest<Blog>('/api/blogs', {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
      return response || null;
    } catch (error) {
      console.error('Error creating blog:', error);
      return null;
    }
  },

  // Update an existing blog
  updateBlog: async (blogData: UpdateBlogInput): Promise<Blog | null> => {
    try {
      const response = await apiRequest<Blog>(`/api/blogs/${blogData.id}`, {
        method: 'PUT',
        body: JSON.stringify(blogData),
      });
      return response || null;
    } catch (error) {
      console.error(`Error updating blog with ID ${blogData.id}:`, error);
      return null;
    }
  },

  // Delete a blog
  deleteBlog: async (id: number): Promise<boolean> => {
    try {
      await apiRequest(`/api/blogs/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error(`Error deleting blog with ID ${id}:`, error);
      return false;
    }
  },
};

export default blogService;
