'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import inventoryService from '../../../../services/inventoryService';

interface StockStatus {
  id: number;
  name: string;
  code: string;
  current_stock: number;
  min_stock_level: number;
  reorder_level: number;
  unit_of_measure: string;
  status: 'normal' | 'low' | 'critical';
}

interface PackagedProductStatus {
  id: number;
  product_name: string;
  packaging_size: string;
  weight_value: number;
  weight_unit: string;
  current_stock: number;
  min_stock_level: number;
  reorder_level: number;
  status: 'normal' | 'low' | 'critical';
}

export default function InventoryDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rawMaterialsStatus, setRawMaterialsStatus] = useState<StockStatus[]>([]);
  const [packagedProductsStatus, setPackagedProductsStatus] = useState<PackagedProductStatus[]>([]);
  const [pendingPurchaseOrders, setPendingPurchaseOrders] = useState(0);
  const [pendingIndents, setPendingIndents] = useState(0);
  const [pendingGatePasses, setPendingGatePasses] = useState(0);
  const [plannedProduction, setPlannedProduction] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch raw materials stock status
        const rawMaterialsResponse = await inventoryService.getInventoryStockStatus({ is_raw_material: true }) as { data: any[], meta?: { total: number } };
        const rawMaterials = rawMaterialsResponse.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          current_stock: item.current_stock,
          min_stock_level: item.min_stock_level,
          reorder_level: item.reorder_level,
          unit_of_measure: item.unit_of_measure,
          status: (item.current_stock <= item.min_stock_level ? 'critical' : 
                 item.current_stock <= item.reorder_level ? 'low' : 'normal') as 'critical' | 'low' | 'normal'
        }));
        setRawMaterialsStatus(rawMaterials);
        
        // Fetch packaged products stock status
        const packagedProductsResponse = await inventoryService.getPackagedProductStockStatus() as { data: any[], meta?: { total: number } };
        const packagedProducts = packagedProductsResponse.data.map((item: any) => ({
          id: item.id,
          product_name: item.product_name,
          packaging_size: item.packaging_size,
          weight_value: item.weight_value,
          weight_unit: item.weight_unit,
          current_stock: item.current_stock,
          min_stock_level: item.min_stock_level,
          reorder_level: item.reorder_level,
          status: (item.current_stock <= item.min_stock_level ? 'critical' : 
                 item.current_stock <= item.reorder_level ? 'low' : 'normal') as 'critical' | 'low' | 'normal'
        }));
        setPackagedProductsStatus(packagedProducts);
        
        // Fetch pending purchase orders count
        const purchaseOrdersResponse = await inventoryService.getPurchaseOrders({ status: 'pending', limit: 1 }) as { data: any[], meta?: { total: number } };
        setPendingPurchaseOrders(purchaseOrdersResponse.meta?.total || 0);
        
        // Fetch pending purchase indents count
        const indentsResponse = await inventoryService.getPurchaseIndents({ status: 'pending', limit: 1 }) as { data: any[], meta?: { total: number } };
        setPendingIndents(indentsResponse.meta?.total || 0);
        
        // Fetch pending gate passes count
        const gatePassesResponse = await inventoryService.getGatePasses({ status: 'pending', limit: 1 }) as { data: any[], meta?: { total: number } };
        setPendingGatePasses(gatePassesResponse.meta?.total || 0);
        
        // Fetch planned production batches count
        const productionResponse = await inventoryService.getProductionBatches({ status: 'planned', limit: 1 }) as { data: any[], meta?: { total: number } };
        setPlannedProduction(productionResponse.meta?.total || 0);
        
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Raw Materials Below Reorder Level</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {rawMaterialsStatus.filter(item => item.status !== 'normal').length}
              </p>
            </div>
          </div>
          <Link href="/admin/inventory/raw-materials?filter=low" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            View Details →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Packaged Products Below Reorder Level</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {packagedProductsStatus.filter(item => item.status !== 'normal').length}
              </p>
            </div>
          </div>
          <Link href="/admin/inventory/packaged-products?filter=low" className="mt-4 inline-block text-sm text-green-600 hover:text-green-800">
            View Details →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Pending Purchase Orders</h2>
              <p className="text-2xl font-semibold text-gray-800">{pendingPurchaseOrders}</p>
            </div>
          </div>
          <Link href="/admin/inventory/purchase-orders?status=pending" className="mt-4 inline-block text-sm text-yellow-600 hover:text-yellow-800">
            View Details →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Pending Gate Passes</h2>
              <p className="text-2xl font-semibold text-gray-800">{pendingGatePasses}</p>
            </div>
          </div>
          <Link href="/admin/inventory/gate-passes?status=pending" className="mt-4 inline-block text-sm text-purple-600 hover:text-purple-800">
            View Details →
          </Link>
        </div>
      </div>
      
      {/* Raw Materials Status */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Raw Materials Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rawMaterialsStatus.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.current_stock} {item.unit_of_measure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reorder_level} {item.unit_of_measure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'critical' ? 'bg-red-100 text-red-800' : 
                        item.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {item.status === 'critical' ? 'Critical' : 
                       item.status === 'low' ? 'Low' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/inventory/raw-materials/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      View
                    </Link>
                    <Link href={`/admin/inventory/purchase-orders/create?item_id=${item.id}`} className="text-green-600 hover:text-green-900">
                      Order
                    </Link>
                  </td>
                </tr>
              ))}
              {rawMaterialsStatus.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No raw materials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {rawMaterialsStatus.length > 5 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <Link href="/admin/inventory/raw-materials" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All Raw Materials →
            </Link>
          </div>
        )}
      </div>
      
      {/* Packaged Products Status */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Packaged Products Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packaging
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packagedProductsStatus.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.weight_value} {item.weight_unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.current_stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reorder_level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'critical' ? 'bg-red-100 text-red-800' : 
                        item.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {item.status === 'critical' ? 'Critical' : 
                       item.status === 'low' ? 'Low' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/inventory/packaged-products/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      View
                    </Link>
                    <Link href={`/admin/inventory/production/create?product_id=${item.id}`} className="text-green-600 hover:text-green-900">
                      Produce
                    </Link>
                  </td>
                </tr>
              ))}
              {packagedProductsStatus.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No packaged products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {packagedProductsStatus.length > 5 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <Link href="/admin/inventory/packaged-products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All Packaged Products →
            </Link>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/inventory/purchase-orders/create" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Create Purchase Order</span>
          </Link>
          
          <Link href="/admin/inventory/raw-materials/create" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Add Raw Material</span>
          </Link>
          
          <Link href="/admin/inventory/production/create" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Create Production Batch</span>
          </Link>
          
          <Link href="/admin/inventory/gate-passes/create" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Create Gate Pass</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
