'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check if user is authenticated and has seller role
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) {
      router.push('/login?redirect=/seller');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'seller') {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-md transition-all duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link href="/seller" className={`${!isSidebarOpen && 'hidden'}`}>
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-gray-800">Seller Hub</span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-5 px-2">
          <Link
            href="/seller"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/seller/products"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            {isSidebarOpen && <span>Products</span>}
          </Link>

          <Link
            href="/seller/orders"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {isSidebarOpen && <span>Orders</span>}
          </Link>

          <Link
            href="/seller/inventory"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {isSidebarOpen && <span>Inventory</span>}
          </Link>

          <Link
            href="/seller/analytics"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {isSidebarOpen && <span>Analytics</span>}
          </Link>

          <Link
            href="/seller/settings"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isSidebarOpen && <span>Settings</span>}
          </Link>
        </nav>

        <div className="mt-auto p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 relative">
              <Image
                src={user.avatar || '/globe.svg'}
                alt={user.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Seller Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Go to storefront</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
