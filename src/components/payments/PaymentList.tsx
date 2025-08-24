import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Payment, PaymentStatus, PaymentFilters } from '../../types/payment';
import { getPayments } from '../../services/paymentService';

const PaymentList: React.FC = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    size: 10
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayments({
        ...filters,
        page: page + 1, // API uses 1-based indexing
        size: rowsPerPage
      });
      setPayments(response.payments);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError('Failed to load payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPayment = (id: number) => {
    router.push(`/payments/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const handleDateChange = (date: Date | null, field: 'start_date' | 'end_date') => {
    if (field === 'start_date') {
      setStartDate(date);
      if (date) {
        setFilters({
          ...filters,
          start_date: format(date, 'yyyy-MM-dd')
        });
      } else {
        const { start_date, ...rest } = filters;
        setFilters(rest);
      }
    } else {
      setEndDate(date);
      if (date) {
        setFilters({
          ...filters,
          end_date: format(date, 'yyyy-MM-dd')
        });
      } else {
        const { end_date, ...rest } = filters;
        setFilters(rest);
      }
    }
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      size: rowsPerPage
    });
    setStartDate(null);
    setEndDate(null);
    setPage(0);
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">Payments</Typography>
        <Button
          variant="outlined"
          startIcon={showFilters ? <ClearIcon /> : <FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={filters.status || ''}
                label="Status"
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(PaymentStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Order ID"
              name="order_id"
              type="number"
              value={filters.order_id || ''}
              onChange={handleFilterChange}
              size="small"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => handleDateChange(date, 'start_date')}
                slotProps={{ textField: { size: 'small' } }}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => handleDateChange(date, 'end_date')}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Stack>
        </Paper>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : payments.length === 0 ? (
        <Alert severity="info">No payments found.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="payments table">
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell component="th" scope="row">
                      {payment.payment_reference}
                    </TableCell>
                    <TableCell>
                      {payment.payment_date ? 
                        new Date(payment.payment_date).toLocaleDateString() : 
                        new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.order_id || '-'}</TableCell>
                    <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status.replace('_', ' ')} 
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.payment_method ? 
                        payment.payment_method.method_type.replace('_', ' ') : 
                        '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPayment(payment.id)}
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default PaymentList;
