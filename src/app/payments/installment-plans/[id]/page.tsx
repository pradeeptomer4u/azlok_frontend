'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { InstallmentPlan, Payment } from '@/types/payment';
import { getInstallmentPlan, getPayments } from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/common/AccessDenied';

interface InstallmentPlanDetailPageProps {
  params: {
    id: string;
  };
}

const InstallmentPlanDetailPage: React.FC<InstallmentPlanDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const planId = parseInt(params.id, 10);
  
  const [plan, setPlan] = useState<InstallmentPlan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const planData = await getInstallmentPlan(planId);
        setPlan(planData);
        
        // Fetch payments related to this installment plan
        const paymentsResponse = await getPayments({ 
          order_id: planData.order_id,
          size: 100 // Get all payments for this order
        });
        
        // Filter payments that are part of this installment plan
        const installmentPayments = paymentsResponse.payments.filter(
          payment => payment.installment_plan_id === planId
        );
        
        setPayments(installmentPayments);
        setError(null);
      } catch (err) {
        setError('Failed to load installment plan details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && planId) {
      fetchData();
    }
  }, [isAuthenticated, planId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isAuthenticated) {
    return <AccessDenied message="You must be logged in to view this page" />;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">Installment plan not found</Alert>
      </Box>
    );
  }

  // Calculate installment details
  const installmentAmount = plan.total_amount / plan.number_of_installments;
  const installments = Array.from({ length: plan.number_of_installments }, (_, i) => {
    const date = new Date(plan.start_date);
    
    if (plan.installment_frequency === 'weekly') {
      date.setDate(date.getDate() + (i * 7));
    } else if (plan.installment_frequency === 'biweekly') {
      date.setDate(date.getDate() + (i * 14));
    } else {
      date.setMonth(date.getMonth() + i);
    }
    
    // Find matching payment for this installment
    const payment = payments.find(p => p.installment_number === i + 1);
    
    return {
      number: i + 1,
      date,
      amount: installmentAmount,
      payment
    };
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Installment Plan Details
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: '66.66%' } }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => router.push(`/orders/${plan.order_id}`)}
                  >
                    #{plan.order_id}
                  </Button>
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={plan.status}
                  color={
                    plan.status === 'active' ? 'success' :
                    plan.status === 'completed' ? 'info' :
                    'default'
                  }
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(plan.total_amount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Number of Installments
                </Typography>
                <Typography variant="body1">
                  {plan.number_of_installments}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Installment Frequency
                </Typography>
                <Typography variant="body1">
                  {plan.installment_frequency.charAt(0).toUpperCase() + plan.installment_frequency.slice(1)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Interest Rate
                </Typography>
                <Typography variant="body1">
                  {plan.interest_rate}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Processing Fee
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(plan.processing_fee)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(plan.start_date), 'PP')}
                </Typography>
              </Box>
              {plan.end_date && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(plan.end_date), 'PP')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
          
          <Card>
            <CardHeader title="Installment Schedule" />
            <Divider />
            <List>
              {installments.map((installment) => (
                <React.Fragment key={installment.number}>
                  <ListItem
                    secondaryAction={
                      installment.payment ? (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => router.push(`/payments/${installment.payment?.id}`)}
                        >
                          View Payment
                        </Button>
                      ) : null
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            Installment #{installment.number}
                          </Typography>
                          <Typography variant="subtitle2">
                            {formatCurrency(installment.amount)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Due: {format(installment.date, 'PP')}
                          </Typography>
                          {installment.payment ? (
                            <Chip
                              label={installment.payment.status}
                              color={
                                installment.payment.status === 'paid' ? 'success' :
                                installment.payment.status === 'pending' ? 'warning' :
                                'default'
                              }
                              size="small"
                            />
                          ) : (
                            <Chip label="Not Paid" color="error" size="small" />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: '33.33%' } }}>
          <Card>
            <CardHeader title="Payment Summary" />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(plan.total_amount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Paid Amount
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    {formatCurrency(
                      payments
                        .filter(p => p.status === 'paid')
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Remaining Amount
                  </Typography>
                  <Typography variant="body1" color="warning.main">
                    {formatCurrency(
                      plan.total_amount - 
                      payments
                        .filter(p => p.status === 'paid')
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Installments Paid
                  </Typography>
                  <Typography variant="body1">
                    {payments.filter(p => p.status === 'paid').length} of {plan.number_of_installments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default InstallmentPlanDetailPage;
