import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

interface ShipmentListProps {
  onViewShipment: (shipmentId: number) => void;
  onEditShipment: (shipmentId: number) => void;
}

interface Shipment {
  id: number;
  order_id: number;
  tracking_number: string;
  waybill_number?: string;
  status: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  shipping_cost: number;
  created_at: string;
  updated_at?: string;
  logistics_provider: {
    id: number;
    name: string;
    code: string;
  };
}

interface ShipmentFilter {
  order_id?: number;
  logistics_provider_id?: number;
  status?: string;
  tracking_number?: string;
  waybill_number?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  page: number;
  limit: number;
}

interface LogisticsProvider {
  id: number;
  name: string;
  code: string;
}

const ShipmentList: React.FC<ShipmentListProps> = ({ onViewShipment, onEditShipment }) => {
  const { token, userRole } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalShipments, setTotalShipments] = useState<number>(0);
  const [providers, setProviders] = useState<LogisticsProvider[]>([]);
  const [filter, setFilter] = useState<ShipmentFilter>({
    page: 0,
    limit: 10,
  });

  useEffect(() => {
    fetchLogisticsProviders();
    fetchShipments();
  }, [token, filter.page, filter.limit]);

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
    }
  };

  const fetchShipments = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filter.order_id) params.append('order_id', filter.order_id.toString());
      if (filter.logistics_provider_id) params.append('logistics_provider_id', filter.logistics_provider_id.toString());
      if (filter.status) params.append('status', filter.status);
      if (filter.tracking_number) params.append('tracking_number', filter.tracking_number);
      if (filter.waybill_number) params.append('waybill_number', filter.waybill_number);
      if (filter.start_date) params.append('start_date', filter.start_date.toISOString());
      if (filter.end_date) params.append('end_date', filter.end_date.toISOString());
      
      params.append('page', (filter.page + 1).toString()); // API uses 1-based indexing
      params.append('limit', filter.limit.toString());
      
      const response = await fetch(`/api/logistics/shipments?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }
      
      const data = await response.json();
      setShipments(data);
      setTotalShipments(data.length); // In a real API, this would come from the response metadata
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setFilter({
      ...filter,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      limit: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleFilterChange = (name: keyof ShipmentFilter, value: any) => {
    setFilter({
      ...filter,
      [name]: value,
      page: 0, // Reset to first page when filter changes
    });
  };

  const handleSearch = () => {
    fetchShipments();
  };

  const handleClearFilters = () => {
    setFilter({
      page: 0,
      limit: 10,
    });
  };

  const getStatusColor = (status: string): 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary' | 'default' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
      case 'picked_up':
      case 'processing':
        return 'info';
      case 'out_for_delivery':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      case 'returned':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Shipments
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Order ID"
                type="number"
                fullWidth
                value={filter.order_id || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('order_id', e.target.value ? parseInt(e.target.value) : undefined)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Logistics Provider</InputLabel>
                <Select
                  value={filter.logistics_provider_id?.toString() || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('logistics_provider_id', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  label="Logistics Provider"
                >
                  <MenuItem value="">All Providers</MenuItem>
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status || ''}
                  onChange={(e: SelectChangeEvent) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Tracking Number"
                fullWidth
                value={filter.tracking_number || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('tracking_number', e.target.value || undefined)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Waybill Number"
                fullWidth
                value={filter.waybill_number || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('waybill_number', e.target.value || undefined)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={filter.start_date}
                  onChange={(date: Date | null) => handleFilterChange('start_date', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={filter.end_date}
                  onChange={(date: Date | null) => handleFilterChange('end_date', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  fullWidth
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Shipments
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchShipments}
            >
              Refresh
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Tracking Number</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Est. Delivery</TableCell>
                  <TableCell>Shipping Cost</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No shipments found
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>{shipment.id}</TableCell>
                      <TableCell>{shipment.order_id}</TableCell>
                      <TableCell>{shipment.tracking_number}</TableCell>
                      <TableCell>{shipment.logistics_provider.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(shipment.status)}
                          color={getStatusColor(shipment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {shipment.estimated_delivery_date
                          ? format(new Date(shipment.estimated_delivery_date), 'MMM dd, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>₹{shipment.shipping_cost.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(shipment.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewShipment(shipment.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {(userRole === 'admin' || userRole === 'seller') && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => onEditShipment(shipment.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalShipments}
            rowsPerPage={filter.limit}
            page={filter.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShipmentList;
