'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Azlok Enterprises" 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="p-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">DASHBOARD</p>
          <Link 
            href="/admin" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </Link>
          
          <p className="text-xs font-semibold text-gray-400 mt-6 mb-2">CATALOG</p>
          <Link 
            href="/admin/products" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categories
          </Link>
          
          <p className="text-xs font-semibold text-gray-400 mt-6 mb-2">USERS</p>
          <Link 
            href="/admin/users" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            All Users
          </Link>
          <Link 
            href="/admin/sellers" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Sellers
          </Link>
          
          <p className="text-xs font-semibold text-gray-400 mt-6 mb-2">ORDERS</p>
          <Link 
            href="/admin/orders" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            All Orders
          </Link>
          
          <p className="text-xs font-semibold text-gray-400 mt-6 mb-2">SETTINGS</p>
          <Link 
            href="/admin/settings" 
            className="flex items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </div>
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                  <Image 
                    src={user?.avatar || '/globe.svg'} 
                    alt={user?.name || 'Admin'} 
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
