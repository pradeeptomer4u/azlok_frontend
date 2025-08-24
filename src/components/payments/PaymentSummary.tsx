import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  AccountBalance as AccountIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { PaymentSummary as PaymentSummaryType, PaymentStatus } from '../../types/payment';
import { getPaymentSummary } from '../../services/paymentService';

const PaymentSummary: React.FC = () => {
  const router = useRouter();
  const [summary, setSummary] = useState<PaymentSummaryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const startDateStr = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const endDateStr = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
      
      const data = await getPaymentSummary(startDateStr, endDateStr);
      setSummary(data);
      setError(null);
    } catch (err) {
      setError('Failed to load payment summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleDateChange = () => {
    fetchSummary();
  };

  const handleViewPayment = (id: number) => {
    router.push(`/payments/${id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: summary?.currency || 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: PaymentStatus) => {
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

  if (!summary) {
    return <Alert severity="info">No payment data available</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">Payment Summary</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
            <Button variant="contained" onClick={handleDateChange}>
              Apply
            </Button>
          </Stack>
        </LocalizationProvider>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Amount
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="div">
                    {formatCurrency(summary.total_amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.total_payments} payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccountIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Paid Amount
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="div" color="success.main">
                    {formatCurrency(summary.paid_amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.payment_status_counts[PaymentStatus.PAID] || 0} payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Pending Amount
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="div" color="warning.main">
                    {formatCurrency(summary.pending_amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.payment_status_counts[PaymentStatus.PENDING] || 0} payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      Refunded Amount
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="div" color="info.main">
                    {formatCurrency(summary.refunded_amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.payment_status_counts[PaymentStatus.REFUNDED] || 0} payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Status Breakdown
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(summary.payment_status_counts).map(([status, count]) => (
                <Grid item key={status} xs={6} sm={4} md={3}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Chip
                      label={status.replace('_', ' ')}
                      color={getStatusColor(status as PaymentStatus)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1">{count}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Payments" />
            <Divider />
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {summary.recent_payments.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No recent payments" />
                </ListItem>
              ) : (
                summary.recent_payments.map((payment) => (
                  <React.Fragment key={payment.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewPayment(payment.id)}
                        >
                          View
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">
                              {payment.payment_reference}
                            </Typography>
                            <Typography variant="subtitle2">
                              {formatCurrency(payment.amount)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                {payment.payment_date
                                  ? format(new Date(payment.payment_date), 'PP')
                                  : format(new Date(payment.created_at), 'PP')}
                              </Typography>
                              <Chip
                                label={payment.status.replace('_', ' ')}
                                color={getStatusColor(payment.status)}
                                size="small"
                              />
                            </Box>
                            {payment.order_id && (
                              <Typography variant="body2" color="text.secondary">
                                Order #{payment.order_id}
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
            <Box p={2} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => router.push('/payments')}
              >
                View All Payments
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentSummary;
