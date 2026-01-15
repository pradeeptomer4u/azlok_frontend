# User Permission Management System

## Overview

The Azlok platform now includes a comprehensive Role-Based Access Control (RBAC) system that allows administrators to grant granular permissions to users. This system controls access to different modules and actions within the admin dashboard.

## Architecture

### 1. Permission Structure

Permissions are organized by **modules** and **actions**:

- **Modules**: Different areas of the admin dashboard (blogs, orders, inventory, tax_rates, products, categories, users, settings)
- **Actions**: Operations that can be performed (view, create, edit, delete, manage)

### 2. Key Components

#### Types & Interfaces (`/src/types/permissions.ts`)
- `PermissionModule`: Available modules in the system
- `PermissionAction`: Available actions (view, create, edit, delete, manage)
- `Permission`: Module-action pair
- `UserPermissions`: User's complete permission set
- Helper functions: `hasPermission()`, `hasModuleAccess()`, `getModuleActions()`

#### Permission Service (`/src/services/permissionService.ts`)
API integration for permission management:
- `getUserPermissions(userId)`: Get permissions for a specific user
- `getMyPermissions()`: Get current user's permissions
- `getAllPermissions()`: List all available permissions
- `grantPermission(userId, module, action)`: Grant single permission
- `updatePermissionsBulk(userId, permissions)`: Update all permissions at once
- `revokePermission(userId, module, action)`: Remove permission
- `checkPermission(module, action)`: Check if current user has permission

#### Auth Context (`/src/context/AuthContext.tsx`)
Extended to include:
- `permissions`: Current user's permissions
- `refreshPermissions()`: Reload permissions from API
- Automatic permission loading for admin users on login

#### Permission Guard (`/src/components/PermissionGuard.tsx`)
React component for protecting routes and UI elements:
```tsx
<PermissionGuard module="blogs" action="create">
  <CreateBlogButton />
</PermissionGuard>
```

Hooks:
- `usePermission(module, action)`: Check if user has specific permission
- `useModuleAccess(module)`: Check if user has any access to a module

## API Endpoints

The system integrates with the following backend endpoints:

- `GET /api/permissions/users/{user_id}/permissions` - View user permissions
- `POST /api/permissions/users/{user_id}/permissions` - Grant single permission
- `PUT /api/permissions/users/{user_id}/permissions/bulk` - Update all permissions
- `DELETE /api/permissions/users/{user_id}/permissions/{permission}` - Revoke permission
- `POST /api/permissions/check-permission` - Check if current user has permission
- `GET /api/permissions/my-permissions` - Get current user's permissions
- `GET /api/permissions/all-permissions` - List all available permissions

## Usage Guide

### For Administrators

#### Managing User Permissions

1. Navigate to **Admin Dashboard** → **Users** → **All Users**
2. Find the user you want to manage
3. Click **Permissions** button next to the user
4. Use the permission matrix to grant/revoke permissions:
   - Check individual action boxes for specific permissions
   - Use "Select All" to grant all actions for a module
   - Use "Manage" action to grant full access to a module
5. Click **Save Permissions** to apply changes

#### Permission Matrix

The permission matrix shows all available modules and actions:

| Module | View | Create | Edit | Delete | Manage |
|--------|------|--------|------|--------|--------|
| Blog Management | ☐ | ☐ | ☐ | ☐ | Select All |
| Order Management | ☐ | ☐ | ☐ | ☐ | Select All |
| Inventory Management | ☐ | ☐ | ☐ | ☐ | Select All |
| Tax Rate Management | ☐ | ☐ | ☐ | ☐ | Select All |
| Product Management | ☐ | ☐ | ☐ | ☐ | Select All |
| Category Management | ☐ | ☐ | ☐ | ☐ | Select All |
| User Management | ☐ | ☐ | ☐ | ☐ | Select All |
| System Settings | ☐ | ☐ | ☐ | ☐ | Select All |

### For Developers

#### Protecting Routes

Use `PermissionGuard` component to protect entire pages:

```tsx
import PermissionGuard from '@/components/PermissionGuard';

export default function BlogsPage() {
  return (
    <PermissionGuard module="blogs" action="view">
      <div>
        {/* Blog content */}
      </div>
    </PermissionGuard>
  );
}
```

#### Protecting UI Elements

Conditionally render buttons or actions based on permissions:

```tsx
import { usePermission } from '@/components/PermissionGuard';

export default function BlogList() {
  const canCreate = usePermission('blogs', 'create');
  const canEdit = usePermission('blogs', 'edit');
  const canDelete = usePermission('blogs', 'delete');

  return (
    <div>
      {canCreate && <button>Create Blog</button>}
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

#### Checking Module Access

Check if user has any access to a module:

```tsx
import { useModuleAccess } from '@/components/PermissionGuard';

export default function AdminLayout() {
  const hasInventoryAccess = useModuleAccess('inventory');

  return (
    <nav>
      {hasInventoryAccess && (
        <Link href="/admin/inventory">Inventory</Link>
      )}
    </nav>
  );
}
```

#### Using Permission Helpers

```tsx
import { hasPermission, hasModuleAccess } from '@/types/permissions';
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { permissions } = useAuth();

  // Check specific permission
  if (hasPermission(permissions, 'blogs', 'create')) {
    // User can create blogs
  }

  // Check module access
  if (hasModuleAccess(permissions, 'inventory')) {
    // User has some access to inventory
  }
}
```

## Permission Levels

### Actions Explained

1. **View**: Read-only access to view data
2. **Create**: Ability to create new records
3. **Edit**: Ability to modify existing records
4. **Delete**: Ability to remove records
5. **Manage**: Full access (includes all above actions)

### Super Admin

Users marked as "Super Admin" have unrestricted access to all modules and actions, bypassing the permission system entirely.

## Admin Dashboard Navigation

The admin sidebar automatically adjusts based on user permissions:

- **Dashboard Overview**: Always visible to all admin users
- **Catalog Section** (Products, Categories, Blogs): Visible if user has access to any of these modules
- **Users Section**: Visible only if user has `users` module access
- **Orders Section**: Visible only if user has `orders` module access
- **Inventory Section**: Visible only if user has `inventory` module access
- **Settings Section**: Visible if user has `tax_rates` or `settings` module access

## Best Practices

### For Administrators

1. **Principle of Least Privilege**: Grant only the minimum permissions needed for users to perform their tasks
2. **Regular Audits**: Periodically review user permissions and remove unnecessary access
3. **Role-Based Assignment**: Group users by role and assign consistent permissions
4. **Document Changes**: Keep track of permission changes for audit purposes

### For Developers

1. **Always Check Permissions**: Never assume a user has access - always verify
2. **Fail Securely**: If permission check fails, deny access by default
3. **User-Friendly Messages**: Provide clear feedback when access is denied
4. **Backend Validation**: Always validate permissions on the backend as well
5. **Test Thoroughly**: Test with different permission combinations

## Security Considerations

1. **Client-Side Only**: The frontend permission system is for UX only. Always validate permissions on the backend.
2. **Token Security**: Permissions are loaded using the user's authentication token
3. **Session Management**: Permissions are refreshed on login and can be manually refreshed
4. **API Security**: All permission management endpoints require admin authentication

## Troubleshooting

### User Can't See Menu Items

1. Check if user has permissions for that module
2. Verify user role is 'admin'
3. Check if permissions were saved correctly
4. Try refreshing permissions: `refreshPermissions()` from AuthContext

### Permission Changes Not Reflecting

1. User may need to log out and log back in
2. Call `refreshPermissions()` to reload from API
3. Check browser console for API errors
4. Verify backend API is returning correct permissions

### Access Denied Errors

1. Verify user has the required permission
2. Check if permission check is using correct module/action names
3. Ensure backend API is properly configured
4. Check authentication token is valid

## Future Enhancements

Potential improvements to the permission system:

1. **Permission Groups**: Create reusable permission templates
2. **Time-Based Permissions**: Grant temporary access
3. **Conditional Permissions**: Based on user attributes or context
4. **Audit Logging**: Track all permission changes
5. **Bulk User Management**: Assign permissions to multiple users at once
6. **Permission Inheritance**: Hierarchical permission structures

## Support

For issues or questions about the permission system:
- Check the troubleshooting section above
- Review the code examples in this document
- Contact the development team for backend API issues
