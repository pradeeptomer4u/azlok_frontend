'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Image from 'next/image';

interface Seller {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  logo_url: string | null;
  banner_url: string | null;
  description: string;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
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

  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      try {
        // Get authentication token
        const token = localStorage.getItem('azlok-token');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Fetch sellers from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?role=SELLER`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch sellers');
        }
        
        const data = await response.json();
        setSellers(data);
      } catch (err) {
        setError('Failed to load sellers. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchSellers();
    }
  }, [isAuthenticated, user]);

  const handleStatusChange = async (id: number, newStatus: 'active' | 'pending' | 'suspended') => {
    try {
      // Mock update - in real app, this would be an API call
      const updatedSellers = sellers.map(seller => 
        seller.id === id ? { ...seller, status: newStatus, updated_at: new Date().toISOString() } : seller
      );
      
      setSellers(updatedSellers);
      
      // When API is ready, uncomment this
      /*
      const response = await fetch(`/api/admin/sellers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update seller status');
      }
      
      const updatedSeller = await response.json();
      setSellers(sellers.map(seller => seller.id === updatedSeller.id ? updatedSeller : seller));
      */
    } catch (err) {
      console.error('Error updating seller status:', err);
      alert('Failed to update seller status. Please try again.');
    }
  };

  const handleUpdateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeller) return;
    
    try {
      // Mock update - in real app, this would be an API call
      const updatedSellers = sellers.map(seller => 
        seller.id === editingSeller.id ? { ...editingSeller, updated_at: new Date().toISOString() } : seller
      );
      
      setSellers(updatedSellers);
      setEditingSeller(null);
      setIsModalOpen(false);
      
      // When API is ready, uncomment this
      /*
      const response = await fetch(`/api/admin/sellers/${editingSeller.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSeller),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update seller');
      }
      
      const updatedSeller = await response.json();
      setSellers(sellers.map(seller => seller.id === updatedSeller.id ? updatedSeller : seller));
      setEditingSeller(null);
      setIsModalOpen(false);
      */
    } catch (err) {
      console.error('Error updating seller:', err);
      alert('Failed to update seller. Please try again.');
    }
  };

  const handleDeleteSeller = async (id: number) => {
    if (!confirm('Are you sure you want to delete this seller? This action cannot be undone.')) return;
    
    try {
      // Mock delete - in real app, this would be an API call
      setSellers(sellers.filter(seller => seller.id !== id));
      
      // When API is ready, uncomment this
      /*
      const response = await fetch(`/api/admin/sellers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete seller');
      }
      
      setSellers(sellers.filter(seller => seller.id !== id));
      */
    } catch (err) {
      console.error('Error deleting seller:', err);
      alert('Failed to delete seller. Please try again.');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Don't render anything if not authenticated or not admin
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Management</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {seller.logo_url ? (
                          <Image
                            src={seller.logo_url}
                            alt={seller.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {seller.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                        <div className="text-sm text-gray-500">{seller.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.email}</div>
                    <div className="text-sm text-gray-500">{seller.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={seller.status}
                      onChange={(e) => handleStatusChange(seller.id, e.target.value as 'active' | 'pending' | 'suspended')}
                      className={`text-sm font-medium rounded-full px-3 py-1 ${
                        seller.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : seller.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(seller.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingSeller(seller);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSeller(seller.id)}
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

      {/* Modal for Edit Seller */}
      {isModalOpen && editingSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Seller</h2>
            <form onSubmit={handleUpdateSeller}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={editingSeller.name}
                    onChange={(e) => setEditingSeller({ ...editingSeller, name: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={editingSeller.email}
                    onChange={(e) => setEditingSeller({ ...editingSeller, email: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={editingSeller.phone}
                    onChange={(e) => setEditingSeller({ ...editingSeller, phone: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    value={editingSeller.status}
                    onChange={(e) => setEditingSeller({ ...editingSeller, status: e.target.value as 'active' | 'pending' | 'suspended' })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
                    Logo URL
                  </label>
                  <input
                    id="logo"
                    type="text"
                    value={editingSeller.logo_url || ''}
                    onChange={(e) => setEditingSeller({ ...editingSeller, logo_url: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="banner">
                    Banner URL
                  </label>
                  <input
                    id="banner"
                    type="text"
                    value={editingSeller.banner_url || ''}
                    onChange={(e) => setEditingSeller({ ...editingSeller, banner_url: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editingSeller.description}
                  onChange={(e) => setEditingSeller({ ...editingSeller, description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
