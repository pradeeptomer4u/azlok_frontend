import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { Shipment, ShipmentStatus, TrackingUpdate } from '../../types/shipment';
import { Address } from '../../types/address';

interface ShipmentDetailProps {
  shipment: Shipment;
  onBack: () => void;
  onAddTrackingUpdate?: (data: Partial<TrackingUpdate>) => Promise<void>;
  userRole?: string;
}

const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`;
};

const formatStatus = (status: ShipmentStatus): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getStatusColor = (status: ShipmentStatus): string => {
  switch (status) {
    case 'delivered':
      return '#4caf50';
    case 'in_transit':
    case 'picked_up':
      return '#2196f3';
    case 'out_for_delivery':
      return '#ff9800';
    case 'failed':
    case 'cancelled':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

const getTimelineDotColor = (status: ShipmentStatus): 'success' | 'primary' | 'warning' | 'error' | 'grey' => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'in_transit':
    case 'picked_up':
      return 'primary';
    case 'out_for_delivery':
      return 'warning';
    case 'failed':
    case 'cancelled':
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusIcon = (status: ShipmentStatus) => {
  switch (status) {
    case 'delivered':
      return <CheckCircleIcon />;
    case 'in_transit':
    case 'picked_up':
    case 'out_for_delivery':
      return <LocalShippingIcon />;
    case 'failed':
    case 'cancelled':
      return <ErrorIcon />;
    case 'pending':
      return <WarningIcon />;
    default:
      return <InfoIcon />;
  }
};

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({
  shipment,
  onBack,
  onAddTrackingUpdate,
  userRole = 'customer',
}) => {
  const [openTrackingDialog, setOpenTrackingDialog] = useState(false);
  const [trackingFormData, setTrackingFormData] = useState<Partial<TrackingUpdate>>({
    status: 'in_transit',
    location: '',
    description: '',
    timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const handleTrackingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrackingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as ShipmentStatus;
    setTrackingFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleAddTrackingUpdate = async () => {
    if (onAddTrackingUpdate) {
      await onAddTrackingUpdate(trackingFormData);
      setOpenTrackingDialog(false);
      setTrackingFormData({
        status: 'in_transit',
        location: '',
        description: '',
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  };

  if (!shipment) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Shipment not found
        </Typography>
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
    <div className="p-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipment Details
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Typography variant="subtitle2">Shipment ID</Typography>
                  <Typography variant="body2">{shipment.id}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Status</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(shipment.status),
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {formatStatus(shipment.status)}
                    </Typography>
                  </Box>
                </div>
                <div>
                  <Typography variant="subtitle2">Tracking Number</Typography>
                  <Typography variant="body2">{shipment.tracking_number}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Carrier</Typography>
                  <Typography variant="body2">{shipment.carrier_name}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Created Date</Typography>
                  <Typography variant="body2">
                    {format(new Date(shipment.created_at), 'MMM dd, yyyy')}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Estimated Delivery</Typography>
                  <Typography variant="body2">
                    {shipment.estimated_delivery_date
                      ? format(new Date(shipment.estimated_delivery_date), 'MMM dd, yyyy')
                      : 'Not available'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Weight</Typography>
                  <Typography variant="body2">{shipment.weight} kg</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Dimensions</Typography>
                  <Typography variant="body2">
                    {shipment.dimensions
                      ? `${shipment.dimensions.length} × ${shipment.dimensions.width} × ${shipment.dimensions.height} cm`
                      : 'Not available'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Insurance</Typography>
                  <Typography variant="body2">
                    {shipment.is_insured
                      ? `Yes (₹${shipment.insurance_amount.toFixed(2)})`
                      : 'No'}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Addresses
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Pickup Address
                  </Typography>
                  <Typography variant="body2">
                    {formatAddress(shipment.pickup_address)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Delivery Address
                  </Typography>
                  <Typography variant="body2">
                    {formatAddress(shipment.delivery_address)}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Package Items
              </Typography>
              {shipment.package_items.length === 0 ? (
                <Typography variant="body2">No items in this shipment.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shipment.package_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.weight ? `${item.weight} kg` : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Attempts
              </Typography>
              {shipment.delivery_attempts.length === 0 ? (
                <Typography variant="body2">No delivery attempts recorded.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shipment.delivery_attempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>
                            {format(new Date(attempt.timestamp), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>{attempt.status}</TableCell>
                          <TableCell>{attempt.notes || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
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
                          <Typography variant="h6" component="h3">
                            {formatStatus(update.status)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {update.location}
                          </Typography>
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
      </div>

      {/* Add Tracking Update Dialog */}
      <Dialog open={openTrackingDialog} onClose={() => setOpenTrackingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Tracking Update</DialogTitle>
        <DialogContent>
          <div className="mt-4 space-y-4">
            <div className="w-full">
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
            </div>
            <div className="w-full">
              <TextField
                name="location"
                label="Location"
                value={trackingFormData.location}
                onChange={handleTrackingFormChange}
                fullWidth
              />
            </div>
            <div className="w-full">
              <TextField
                name="description"
                label="Description"
                value={trackingFormData.description}
                onChange={handleTrackingFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </div>
            <div className="w-full">
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
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTrackingDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTrackingUpdate} variant="contained" color="primary">
            Add Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShipmentDetail;
