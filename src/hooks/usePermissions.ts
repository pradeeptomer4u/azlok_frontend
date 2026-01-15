import { useAuth } from '../app/context/AuthContext';

export const usePermissions = () => {
  const { hasPermission, user } = useAuth();

  return {
    hasPermission,
    canManageBlogs: hasPermission('manage_blogs'),
    canViewBlogs: hasPermission('view_blogs'),
    canManageOrders: hasPermission('manage_orders'),
    canViewOrders: hasPermission('view_orders'),
    canManageInventory: hasPermission('manage_inventory'),
    canViewInventory: hasPermission('view_inventory'),
    canManageTaxRates: hasPermission('manage_tax_rates'),
    canViewTaxRates: hasPermission('view_tax_rates'),
    canManageProducts: hasPermission('manage_products'),
    canViewProducts: hasPermission('view_products'),
    canManageUsers: hasPermission('manage_users'),
    canViewUsers: hasPermission('view_users'),
    canManageCategories: hasPermission('manage_categories'),
    canViewCategories: hasPermission('view_categories'),
    canManageCompanies: hasPermission('manage_companies'),
    canViewCompanies: hasPermission('view_companies'),
    canManageSellers: hasPermission('manage_sellers'),
    canViewSellers: hasPermission('view_sellers'),
    isAdmin: user?.role === 'admin' || user?.role === 'company',
  };
};
