'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/account' },
    { name: 'Orders', href: '/account/orders' },
    { name: 'Invoices', href: '/account/invoices' },
    { name: 'Profile', href: '/account/profile' },
    { name: 'Addresses', href: '/account/addresses' },
    { name: 'Wishlist', href: '/account/wishlist' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">My Account</h2>
            </div>
            <nav className="px-4 py-2">
              <ul>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (pathname && pathname.startsWith(`${item.href}/`));
                  return (
                    <li key={item.name} className="py-1">
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;
