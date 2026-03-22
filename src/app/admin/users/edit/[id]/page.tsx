'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserById, updateUser, User } from '../../../../../services/userService';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'buyer' as User['role'],
    status: 'active' as User['status'],
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    gstin: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(userId);
        if (!userData) throw new Error('User not found');

        setForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || '',
          role: userData.role || 'buyer',
          status: userData.status || 'active',
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          postalCode: userData.address?.postalCode || '',
          country: userData.address?.country || '',
          gstin: userData.billingInfo?.gstin || '',
          panNumber: userData.billingInfo?.panNumber || '',
          bankName: userData.billingInfo?.bankName || '',
          accountNumber: userData.billingInfo?.accountNumber || '',
        });
      } catch (err) {
        setError('Failed to load user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Partial<User> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        role: form.role,
        status: form.status,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        billingInfo: {
          gstin: form.gstin,
          panNumber: form.panNumber,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
        },
      };

      const updated = await updateUser(userId, payload);
      if (!updated) throw new Error('Update failed');

      setSuccess('User updated successfully!');
      setTimeout(() => router.push(`/admin/users/${userId}`), 1500);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/users/${userId}`} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
            <p className="text-sm text-gray-500">ID: {userId}</p>
          </div>
        </div>
        <Link
          href={`/admin/users/${userId}/permissions`}
          className="text-sm text-blue-600 hover:underline"
        >
          Manage Permissions →
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Billing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input
                type="text"
                value={form.panNumber}
                onChange={(e) => handleChange('panNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link
            href={`/admin/users/${userId}`}
            className="px-6 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}