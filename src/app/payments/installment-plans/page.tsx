'use client';

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
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { InstallmentPlan } from '@/types/payment';
import { getInstallmentPlans } from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/common/AccessDenied';

const InstallmentPlansPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallmentPlans = async () => {
      try {
        setLoading(true);
        const data = await getInstallmentPlans();
        setInstallmentPlans(data);
        setError(null);
      } catch (err) {
        setError('Failed to load installment plans');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchInstallmentPlans();
    }
  }, [isAuthenticated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isAuthenticated) {
    return <AccessDenied message="You must be logged in to view this page" />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Installment Plans
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : installmentPlans.length === 0 ? (
        <Alert severity="info">No installment plans found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="installment plans table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Installments</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {installmentPlans.map((plan) => (
                <TableRow key={plan.id} hover>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => router.push(`/orders/${plan.order_id}`)}
                    >
                      #{plan.order_id}
                    </Button>
                  </TableCell>
                  <TableCell>{formatCurrency(plan.total_amount)}</TableCell>
                  <TableCell>{plan.number_of_installments}</TableCell>
                  <TableCell>{plan.installment_frequency}</TableCell>
                  <TableCell>{format(new Date(plan.start_date), 'PP')}</TableCell>
                  <TableCell>
                    {plan.end_date ? format(new Date(plan.end_date), 'PP') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.status}
                      color={plan.status === 'active' ? 'success' : 
                             plan.status === 'completed' ? 'info' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push(`/payments/installment-plans/${plan.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default InstallmentPlansPage;
