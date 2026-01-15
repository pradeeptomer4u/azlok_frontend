'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: '',
      }));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="container-custom mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    try {
      // Validate password fields if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setIsSaving(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
          setIsSaving(false);
          return;
        }
        if (!formData.currentPassword) {
          setMessage({ type: 'error', text: 'Current password is required to change password' });
          setIsSaving(false);
          return;
        }
      }

      // TODO: Implement API call to update profile
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     full_name: formData.name,
      //     email: formData.email,
      //     phone: formData.phone,
      //     ...(formData.newPassword && {
      //       current_password: formData.currentPassword,
      //       new_password: formData.newPassword
      //     })
      //   })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-custom mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 font-['Playfair_Display',serif]">My Profile</h1>
          <p className="text-gray-600 mt-2 font-['Montserrat',sans-serif]">Manage your account information</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
            <div className="flex items-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white mr-4">
                <img 
                  src={user.avatar || '/globe.svg'} 
                  alt={user.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold font-['Playfair_Display',serif]">{user.name}</h2>
                <p className="text-green-100 font-['Montserrat',sans-serif]">{user.email}</p>
                <p className="text-sm text-green-100 capitalize font-['Montserrat',sans-serif]">{user.role} Account</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Montserrat',sans-serif]">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-['Montserrat',sans-serif]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-['Montserrat',sans-serif]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-['Montserrat',sans-serif]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Montserrat',sans-serif]">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-['Montserrat',sans-serif]"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-['Montserrat',sans-serif]"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-['Montserrat',sans-serif]"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-['Montserrat',sans-serif] font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-['Montserrat',sans-serif] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setMessage(null);
                        // Reset form to user data
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      disabled={isSaving}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors font-['Montserrat',sans-serif] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Additional Account Information */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Montserrat',sans-serif]">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-['Montserrat',sans-serif]">Account Type</span>
              <span className="font-medium text-gray-800 capitalize font-['Montserrat',sans-serif]">{user.role}</span>
            </div>
            {user.company && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-['Montserrat',sans-serif]">Company</span>
                <span className="font-medium text-gray-800 font-['Montserrat',sans-serif]">{user.company}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 font-['Montserrat',sans-serif]">Member Since</span>
              <span className="font-medium text-gray-800 font-['Montserrat',sans-serif]">
                {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
