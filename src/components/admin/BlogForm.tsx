'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import blogService, { Blog } from '../../services/blogService';
import productService, { Product } from '../../services/productService';
import Spinner from '../ui/Spinner';
import { ErrorAlert } from '../ui/ErrorAlert';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface BlogFormProps {
  blogId?: number; // Optional for edit mode
  initialData?: Blog; // Blog data for edit mode
}

export default function BlogForm({ blogId, initialData }: BlogFormProps) {
  const router = useRouter();
  const isEditMode = !!blogId;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    published_date: '',
    meta_title: '',
    meta_description: '',
    tags: [''],
    featured_product_ids: [] as number[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Products state
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load initial data for edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        featured_image: initialData.featured_image || '',
        status: initialData.status || 'draft',
        published_date: initialData.published_date ? new Date(initialData.published_date).toISOString().split('T')[0] : '',
        meta_title: initialData.meta_title || '',
        meta_description: initialData.meta_description || '',
        tags: initialData.tags || [''],
        featured_product_ids: initialData.featured_products?.map(p => p.id) || []
      });

      // Load selected products
      if (initialData.featured_products && initialData.featured_products.length > 0) {
        // Convert featured_products to Product type
        const products: Product[] = initialData.featured_products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image_url: p.image_url,
          slug: p.slug,
          description: '',
          category_id: 0,
          stock_quantity: 0,
          sku: '',
          created_at: '',
          updated_at: ''
        }));
        setSelectedProducts(products);
      }
    }
  }, [isEditMode, initialData]);

  // Load trending products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const products = await productService.getBestsellers(20);
        setAvailableProducts(products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle rich text editor change
  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });

    // Clear error when content is edited
    if (errors.content) {
      setErrors({
        ...errors,
        content: ''
      });
    }
  };

  // Handle tag change
  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({
      ...formData,
      tags: updatedTags
    });
  };

  // Add new tag field
  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, '']
    });
  };

  // Remove tag field
  const removeTag = (index: number) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData({
      ...formData,
      tags: updatedTags
    });
  };

  // Handle product search
  const handleProductSearch = async () => {
    if (!productSearchTerm.trim()) return;
    
    setLoadingProducts(true);
    try {
      const products = await productService.searchProducts(productSearchTerm);
      setAvailableProducts(products);
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add product to featured products
  const addProductToFeatured = (product: Product) => {
    if (!formData.featured_product_ids.includes(product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setFormData({
        ...formData,
        featured_product_ids: [...formData.featured_product_ids, product.id]
      });
    }
  };

  // Remove product from featured products
  const removeProductFromFeatured = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    setFormData({
      ...formData,
      featured_product_ids: formData.featured_product_ids.filter(id => id !== productId)
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.status === 'published' && !formData.published_date) {
      newErrors.published_date = 'Published date is required for published blogs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Filter out empty tags
      const filteredTags = formData.tags.filter(tag => tag.trim() !== '');

      // Prepare blog data
      const blogData = {
        title: formData.title,
        slug: formData.slug || undefined,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featured_image: formData.featured_image || undefined,
        status: formData.status as 'draft' | 'published' | 'archived',
        published_date: formData.published_date || undefined,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        tags: filteredTags.length > 0 ? filteredTags : undefined,
        featured_product_ids: formData.featured_product_ids.length > 0 ? formData.featured_product_ids : undefined
      };

      let response;
      if (isEditMode && blogId) {
        // Update existing blog
        response = await blogService.updateBlog({
          id: blogId,
          ...blogData
        });
      } else {
        // Create new blog
        response = await blogService.createBlog(blogData);
      }

      if (response) {
        // Show success message
        alert(`Blog ${isEditMode ? 'updated' : 'created'} successfully!`);
        
        // Redirect back to blog list
        router.push('/admin/blogs');
      } else {
        throw new Error('Failed to save blog');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the blog');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'indent', 'direction',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? 'Update blog post information' : 'Fill in the information to create a new blog post'}
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area - 2/3 width */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter blog title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Slug */}
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-gray-400 text-xs">(Leave empty to auto-generate)</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter blog slug"
                />
              </div>
              
              {/* Featured Image */}
              <div className="mb-4">
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter image URL"
                />
                {formData.featured_image && (
                  <div className="mt-2 h-40 bg-gray-100 rounded-md overflow-hidden relative">
                    <Image
                      src={formData.featured_image}
                      alt="Featured image preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className={`${errors.content ? 'border border-red-300 rounded-md' : ''}`}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="h-64 mb-12"
                  />
                </div>
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              </div>
              
              {/* Excerpt */}
              <div className="mb-4">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt <span className="text-gray-400 text-xs">(Short summary for previews)</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter a short excerpt"
                ></textarea>
              </div>
            </div>
            
            {/* SEO Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">SEO Information</h3>
              
              {/* Meta Title */}
              <div className="mb-4">
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title <span className="text-gray-400 text-xs">(Defaults to post title)</span>
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter meta title"
                />
              </div>
              
              {/* Meta Description */}
              <div className="mb-4">
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={2}
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter meta description"
                ></textarea>
              </div>
              
              {/* Tags */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Add Tag
                  </button>
                </div>
                
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter tag"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="col-span-1 space-y-6">
            {/* Publishing Options */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-900 mb-4">Publishing Options</h3>
              
              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              {/* Published Date */}
              <div className="mb-4">
                <label htmlFor="published_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date {formData.status === 'published' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  id="published_date"
                  name="published_date"
                  value={formData.published_date}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.published_date ? 'border-red-300' : ''
                  }`}
                />
                {errors.published_date && <p className="mt-1 text-sm text-red-600">{errors.published_date}</p>}
              </div>
            </div>
            
            {/* Featured Products */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-900 mb-4">Featured Products</h3>
              
              {/* Product Search */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search products"
                  />
                  <button
                    type="button"
                    onClick={handleProductSearch}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Search
                  </button>
                </div>
              </div>
              
              {/* Available Products */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Products</h4>
                {loadingProducts ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                    {availableProducts.length === 0 ? (
                      <p className="text-sm text-gray-500 p-3">No products found</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {availableProducts.map((product) => (
                          <li key={product.id} className="p-3 hover:bg-gray-100 flex justify-between items-center">
                            <div className="flex items-center">
                              {product.image_url && (
                                <div className="h-10 w-10 mr-3 relative">
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-sm text-gray-500">₹{product.price}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addProductToFeatured(product)}
                              disabled={formData.featured_product_ids.includes(product.id)}
                              className={`text-xs px-2 py-1 rounded-md ${
                                formData.featured_product_ids.includes(product.id)
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-primary-dark'
                              }`}
                            >
                              {formData.featured_product_ids.includes(product.id) ? 'Added' : 'Add'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Products */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Products</h4>
                {selectedProducts.length === 0 ? (
                  <p className="text-sm text-gray-500 p-3 border border-gray-200 rounded-md">No products selected</p>
                ) : (
                  <div className="border border-gray-200 rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {selectedProducts.map((product) => (
                        <li key={product.id} className="p-3 hover:bg-gray-100 flex justify-between items-center">
                          <div className="flex items-center">
                            {product.image_url && (
                              <div className="h-10 w-10 mr-3 relative">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  className="rounded-md"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500">₹{product.price}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProductFromFeatured(product.id)}
                            className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `${isEditMode ? 'Update' : 'Create'} Blog Post`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
