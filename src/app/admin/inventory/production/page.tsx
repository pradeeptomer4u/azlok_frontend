'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash, Eye, CheckCircle } from 'lucide-react';
import inventoryService from '../../../../services/inventoryService';
import Pagination from '../../../../components/admin/common/Pagination';
import StatusBadge from '../../../../components/admin/common/StatusBadge';
import DeleteConfirmModal from '../../../../components/admin/common/DeleteConfirmModal';

interface ProductionBatch {
  id: number;
  batch_number: string;
  product_name: string;
  packaging_size: string;
  planned_quantity: number;
  produced_quantity: number;
  unit_of_measure: string;
  start_date: string;
  end_date?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export default function ProductionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams?.get('status') || null);
  const [dateFilter, setDateFilter] = useState<string | null>(searchParams?.get('date') || null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProductionBatches();
  }, [currentPage, statusFilter, dateFilter, searchParams]);

  const fetchProductionBatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        date: dateFilter
      };
      
      const response = await inventoryService.getProductionBatches(params) as { data: ProductionBatch[], meta: { total: number } };
      
      if (response && response.data) {
        setProductionBatches(response.data);
        if (response.meta && typeof response.meta.total === 'number') {
          setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
        } else {
          setTotalPages(1);
        }
      } else {
        setProductionBatches([]);
        setTotalPages(1);
        console.error('Invalid response format from production batches API');
      }
    } catch (err) {
      console.error('Error fetching production batches:', err);
      setError('Failed to load production batches. Please try again.');
      setProductionBatches([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setStatusFilter(value || null);
    } else if (name === 'date') {
      setDateFilter(value || null);
    }
    
    setCurrentPage(1);
    
    // Update URL with filters
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    router.push(`/admin/inventory/production?${params.toString()}`);
  };

  const handleDeleteClick = (id: number) => {
    setBatchToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (batchToDelete) {
      try {
        const response = await inventoryService.deleteProductionBatch(batchToDelete) as { success?: boolean };
        
        if (response && response.success) {
          setProductionBatches(productionBatches.filter(batch => batch.id !== batchToDelete));
          setShowDeleteModal(false);
          setBatchToDelete(null);
        } else {
          throw new Error('Failed to delete production batch');
        }
      } catch (err: any) {
        console.error('Error deleting production batch:', err);
        setError(err.message || 'Failed to delete production batch');
      }
    }
  };

  const handleCompleteProduction = async (id: number) => {
    try {
      // Using 0 as a placeholder for producedQuantity - in a real app, you would prompt for this value
      const response = await inventoryService.completeProductionBatch(id, 0) as { success?: boolean, data?: ProductionBatch };
      
      if (response && response.success && response.data) {
        // Update the batch in the list
        setProductionBatches(productionBatches.map(batch => 
          batch.id === id ? response.data! : batch
        ));
      } else {
        throw new Error('Failed to complete production batch');
      }
    } catch (err: any) {
      console.error('Error completing production batch:', err);
      setError(err.message || 'Failed to complete production batch');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Production Management</h1>
        <Link href="/admin/inventory/production/create" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium flex items-center">
          <Plus className="mr-2" size={16} />
          New Production Batch
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter || ''}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <select
              id="date"
              name="date"
              value={dateFilter || ''}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Production Batches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : productionBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No production batches found
                  </td>
                </tr>
              ) : (
                productionBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.batch_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.product_name} ({batch.packaging_size})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.produced_quantity}/{batch.planned_quantity} {batch.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(batch.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/inventory/production/${batch.id}`} className="text-blue-600 hover:text-blue-900" title="View Details">
                          <Eye className="inline" size={16} />
                        </Link>
                        
                        {batch.status !== 'completed' && batch.status !== 'cancelled' && (
                          <>
                            <Link href={`/admin/inventory/production/${batch.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                              <Edit className="inline" size={16} />
                            </Link>
                            
                            <button
                              onClick={() => handleCompleteProduction(batch.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Complete Production"
                            >
                              <CheckCircle className="inline" size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteClick(batch.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel/Delete"
                            >
                              <Trash className="inline" size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Production Batch"
        message="Are you sure you want to delete this production batch? This action cannot be undone."
      />
    </div>
  );
}
