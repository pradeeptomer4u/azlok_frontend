'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    // Handle escape key to close dropdown
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  // Get button position for dropdown placement
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  
  useEffect(() => {
    if (isUserMenuOpen && userMenuRef.current) {
      const buttonRect = userMenuRef.current.getBoundingClientRect();
      setButtonPosition({
        top: buttonRect.bottom + window.scrollY,
        right: window.innerWidth - buttonRect.right
      });
    }
  }, [isUserMenuOpen]);

  return (
    <header className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-green-200/30 relative font-[Poppins,sans-serif]">
      {/* Advanced background graphics with enhanced elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-green-100/90 to-green-50/80"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-green-300/30 to-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-green-400/20 to-blue-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-300/10 to-yellow-200/10 rounded-full blur-3xl animate-float2"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-gradient-to-l from-green-200/20 to-green-400/10 rounded-full blur-2xl animate-float3"></div>
        
        {/* Light rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform opacity-30 animate-slowPan"></div>
        
        {/* Enhanced animated particles */}
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-green-500/40 rounded-full animate-float1 shadow-lg shadow-green-500/20"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-green-600/30 rounded-full animate-float2 shadow-lg shadow-green-600/20"></div>
        <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-float3 shadow-lg shadow-green-400/20"></div>
        <div className="absolute top-2/3 left-1/5 w-2.5 h-2.5 bg-green-300/30 rounded-full animate-float4 shadow-lg shadow-green-300/20"></div>
        <div className="absolute top-1/5 right-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-float2 shadow-lg shadow-blue-300/20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-yellow-300/30 rounded-full animate-float3 shadow-lg shadow-yellow-300/20"></div>
        
        {/* Advanced decorative geometric shapes */}
        <div className="absolute top-0 left-1/4 w-20 h-20 border border-green-200/30 rounded-lg rotate-45 transform opacity-30 animate-spin-slow"></div>
        <div className="absolute bottom-0 right-1/3 w-16 h-16 border border-green-300/30 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-green-400/20 rounded-md rotate-12 transform opacity-20 animate-float1"></div>
        <div className="absolute top-1/4 right-1/2 w-24 h-8 border-t border-l border-green-300/20 opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/3 w-8 h-24 border-r border-b border-green-300/20 opacity-30"></div>
      </div>
      
      <div className="container-custom mx-auto relative overflow-hidden">
        <div className="flex items-center justify-between py-2">
          {/* Logo with enhanced styling */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-200/0 via-green-300/20 to-green-200/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl group-hover:duration-500"></div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/30 to-yellow-300/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>
                <Image 
                  src="/logo.png" 
                  alt="Azlok Enterprises" 
                  width={120} 
                  height={40} 
                  className="object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop with enhanced styling */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full max-w-xl mx-auto group">
              {/* Enhanced gradient glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
              
              {/* Subtle animated particles */}
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-green-500/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float1 transition-opacity duration-500"></div>
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-green-400/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float2 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Search icon with enhanced styling */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-100/0 group-hover:bg-green-100/30 rounded-full transition-colors duration-300 -z-10"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Enhanced input field */}
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full py-2.5 pl-10 pr-12 border border-green-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white/80 backdrop-blur-sm shadow-inner transition-all duration-300 group-hover:border-green-400 placeholder:text-gray-400/70 placeholder:font-light placeholder:tracking-wide relative z-10 font-light tracking-wide"
                />
                
                {/* Filter button with enhanced styling */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-6 w-px bg-gradient-to-b from-gray-300/30 via-gray-300/50 to-gray-300/30 mr-2"></div>
                  <button className="text-gray-500 hover:text-green-600 transition-all duration-300 hover:scale-110 p-1.5 rounded-full hover:bg-green-50/80 group/filter relative">
                    <div className="absolute inset-0 bg-green-100/0 group-hover/filter:bg-green-100/30 rounded-full transition-colors duration-300 -z-10"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-3 py-1.5 overflow-hidden">
              {/* Enhanced background effect */}
              <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 group-hover:h-full transition-all duration-300 -z-10 rounded-md"></span>
              
              {/* Animated underline with glow */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 via-green-600 to-green-400 group-hover:w-full transition-all duration-500 ease-out shadow-sm shadow-green-400/50"></span>
              
              {/* Text with icon */}
              <span className="relative z-10 flex items-center">
                <span className="absolute -inset-1 rounded-full bg-green-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300 relative z-10 group-hover:animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-medium tracking-wide relative z-10">Products</span>
              </span>
            </Link>
            <Link href="/categories" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-3 py-1.5 overflow-hidden">
              {/* Enhanced background effect */}
              <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 group-hover:h-full transition-all duration-300 -z-10 rounded-md"></span>
              
              {/* Animated underline with glow */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 via-green-600 to-green-400 group-hover:w-full transition-all duration-500 ease-out shadow-sm shadow-green-400/50"></span>
              
              {/* Text with icon */}
              <span className="relative z-10 flex items-center">
                <span className="absolute -inset-1 rounded-full bg-green-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300 relative z-10 group-hover:animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium tracking-wide relative z-10">Categories</span>
              </span>
            </Link>
            <Link href="/track" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-3 py-1.5 overflow-hidden">
              {/* Enhanced background effect */}
              <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 group-hover:h-full transition-all duration-300 -z-10 rounded-md"></span>
              
              {/* Animated underline with glow */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 via-green-600 to-green-400 group-hover:w-full transition-all duration-500 ease-out shadow-sm shadow-green-400/50"></span>
              
              {/* Text with icon */}
              <span className="relative z-10 flex items-center">
                <span className="absolute -inset-1 rounded-full bg-green-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300 relative z-10 group-hover:animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium tracking-wide relative z-10">Track Order</span>
              </span>
            </Link>
            <div className="relative z-[100] static md:relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/80 relative group border border-transparent hover:border-green-200/50 shadow-sm hover:shadow-md"
              >
                {/* Button glow effect */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></span>
                {isAuthenticated ? (
                  <>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-green-200 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:border-green-300 bg-gradient-to-br from-green-100 to-green-200">
                      <Image 
                        src={user?.avatar || '/globe.svg'} 
                        alt={user?.name || 'User'} 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-medium tracking-wide">{user?.name || 'User'}</span>
                  </>
                ) : (
                  <div className="flex items-center">
                    <div className="p-1.5 bg-gradient-to-br from-green-400/80 to-green-500/80 rounded-full text-white shadow-sm mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>Account</span>
                  </div>
                )}
                <div className="ml-1.5 transition-transform duration-300 transform group-hover:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {isUserMenuOpen && (
                <div 
                  className="fixed w-64 bg-white rounded-lg shadow-2xl py-2 z-[9999] border border-green-200/50 animate-fadeIn transform origin-top-right transition-all duration-200 scale-100 max-h-[80vh] overflow-y-auto"
                  style={{
                    top: `${buttonPosition.top + 5}px`,
                    right: `${buttonPosition.right}px`,
                  }}
                >
                  {/* Dropdown arrow */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-green-200/50 transform rotate-45"></div>
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      {user?.role === 'seller' && (
                        <>
                          <Link href="/seller/products" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            My Products
                          </Link>
                          <Link href="/logistics" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Logistics
                          </Link>
                          <Link href="/payments" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Payments
                          </Link>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <>
                          <Link href="/logistics" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Logistics Management
                          </Link>
                          <Link href="/payments" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Payment Management
                          </Link>
                        </>
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                      </Link>
                      <Link href="/register" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150" onClick={() => setIsUserMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/cart" className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/0 via-green-500/20 to-green-400/0 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 group-hover:duration-300"></div>
              <div className="relative bg-white/10 p-2 rounded-full overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:shadow-green-200/50">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800 group-hover:text-green-600 relative z-10 transition-all duration-300 transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium animate-pulse shadow-md shadow-green-300/50 border border-white/80 transform transition-all duration-300 group-hover:scale-110 z-20">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-10 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white/80 backdrop-blur-sm shadow-inner"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-50 to-green-100 border-t border-green-200 z-[90] relative">
          <div className="container-custom mx-auto py-3">
            <nav className="flex flex-col space-y-3 max-h-[70vh] overflow-y-auto">
              <Link href="/products" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link href="/categories" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/track" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                Track Order
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'seller') && (
                    <>
                      <Link href="/logistics" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                        Logistics
                      </Link>
                      <Link href="/payments" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                        Payments
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="text-red-600 hover:text-red-800 py-2 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
              <Link href="/cart" className="text-green-800 hover:text-green-600 font-medium transition-all duration-200 py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                Cart
                {itemCount > 0 && (
                  <span className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Contact Info Bar with enhanced graphics */}
      <div className="bg-gradient-to-r from-green-700 via-green-800 to-green-700 text-white py-2 px-4 shadow-inner relative overflow-hidden">
        {/* Advanced background effects */}
        <div className="absolute inset-0 bg-[url('/images/leaf-pattern.png')] opacity-10 bg-repeat animate-slowPan"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>
        
        {/* Light streaks */}
        <div className="absolute -inset-full h-[500%] w-[500%] rotate-[-35deg] animate-[spin_20s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl"></div>
        
        {/* Animated particles */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float1"></div>
          <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full animate-float2"></div>
          <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float3"></div>
          <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-white/20 rounded-full animate-float4"></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-float1"></div>
          <div className="absolute top-1/5 left-2/3 w-1 h-1 bg-white/30 rounded-full animate-float3"></div>
        </div>
        
        {/* Geometric decorations */}
        <div className="absolute top-0 right-1/4 w-12 h-12 border border-white/10 rounded-full opacity-20 rotate-45 transform"></div>
        <div className="absolute bottom-0 left-1/3 w-8 h-8 border border-white/10 rounded-lg opacity-20 rotate-12 transform"></div>
        
        <div className="container-custom mx-auto flex flex-col md:flex-row justify-between items-center text-base relative">
          <div className="flex items-center mb-3 md:mb-0 relative z-10 group">
            <div className="relative mr-2">
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 text-white/90 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-white/90 group-hover:text-white drop-shadow-sm font-medium tracking-wider transition-colors duration-300">Call us: <span className="font-semibold tracking-widest">8800412138</span></span>
          </div>
          <div className="flex items-center relative z-10">
            <div className="relative overflow-hidden inline-block">
              <span className="text-white/90 font-medium tracking-[0.15em] drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white animate-shimmer bg-[length:200%_100%] uppercase text-sm">Azlok - Premium B2C Shopping Experience</span>
            </div>
          </div>
        </div>
      </div>
      

    </header>
  );
};

export default Header;
