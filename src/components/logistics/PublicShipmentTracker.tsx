import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
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
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface ShipmentTrackingData {
  tracking_number: string;
  status: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  logistics_provider: {
    name: string;
    code: string;
  };
  tracking_updates: TrackingUpdate[];
}

interface TrackingUpdate {
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

const PublicShipmentTracker: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [shipment, setShipment] = useState<ShipmentTrackingData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(e.target.value);
  };

  const handleTrackShipment = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/logistics/public/track/${trackingNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Shipment not found. Please check the tracking number and try again.');
        }
        throw new Error('Failed to track shipment');
      }
      
      const data = await response.json();
      setShipment(data);
    } catch (error) {
      console.error('Error tracking shipment:', error);
      setError(error instanceof Error ? error.message : 'Failed to track shipment');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackShipment();
    }
  };

  const getStatusColor = (status: string) => {
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Track Your Shipment
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your tracking number to get real-time updates on your shipment
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Tracking Number"
            variant="outlined"
            fullWidth
            value={trackingNumber}
            onChange={handleTrackingNumberChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your tracking number"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrackShipment}
            startIcon={<SearchIcon />}
            disabled={loading}
            sx={{ minWidth: '120px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Track'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {shipment && (
        <Card>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tracking Number
                  </Typography>
                  <Typography variant="h6">
                    {shipment.tracking_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={formatStatus(shipment.status)}
                    color={getStatusColor(shipment.status) as any}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Logistics Provider
                  </Typography>
                  <Typography variant="body1">
                    {shipment.logistics_provider.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body1">
                    {shipment.estimated_delivery_date
                      ? format(new Date(shipment.estimated_delivery_date), 'MMM dd, yyyy')
                      : 'Not available'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Tracking History
            </Typography>
            
            {shipment.tracking_updates.length === 0 ? (
              <Alert severity="info">
                No tracking updates available yet. Please check back later.
              </Alert>
            ) : (
              <Timeline position="alternate">
                {shipment.tracking_updates
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((update, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {format(new Date(update.timestamp), 'MMM dd, yyyy HH:mm')}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getStatusColor(update.status) as any}>
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
      )}
    </Container>
  );
};

export default PublicShipmentTracker;
