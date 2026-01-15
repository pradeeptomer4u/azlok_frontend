// Permission types for role-based access control (RBAC)

export type PermissionModule = 
  | 'blogs'
  | 'orders'
  | 'inventory'
  | 'tax_rates'
  | 'products'
  | 'categories'
  | 'users'
  | 'companies'
  | 'sellers';

export type PermissionAction = 'view' | 'manage';

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface UserPermissions {
  user_id: number;
  permissions: Permission[];
  is_super_admin?: boolean;
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  message?: string;
}

// Helper function to check if user has specific permission
export function hasPermission(
  userPermissions: UserPermissions | null,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (!userPermissions) return false;
  
  // Super admin has all permissions
  if (userPermissions.is_super_admin) return true;
  
  // Safety check: ensure permissions array exists
  if (!userPermissions.permissions || !Array.isArray(userPermissions.permissions)) {
    return false;
  }
  
  const modulePermission = userPermissions.permissions.find(
    (p) => p.module === module
  );
  
  if (!modulePermission) return false;
  
  return modulePermission.actions.includes(action) || 
         modulePermission.actions.includes('manage');
}

// Helper function to check if user has any permission for a module
export function hasModuleAccess(
  userPermissions: UserPermissions | null,
  module: PermissionModule
): boolean {
  if (!userPermissions) return false;
  
  // Super admin has all permissions
  if (userPermissions.is_super_admin) return true;
  
  // Safety check: ensure permissions array exists
  if (!userPermissions.permissions || !Array.isArray(userPermissions.permissions)) {
    return false;
  }
  
  return userPermissions.permissions.some((p) => p.module === module);
}

// Get all actions for a module
export function getModuleActions(
  userPermissions: UserPermissions | null,
  module: PermissionModule
): PermissionAction[] {
  if (!userPermissions) return [];
  
  // Super admin has all actions
  if (userPermissions.is_super_admin) {
    return ['view', 'manage'];
  }
  
  // Safety check: ensure permissions array exists
  if (!userPermissions.permissions || !Array.isArray(userPermissions.permissions)) {
    return [];
  }
  
  const modulePermission = userPermissions.permissions.find(
    (p) => p.module === module
  );
  
  return modulePermission?.actions || [];
}

// Permission module labels for UI
export const PERMISSION_MODULE_LABELS: Record<PermissionModule, string> = {
  blogs: 'Blog Management',
  orders: 'Order Management',
  inventory: 'Inventory Management',
  tax_rates: 'Tax Rate Management',
  products: 'Product Management',
  categories: 'Category Management',
  users: 'User Management',
  companies: 'Company Management',
  sellers: 'Seller Management',
};

// Permission action labels for UI
export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'View Only',
  manage: 'Full Access',
};
