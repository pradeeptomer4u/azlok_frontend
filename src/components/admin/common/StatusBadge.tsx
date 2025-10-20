'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  colorMap,
  className = ''
}) => {
  const defaultColorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-purple-100 text-purple-800',
    paid: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    // Add more status-color mappings as needed
    default: 'bg-gray-100 text-gray-800'
  };

  const getStatusColor = (status: string): string => {
    const map = colorMap || defaultColorMap;
    return map[status.toLowerCase()] || map.default;
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)} ${className}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
