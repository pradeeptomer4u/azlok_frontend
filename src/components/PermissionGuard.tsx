'use client';

import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionModule, PermissionAction, hasPermission } from '../types/permissions';
import Link from 'next/link';

interface PermissionGuardProps {
  children: ReactNode;
  module: PermissionModule;
  action: PermissionAction;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export default function PermissionGuard({
  children,
  module,
  action,
  fallback,
  showMessage = true,
}: PermissionGuardProps) {
  const { permissions, user } = useAuth();

  // Check if user has the required permission
  const hasAccess = hasPermission(permissions, module, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showMessage) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-yellow-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">
            You don't have permission to {action} {module}. Please contact your administrator.
          </p>
          <Link
            href="/admin"
            className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermission(module: PermissionModule, action: PermissionAction): boolean {
  const { permissions } = useAuth();
  return hasPermission(permissions, module, action);
}

// Hook for checking module access
export function useModuleAccess(module: PermissionModule): boolean {
  const { permissions } = useAuth();
  
  if (!permissions) return false;
  
  // Super admin has all permissions
  if (permissions.is_super_admin) return true;
  
  return permissions.permissions.some((p) => p.module === module);
}
