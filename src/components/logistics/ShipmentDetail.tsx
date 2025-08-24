import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface ShipmentDetailProps {
  shipmentId: number;
  onBack: () => void;
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
  created_at: string;
  updated_at?: string;
  logistics_provider: {
    id: number;
    name: string;
    code: string;
  };
  tracking_updates: TrackingUpdate[];
  delivery_attempts: DeliveryAttempt[];
}

interface TrackingUpdate {
  id: number;
  shipment_id: number;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
  created_at: string;
}

interface DeliveryAttempt {
  id: number;
  shipment_id: number;
  attempt_number: number;
  status: string;
  timestamp: string;
  notes?: string;
  delivery_person?: string;
  contact_made: boolean;
  signature_image_url?: string;
  proof_of_delivery_url?: string;
  created_at: string;
}

interface Address {
  contact_name?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  contact_phone?: string;
}

interface TrackingUpdateFormData {
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipmentId, onBack }) => {
  const { token, userRole } = useAuth();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openTrackingDialog, setOpenTrackingDialog] = useState<boolean>(false);
  const [trackingFormData, setTrackingFormData] = useState<TrackingUpdateFormData>({
    status: 'in_transit',
    location: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
  });

  useEffect(() => {
    fetchShipmentDetails();
  }, [shipmentId, token]);

  const fetchShipmentDetails = async () => {
    setLoading(true);
    setError(null);
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
      setShipment(data);
    } catch (error: unknown) {
      console.error('Error fetching shipment details:', error);
      setError('Failed to load shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrackingUpdate = async () => {
    try {
      const response = await fetch('/api/logistics/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
          status: trackingFormData.status,
          location: trackingFormData.location,
          description: trackingFormData.description,
          timestamp: new Date(trackingFormData.timestamp).toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add tracking update');
      }
      
      // Refresh shipment details
      fetchShipmentDetails();
      setOpenTrackingDialog(false);
      
      // Reset form
      setTrackingFormData({
        status: 'in_transit',
        location: '',
        description: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    } catch (error: unknown) {
      console.error('Error adding tracking update:', error);
      setError('Failed to add tracking update. Please try again.');
    }
  };

  const handleTrackingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrackingFormData({
      ...trackingFormData,
      [name]: value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: string }>) => {
    setTrackingFormData({
      ...trackingFormData,
      status: e.target.value,
    });
  };

  // For Chip component
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
  
  // For TimelineDot component
  const getTimelineDotColor = (status: string): 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary' | 'inherit' | 'grey' => {
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
        return 'grey';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon color="success" />;
      case 'failed':
      case 'cancelled':
        return <ErrorIcon color="error" />;
      default:
        return <ShippingIcon color="primary" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return 'N/A';
    
    return (
      <>
        {address.contact_name && <div><strong>{address.contact_name}</strong></div>}
        <div>{address.street}</div>
        <div>{address.city}, {address.state} {address.postal_code}</div>
        <div>{address.country}</div>
        {address.contact_phone && <div>Phone: {address.contact_phone}</div>}
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Shipments
        </Button>
      </Box>
    );
  }

  if (!shipment) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Shipment not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          Back to Shipments
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Shipments
        </Button>
        {(userRole === 'admin' || userRole === 'seller') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenTrackingDialog(true)}
          >
            Add Tracking Update
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipment Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Shipment ID</Typography>
                  <Typography variant="body2">{shipment.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Order ID</Typography>
                  <Typography variant="body2">{shipment.order_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Tracking Number</Typography>
                  <Typography variant="body2">{shipment.tracking_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Waybill Number</Typography>
                  <Typography variant="body2">{shipment.waybill_number || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={formatStatus(shipment.status)}
                    color={getStatusColor(shipment.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Logistics Provider</Typography>
                  <Typography variant="body2">{shipment.logistics_provider.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created Date</Typography>
                  <Typography variant="body2">
                    {format(new Date(shipment.created_at), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Estimated Delivery</Typography>
                  <Typography variant="body2">
                    {shipment.estimated_delivery_date
                      ? format(new Date(shipment.estimated_delivery_date), 'MMM dd, yyyy')
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Actual Delivery</Typography>
                  <Typography variant="body2">
                    {shipment.actual_delivery_date
                      ? format(new Date(shipment.actual_delivery_date), 'MMM dd, yyyy HH:mm')
                      : 'Not delivered yet'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Shipping Cost</Typography>
                  <Typography variant="body2">₹{shipment.shipping_cost.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Weight</Typography>
                  <Typography variant="body2">
                    {shipment.weight ? `${shipment.weight} kg` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Dimensions</Typography>
                  <Typography variant="body2">
                    {shipment.dimensions
                      ? `${shipment.dimensions.length} × ${shipment.dimensions.width} × ${shipment.dimensions.height} ${shipment.dimensions.unit}`
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Special Instructions</Typography>
                  <Typography variant="body2">
                    {shipment.special_instructions || 'None'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Signature Required</Typography>
                  <Typography variant="body2">
                    {shipment.signature_required ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Insurance</Typography>
                  <Typography variant="body2">
                    {shipment.is_insured
                      ? `Yes (₹${shipment.insurance_amount.toFixed(2)})`
                      : 'No'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Addresses
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Pickup Address
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {formatAddress(shipment.pickup_address)}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Delivery Address
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {formatAddress(shipment.delivery_address)}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Attempts
              </Typography>
              {shipment.delivery_attempts.length === 0 ? (
                <Typography variant="body2">No delivery attempts recorded yet.</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Attempt #</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shipment.delivery_attempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>{attempt.attempt_number}</TableCell>
                          <TableCell>
                            {format(new Date(attempt.timestamp), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={formatStatus(attempt.status)}
                              color={
                                attempt.status === 'successful'
                                  ? 'success'
                                  : attempt.status === 'failed'
                                  ? 'error'
                                  : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{attempt.notes || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tracking History
              </Typography>
              {shipment.tracking_updates.length === 0 ? (
                <Typography variant="body2">No tracking updates available.</Typography>
              ) : (
                <Timeline position="alternate">
                  {shipment.tracking_updates
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((update, index) => (
                      <TimelineItem key={update.id}>
                        <TimelineOppositeContent color="text.secondary">
                          {format(new Date(update.timestamp), 'MMM dd, yyyy HH:mm')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                              color={getTimelineDotColor(update.status)}
                          >
                            {getStatusIcon(update.status)}
                          </TimelineDot>
                          {index < shipment.tracking_updates.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="subtitle2">
                              {formatStatus(update.status)}
                            </Typography>
                            {update.location && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                                {update.location}
                              </Typography>
                            )}
                            {update.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {update.description}
                              </Typography>
                            )}
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                </Timeline>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Tracking Update Dialog */}
      <Dialog open={openTrackingDialog} onClose={() => setOpenTrackingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Tracking Update</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                name="status"
                label="Status"
                value={trackingFormData.status}
                onChange={handleStatusChange}
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                value={trackingFormData.location}
                onChange={handleTrackingFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={trackingFormData.description}
                onChange={handleTrackingFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="timestamp"
                label="Timestamp"
                type="datetime-local"
                value={trackingFormData.timestamp}
                onChange={handleTrackingFormChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTrackingDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTrackingUpdate} variant="contained" color="primary">
            Add Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShipmentDetail;
