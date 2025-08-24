'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatTaxPercentage } from '../../utils/taxService';

// Define types for tax data
interface TaxSummaryData {
  totalTaxCollected: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxByState: {
    [state: string]: {
      total: number;
      cgst: number;
      sgst: number;
      igst: number;
    };
  };
  taxByMonth: {
    [month: string]: {
      total: number;
      cgst: number;
      sgst: number;
      igst: number;
    };
  };
  taxByCategory: {
    [category: string]: {
      total: number;
      cgst: number;
      sgst: number;
      igst: number;
    };
  };
}

interface Order {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  category?: string;
  buyer_state?: string;
}

interface TaxSummaryDashboardProps {
  orders: Order[];
}

// Mock state names for display
const stateNames: { [code: string]: string } = {
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BR': 'Bihar',
  'CG': 'Chhattisgarh',
  'GA': 'Goa',
  'GJ': 'Gujarat',
  'HR': 'Haryana',
  'HP': 'Himachal Pradesh',
  'JH': 'Jharkhand',
  'KA': 'Karnataka',
  'KL': 'Kerala',
  'MP': 'Madhya Pradesh',
  'MH': 'Maharashtra',
  'MN': 'Manipur',
  'ML': 'Meghalaya',
  'MZ': 'Mizoram',
  'NL': 'Nagaland',
  'OD': 'Odisha',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TN': 'Tamil Nadu',
  'TS': 'Telangana',
  'TR': 'Tripura',
  'UK': 'Uttarakhand',
  'UP': 'Uttar Pradesh',
  'WB': 'West Bengal',
  'AN': 'Andaman and Nicobar Islands',
  'CH': 'Chandigarh',
  'DN': 'Dadra and Nagar Haveli and Daman and Diu',
  'DL': 'Delhi',
  'JK': 'Jammu and Kashmir',
  'LA': 'Ladakh',
  'LD': 'Lakshadweep',
  'PY': 'Puducherry'
};

// Mock additional data
const mockAdditionalOrders: Order[] = [
  {
    id: 'ORD-2025-1230',
    date: '2025-08-10',
    customer: 'DEF Manufacturing',
    amount: 75000,
    status: 'Delivered',
    tax_amount: 13500,
    cgst_amount: 6750,
    sgst_amount: 6750,
    igst_amount: 0,
    category: 'Machinery',
    buyer_state: 'MH'
  },
  {
    id: 'ORD-2025-1229',
    date: '2025-08-05',
    customer: 'GHI Electronics',
    amount: 42000,
    status: 'Delivered',
    tax_amount: 7560,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 7560,
    category: 'Electronics',
    buyer_state: 'KA'
  },
  {
    id: 'ORD-2025-1228',
    date: '2025-07-28',
    customer: 'JKL Textiles',
    amount: 36000,
    status: 'Delivered',
    tax_amount: 6480,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 6480,
    category: 'Textiles',
    buyer_state: 'TN'
  },
  {
    id: 'ORD-2025-1227',
    date: '2025-07-20',
    customer: 'MNO Industries',
    amount: 58000,
    status: 'Delivered',
    tax_amount: 10440,
    cgst_amount: 5220,
    sgst_amount: 5220,
    igst_amount: 0,
    category: 'Industrial',
    buyer_state: 'MH'
  },
  {
    id: 'ORD-2025-1226',
    date: '2025-07-15',
    customer: 'PQR Enterprises',
    amount: 29000,
    status: 'Delivered',
    tax_amount: 5220,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 5220,
    category: 'Machinery',
    buyer_state: 'GJ'
  },
  {
    id: 'ORD-2025-1225',
    date: '2025-07-10',
    customer: 'STU Corp',
    amount: 47000,
    status: 'Delivered',
    tax_amount: 8460,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 8460,
    category: 'Electronics',
    buyer_state: 'DL'
  }
];

const TaxSummaryDashboard = ({ orders }: TaxSummaryDashboardProps) => {
  const [taxSummary, setTaxSummary] = useState<TaxSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [exportFormat, setExportFormat] = useState('csv');

  // In a real app, we would fetch tax data from an API
  useEffect(() => {
    const fetchTaxData = async () => {
      setIsLoading(true);
      try {
        // Combine provided orders with mock additional orders
        const combinedOrders = [...orders, ...mockAdditionalOrders];
        
        // Add missing properties to orders
        const enhancedOrders = combinedOrders.map(order => ({
          ...order,
          category: order.category || 'Uncategorized',
          buyer_state: order.buyer_state || (order.cgst_amount > 0 ? 'MH' : 'KA')
        }));
        
        setAllOrders(enhancedOrders);
        
        // Calculate tax summary
        const summary = calculateTaxSummary(enhancedOrders, timeRange);
        setTaxSummary(summary);
      } catch (error) {
        console.error('Error fetching tax data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxData();
  }, [orders, timeRange]);

  const calculateTaxSummary = (orders: Order[], timeRange: string): TaxSummaryData => {
    // Filter orders by time range if needed
    let filteredOrders = orders;
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (timeRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeRange === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (timeRange === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredOrders = orders.filter(order => new Date(order.date) >= cutoffDate);
    }
    
    // Initialize summary data
    const summary: TaxSummaryData = {
      totalTaxCollected: 0,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      taxByState: {},
      taxByMonth: {},
      taxByCategory: {}
    };
    
    // Process each order
    filteredOrders.forEach(order => {
      // Update totals
      summary.totalTaxCollected += order.tax_amount;
      summary.cgstTotal += order.cgst_amount;
      summary.sgstTotal += order.sgst_amount;
      summary.igstTotal += order.igst_amount;
      
      // Update tax by state
      const state = order.buyer_state || 'Unknown';
      if (!summary.taxByState[state]) {
        summary.taxByState[state] = { total: 0, cgst: 0, sgst: 0, igst: 0 };
      }
      summary.taxByState[state].total += order.tax_amount;
      summary.taxByState[state].cgst += order.cgst_amount;
      summary.taxByState[state].sgst += order.sgst_amount;
      summary.taxByState[state].igst += order.igst_amount;
      
      // Update tax by month
      const month = order.date.substring(0, 7); // Format: YYYY-MM
      if (!summary.taxByMonth[month]) {
        summary.taxByMonth[month] = { total: 0, cgst: 0, sgst: 0, igst: 0 };
      }
      summary.taxByMonth[month].total += order.tax_amount;
      summary.taxByMonth[month].cgst += order.cgst_amount;
      summary.taxByMonth[month].sgst += order.sgst_amount;
      summary.taxByMonth[month].igst += order.igst_amount;
      
      // Update tax by category
      const category = order.category || 'Uncategorized';
      if (!summary.taxByCategory[category]) {
        summary.taxByCategory[category] = { total: 0, cgst: 0, sgst: 0, igst: 0 };
      }
      summary.taxByCategory[category].total += order.tax_amount;
      summary.taxByCategory[category].cgst += order.cgst_amount;
      summary.taxByCategory[category].sgst += order.sgst_amount;
      summary.taxByCategory[category].igst += order.igst_amount;
    });
    
    return summary;
  };

  const handleExportTaxData = () => {
    if (!taxSummary) return;
    
    if (exportFormat === 'csv') {
      // Generate CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      // Add header
      csvContent += 'Order ID,Date,Customer,Amount,Tax Amount,CGST,SGST,IGST,Category,Buyer State\n';
      
      // Add rows
      allOrders.forEach(order => {
        const row = [
          order.id,
          order.date,
          order.customer,
          order.amount,
          order.tax_amount,
          order.cgst_amount,
          order.sgst_amount,
          order.igst_amount,
          order.category || 'Uncategorized',
          stateNames[order.buyer_state || ''] || order.buyer_state || 'Unknown'
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `tax_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For PDF or other formats, we would use a library like jsPDF
      alert('PDF export functionality will be implemented in the future.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!taxSummary) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Tax Summary</h2>
        <p className="text-gray-600">No tax data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Tax Summary</h2>
          <div className="flex space-x-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <div className="flex items-center space-x-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
              <button
                onClick={handleExportTaxData}
                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Tax Overview Cards */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-blue-700 text-sm font-medium">Total Tax Collected</h3>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(taxSummary.totalTaxCollected)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-green-700 text-sm font-medium">CGST Collected</h3>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(taxSummary.cgstTotal)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-yellow-700 text-sm font-medium">SGST Collected</h3>
              <p className="text-2xl font-bold text-yellow-800">{formatCurrency(taxSummary.sgstTotal)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-purple-700 text-sm font-medium">IGST Collected</h3>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(taxSummary.igstTotal)}</p>
            </div>
          </div>
          
          {/* Tax by State */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tax by State</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tax
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IGST
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(taxSummary.taxByState).map(([state, data]) => (
                    <tr key={state}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {stateNames[state] || state}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.cgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.sgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.igst)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Tax by Month */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tax by Month</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tax
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IGST
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(taxSummary.taxByMonth)
                    .sort((a, b) => b[0].localeCompare(a[0])) // Sort by month descending
                    .map(([month, data]) => (
                    <tr key={month}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.cgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.sgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.igst)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Tax by Category */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tax by Product Category</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tax
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SGST
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IGST
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(taxSummary.taxByCategory)
                    .sort((a, b) => b[1].total - a[1].total) // Sort by total tax descending
                    .map(([category, data]) => (
                    <tr key={category}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.cgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.sgst)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(data.igst)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummaryDashboard;
