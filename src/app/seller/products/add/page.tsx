'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploader from '../../../components/ImageUploader';

export const runtime = "edge";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(['/logo.png']);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    features: [''],
    specifications: [{ key: '', value: '' }]
  });
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle feature changes
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
  
  // Handle specification changes
  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };
  
  // Add new specification field
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
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
  
  // Handle image upload completion
  const handleImageUploaded = (imageUrl: string) => {
    setImages([...images, imageUrl]);
  };
  
  // Remove image
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      alert('Product added successfully!');
      
      // Redirect to products page
      router.push('/seller/products');
    } catch (error) {
      alert('Failed to add product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Link
          href="/seller/products"
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing</p>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="sku"
                        id="sku"
                        required
                        value={formData.sku}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g. IMP-001"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select a category</option>
                        <option value="Machinery Parts">Machinery Parts</option>
                        <option value="Electric Motors">Electric Motors</option>
                        <option value="Hydraulic Components">Hydraulic Components</option>
                        <option value="Pumps & Motors">Pumps & Motors</option>
                        <option value="Sensors & Controls">Sensors & Controls</option>
                        <option value="Automation Systems">Automation Systems</option>
                        <option value="Material Handling">Material Handling</option>
                        <option value="Pneumatic Systems">Pneumatic Systems</option>
                        <option value="Power Transmission">Power Transmission</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your product in detail"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Feature
                  </button>
                </div>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter product feature"
                      />
                    </div>
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 flex-shrink-0 p-1 rounded-full text-red-500 hover:bg-red-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Specifications</h3>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Specification
                  </button>
                </div>
                
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-6 mb-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Specification name"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Specification value"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      {formData.specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="flex-shrink-0 p-1 rounded-full text-red-500 hover:bg-red-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-2">
                      <div className="relative h-40 w-full mb-2">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Image {index + 1}</span>
                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <ImageUploader
                    onImageUploaded={handleImageUploaded}
                    folder="products"
                    className="mt-4"
                    maxSize={5}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Upload product images. First image will be used as the product thumbnail.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Product...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
                
                <div className="mt-4">
                  <Link
                    href="/seller/products"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
