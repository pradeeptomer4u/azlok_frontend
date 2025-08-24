import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  FormControl,
  MenuItem,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  MoneyOff as RefundIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Payment, PaymentStatus, Transaction, TransactionType } from '../../types/payment';
import { getPayment, updatePayment, refundPayment, getTransactions } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';

interface PaymentDetailProps {
  paymentId: number;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ paymentId }) => {
  const router = useRouter();
  const { userRole } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState<boolean>(false);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundLoading, setRefundLoading] = useState<boolean>(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<PaymentStatus | ''>('');
  const [updateStatusLoading, setUpdateStatusLoading] = useState<boolean>(false);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const paymentData = await getPayment(paymentId);
      setPayment(paymentData);
      
      // Fetch transactions related to this payment
      const transactionsData = await getTransactions({ payment_id: paymentId });
      setTransactions(transactionsData);
      
      setError(null);
    } catch (err) {
      setError('Failed to load payment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId, fetchPaymentData]);

  const handleRefund = async () => {
    if (!payment) return;
    
    try {
      setRefundLoading(true);
      setRefundError(null);
      
      const amount = parseFloat(refundAmount);
      if (isNaN(amount) || amount <= 0) {
        setRefundError('Please enter a valid refund amount');
        return;
      }
      
      if (amount > (payment.amount - payment.refunded_amount)) {
        setRefundError('Refund amount cannot exceed the remaining payment amount');
        return;
      }
      
      await refundPayment(payment.id, amount, refundReason || undefined);
      setRefundDialogOpen(false);
      fetchPaymentData(); // Refresh data
    } catch (err: Error | unknown) {
      const error = err as Error;
      setRefundError(error.message || 'Failed to process refund');
      console.error(err);
    } finally {
      setRefundLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!payment || !newStatus) return;
    
    try {
      setUpdateStatusLoading(true);
      
      await updatePayment(payment.id, { status: newStatus });
      setUpdateStatusDialogOpen(false);
      fetchPaymentData(); // Refresh data
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary' | 'default' => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success';
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return 'warning';
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
      case PaymentStatus.EXPIRED:
        return 'error';
      case PaymentStatus.REFUNDED:
        return 'info';
      case PaymentStatus.PARTIALLY_PAID:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP p');
  };

  const canRefund = () => {
    if (!payment) return false;
    if (userRole !== 'admin') return false;
    
    return (
      payment.status === PaymentStatus.PAID &&
      payment.refunded_amount < payment.amount
    );
  };

  const canUpdateStatus = () => {
    if (!payment) return false;
    if (userRole !== 'admin' && userRole !== 'seller') return false;
    
    return true;
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYMENT:
        return 'Payment';
      case TransactionType.REFUND:
        return 'Refund';
      case TransactionType.CHARGEBACK:
        return 'Chargeback';
      case TransactionType.SETTLEMENT:
        return 'Settlement';
      case TransactionType.FEE:
        return 'Fee';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!payment) {
    return <Alert severity="info">Payment not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Payment Details
        </Typography>
        <Box>
          {canRefund() && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<RefundIcon />}
              onClick={() => setRefundDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Refund
            </Button>
          )}
          {canUpdateStatus() && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setUpdateStatusDialogOpen(true)}
            >
              Update Status
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 8', lg: 'span 8' } }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Reference
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {payment.payment_reference}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={payment.status.replace('_', ' ')}
                  color={getStatusColor(payment.status)}
                  size="small"
                />
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(payment.amount, payment.currency)}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Refunded Amount
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(payment.refunded_amount, payment.currency)}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(payment.payment_date)}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(payment.created_at)}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1">
                  {payment.order_id ? (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => router.push(`/orders/${payment.order_id}`)}
                    >
                      #{payment.order_id}
                    </Button>
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
              <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">
                  {payment.user_id ? (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => router.push(`/users/${payment.user_id}`)}
                    >
                      #{payment.user_id}
                    </Button>
                  ) : (
                    '-'
                  )}
                </Typography>
              </Grid>
              {payment.description && (
                <Grid component="div" sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {payment.description}
                  </Typography>
                </Grid>
              )}
              {payment.refund_reason && (
                <Grid component="div" sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Refund Reason
                  </Typography>
                  <Typography variant="body1">
                    {payment.refund_reason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {payment.payment_method && (
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Payment Method" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Method Type
                    </Typography>
                    <Typography variant="body1">
                      {payment.payment_method.method_type.replace('_', ' ')}
                    </Typography>
                  </Grid>
                  <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body1">
                      {payment.payment_method.provider}
                    </Typography>
                  </Grid>
                  {payment.payment_method.card_last_four && (
                    <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Card Number
                      </Typography>
                      <Typography variant="body1">
                        •••• •••• •••• {payment.payment_method.card_last_four}
                      </Typography>
                    </Grid>
                  )}
                  {payment.payment_method.card_holder_name && (
                    <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Card Holder
                      </Typography>
                      <Typography variant="body1">
                        {payment.payment_method.card_holder_name}
                      </Typography>
                    </Grid>
                  )}
                  {payment.payment_method.upi_id && (
                    <Grid component="div" sx={{ gridColumn: 'span 12' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        UPI ID
                      </Typography>
                      <Typography variant="body1">
                        {payment.payment_method.upi_id}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {payment.is_installment && payment.installment_plan_id && (
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Installment Plan" />
              <Divider />
              <CardContent>
                <Typography variant="body1">
                  This payment is part of an installment plan.
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => router.push(`/payments/installment-plans/${payment.installment_plan_id}`)}
                >
                  View Installment Plan
                </Button>
              </CardContent>
            </Card>
          )}

          {payment.gateway && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Gateway Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gateway
                    </Typography>
                    <Typography variant="body1">
                      {payment.gateway}
                    </Typography>
                  </Grid>
                  {payment.gateway_payment_id && (
                    <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gateway Payment ID
                      </Typography>
                      <Typography variant="body1">
                        {payment.gateway_payment_id}
                      </Typography>
                    </Grid>
                  )}
                  {payment.gateway_response && (
                    <Grid component="div" sx={{ gridColumn: 'span 12' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gateway Response
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          p: 2,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          overflow: 'auto',
                          maxHeight: 200,
                          fontSize: '0.875rem'
                        }}
                      >
                        {JSON.stringify(payment.gateway_response, null, 2)}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>

        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4', lg: 'span 4' } }}>
          <Card>
            <CardHeader 
              title="Transactions" 
              avatar={<ReceiptIcon color="primary" />}
            />
            <Divider />
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {transactions.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No transactions found" />
                </ListItem>
              ) : (
                transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">
                              {getTransactionTypeLabel(transaction.transaction_type)}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color={
                                transaction.transaction_type === TransactionType.REFUND
                                  ? 'error.main'
                                  : 'success.main'
                              }
                            >
                              {transaction.transaction_type === TransactionType.REFUND ? '-' : '+'}
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(transaction.transaction_date), 'PPp')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ref: {transaction.transaction_reference}
                            </Typography>
                            {transaction.description && (
                              <Typography variant="body2" color="text.secondary">
                                {transaction.description}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)}>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          {refundError && <Alert severity="error" sx={{ mb: 2 }}>{refundError}</Alert>}
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Refund Amount"
              type="number"
              fullWidth
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              InputProps={{
                startAdornment: payment?.currency,
              }}
              margin="normal"
              helperText={`Maximum refundable amount: ${formatCurrency(
                payment ? payment.amount - payment.refunded_amount : 0,
                payment?.currency || 'USD'
              )}`}
            />
            <TextField
              label="Refund Reason"
              fullWidth
              multiline
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRefund}
            variant="contained"
            color="primary"
            disabled={refundLoading}
          >
            {refundLoading ? <CircularProgress size={24} /> : 'Process Refund'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onClose={() => setUpdateStatusDialogOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <TextField
                select
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as PaymentStatus)}
                fullWidth
              >
                {Object.values(PaymentStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            disabled={updateStatusLoading || !newStatus}
          >
            {updateStatusLoading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentDetail;
