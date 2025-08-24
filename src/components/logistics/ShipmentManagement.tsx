import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ShipmentList from './ShipmentList';
import ShipmentDetail from './ShipmentDetail';
import ShipmentForm from './ShipmentForm';
import { Shipment } from '../../types/shipment';

enum ViewMode {
  LIST,
  DETAIL,
  CREATE,
  EDIT,
}

const ShipmentManagement: React.FC = () => {
  const { userRole } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  useEffect(() => {
    if (selectedShipmentId) {
      fetchShipmentDetails(selectedShipmentId);
    }
  }, [selectedShipmentId]);
  
  const fetchShipmentDetails = async (shipmentId: number) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with a mock fetch
      const response = await fetch(`/api/shipments/${shipmentId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedShipment(data);
      } else {
        throw new Error('Failed to fetch shipment details');
      }
    } catch (error) {
      console.error('Error fetching shipment details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load shipment details',
        severity: 'error',
      });
    }
  };

  const handleViewShipment = (shipmentId: number) => {
    setSelectedShipmentId(shipmentId);
    setViewMode(ViewMode.DETAIL);
  };

  const handleEditShipment = (shipmentId: number) => {
    setSelectedShipmentId(shipmentId);
    setViewMode(ViewMode.EDIT);
  };

  const handleCreateShipment = () => {
    setSelectedShipmentId(null);
    setViewMode(ViewMode.CREATE);
  };

  const handleBackToList = () => {
    setViewMode(ViewMode.LIST);
    setSelectedShipmentId(null);
  };

  const handleShipmentSaved = () => {
    setSnackbar({
      open: true,
      message: selectedShipmentId
        ? 'Shipment updated successfully!'
        : 'Shipment created successfully!',
      severity: 'success',
    });
    setViewMode(ViewMode.LIST);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.DETAIL:
        return selectedShipment ? (
          <ShipmentDetail
            shipment={selectedShipment}
            onBack={handleBackToList}
            userRole={userRole || 'customer'}
          />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading shipment details...</Typography>
          </Box>
        );
      case ViewMode.CREATE:
      case ViewMode.EDIT:
        return (
          <ShipmentForm
            shipmentId={viewMode === ViewMode.EDIT ? selectedShipmentId! : undefined}
            open={true}
            onClose={handleBackToList}
            onSave={handleShipmentSaved}
          />
        );
      case ViewMode.LIST:
      default:
        return (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Shipment Management</Typography>
              {(userRole === 'admin' || userRole === 'seller') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateShipment}
                >
                  Create Shipment
                </Button>
              )}
            </Box>
            <ShipmentList
              onViewShipment={handleViewShipment}
              onEditShipment={handleEditShipment}
            />
          </>
        );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {renderContent()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ShipmentManagement;
