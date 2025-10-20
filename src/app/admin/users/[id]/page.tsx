'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { getUserById, deleteUser, updateUserStatus, User, BuyerActivity, SellerActivity } from '../../../../services/userService';

export const runtime = "edge";

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        if (!params?.id) {
          throw new Error('User ID not found');
        }
        
        const userId = Array.isArray(params.id) ? params.id[0] : params.id;
        const userData = await getUserById(userId);
        
        if (!userData) {
          throw new Error('User not found');
        }
        
        setUser(userData);
      } catch (err) {
        setError('Failed to load user. Please try again.');
        console.error('Error fetching user:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [params?.id]);
  
  // Handle delete user
  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        const success = await deleteUser(user.id);
        
        if (success) {
          alert(`User ${user.name} deleted successfully!`);
          router.push('/admin/users');
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
        setIsLoading(false);
      }
    }
  };
  
  // Handle user status update
  const handleStatusUpdate = async (newStatus: 'active' | 'inactive') => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const success = await updateUserStatus(user.id, newStatus);
      
      if (success) {
        // Update local state to reflect the change
        setUser(prev => prev ? {...prev, status: newStatus} : null);
        alert(`User status updated to ${newStatus}`);
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'User not found'}</span>
        <div className="mt-4">
          <Link 
            href="/admin/users" 
            className="text-red-700 underline hover:text-red-800"
          >
            Return to users list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/users" 
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link 
            href={`/admin/users/edit/${user.id}`} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button 
            onClick={handleDeleteUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      {/* User Status Badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
        <span className="ml-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${user.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 
            user.role === 'seller' ? 'bg-purple-100 text-purple-800' : 
            'bg-green-100 text-green-800'}">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-xl font-bold mt-1">{formatDate(user.joinDate)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Last Login</p>
          <p className="text-xl font-bold mt-1">{formatDate(user.lastLogin)}</p>
        </div>
        {user.role === 'buyer' ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-bold mt-1">{(user.activity as BuyerActivity).ordersCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-xl font-bold mt-1">{formatCurrency((user.activity as BuyerActivity).totalSpent)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-xl font-bold mt-1">{(user.activity as SellerActivity).productsCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-xl font-bold mt-1">{(user.activity as SellerActivity).salesCount}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {user.role === 'buyer' ? 'Order History' : 'Sales Activity'}
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'billing'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Billing Information
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User Avatar */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="h-40 w-40 relative mb-4">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-gray-500">{user.company}</p>
                  <div className="mt-4 flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Message
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        onClick={() => handleStatusUpdate('inactive')} 
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate('active')} 
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company</p>
                      <p className="mt-1">{user.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} {user.address.postalCode}</p>
                    <p>{user.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-6">
            {user.role === 'buyer' ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold mt-1">{(user.activity as BuyerActivity).ordersCount}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency((user.activity as BuyerActivity).totalSpent)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency((user.activity as BuyerActivity).averageOrderValue)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                    <Link 
                      href={`/admin/users/${user.id}/orders`}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      View All Orders
                    </Link>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(user.activity as BuyerActivity).recentOrders?.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.amount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/admin/orders/${order.id}`} className="text-primary hover:text-primary-dark">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold mt-1">{(user.activity as SellerActivity).productsCount}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold mt-1">{(user.activity as SellerActivity).salesCount}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency((user.activity as SellerActivity).totalRevenue)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
                    <Link 
                      href={`/admin/sellers/${user.id}/products`}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      View All Products
                    </Link>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(user.activity as SellerActivity).topProducts?.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales} units</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/admin/products/${product.id}`} className="text-primary hover:text-primary-dark">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">GSTIN</p>
                  <p className="mt-1">{user.billingInfo.gstin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PAN Number</p>
                  <p className="mt-1">{user.billingInfo.panNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bank Name</p>
                  <p className="mt-1">{user.billingInfo.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Number</p>
                  <p className="mt-1">{user.billingInfo.accountNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <p>{user.address.street}</p>
                <p>{user.address.city}, {user.address.state} {user.address.postalCode}</p>
                <p>{user.address.country}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Update Billing Information
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Download Invoice History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
