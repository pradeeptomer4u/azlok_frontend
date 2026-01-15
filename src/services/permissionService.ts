'use client';

import { Permission, UserPermissions, PermissionModule, PermissionAction } from '../types/permissions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('azlok-token');
  }
  return null;
};

// Get headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const permissionService = {
  // Get user permissions
  getUserPermissions: async (userId: number): Promise<UserPermissions | null> => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/users/${userId}/permissions`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }

      const data = await response.json();
      
      // Backend returns flat array of permission strings: ['view_blogs', 'manage_blogs']
      // Frontend expects: [{ module: "blogs", actions: ["manage", "view"] }]
      
      if (Array.isArray(data)) {
        const permissionMap = new Map<string, Set<string>>();
        
        data.forEach((permString: any) => {
          if (typeof permString === 'string') {
            // Split "manage_blogs" into ["manage", "blogs"]
            const parts = permString.split('_');
            if (parts.length >= 2) {
              const action = parts[0];
              const module = parts.slice(1).join('_'); // Handle modules with underscores
              
              if (!permissionMap.has(module)) {
                permissionMap.set(module, new Set());
              }
              permissionMap.get(module)?.add(action);
            }
          }
        });
        
        const transformedPermissions: Permission[] = Array.from(permissionMap.entries()).map(
          ([module, actions]) => ({
            module: module as PermissionModule,
            actions: Array.from(actions) as PermissionAction[],
          })
        );
        
        return {
          user_id: data[0]?.user_id || userId,
          is_super_admin: data[0]?.is_super_admin || false,
          permissions: transformedPermissions,
        };
      }
      
      return {
        user_id: userId,
        is_super_admin: false,
        permissions: [],
      };
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return null;
    }
  },

  // Get current user's permissions
  getMyPermissions: async (): Promise<UserPermissions | null> => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/my-permissions`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current user permissions');
      }

      const data = await response.json();
      
      // Backend returns flat array of permission strings: ['view_blogs', 'manage_blogs']
      if (Array.isArray(data)) {
        const permissionMap = new Map<string, Set<string>>();
        
        data.forEach((permString: any) => {
          if (typeof permString === 'string') {
            const parts = permString.split('_');
            if (parts.length >= 2) {
              const action = parts[0];
              const module = parts.slice(1).join('_');
              
              if (!permissionMap.has(module)) {
                permissionMap.set(module, new Set());
              }
              permissionMap.get(module)?.add(action);
            }
          }
        });
        
        const transformedPermissions: Permission[] = Array.from(permissionMap.entries()).map(
          ([module, actions]) => ({
            module: module as PermissionModule,
            actions: Array.from(actions) as PermissionAction[],
          })
        );
        
        return {
          user_id: data[0]?.user_id,
          is_super_admin: data[0]?.is_super_admin || false,
          permissions: transformedPermissions,
        };
      }
      
      return {
        user_id: 0,
        is_super_admin: false,
        permissions: [],
      };
    } catch (error) {
      console.error('Error fetching current user permissions:', error);
      return null;
    }
  },

  // Get all available permissions
  getAllPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/all-permissions`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all permissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all permissions:', error);
      return [];
    }
  },

  // Grant single permission to user
  grantPermission: async (
    userId: number,
    module: PermissionModule,
    action: PermissionAction
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/users/${userId}/permissions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ module, action }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error granting permission:', error);
      return false;
    }
  },

  // Update all permissions for user (bulk update)
  updatePermissionsBulk: async (
    userId: number,
    permissions: Permission[]
  ): Promise<boolean> => {
    try {
      // Transform permissions to flat string format expected by backend
      // Backend expects: ["manage_blogs", "view_orders", etc.]
      const flatPermissions: string[] = [];
      
      permissions.forEach(perm => {
        perm.actions.forEach(action => {
          // Convert "blogs" + "manage" to "manage_blogs"
          flatPermissions.push(`${action}_${perm.module}`);
        });
      });

      const response = await fetch(`${API_URL}/api/permissions/users/${userId}/permissions/bulk`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          user_id: userId,
          permissions: flatPermissions 
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating permissions:', error);
      return false;
    }
  },

  // Revoke permission from user
  revokePermission: async (
    userId: number,
    module: PermissionModule,
    action: PermissionAction
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/api/permissions/users/${userId}/permissions/${module}:${action}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error revoking permission:', error);
      return false;
    }
  },

  // Check if current user has specific permission
  checkPermission: async (
    module: PermissionModule,
    action: PermissionAction
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/check-permission`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ module, action }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.has_permission || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },
};

export default permissionService;
