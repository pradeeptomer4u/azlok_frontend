'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import inventoryService, { GatePass } from '../../../../services/inventoryService';

export default function GatePassesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams?.get('status') || null;
  const typeFilter = searchParams?.get('type') || null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchGatePasses = async () => {
      try {
        setIsLoading(true);
        
        const params: any = {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (statusFilter) {
          params.status = statusFilter;
        }
        
        if (typeFilter) {
          params.pass_type = typeFilter;
        }
        
        if (dateRange.start) {
          params.start_date = dateRange.start;
        }
        
        if (dateRange.end) {
          params.end_date = dateRange.end;
        }
        
        const response = await inventoryService.getGatePasses(params) as { data: GatePass[], meta: { total: number } };
        // Check if response and its properties exist before using them
        if (response && response.data) {
          setGatePasses(response.data);
          // Check if meta exists and has total property
          if (response.meta && typeof response.meta.total === 'number') {
            setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
          } else {
            setTotalPages(1); // Default to 1 page if meta data is missing
          }
        } else {
          // Handle empty or invalid response
          setGatePasses([]);
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error('Error fetching gate passes:', err);
        setError(err.message || 'Failed to load gate passes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGatePasses();
  }, [currentPage, searchTerm, statusFilter, typeFilter, dateRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleApprove = async (id: number) => {
    if (window.confirm('Are you sure you want to approve this gate pass?')) {
      try {
        await inventoryService.approveGatePass(id);
        
        // Update the status in the local state
        setGatePasses(prevPasses => 
          prevPasses.map(pass => 
            pass.id === id ? { ...pass, status: 'approved' } : pass
          )
        );
        
        alert('Gate pass approved successfully');
      } catch (err: any) {
        console.error('Error approving gate pass:', err);
        alert(err.message || 'Failed to approve gate pass');
      }
    }
  };

  const handlePrint = async (id: number) => {
    try {
      const response = await inventoryService.printGatePass(id) as { data: any };
      
      // Check if response and response.data exist before proceeding
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Create a new window and print the gate pass
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Gate Pass #${response.data.pass_number}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .company-name { font-size: 24px; font-weight: bold; }
                .title { font-size: 18px; font-weight: bold; margin: 10px 0; }
                .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .info-table td { padding: 5px; }
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .footer { margin-top: 30px; display: flex; justify-content: space-between; }
                .signature { width: 30%; text-align: center; }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="company-name">Azlok Enterprises</div>
                <div class="title">${response.data.pass_type.toUpperCase()} GATE PASS</div>
                <div>Pass No: ${response.data.pass_number}</div>
                <div>Date: ${new Date(response.data.pass_date).toLocaleDateString()}</div>
              </div>
              
              <table class="info-table">
                <tr>
                  <td><strong>Party Name:</strong></td>
                  <td>${response.data.party_name || '-'}</td>
                  <td><strong>Reference:</strong></td>
                  <td>${response.data.reference_number || '-'}</td>
                </tr>
                <tr>
                  <td><strong>Vehicle No:</strong></td>
                  <td>${response.data.vehicle_number || '-'}</td>
                  <td><strong>Driver:</strong></td>
                  <td>${response.data.driver_name || '-'}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td>${response.data.status.toUpperCase()}</td>
                  <td><strong>Notes:</strong></td>
                  <td>${response.data.notes || '-'}</td>
                </tr>
              </table>
              
              <div class="title">Items</div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${response.data.items.map((item: any, index: number) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.item_name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit_of_measure}</td>
                      <td>${item.description || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="footer">
                <div class="signature">
                  <div>_________________________</div>
                  <div>Security</div>
                </div>
                <div class="signature">
                  <div>_________________________</div>
                  <div>Store Incharge</div>
                </div>
                <div class="signature">
                  <div>_________________________</div>
                  <div>Authorized Signatory</div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err: any) {
      console.error('Error printing gate pass:', err);
      alert(err.message || 'Failed to print gate pass');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'inward':
        return 'bg-green-100 text-green-800';
      case 'outward':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading && gatePasses.length === 0) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gate Passes</h1>
        <Link 
          href="/admin/inventory/gate-passes/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Create Gate Pass
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by pass number or party name"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Pass Type
            </label>
            <select
              id="type"
              value={typeFilter || ''}
              onChange={(e) => {
                const newType = e.target.value;
                const params = new URLSearchParams(searchParams?.toString() || '');
                
                if (newType) {
                  params.set('type', newType);
                } else {
                  params.delete('type');
                }
                
                router.push(`/admin/inventory/gate-passes?${params.toString()}`);
              }}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="inward">Inward</option>
              <option value="outward">Outward</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter || ''}
              onChange={(e) => {
                const newStatus = e.target.value;
                const params = new URLSearchParams(searchParams?.toString() || '');
                
                if (newStatus) {
                  params.set('status', newStatus);
                } else {
                  params.delete('status');
                }
                
                router.push(`/admin/inventory/gate-passes?${params.toString()}`);
              }}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="start_date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="end_date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Gate Passes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pass Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
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
              {gatePasses.map((pass) => (
                <tr key={pass.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pass.pass_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(pass.pass_type)}`}>
                      {pass.pass_type.charAt(0).toUpperCase() + pass.pass_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pass.pass_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pass.party_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pass.reference_number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(pass.status)}`}>
                      {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/inventory/gate-passes/${pass.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </Link>
                    {pass.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(pass.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <Link href={`/admin/inventory/gate-passes/edit/${pass.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </Link>
                      </>
                    )}
                    {(pass.status === 'approved' || pass.status === 'completed') && (
                      <button
                        onClick={() => handlePrint(pass.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Print
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {gatePasses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No gate passes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, gatePasses.length + (currentPage - 1) * itemsPerPage)}
                  </span>{' '}
                  of <span className="font-medium">{gatePasses.length + (currentPage - 1) * itemsPerPage}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === totalPages
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
