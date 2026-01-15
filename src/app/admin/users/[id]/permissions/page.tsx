'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Permission, 
  PermissionModule, 
  PermissionAction,
  PERMISSION_MODULE_LABELS,
  PERMISSION_ACTION_LABELS 
} from '../../../../../types/permissions';
import permissionService from '../../../../../services/permissionService';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

const AVAILABLE_MODULES: PermissionModule[] = [
  'blogs',
  'orders',
  'inventory',
  'tax_rates',
  'products',
  'categories',
  'users',
  'companies',
  'sellers',
];

const AVAILABLE_ACTIONS: PermissionAction[] = [
  'view',
  'manage',
];

export default function UserPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('azlok-token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user details
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user permissions
      const userPermissions = await permissionService.getUserPermissions(parseInt(userId));
      
      console.log('Fetched user permissions:', userPermissions);
      
      if (userPermissions) {
        const perms = Array.isArray(userPermissions.permissions) ? userPermissions.permissions : [];
        console.log('Setting permissions:', perms);
        setPermissions(perms);
        setIsSuperAdmin(userPermissions.is_super_admin || false);
      } else {
        console.log('No permissions returned from API');
        setPermissions([]);
        setIsSuperAdmin(false);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const hasAction = (module: PermissionModule, action: PermissionAction): boolean => {
    if (!permissions || !Array.isArray(permissions)) return false;
    const modulePermission = permissions.find(p => p.module === module);
    return modulePermission?.actions.includes(action) || false;
  };

  const toggleAction = (module: PermissionModule, action: PermissionAction) => {
    setPermissions(prev => {
      const moduleIndex = prev.findIndex(p => p.module === module);
      
      if (moduleIndex === -1) {
        // Module doesn't exist, add it with this action
        return [...prev, { module, actions: [action] }];
      }
      
      const modulePermission = prev[moduleIndex];
      const actionIndex = modulePermission.actions.indexOf(action);
      
      if (actionIndex === -1) {
        // Action doesn't exist, add it
        const newActions = [...modulePermission.actions, action];
        const newPermissions = [...prev];
        newPermissions[moduleIndex] = { module, actions: newActions };
        return newPermissions;
      } else {
        // Action exists, remove it
        const newActions = modulePermission.actions.filter(a => a !== action);
        
        if (newActions.length === 0) {
          // No actions left, remove the module
          return prev.filter((_, i) => i !== moduleIndex);
        }
        
        const newPermissions = [...prev];
        newPermissions[moduleIndex] = { module, actions: newActions };
        return newPermissions;
      }
    });
  };

  const toggleModule = (module: PermissionModule) => {
    if (!permissions || !Array.isArray(permissions)) return;
    const modulePermission = permissions.find(p => p.module === module);
    const allActionsSelected = modulePermission && 
      AVAILABLE_ACTIONS.every(action => modulePermission.actions.includes(action));

    if (allActionsSelected) {
      // Remove all actions for this module
      setPermissions(prev => prev.filter(p => p.module !== module));
    } else {
      // Add all actions for this module
      setPermissions(prev => {
        const filtered = prev.filter(p => p.module !== module);
        return [...filtered, { module, actions: [...AVAILABLE_ACTIONS] }];
      });
    }
  };

  const handleSavePermissions = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const success = await permissionService.updatePermissionsBulk(
        parseInt(userId),
        permissions
      );

      if (success) {
        setSuccessMessage('Permissions updated successfully!');
        // Reload permissions to show the saved data
        await fetchUserData();
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error('Failed to update permissions');
      }
    } catch (err: any) {
      console.error('Error saving permissions:', err);
      setError(err.message || 'Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        User not found
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-primary hover:text-primary-dark mb-4 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Manage User Permissions</h1>
        <p className="text-gray-600 mt-1">
          Configure permissions for {user.full_name || user.username} ({user.email})
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Super Admin</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                isSuperAdmin
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isSuperAdmin ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Permission Matrix</h2>
          <p className="text-sm text-gray-600">
            Grant specific permissions by module and action. "Manage" grants full access to a module.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                {AVAILABLE_ACTIONS.map(action => (
                  <th key={action} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {PERMISSION_ACTION_LABELS[action]}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  All
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {AVAILABLE_MODULES.map(module => {
                const modulePermission = permissions && Array.isArray(permissions) 
                  ? permissions.find(p => p.module === module) 
                  : null;
                const allSelected = modulePermission && 
                  AVAILABLE_ACTIONS.every(action => modulePermission.actions.includes(action));
                
                return (
                  <tr key={module} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {PERMISSION_MODULE_LABELS[module]}
                    </td>
                    {AVAILABLE_ACTIONS.map(action => (
                      <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={hasAction(module, action)}
                          onChange={() => toggleAction(module, action)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleModule(module)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          allSelected
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {allSelected ? 'Deselect' : 'Select All'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Permission Summary</h3>
          <div className="text-sm text-blue-800">
            {!permissions || !Array.isArray(permissions) || permissions.length === 0 ? (
              <p>No permissions granted</p>
            ) : (
              <div className="space-y-1">
                {permissions.map(perm => (
                  <div key={perm.module}>
                    <span className="font-medium">{PERMISSION_MODULE_LABELS[perm.module]}:</span>{' '}
                    {perm.actions.map(a => PERMISSION_ACTION_LABELS[a]).join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/admin/users"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSavePermissions}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
}
