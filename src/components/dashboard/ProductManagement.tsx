import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import productService, { Product, CreateProductInput, UpdateProductInput, ProductFilters } from '../../services/productService';
import { Spinner } from '../ui/Spinner';
import { ErrorAlert } from '../ui/ErrorAlert';

interface ProductManagementProps {
  sellerId: number;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ sellerId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    description: '',
    price: 0,
    category_id: 1,
    stock_quantity: 0,
    sku: '',
  });
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  // Fetch seller's products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: ProductFilters = {
        page: currentPage,
        size: pageSize,
      };
      
      const response = await productService.getSellerProducts(sellerId, filters);
      setProducts(response.items);
      setTotalProducts(response.total);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sellerId, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: 1,
      stock_quantity: 0,
      sku: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      category_id: product.category_id,
      brand: product.brand,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url,
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_bestseller: product.is_bestseller,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      hsn_code: product.hsn_code,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeleting(true);
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setTotalProducts(prev => prev - 1);
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      if (currentProduct) {
        // Update existing product
        const updateData: UpdateProductInput = {
          id: currentProduct.id,
          ...formData
        };
        const updated = await productService.updateProduct(updateData);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
      } else {
        // Create new product
        const created = await productService.createProduct(formData);
        setProducts([created, ...products]);
        setTotalProducts(prev => prev + 1);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to ${currentProduct ? 'update' : 'create'} product. Please try again.`);
      console.error(`Error ${currentProduct ? 'updating' : 'creating'} product:`, err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800">Product Management</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add New Product
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found. Click "Add New Product" to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.image_url}
                              alt={product.name}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.discount_price && (
                        <div className="text-xs text-green-600">
                          Sale: ${product.discount_price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isDeleting && deleteId === product.id}
                      >
                        {isDeleting && deleteId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalProducts)}
                </span>{' '}
                of <span className="font-medium">{totalProducts}</span> products
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, currentPage - 2);
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="discount_price"
                      id="discount_price"
                      min="0"
                      step="0.01"
                      value={formData.discount_price || ''}
                      onChange={handleInputChange}
                      className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                    Category*
                  </label>
                  <select
                    name="category_id"
                    id="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={1}>Electronics</option>
                    <option value={2}>Clothing</option>
                    <option value={3}>Home & Kitchen</option>
                    <option value={4}>Books</option>
                    <option value={5}>Toys & Games</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={formData.brand || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    id="stock_quantity"
                    required
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU*
                  </label>
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    required
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    min="0"
                    step="0.01"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    id="dimensions"
                    placeholder="e.g., 10x20x30 cm"
                    value={formData.dimensions || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="hsn_code" className="block text-sm font-medium text-gray-700">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    name="hsn_code"
                    id="hsn_code"
                    value={formData.hsn_code || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        id="is_featured"
                        checked={formData.is_featured || false}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                        Featured
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_new"
                        id="is_new"
                        checked={formData.is_new || false}
                        onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_new" className="ml-2 block text-sm text-gray-700">
                        New Arrival
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_bestseller"
                        id="is_bestseller"
                        checked={formData.is_bestseller || false}
                        onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_bestseller" className="ml-2 block text-sm text-gray-700">
                        Bestseller
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Saving...' : currentProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
