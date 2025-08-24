'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  pill?: boolean;
  className?: string;
}

const colorClasses = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-600 text-white',
  success: 'bg-green-600 text-white',
  danger: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-cyan-500 text-white',
  light: 'bg-gray-100 text-gray-800',
  dark: 'bg-gray-800 text-white'
};

const Badge = ({ 
  children, 
  color = 'primary', 
  pill = false,
  className = ''
}: BadgeProps) => {
  return (
    <span 
      className={`
        inline-block px-2 py-1 text-xs font-medium 
        ${colorClasses[color]} 
        ${pill ? 'rounded-full' : 'rounded'} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
