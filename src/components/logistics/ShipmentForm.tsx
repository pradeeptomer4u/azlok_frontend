import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../../context/AuthContext';

interface ShipmentFormProps {
  shipmentId?: number;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface LogisticsProvider {
  id: number;
  name: string;
  code: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
}

interface Address {
  contact_name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_phone?: string;
  contact_email?: string;
}

interface ShipmentFormData {
  order_id: number;
  logistics_provider_id: number;
  tracking_number?: string;
  waybill_number?: string;
  status: string;
  estimated_delivery_date?: Date | null;
  shipping_cost: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  pickup_address: Address;
  delivery_address: Address;
  special_instructions?: string;
  signature_required: boolean;
  is_insured: boolean;
  insurance_amount: number;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({
  shipmentId,
  open,
  onClose,
  onSave,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<LogisticsProvider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<ShipmentFormData>({
    order_id: 0,
    logistics_provider_id: 0,
    status: 'pending',
    shipping_cost: 0,
    pickup_address: {
      contact_name: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      contact_phone: '',
      contact_email: '',
    },
    delivery_address: {
      contact_name: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      contact_phone: '',
      contact_email: '',
    },
    signature_required: false,
    is_insured: false,
    insurance_amount: 0,
  });

  useEffect(() => {
    if (open) {
      fetchLogisticsProviders();
      fetchOrders();
      if (shipmentId) {
        fetchShipmentDetails();
      }
    }
  }, [open, shipmentId]);

  const fetchLogisticsProviders = async () => {
    try {
      const response = await fetch('/api/logistics/providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch logistics providers');
      }
      
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching logistics providers:', error);
      setError('Failed to load logistics providers. Please try again.');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?status=confirmed&limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    }
  };

  const fetchShipmentDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logistics/shipments/${shipmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipment details');
      }
      
      const data = await response.json();
      
      // Convert API data to form data format
      setFormData({
        order_id: data.order_id,
        logistics_provider_id: data.logistics_provider.id,
        tracking_number: data.tracking_number,
        waybill_number: data.waybill_number,
        status: data.status,
        estimated_delivery_date: data.estimated_delivery_date ? new Date(data.estimated_delivery_date) : null,
        shipping_cost: data.shipping_cost,
        weight: data.weight,
        dimensions: data.dimensions,
        pickup_address: data.pickup_address,
        delivery_address: data.delivery_address,
        special_instructions: data.special_instructions,
        signature_required: data.signature_required,
        is_insured: data.is_insured,
        insurance_amount: data.insurance_amount,
      });
    } catch (error) {
      console.error('Error fetching shipment details:', error);
      setError('Failed to load shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      estimated_delivery_date: date,
    });
  };

  const handleAddressChange = (type: 'pickup_address' | 'delivery_address', field: keyof Address, value: string) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: value,
      },
    });
  };

  const handleDimensionsChange = (field: keyof typeof formData.dimensions, value: string) => {
    const dimensions = formData.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm',
    };
    
    setFormData({
      ...formData,
      dimensions: {
        ...dimensions,
        [field]: field === 'unit' ? value : parseFloat(value) || 0,
      },
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        estimated_delivery_date: formData.estimated_delivery_date
          ? formData.estimated_delivery_date.toISOString().split('T')[0]
          : undefined,
      };
      
      const url = shipmentId
        ? `/api/logistics/shipments/${shipmentId}`
        : '/api/logistics/shipments';
      
      const method = shipmentId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save shipment');
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving shipment:', error);
      setError('Failed to save shipment. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOrderSelect = async (orderId: number) => {
    if (!orderId) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const orderData = await response.json();
      
      // Pre-fill delivery address from order
      if (orderData.shipping_address) {
        setFormData({
          ...formData,
          order_id: orderId,
          delivery_address: {
            contact_name: orderData.customer_name || '',
            street: orderData.shipping_address.street || '',
            city: orderData.shipping_address.city || '',
            state: orderData.shipping_address.state || '',
            postal_code: orderData.shipping_address.postal_code || '',
            country: orderData.shipping_address.country || 'India',
            contact_phone: orderData.shipping_address.phone || '',
            contact_email: orderData.customer_email || '',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {shipmentId ? 'Edit Shipment' : 'Create New Shipment'}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Order</InputLabel>
                  <Select
                    name="order_id"
                    value={formData.order_id.toString()}
                    onChange={(e) => {
                      handleSelectChange(e);
                      handleOrderSelect(parseInt(e.target.value));
                    }}
                    label="Order"
                    disabled={!!shipmentId} // Disable changing order for existing shipments
                  >
                    <MenuItem value="0">Select an order</MenuItem>
                    {orders.map((order) => (
                      <MenuItem key={order.id} value={order.id.toString()}>
                        #{order.order_number} - {order.customer_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Logistics Provider</InputLabel>
                  <Select
                    name="logistics_provider_id"
                    value={formData.logistics_provider_id.toString()}
                    onChange={handleSelectChange}
                    label="Logistics Provider"
                  >
                    <MenuItem value="0">Select a provider</MenuItem>
                    {providers.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id.toString()}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="tracking_number"
                  label="Tracking Number"
                  value={formData.tracking_number || ''}
                  onChange={handleChange}
                  fullWidth
                  disabled={!shipmentId} // Auto-generated for new shipments
                  helperText={!shipmentId ? "Will be auto-generated" : ""}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="waybill_number"
                  label="Waybill Number"
                  value={formData.waybill_number || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="picked_up">Picked Up</MenuItem>
                    <MenuItem value="in_transit">In Transit</MenuItem>
                    <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="returned">Returned</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Estimated Delivery Date"
                    value={formData.estimated_delivery_date}
                    onChange={handleDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  name="shipping_cost"
                  label="Shipping Cost"
                  type="number"
                  value={formData.shipping_cost}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="signature_required"
                      checked={formData.signature_required}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Signature Required"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Dimensions
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="Length"
                  type="number"
                  value={formData.dimensions?.length || ''}
                  onChange={(e) => handleDimensionsChange('length', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="Width"
                  type="number"
                  value={formData.dimensions?.width || ''}
                  onChange={(e) => handleDimensionsChange('width', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="Height"
                  type="number"
                  value={formData.dimensions?.height || ''}
                  onChange={(e) => handleDimensionsChange('height', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.dimensions?.unit || 'cm'}
                    onChange={(e) => handleDimensionsChange('unit', e.target.value)}
                    label="Unit"
                  >
                    <MenuItem value="cm">cm</MenuItem>
                    <MenuItem value="in">in</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Insurance
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_insured"
                      checked={formData.is_insured}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Insure Shipment"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="insurance_amount"
                  label="Insurance Amount"
                  type="number"
                  value={formData.insurance_amount}
                  onChange={handleChange}
                  fullWidth
                  disabled={!formData.is_insured}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="special_instructions"
                  label="Special Instructions"
                  value={formData.special_instructions || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Pickup Address
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Name"
                  value={formData.pickup_address.contact_name}
                  onChange={(e) => handleAddressChange('pickup_address', 'contact_name', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Phone"
                  value={formData.pickup_address.contact_phone || ''}
                  onChange={(e) => handleAddressChange('pickup_address', 'contact_phone', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  value={formData.pickup_address.street}
                  onChange={(e) => handleAddressChange('pickup_address', 'street', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="City"
                  value={formData.pickup_address.city}
                  onChange={(e) => handleAddressChange('pickup_address', 'city', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="State"
                  value={formData.pickup_address.state}
                  onChange={(e) => handleAddressChange('pickup_address', 'state', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Postal Code"
                  value={formData.pickup_address.postal_code}
                  onChange={(e) => handleAddressChange('pickup_address', 'postal_code', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Country"
                  value={formData.pickup_address.country}
                  onChange={(e) => handleAddressChange('pickup_address', 'country', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Email"
                  value={formData.pickup_address.contact_email || ''}
                  onChange={(e) => handleAddressChange('pickup_address', 'contact_email', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Delivery Address
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Name"
                  value={formData.delivery_address.contact_name}
                  onChange={(e) => handleAddressChange('delivery_address', 'contact_name', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Phone"
                  value={formData.delivery_address.contact_phone || ''}
                  onChange={(e) => handleAddressChange('delivery_address', 'contact_phone', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  value={formData.delivery_address.street}
                  onChange={(e) => handleAddressChange('delivery_address', 'street', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="City"
                  value={formData.delivery_address.city}
                  onChange={(e) => handleAddressChange('delivery_address', 'city', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="State"
                  value={formData.delivery_address.state}
                  onChange={(e) => handleAddressChange('delivery_address', 'state', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  label="Postal Code"
                  value={formData.delivery_address.postal_code}
                  onChange={(e) => handleAddressChange('delivery_address', 'postal_code', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Country"
                  value={formData.delivery_address.country}
                  onChange={(e) => handleAddressChange('delivery_address', 'country', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Email"
                  value={formData.delivery_address.contact_email || ''}
                  onChange={(e) => handleAddressChange('delivery_address', 'contact_email', e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={saving || loading}
        >
          {saving ? <CircularProgress size={24} /> : shipmentId ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShipmentForm;
