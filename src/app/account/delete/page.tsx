'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import MetaTags from '../../../components/SEO/MetaTags';

export const runtime = "edge";

export default function AccountDeletionPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/account/delete');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for account deletion.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password to confirm deletion request.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/users/delete-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit account deletion request');
      }

      setSuccess(true);
      
      // Log the user out after 5 seconds
      setTimeout(() => {
        logout();
        router.push('/');
      }, 5000);
      
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting your request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Delete Account - Azlok"
        description="Request deletion of your Azlok account and associated personal data."
        keywords="account deletion, delete account, privacy, GDPR, data protection"
        ogType="website"
        ogUrl="/account/delete"
        ogImage="/logo.png"
        canonicalUrl="/account/delete"
      />

      <div className="container-custom mx-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Delete Your Account</h1>
          
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-700 mb-3">Request Submitted Successfully</h2>
              <p className="text-gray-700 mb-4">
                Your account deletion request has been submitted. Our team will process your request within 30 days.
                You will receive a confirmation email once the process is complete.
              </p>
              <p className="text-gray-700 mb-4">
                You will be logged out and redirected to the homepage in a few seconds.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-red-700 mb-3">Warning: This Action Cannot Be Undone</h2>
                <p className="text-gray-700 mb-4">
                  Requesting account deletion will permanently remove your account and all associated data from our system.
                  This action cannot be undone.
                </p>
                <p className="text-gray-700">
                  If you&apos;re experiencing issues with our service, please consider <a href="/contact" className="text-blue-600 hover:underline">contacting our support team</a> before proceeding with account deletion.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Deletion Request</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                      Please tell us why you&apos;re leaving:
                    </label>
                    <textarea
                      id="reason"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                      Enter your password to confirm:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Delete My Account'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">What Happens Next?</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Your deletion request will be reviewed by our team</li>
              <li className="mb-2">We will process your request within 30 days</li>
              <li className="mb-2">You will receive a confirmation email once the process is complete</li>
              <li className="mb-2">Your personal data will be anonymized or deleted as per our privacy policy</li>
              <li className="mb-2">Some information may be retained as required by law or for legitimate business purposes</li>
            </ul>
            <p className="text-gray-700">
              If you have any questions about the account deletion process, please contact our privacy team at privacy@azlok.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
