'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface ProductData {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  category?: string;
  category_ids?: number[];
  description?: string;
  features?: string[];
  specifications?: Array<{ name: string; value: string }>;
  images?: string[];
  status?: 'active' | 'inactive' | 'pending';
}

interface ProductFormProps {
  productId?: number; // Optional for edit mode
  initialData?: ProductData; // Product data for edit mode
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!productId;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    category_ids: [] as number[],
    description: '',
    features: [''],
    specifications: [{ name: '', value: '' }],
    images: [''],
    status: 'active'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('azlok-token');
        
        if (!token) {
          console.error('Authentication required to fetch categories');
          return;
        }
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Load initial data for edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        price: initialData.price ? initialData.price.toString() : '',
        stock: initialData.stock ? initialData.stock.toString() : '',
        category: initialData.category || '',
        category_ids: initialData.category_ids || [],
        description: initialData.description || '',
        features: initialData.features || [''],
        specifications: initialData.specifications || [{ name: '', value: '' }],
        images: initialData.images || [''],
        status: initialData.status || 'active'
      });
      
      if (initialData.images && initialData.images.length > 0) {
        setPreviewImages(initialData.images);
      }
    }
  }, [isEditMode, initialData]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Find the selected category
      const selectedCategory = categories.find(cat => cat.name === value);
      
      setFormData({
        ...formData,
        [name]: value,
        category_ids: selectedCategory ? [selectedCategory.id] : []
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle feature change
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };
  
  // Add new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };
  
  // Remove feature field
  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };
  
  // Handle specification change
  const handleSpecificationChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };
  
  // Add new specification field
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: '', value: '' }]
    });
  };
  
  // Remove specification field
  const removeSpecification = (index: number) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };
  
  // Handle image change
  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    // For demo purposes, we'll just use the same image for preview
    // In a real app, this would handle file uploads
    const updatedPreviews = [...previewImages];
    updatedPreviews[index] = value || '/logo.png'; // Use the URL or fallback to demo image
    setPreviewImages(updatedPreviews);
  };
  
  // Add new image field
  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
    setPreviewImages([...previewImages, '']);
  };
  
  // Remove image field
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('azlok-token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Prepare product data for API
      const productData = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock),
        category_ids: formData.category_ids,
        description: formData.description,
        features: formData.features.filter(f => f.trim() !== ''),
        specifications: formData.specifications.filter(s => s.name.trim() !== '' && s.value.trim() !== ''),
        image_urls: formData.images.filter(img => img.trim() !== ''),
        approval_status: formData.status
      };
      
      let response;
      
      if (isEditMode && productId) {
        // Update existing product
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new product
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      if (response.status >= 200 && response.status < 300) {
        // Show success message
        alert(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
        
        // Redirect back to products list
        router.push('/admin/products');
      } else {
        throw new Error(`API returned status code ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`An error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? 'Update product information' : 'Fill in the information to create a new product'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
          </div>
          
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.name ? 'border-red-300' : ''
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.sku ? 'border-red-300' : ''
              }`}
              placeholder="Enter product SKU"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.price ? 'border-red-300' : ''
              }`}
              placeholder="Enter product price"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.stock ? 'border-red-300' : ''
              }`}
              placeholder="Enter stock quantity"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.category ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select a category</option>
              {isLoadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
          
          {/* Status */}
          <div>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
          
          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.description ? 'border-red-300' : ''
              }`}
              placeholder="Enter product description"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          
          {/* Features */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Feature
              </button>
            </div>
            
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter feature"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
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
          
          {/* Specifications */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Specifications</label>
              <button
                type="button"
                onClick={addSpecification}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Specification
              </button>
            </div>
            
            {formData.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Name (e.g., Material)"
                />
                <div className="flex items-center">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Value (e.g., Stainless Steel)"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Images */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Image
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="border rounded-md p-2">
                  <div className="mb-2 h-32 bg-gray-100 rounded-md overflow-hidden relative">
                    {previewImages[index] ? (
                      <Image
                        src={previewImages[index]}
                        alt={`Product image ${index + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Image URL"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
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
              `${isEditMode ? 'Update' : 'Create'} Product`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
