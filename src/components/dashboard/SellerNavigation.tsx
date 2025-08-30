'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText, 
  Users, 
  HelpCircle 
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default function SellerNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/seller/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      href: '/seller/inventory',
      icon: <Package size={18} />,
      label: 'Inventory',
    },
    {
      href: '/seller/orders',
      icon: <ShoppingCart size={18} />,
      label: 'Orders',
    },
    {
      href: '/seller/analytics',
      icon: <BarChart3 size={18} />,
      label: 'Analytics',
    },
    {
      href: '/seller/products',
      icon: <FileText size={18} />,
      label: 'Products',
    },
    {
      href: '/seller/customers',
      icon: <Users size={18} />,
      label: 'Customers',
    },
    {
      href: '/seller/settings',
      icon: <Settings size={18} />,
      label: 'Settings',
    },
    {
      href: '/seller/support',
      icon: <HelpCircle size={18} />,
      label: 'Support',
    },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Seller Portal</h2>
      </div>
      
      <div className="px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );
}
