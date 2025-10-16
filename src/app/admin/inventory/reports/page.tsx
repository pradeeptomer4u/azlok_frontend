'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaDownload, FaFilePdf, FaFileExcel, FaChartBar } from 'react-icons/fa';
import inventoryService from '../../../../services/inventoryService';

interface ReportOption {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  formats: string[];
  parameters: ReportParameter[];
}

interface ReportParameter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'text' | 'checkbox';
  required: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean;
}

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(searchParams?.get('report') || null);
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({});
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  // Define available report options
  const reportOptions: ReportOption[] = [
    {
      id: 'inventory_status',
      name: 'Inventory Status Report',
      description: 'Current stock levels of all inventory items with status indicators',
      icon: <FaChartBar className="h-8 w-8 text-blue-500" />,
      formats: ['pdf', 'excel', 'csv'],
      parameters: [
        {
          id: 'item_type',
          name: 'Item Type',
          type: 'select',
          required: false,
          options: [
            { value: 'all', label: 'All Items' },
            { value: 'raw_material', label: 'Raw Materials' },
            { value: 'packaged_product', label: 'Packaged Products' }
          ],
          defaultValue: 'all'
        },
        {
          id: 'status',
          name: 'Stock Status',
          type: 'select',
          required: false,
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'critical', label: 'Critical (Below Min Level)' },
            { value: 'low', label: 'Low (Below Reorder Level)' },
            { value: 'normal', label: 'Normal' },
            { value: 'excess', label: 'Excess (Above Max Level)' }
          ],
          defaultValue: 'all'
        },
        {
          id: 'include_inactive',
          name: 'Include Inactive Items',
          type: 'checkbox',
          required: false,
          defaultValue: false
        }
      ]
    },
    {
      id: 'stock_movement',
      name: 'Stock Movement Report',
      description: 'Track all inventory movements within a specified date range',
      icon: <FaChartBar className="h-8 w-8 text-green-500" />,
      formats: ['pdf', 'excel', 'csv'],
      parameters: [
        {
          id: 'start_date',
          name: 'Start Date',
          type: 'date',
          required: true
        },
        {
          id: 'end_date',
          name: 'End Date',
          type: 'date',
          required: true
        },
        {
          id: 'movement_type',
          name: 'Movement Type',
          type: 'select',
          required: false,
          options: [
            { value: 'all', label: 'All Types' },
            { value: 'adjustment', label: 'Stock Adjustment' },
            { value: 'transfer', label: 'Stock Transfer' },
            { value: 'return', label: 'Return to Supplier' },
            { value: 'write_off', label: 'Write Off' },
            { value: 'production', label: 'Production Consumption' }
          ],
          defaultValue: 'all'
        },
        {
          id: 'item_id',
          name: 'Item',
          type: 'select',
          required: false,
          options: [
            { value: '', label: 'All Items' }
            // This would be populated dynamically with inventory items
          ],
          defaultValue: ''
        }
      ]
    },
    {
      id: 'purchase_order',
      name: 'Purchase Order Report',
      description: 'Summary of purchase orders by supplier, status, or date range',
      icon: <FaChartBar className="h-8 w-8 text-purple-500" />,
      formats: ['pdf', 'excel', 'csv'],
      parameters: [
        {
          id: 'start_date',
          name: 'Start Date',
          type: 'date',
          required: true
        },
        {
          id: 'end_date',
          name: 'End Date',
          type: 'date',
          required: true
        },
        {
          id: 'status',
          name: 'Order Status',
          type: 'select',
          required: false,
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'received', label: 'Received' },
            { value: 'cancelled', label: 'Cancelled' }
          ],
          defaultValue: 'all'
        },
        {
          id: 'supplier_id',
          name: 'Supplier',
          type: 'select',
          required: false,
          options: [
            { value: '', label: 'All Suppliers' }
            // This would be populated dynamically with suppliers
          ],
          defaultValue: ''
        }
      ]
    },
    {
      id: 'production',
      name: 'Production Report',
      description: 'Production batches, yields, and efficiency metrics',
      icon: <FaChartBar className="h-8 w-8 text-yellow-500" />,
      formats: ['pdf', 'excel', 'csv'],
      parameters: [
        {
          id: 'start_date',
          name: 'Start Date',
          type: 'date',
          required: true
        },
        {
          id: 'end_date',
          name: 'End Date',
          type: 'date',
          required: true
        },
        {
          id: 'status',
          name: 'Production Status',
          type: 'select',
          required: false,
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'planned', label: 'Planned' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
          ],
          defaultValue: 'all'
        },
        {
          id: 'product_id',
          name: 'Product',
          type: 'select',
          required: false,
          options: [
            { value: '', label: 'All Products' }
            // This would be populated dynamically with products
          ],
          defaultValue: ''
        }
      ]
    },
    {
      id: 'sales_analysis',
      name: 'Sales Analysis Report',
      description: 'Sales trends, top-selling products, and revenue analysis',
      icon: <FaChartBar className="h-8 w-8 text-red-500" />,
      formats: ['pdf', 'excel', 'csv'],
      parameters: [
        {
          id: 'start_date',
          name: 'Start Date',
          type: 'date',
          required: true
        },
        {
          id: 'end_date',
          name: 'End Date',
          type: 'date',
          required: true
        },
        {
          id: 'group_by',
          name: 'Group By',
          type: 'select',
          required: false,
          options: [
            { value: 'product', label: 'Product' },
            { value: 'category', label: 'Category' },
            { value: 'customer', label: 'Customer' },
            { value: 'date', label: 'Date' }
          ],
          defaultValue: 'product'
        },
        {
          id: 'include_tax',
          name: 'Include Tax in Analysis',
          type: 'checkbox',
          required: false,
          defaultValue: true
        }
      ]
    }
  ];

  useEffect(() => {
    // Initialize parameters with default values when a report is selected
    if (selectedReport) {
      const report = reportOptions.find(r => r.id === selectedReport);
      if (report) {
        const defaultParams: Record<string, any> = {};
        report.parameters.forEach(param => {
          if (param.defaultValue !== undefined) {
            defaultParams[param.id] = param.defaultValue;
          } else if (param.type === 'date') {
            // Set default dates to current month
            const today = new Date();
            if (param.id === 'start_date') {
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
              defaultParams[param.id] = firstDay.toISOString().split('T')[0];
            } else if (param.id === 'end_date') {
              defaultParams[param.id] = today.toISOString().split('T')[0];
            }
          }
        });
        setReportParameters(defaultParams);
      }
    }
  }, [selectedReport]);

  const handleReportSelection = (reportId: string) => {
    setSelectedReport(reportId);
    
    // Update URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('report', reportId);
    router.push(`/admin/inventory/reports?${params.toString()}`);
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setReportParameters({
      ...reportParameters,
      [paramId]: value
    });
  };

  const handleFormatChange = (format: string) => {
    setReportFormat(format);
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Validate required parameters
      const report = reportOptions.find(r => r.id === selectedReport);
      if (!report) {
        throw new Error('Invalid report selected');
      }
      
      const missingParams = report.parameters
        .filter(param => param.required && !reportParameters[param.id])
        .map(param => param.name);
      
      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
      }
      
      const response = await inventoryService.generateReport({
        report_id: selectedReport,
        format: reportFormat,
        parameters: reportParameters
      }) as { success: boolean, data?: { report_url: string } };
      
      if (response && response.success && response.data?.report_url) {
        // Open or download the report
        window.open(response.data.report_url, '_blank');
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Available Reports</h2>
            <div className="space-y-4">
              {reportOptions.map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleReportSelection(report.id)}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{report.icon}</div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Report Parameters */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedReport
                ? `${reportOptions.find(r => r.id === selectedReport)?.name} Parameters`
                : 'Select a Report'}
            </h2>
            
            {!selectedReport ? (
              <p className="text-gray-500">Please select a report from the list on the left to configure parameters.</p>
            ) : (
              <div className="space-y-6">
                {/* Parameters Form */}
                <div className="space-y-4">
                  {reportOptions
                    .find(r => r.id === selectedReport)
                    ?.parameters.map((param) => (
                      <div key={param.id}>
                        <label htmlFor={param.id} className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {param.type === 'date' && (
                          <input
                            type="date"
                            id={param.id}
                            value={reportParameters[param.id] || ''}
                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required={param.required}
                          />
                        )}
                        
                        {param.type === 'select' && (
                          <select
                            id={param.id}
                            value={reportParameters[param.id] || ''}
                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required={param.required}
                          >
                            {param.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {param.type === 'text' && (
                          <input
                            type="text"
                            id={param.id}
                            value={reportParameters[param.id] || ''}
                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required={param.required}
                          />
                        )}
                        
                        {param.type === 'checkbox' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={param.id}
                              checked={reportParameters[param.id] || false}
                              onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={param.id} className="ml-2 block text-sm text-gray-900">
                              {param.name}
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                  <div className="flex space-x-4">
                    {reportOptions
                      .find(r => r.id === selectedReport)
                      ?.formats.map((format) => (
                        <div key={format} className="flex items-center">
                          <input
                            type="radio"
                            id={`format-${format}`}
                            name="report-format"
                            value={format}
                            checked={reportFormat === format}
                            onChange={() => handleFormatChange(format)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor={`format-${format}`} className="ml-2 block text-sm text-gray-900">
                            {format.toUpperCase()}
                            {format === 'pdf' && <FaFilePdf className="inline ml-1" />}
                            {format === 'excel' && <FaFileExcel className="inline ml-1" />}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium flex items-center justify-center w-full md:w-auto disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaDownload className="mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
