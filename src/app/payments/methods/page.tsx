'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PaymentMethodList from '@/components/payments/PaymentMethodList';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/common/AccessDenied';

export const runtime = "edge";

const PaymentMethodsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AccessDenied message="You must be logged in to view this page" />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Payment Methods
      </Typography>
      <Paper sx={{ p: 3 }}>
        <PaymentMethodList />
      </Paper>
    </Box>
  );
};

export default PaymentMethodsPage;
