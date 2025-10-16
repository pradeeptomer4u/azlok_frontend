'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import inventoryService from '../../../../services/inventoryService';
import Pagination from '../../../../components/admin/common/Pagination';
import DeleteConfirmModal from '../../../../components/admin/common/DeleteConfirmModal';

interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  gst_number?: string;
  pan_number?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active: boolean;
  created_at: string;
}

export default function SuppliersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams?.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams?.get('status') || null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, searchTerm, statusFilter, searchParams]);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter
      };
      
      const response = await inventoryService.getSuppliers(params) as { data: Supplier[], meta: { total: number } };
      
      if (response && response.data) {
        setSuppliers(response.data);
        if (response.meta && typeof response.meta.total === 'number') {
          setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
        } else {
          setTotalPages(1);
        }
      } else {
        setSuppliers([]);
        setTotalPages(1);
        console.error('Invalid response format from suppliers API');
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load suppliers. Please try again.');
      setSuppliers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    // Update URL with search term
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    router.push(`/admin/inventory/suppliers?${params.toString()}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value || null);
    setCurrentPage(1);
    
    // Update URL with status filter
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    
    router.push(`/admin/inventory/suppliers?${params.toString()}`);
  };

  const handleDeleteClick = (id: number) => {
    setSupplierToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (supplierToDelete) {
      try {
        const response = await inventoryService.deleteSupplier(supplierToDelete) as { success?: boolean };
        
        if (response && response.success) {
          setSuppliers(suppliers.filter(supplier => supplier.id !== supplierToDelete));
          setShowDeleteModal(false);
          setSupplierToDelete(null);
        } else {
          throw new Error('Failed to delete supplier');
        }
      } catch (err: any) {
        console.error('Error deleting supplier:', err);
        setError(err.message || 'Failed to delete supplier');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link href="/admin/inventory/suppliers/create" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium flex items-center">
          <Plus className="mr-2" size={16} />
          Add New Supplier
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>
          
          <div>
            <select
              value={statusFilter || ''}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Suppliers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
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
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.contact_person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/inventory/suppliers/${supplier.id}`} className="text-blue-600 hover:text-blue-900" title="View Details">
                          <Eye className="inline" size={16} />
                        </Link>
                        
                        <Link href={`/admin/inventory/suppliers/${supplier.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit className="inline" size={16} />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteClick(supplier.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash className="inline" size={16} />
                        </button>
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
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone and may affect related purchase orders and inventory items."
      />
    </div>
  );
}
