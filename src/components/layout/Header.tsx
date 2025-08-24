'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Azlok Enterprises" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary">
              Categories
            </Link>
            <Link href="/deals" className="text-gray-700 hover:text-primary">
              Deals
            </Link>
            <Link href="/track" className="text-gray-700 hover:text-primary">
              Track Order
            </Link>
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-gray-700 hover:text-primary"
              >
                {isAuthenticated ? (
                  <>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                      <Image 
                        src={user?.avatar || '/globe.svg'} 
                        alt={user?.name || 'User'} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{user?.name}</span>
                  </>
                ) : (
                  <span>Account</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      {user?.role === 'seller' && (
                        <>
                          <Link href="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            My Products
                          </Link>
                          <Link href="/logistics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Logistics
                          </Link>
                          <Link href="/payments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Payments
                          </Link>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <>
                          <Link href="/logistics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Logistics Management
                          </Link>
                          <Link href="/payments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Login
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/cart" className="relative text-gray-700 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
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
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom mx-auto py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/products" className="text-gray-700 hover:text-primary py-2">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary py-2">
                Categories
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-primary py-2">
                Deals
              </Link>
              <Link href="/track" className="text-gray-700 hover:text-primary py-2">
                Track Order
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary py-2">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-primary py-2">
                    Profile
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'seller') && (
                    <>
                      <Link href="/logistics" className="text-gray-700 hover:text-primary py-2">
                        Logistics
                      </Link>
                      <Link href="/payments" className="text-gray-700 hover:text-primary py-2">
                        Payments
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 py-2 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary py-2">
                    Login
                  </Link>
                  <Link href="/register" className="text-gray-700 hover:text-primary py-2">
                    Register
                  </Link>
                </>
              )}
              <Link href="/cart" className="text-gray-700 hover:text-primary py-2 flex items-center">
                Cart
                {itemCount > 0 && (
                  <span className="ml-2 bg-secondary text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Contact Info Bar */}
      <div className="bg-primary bg-opacity-10 text-primary py-2 px-4">
        <div className="container-custom mx-auto flex flex-col md:flex-row justify-between items-center text-base">
          <div className="flex items-center mb-3 md:mb-0 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-800">Call us: 8800412138</span>
          </div>
          <div className="flex items-center font-medium">
            <span className="text-gray-800">Azlok - Premium B2C Shopping Experience</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
