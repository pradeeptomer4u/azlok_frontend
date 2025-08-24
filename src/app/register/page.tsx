'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'buyer' as 'buyer' | 'seller',
  });
  const [passwordError, setPasswordError] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      company: formData.company,
    });
  };

  return (
    <div className="container-custom mx-auto py-12">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-md p-4 cursor-pointer ${
                    formData.role === 'buyer' 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="buyer"
                      name="role"
                      value="buyer"
                      checked={formData.role === 'buyer'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="buyer" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                      Buyer
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">I want to purchase products</p>
                </div>
                
                <div 
                  className={`border rounded-md p-4 cursor-pointer ${
                    formData.role === 'seller' 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'seller' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="seller"
                      name="role"
                      value="seller"
                      checked={formData.role === 'seller'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="seller" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                      Seller
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">I want to sell products</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your Company Ltd."
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    passwordError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    passwordError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
