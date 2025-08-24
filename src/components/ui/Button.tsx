'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  light: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  dark: 'bg-gray-800 hover:bg-gray-900 text-white',
  link: 'bg-transparent text-blue-600 hover:underline',
  outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50'
};

const sizeClasses = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg'
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}: ButtonProps) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
