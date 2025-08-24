import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UpiIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { PaymentMethod, PaymentMethodType } from '../../types/payment';
import { getPaymentMethods, deletePaymentMethod } from '../../services/paymentService';
import PaymentMethodForm from './PaymentMethodForm';

const PaymentMethodList: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await getPaymentMethods();
      setPaymentMethods(data);
      setError(null);
    } catch (err) {
      setError('Failed to load payment methods');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleAddMethod = () => {
    setEditMethod(null);
    setOpenForm(true);
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditMethod(method);
    setOpenForm(true);
  };

  const handleDeleteMethod = async (id: number) => {
    try {
      await deletePaymentMethod(id);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      setSnackbar({
        open: true,
        message: 'Payment method deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete payment method',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleFormClose = (refreshData: boolean = false) => {
    setOpenForm(false);
    if (refreshData) {
      fetchPaymentMethods();
    }
  };

  const getMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return <CreditCardIcon />;
      case PaymentMethodType.BANK_TRANSFER:
      case PaymentMethodType.NET_BANKING:
        return <BankIcon />;
      case PaymentMethodType.UPI:
        return <UpiIcon />;
      case PaymentMethodType.WALLET:
        return <WalletIcon />;
      default:
        return <CreditCardIcon />;
    }
  };

  const getMethodTypeLabel = (type: PaymentMethodType): string => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
        return 'Credit Card';
      case PaymentMethodType.DEBIT_CARD:
        return 'Debit Card';
      case PaymentMethodType.UPI:
        return 'UPI';
      case PaymentMethodType.NET_BANKING:
        return 'Net Banking';
      case PaymentMethodType.WALLET:
        return 'Wallet';
      case PaymentMethodType.COD:
        return 'Cash on Delivery';
      case PaymentMethodType.EMI:
        return 'EMI';
      case PaymentMethodType.BANK_TRANSFER:
        return 'Bank Transfer';
      default:
        return type;
    }
  };

  const getMethodDetails = (method: PaymentMethod): string => {
    switch (method.method_type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return `${method.provider} •••• ${method.card_last_four || '****'}`;
      case PaymentMethodType.UPI:
        return method.upi_id || '';
      case PaymentMethodType.BANK_TRANSFER:
        return `${method.bank_name || ''} •••• ${method.account_last_four || '****'}`;
      case PaymentMethodType.WALLET:
        return method.wallet_provider || '';
      default:
        return method.provider;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">Payment Methods</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddMethod}
        >
          Add Method
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : paymentMethods.length === 0 ? (
        <Alert severity="info">No payment methods found. Add your first payment method.</Alert>
      ) : (
        <Box>
          {paymentMethods.map((method) => (
            <Card key={method.id} sx={{ mb: 2, position: 'relative' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Box mr={2} display="flex" alignItems="center" justifyContent="center" sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}>
                      {getMethodIcon(method.method_type)}
                    </Box>
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" component="div" fontWeight="bold">
                          {getMethodTypeLabel(method.method_type)}
                        </Typography>
                        {method.is_default && (
                          <Chip 
                            label="Default" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {getMethodDetails(method)}
                      </Typography>
                      {method.method_type === PaymentMethodType.CREDIT_CARD || 
                       method.method_type === PaymentMethodType.DEBIT_CARD ? (
                        <Typography variant="body2" color="text.secondary">
                          Expires: {method.card_expiry_month}/{method.card_expiry_year}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditMethod(method)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => setConfirmDelete(method.id)}
                      aria-label="delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add/Edit Payment Method Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={() => handleFormClose(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMethod ? 'Edit Payment Method' : 'Add Payment Method'}
        </DialogTitle>
        <DialogContent>
          <PaymentMethodForm 
            paymentMethod={editMethod} 
            onSave={() => handleFormClose(true)}
            onCancel={() => handleFormClose(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment method? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button 
            onClick={() => confirmDelete !== null && handleDeleteMethod(confirmDelete)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentMethodList;
