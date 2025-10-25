'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find portal container after mount
  useEffect(() => {
    setPortalContainer(document.getElementById('dropdown-portal'));
  }, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the button and the dropdown
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    
    // Handle escape key to close dropdown
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    
    // Only add listeners when dropdown is open
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isUserMenuOpen]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isUserMenuOpen) {
        // Close dropdown on resize to prevent positioning issues
        setIsUserMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 shadow-xl sticky top-0 z-[100] backdrop-blur-md border-b border-green-200/40 font-['Poppins',sans-serif]">
      {/* Fixed position portal container for dropdown menus */}
      <div id="dropdown-portal" className="fixed inset-0 pointer-events-none z-[99999]"></div>
      
      {/* Advanced background graphics with enhanced elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced gradient mesh background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-green-100/90 to-green-50/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-200/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/5 via-transparent to-transparent"></div>
        
        {/* Subtle pattern overlay with fallback color */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#f0fff4] bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
      </div>
      
      <div className="container-custom mx-auto relative overflow-hidden">
        <div className="flex items-center justify-between py-.10 px-1 md:px-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group relative overflow-hidden">
              <div className="relative p-1.5">
                <Image 
                  src="/logo.png" 
                  alt="Azlok Enterprises" 
                  width={110} 
                  height={38} 
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full max-w-xl mx-auto group">
              <div className="relative">
                {/* Search icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Input field */}
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full py-2.5 pl-10 pr-12 border border-green-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white/80 backdrop-blur-sm shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link href="/products" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-2 py-1 overflow-hidden">
              <span className="font-medium tracking-wide relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Products
              </span>
            </Link>
            <Link href="/categories" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-2 py-1 overflow-hidden">
              <span className="font-medium tracking-wide relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Categories
              </span>
            </Link>
            <Link href="/track" className="text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-200 relative group px-2 py-1 overflow-hidden">
              <span className="font-medium tracking-wide relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Track Order
              </span>
            </Link>
            
            {/* Account dropdown */}
            <div className="relative z-[100]" ref={userMenuRef}>
              <button 
                ref={userButtonRef}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className={`flex items-center text-green-800 hover:text-green-600 font-medium tracking-wide transition-all duration-300 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/80 relative group border ${isUserMenuOpen ? 'border-green-300 bg-green-50' : 'border-transparent'} hover:border-green-200/50 shadow-sm hover:shadow-md`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
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
              
              {/* Portal for dropdown menu */}
              {isUserMenuOpen && portalContainer && createPortal(
                <div 
                  ref={dropdownRef}
                  className="fixed w-64 bg-white rounded-lg shadow-2xl py-2 border border-green-200/50 transition-opacity duration-200 ease-in-out max-h-[80vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
                  style={{
                    animation: 'fadeIn 0.2s ease-out',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    top: userButtonRef.current ? userButtonRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 0,
                    left: userButtonRef.current ? userButtonRef.current.getBoundingClientRect().left : 0,
                    zIndex: 99999,
                  }}
                >
                  {/* Dropdown arrow */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-green-200/50 transform rotate-45 shadow-[-3px_-3px_5px_rgba(0,0,0,0.02)]"></div>
                  
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
                </div>,
                portalContainer
              )}
            </div>
            
            {/* Cart icon */}
            <Link href="/cart" className="relative group">
              <div className="relative bg-white/10 p-2 rounded-full overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:shadow-green-200/50">
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
          <div className="md:hidden flex items-center relative z-[9999]">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none group overflow-hidden border border-green-200/50"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              style={{ zIndex: 9999 }}
            >
              <div className="relative z-10 flex flex-col justify-center items-center space-y-1 transform group-hover:scale-110 transition-transform duration-300 w-6 h-4">
                <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-full transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''} shadow-sm`}></span>
                <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 translate-x-3' : 'opacity-100'} shadow-sm`}></span>
                <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-full transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''} shadow-sm`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Drawer style */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} /* Fallback solid background */
      >
        <div 
          className={`absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: '#ffffff' }} /* Solid white background */
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Azlok Enterprises" 
                width={80} 
                height={30} 
                className="object-contain"
              />
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="p-4 space-y-2 bg-white" style={{ backgroundColor: '#ffffff' }}>
            <Link 
              href="/products" 
              className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-medium">Products</span>
            </Link>
            
            <Link 
              href="/categories" 
              className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-medium">Categories</span>
            </Link>
            
            <Link 
              href="/track" 
              className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">Track Order</span>
            </Link>
            
            <Link 
              href="/cart" 
              className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Cart {itemCount > 0 && <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">{itemCount}</span>}</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Profile</span>
                </Link>
                
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-left transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium text-red-600">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Login</span>
                </Link>
                
                <Link 
                  href="/register" 
                  className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-medium">Register</span>
                </Link>
              </>
            )}
          </nav>
          
          {/* Contact Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-green-50 border-t border-green-100" style={{ backgroundColor: '#f0fdf4' }}>
            <div className="flex items-center text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium">8800412138</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Info Bar with advanced graphics */}
      <div className="bg-gradient-to-r from-green-700 via-green-800 to-green-700 text-white py-0.5 px-2 shadow-inner relative overflow-hidden z-[90]">
        <div className="container-custom mx-auto flex flex-col md:flex-row justify-between items-center text-base relative py-0">
          {/* Call us section */}
          <div className="flex items-center justify-center w-full md:w-auto mb-0 md:mb-0 relative z-10 group">
            <div className="flex flex-col space-y-0">
              <span className="text-white/70 text-[12px] font-medium tracking-wider transition-colors duration-300">Call us:</span>
              <a href="tel:8800412138" className="text-white font-semibold tracking-widest text-xs group-hover:text-white/90 transition-colors duration-300 hover:underline decoration-white/30 underline-offset-2">8800412138</a>
            </div>
          </div>
          
          {/* Company tagline */}
          <div className="flex items-center justify-center w-full md:w-auto relative z-10">
            <div className="relative overflow-hidden inline-block text-center">
              <span className="text-white/90 font-medium tracking-[0.15em] drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white animate-shimmer bg-[length:200%_100%] uppercase text-xs md:text-sm">AZLOK - PREMIUM B2C SHOPPING EXPERIENCE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
