'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent_id: null as number | null,
    image_url: '',
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Get token from localStorage
        const token = localStorage.getItem('azlok-token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Fetch categories from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get token from localStorage
      const token = localStorage.getItem('azlok-token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setNewCategory({ name: '', description: '', parent_id: null, image_url: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('azlok-token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCategory),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      const updatedCategory = await response.json();
      setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('azlok-token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Don't render anything if not authenticated or not admin
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setNewCategory({ name: '', description: '', parent_id: null, image_url: '' });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description.length > 50
                      ? `${category.description.substring(0, 50)}...`
                      : category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.parent_id
                      ? categories.find(c => c.id === category.parent_id)?.name || 'Unknown'
                      : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, name: e.target.value })
                      : setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editingCategory ? editingCategory.description : newCategory.description}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, description: e.target.value })
                      : setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
                  Parent Category
                </label>
                <select
                  id="parent"
                  value={editingCategory ? (editingCategory.parent_id || '') : (newCategory.parent_id || '')}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value, 10) : null;
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, parent_id: value })
                      : setNewCategory({ ...newCategory, parent_id: value });
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">None</option>
                  {categories
                    .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image URL
                </label>
                <input
                  id="image"
                  type="text"
                  value={editingCategory ? (editingCategory.image_url || '') : newCategory.image_url}
                  onChange={(e) =>
                    editingCategory
                      ? setEditingCategory({ ...editingCategory, image_url: e.target.value })
                      : setNewCategory({ ...newCategory, image_url: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
