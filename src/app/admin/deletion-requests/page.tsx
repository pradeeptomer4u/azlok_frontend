'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import MetaTags from '../../../components/SEO/MetaTags';

export const runtime = "edge";

interface DeletionRequest {
  id: string;
  userId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedById?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  processedBy?: {
    id: string;
    email: string;
    name: string;
  };
}

export default function AdminDeletionRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch deletion requests
  useEffect(() => {
    const fetchDeletionRequests = async () => {
      if (!user || user.role !== 'admin') {
        router.push('/login?redirect=/admin/deletion-requests');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/users/delete-request');
        
        if (!response.ok) {
          throw new Error('Failed to fetch deletion requests');
        }

        const data = await response.json();
        setDeletionRequests(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching deletion requests');
      } finally {
        setLoading(false);
      }
    };

    fetchDeletionRequests();
  }, [user, router]);

  // Handle request approval
  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`/api/users/delete-request/${requestId}/approve`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to approve deletion request');
      }

      // Update the local state
      setDeletionRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'APPROVED' as const, 
                processedAt: new Date().toISOString(),
                processedBy: { 
                  id: String(user?.id || ''), 
                  email: user?.email || '', 
                  name: user?.name || '' 
                }
              } 
            : req
        )
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred while approving the request');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle request rejection
  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`/api/users/delete-request/${requestId}/reject`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to reject deletion request');
      }

      // Update the local state
      setDeletionRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'REJECTED' as const, 
                processedAt: new Date().toISOString(),
                processedBy: { 
                  id: String(user?.id || ''), 
                  email: user?.email || '', 
                  name: user?.name || '' 
                }
              } 
            : req
        )
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred while rejecting the request');
    } finally {
      setProcessingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Account Deletion Requests - Admin - Azlok"
        description="Manage account deletion requests from users."
        keywords="admin, account deletion, GDPR, data protection"
        ogType="website"
        ogUrl="/admin/deletion-requests"
        ogImage="/logo.png"
        canonicalUrl="/admin/deletion-requests"
      />

      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Account Deletion Requests</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : deletionRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 text-lg">No account deletion requests found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deletionRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.user.name}</div>
                        <div className="text-sm text-gray-500">{request.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs break-words">{request.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(request.requestedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {request.status}
                        </span>
                        {request.processedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(request.processedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'PENDING' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={!!processingId}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {processingId === request.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              disabled={!!processingId}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {processingId === request.id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            {request.processedBy ? `By ${request.processedBy.name}` : 'Processed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
