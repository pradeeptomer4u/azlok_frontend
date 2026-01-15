'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { checkUsernameAvailability } from '../../services/authService';
import { debounce } from 'lodash';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
  });
  const [passwordError, setPasswordError] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const { register, isLoading, error } = useAuth();

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setUsernameChecking(true);
      try {
        const result = await checkUsernameAvailability(username);
        setUsernameAvailable(result.available);
        if (!result.available) {
          setUsernameError('Username is already taken');
        } else {
          setUsernameError('');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setUsernameChecking(false);
      }
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }

    // Check username availability
    if (name === 'username') {
      setUsernameAvailable(null);
      checkUsername(value);
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

    // Validate username
    if (!formData.username) {
      setUsernameError('Username is required');
      return;
    }

    if (formData.username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return;
    }

    // Check if username is available
    if (usernameAvailable === false) {
      setUsernameError('Username is already taken');
      return;
    }
    
    await register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    });
  };

  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-orange-200/5 rounded-full blur-3xl animate-float2"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"></div>
      </div>
      
      <div className="container-custom mx-auto relative z-10 py-8">
        <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50">
          <div className="px-6 py-8 relative group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Create an Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Full Name
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="relative w-full border border-green-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Username
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`relative w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light ${usernameError ? 'border-red-300' : 'border-green-200'}`}
                    placeholder="johndoe"
                    required
                  />
                  {usernameChecking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  {!usernameChecking && usernameAvailable !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {usernameAvailable ? (
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="mt-1 text-sm text-red-600 font-['Montserrat',sans-serif]">{usernameError}</p>
                )}
                {!usernameError && usernameAvailable && (
                  <p className="mt-1 text-sm text-green-600 font-['Montserrat',sans-serif]">Username is available</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="relative w-full border border-green-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Phone Number
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="relative w-full border border-green-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Password
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`relative w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light ${
                      passwordError ? 'border-red-300' : 'border-green-200'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-['Montserrat',sans-serif]">
                  Confirm Password
                </label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`relative w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light ${
                      passwordError ? 'border-red-300' : 'border-green-200'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600 font-['Montserrat',sans-serif]">{passwordError}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center group/checkbox">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/checkbox:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded relative"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-['Montserrat',sans-serif]">
                  I agree to the{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 font-['Montserrat',sans-serif] font-medium relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
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
            <p className="text-sm text-gray-600 font-['Montserrat',sans-serif]">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium relative group/link">
                <span className="relative z-10">Sign in</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 group-hover/link:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
