import { apiRequest } from '../utils/apiRequest';

// Raw Material / Inventory Item
export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  category_id: number;
  category_name?: string;
  unit_of_measure: string;
  min_stock_level: number;
  max_stock_level: number;
  reorder_level: number;
  cost_price: number;
  hsn_code?: string;
  is_active: boolean;
  is_raw_material: boolean;
  current_stock: number;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryItemInput {
  name: string;
  code: string;
  description?: string;
  category_id: number;
  unit_of_measure: string;
  min_stock_level: number;
  max_stock_level: number;
  reorder_level: number;
  cost_price: number;
  hsn_code?: string;
  is_active: boolean;
  is_raw_material: boolean;
}

export interface UpdateInventoryItemInput extends Partial<CreateInventoryItemInput> {
  id: number;
}

// Packaged Products
export interface PackagedProduct {
  id: number;
  product_id: number;
  product_name?: string;
  packaging_size: string; // SIZE_50G, SIZE_100G, SIZE_500G, SIZE_1KG
  weight_value: number;
  weight_unit: string; // g, kg
  items_per_package: number;
  barcode?: string;
  min_stock_level: number;
  reorder_level: number;
  current_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePackagedProductInput {
  product_id: number;
  packaging_size: string;
  weight_value: number;
  weight_unit: string;
  items_per_package: number;
  barcode?: string;
  min_stock_level: number;
  reorder_level: number;
  is_active: boolean;
}

export interface UpdatePackagedProductInput extends Partial<CreatePackagedProductInput> {
  id: number;
}

// Stock Movement
export interface StockMovement {
  id: number;
  inventory_item_id: number;
  item_name?: string;
  movement_type: 'purchase' | 'production' | 'sales' | 'adjustment' | 'return' | 'transfer';
  quantity: number;
  unit_price?: number;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
}

export interface CreateStockMovementInput {
  inventory_item_id: number;
  movement_type: 'purchase' | 'production' | 'sales' | 'adjustment' | 'return' | 'transfer';
  quantity: number;
  unit_price?: number;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
}

// Packaged Product Movement
export interface PackagedProductMovement {
  id: number;
  packaged_product_id: number;
  product_name?: string;
  packaging_size?: string;
  movement_type: 'production' | 'sales' | 'adjustment' | 'return' | 'transfer';
  quantity: number;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
}

export interface CreatePackagedProductMovementInput {
  packaged_product_id: number;
  movement_type: 'production' | 'sales' | 'adjustment' | 'return' | 'transfer';
  quantity: number;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
}

// Supplier
export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierInput {
  name: string;
  code: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active: boolean;
  notes?: string;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {
  id: number;
}

// Purchase Indent
export interface PurchaseIndent {
  id: number;
  indent_number: string;
  department: string;
  request_date: string;
  required_by_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  approved_at?: string;
  approved_by?: number;
  approved_by_name?: string;
  items: PurchaseIndentItem[];
}

export interface PurchaseIndentItem {
  id: number;
  indent_id: number;
  inventory_item_id: number;
  item_name?: string;
  quantity: number;
  unit_of_measure: string;
  estimated_price?: number;
  notes?: string;
}

export interface CreatePurchaseIndentInput {
  department: string;
  request_date: string;
  required_by_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  items: {
    inventory_item_id: number;
    quantity: number;
    unit_of_measure: string;
    estimated_price?: number;
    notes?: string;
  }[];
}

// Purchase Order
export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name?: string;
  indent_id?: number;
  order_date: string;
  expected_delivery_date: string;
  delivery_address?: string;
  status: 'pending' | 'approved' | 'partially_received' | 'received' | 'cancelled';
  payment_terms?: string;
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  approved_at?: string;
  approved_by?: number;
  approved_by_name?: string;
  items: PurchaseOrderItem[];
  total_amount: number;
  total_tax_amount: number;
  grand_total: number;
}

export interface PurchaseOrderItem {
  id: number;
  po_id: number;
  inventory_item_id: number;
  item_name?: string;
  indent_item_id?: number;
  quantity: number;
  unit_of_measure: string;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  hsn_code?: string;
  notes?: string;
  received_quantity: number;
}

export interface CreatePurchaseOrderInput {
  supplier_id: number;
  indent_id?: number;
  order_date: string;
  expected_delivery_date: string;
  delivery_address?: string;
  status: 'pending' | 'approved';
  payment_terms?: string;
  notes?: string;
  items: {
    inventory_item_id: number;
    indent_item_id?: number;
    quantity: number;
    unit_of_measure: string;
    unit_price: number;
    tax_rate: number;
    discount_amount: number;
    hsn_code?: string;
    notes?: string;
  }[];
}

// Purchase Receipt
export interface PurchaseReceipt {
  id: number;
  receipt_number: string;
  po_id: number;
  po_number?: string;
  supplier_id?: number;
  supplier_name?: string;
  receipt_date: string;
  supplier_invoice_number?: string;
  supplier_invoice_date?: string;
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  items: PurchaseReceiptItem[];
}

export interface PurchaseReceiptItem {
  id: number;
  receipt_id: number;
  po_item_id: number;
  inventory_item_id: number;
  item_name?: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  rejection_reason?: string;
  batch_number?: string;
  expiry_date?: string;
  notes?: string;
}

export interface CreatePurchaseReceiptInput {
  po_id: number;
  receipt_date: string;
  supplier_invoice_number?: string;
  supplier_invoice_date?: string;
  notes?: string;
  items: {
    po_item_id: number;
    received_quantity: number;
    accepted_quantity: number;
    rejected_quantity: number;
    rejection_reason?: string;
    batch_number?: string;
    expiry_date?: string;
    notes?: string;
  }[];
}

// Bill of Material (Recipe)
export interface BillOfMaterial {
  id: number;
  product_id: number;
  product_name?: string;
  name: string;
  description?: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items: BOMItem[];
}

export interface BOMItem {
  id: number;
  bom_id: number;
  inventory_item_id: number;
  item_name?: string;
  quantity: number;
  unit_of_measure: string;
  notes?: string;
}

export interface CreateBOMInput {
  product_id: number;
  name: string;
  description?: string;
  version: string;
  is_active: boolean;
  items: {
    inventory_item_id: number;
    quantity: number;
    unit_of_measure: string;
    notes?: string;
  }[];
}

// Production Batch
export interface ProductionBatch {
  id: number;
  batch_number: string;
  product_id: number;
  product_name?: string;
  bom_id: number;
  planned_quantity: number;
  produced_quantity?: number;
  production_date: string;
  completion_date?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  packaged_items: ProductionBatchPackagedItem[];
}

export interface ProductionBatchPackagedItem {
  id: number;
  batch_id: number;
  packaged_product_id: number;
  product_name?: string;
  packaging_size?: string;
  quantity: number;
  produced_quantity?: number;
  notes?: string;
}

export interface CreateProductionBatchInput {
  product_id: number;
  bom_id: number;
  planned_quantity: number;
  production_date: string;
  status: 'planned';
  notes?: string;
  packaged_items: {
    packaged_product_id: number;
    quantity: number;
    notes?: string;
  }[];
}

// Gate Pass
export interface GatePass {
  id: number;
  pass_number: string;
  pass_type: 'inward' | 'outward';
  pass_date: string;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  party_name?: string;
  vehicle_number?: string;
  driver_name?: string;
  driver_contact?: string;
  status: 'pending' | 'approved' | 'completed';
  notes?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  approved_at?: string;
  approved_by?: number;
  approved_by_name?: string;
  items: GatePassItem[];
}

export interface GatePassItem {
  id: number;
  gate_pass_id: number;
  item_type: 'raw_material' | 'packaged_product';
  item_id: number;
  item_name?: string;
  quantity: number;
  unit_of_measure: string;
  description?: string;
}

export interface CreateGatePassInput {
  pass_type: 'inward' | 'outward';
  pass_date: string;
  reference_number?: string;
  reference_type?: string;
  reference_id?: number;
  party_name?: string;
  vehicle_number?: string;
  driver_name?: string;
  driver_contact?: string;
  notes?: string;
  items: {
    item_type: 'raw_material' | 'packaged_product';
    item_id: number;
    quantity: number;
    unit_of_measure: string;
    description?: string;
  }[];
}

// Company
export interface Company {
  id: number;
  name: string;
  code: string;
  gst_number: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Customer
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst_number?: string;
  pan_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Invoice
export interface Invoice {
  id: number;
  invoice_number: string;
  company_id: number;
  company_name?: string;
  customer_id: number;
  customer_name?: string;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  notes?: string;
  terms?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  product_name?: string;
  description: string;
  quantity: number;
  unit_price: number;
  hsn_code: string;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  cess_rate: number;
  discount: number;
  amount: number;
}

export interface CreateInvoiceInput {
  company_id: number;
  customer_id: number;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent';
  notes?: string;
  terms?: string;
  items: {
    product_id: number;
    description: string;
    quantity: number;
    unit_price: number;
    hsn_code: string;
    cgst_rate: number;
    sgst_rate: number;
    igst_rate: number;
    cess_rate: number;
    discount: number;
  }[];
}

// Service functions
const inventoryService = {
  // Inventory Items
  getInventoryItems: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/inventory/items?${queryString}` : '/api/inventory/items';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getInventoryItem: async (id: number) => {
    return await apiRequest(`/api/inventory/items/${id}`, {
      method: 'GET'
    });
  },
  
  createInventoryItem: async (data: CreateInventoryItemInput) => {
    return await apiRequest('/api/inventory/items', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  updateInventoryItem: async (id: number, data: Partial<CreateInventoryItemInput>) => {
    return await apiRequest(`/api/inventory/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  deleteInventoryItem: async (id: number) => {
    return await apiRequest(`/api/inventory/items/${id}`, {
      method: 'DELETE'
    });
  },
  
  getInventoryStockStatus: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/inventory/items/stock-status?${queryString}` : '/api/inventory/items/stock-status';
    return await apiRequest(url, { method: 'GET' });
  },
  
  // Stock Movements
  createStockMovement: async (data: CreateStockMovementInput) => {
    return await apiRequest('/api/inventory/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  getStockMovements: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/inventory/stock-movements?${queryString}` : '/api/inventory/stock-movements';
    return await apiRequest(url, { method: 'GET' });
  },
  
  // Packaged Products
  getPackagedProducts: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/packaged-products?${queryString}` : '/api/packaged-products';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getPackagedProduct: async (id: number) => {
    return await apiRequest(`/api/packaged-products/${id}`, {
      method: 'GET'
    });
  },
  
  createPackagedProduct: async (data: CreatePackagedProductInput) => {
    return await apiRequest('/api/packaged-products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  updatePackagedProduct: async (id: number, data: Partial<CreatePackagedProductInput>) => {
    return await apiRequest(`/api/packaged-products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  deletePackagedProduct: async (id: number) => {
    return await apiRequest(`/api/packaged-products/${id}`, {
      method: 'DELETE'
    });
  },
  
  createPackagedProductMovement: async (data: CreatePackagedProductMovementInput) => {
    return await apiRequest('/api/packaged-products/movements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  getPackagedProductStockStatus: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/packaged-products/stock-status?${queryString}` : '/api/packaged-products/stock-status';
    return await apiRequest(url, { method: 'GET' });
  },
  
  // Suppliers
  getSuppliers: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/purchase/suppliers?${queryString}` : '/api/purchase/suppliers';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getSupplier: async (id: number) => {
    return await apiRequest(`/api/purchase/suppliers/${id}`, {
      method: 'GET'
    });
  },
  
  createSupplier: async (data: CreateSupplierInput) => {
    return await apiRequest('/api/purchase/suppliers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  updateSupplier: async (id: number, data: Partial<CreateSupplierInput>) => {
    return await apiRequest(`/api/purchase/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  deleteSupplier: async (id: number) => {
    return await apiRequest(`/api/purchase/suppliers/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Purchase Indents
  getPurchaseIndents: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/purchase/indents?${queryString}` : '/api/purchase/indents';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getPurchaseIndent: async (id: number) => {
    return await apiRequest(`/api/purchase/indents/${id}`, {
      method: 'GET'
    });
  },
  
  createPurchaseIndent: async (data: CreatePurchaseIndentInput) => {
    return await apiRequest('/api/purchase/indents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  approvePurchaseIndent: async (id: number) => {
    return await apiRequest(`/api/purchase/indents/${id}/approve`, {
      method: 'PUT'
    });
  },
  
  // Purchase Orders
  getPurchaseOrders: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/purchase/orders?${queryString}` : '/api/purchase/orders';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getPurchaseOrder: async (id: number) => {
    return await apiRequest(`/api/purchase/orders/${id}`, {
      method: 'GET'
    });
  },
  
  createPurchaseOrder: async (data: CreatePurchaseOrderInput) => {
    return await apiRequest('/api/purchase/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  approvePurchaseOrder: async (id: number) => {
    return await apiRequest(`/api/purchase/orders/${id}/approve`, {
      method: 'PUT'
    });
  },
  
  // Purchase Receipts
  getPurchaseReceipts: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/purchase/receipts?${queryString}` : '/api/purchase/receipts';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getPurchaseReceipt: async (id: number) => {
    return await apiRequest(`/api/purchase/receipts/${id}`, {
      method: 'GET'
    });
  },
  
  createPurchaseReceipt: async (data: CreatePurchaseReceiptInput) => {
    return await apiRequest('/api/purchase/receipts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // Bill of Materials
  getBOMs: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/production/bom?${queryString}` : '/api/production/bom';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getBOM: async (id: number) => {
    return await apiRequest(`/api/production/bom/${id}`, {
      method: 'GET'
    });
  },
  
  createBOM: async (data: CreateBOMInput) => {
    return await apiRequest('/api/production/bom', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // Production Batches
  getProductionBatches: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/production/batches?${queryString}` : '/api/production/batches';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getProductionBatch: async (id: number) => {
    return await apiRequest(`/api/production/batches/${id}`, {
      method: 'GET'
    });
  },
  
  createProductionBatch: async (data: CreateProductionBatchInput) => {
    return await apiRequest('/api/production/batches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  startProductionBatch: async (id: number) => {
    return await apiRequest(`/api/production/batches/${id}/start`, {
      method: 'PUT'
    });
  },
  
  completeProductionBatch: async (id: number, producedQuantity: number) => {
    return await apiRequest(`/api/production/batches/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ produced_quantity: producedQuantity })
    });
  },
  
  deleteProductionBatch: async (id: number) => {
    return await apiRequest(`/api/production/batches/${id}`, {
      method: 'DELETE'
    });
  },
  
  getMaterialRequirements: async (productId: number, quantity: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append('product_id', productId.toString());
    queryParams.append('quantity', quantity.toString());
    return await apiRequest(`/api/production/material-requirements?${queryParams.toString()}`, {
      method: 'GET'
    });
  },
  
  // Gate Passes
  getGatePasses: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/gate-pass?${queryString}` : '/api/gate-pass';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getGatePass: async (id: number) => {
    return await apiRequest(`/api/gate-pass/${id}`, {
      method: 'GET'
    });
  },
  
  createGatePass: async (data: CreateGatePassInput) => {
    return await apiRequest('/api/gate-pass', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  approveGatePass: async (id: number) => {
    return await apiRequest(`/api/gate-pass/${id}/approve`, {
      method: 'PUT'
    });
  },
  
  printGatePass: async (id: number) => {
    return await apiRequest(`/api/gate-pass/print/${id}`, {
      method: 'GET'
    });
  },
  
  // Companies
  getCompanies: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/companies?${queryString}` : '/api/companies';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getCompany: async (id: number) => {
    return await apiRequest(`/api/companies/${id}`, {
      method: 'GET'
    });
  },
  
  // Customers
  getCustomers: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/customers?${queryString}` : '/api/customers';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getCustomer: async (id: number) => {
    return await apiRequest(`/api/customers/${id}`, {
      method: 'GET'
    });
  },
  
  // Products
  getProducts: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getProduct: async (id: number) => {
    return await apiRequest(`/api/products/${id}`, {
      method: 'GET'
    });
  },
  
  // Invoices
  getInvoices: async (params?: any) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/api/invoices?${queryString}` : '/api/invoices';
    return await apiRequest(url, { method: 'GET' });
  },
  
  getInvoice: async (id: number) => {
    return await apiRequest(`/api/invoices/${id}`, {
      method: 'GET'
    });
  },
  
  createInvoice: async (data: CreateInvoiceInput) => {
    return await apiRequest('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  updateInvoiceStatus: async (id: number, status: 'draft' | 'sent' | 'paid' | 'cancelled') => {
    return await apiRequest(`/api/invoices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },
  
  deleteInvoice: async (id: number) => {
    return await apiRequest(`/api/invoices/${id}`, {
      method: 'DELETE'
    });
  },
  
  printInvoice: async (id: number) => {
    return await apiRequest(`/api/invoices/print/${id}`, {
      method: 'GET'
    });
  },
  
  // Reports
  generateReport: async (data: { report_id: string, format: string, parameters: Record<string, any> }) => {
    return await apiRequest('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default inventoryService;
