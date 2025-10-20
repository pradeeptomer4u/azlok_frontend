'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PaymentList from '@/components/payments/PaymentList';
import PaymentSummary from '@/components/payments/PaymentSummary';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/common/AccessDenied';

export const runtime = "edge";

const PaymentsPage = () => {
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!isAuthenticated) {
    return <AccessDenied message="You must be logged in to view this page" />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Payments Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment content tabs">
          <Tab label="Payment List" />
          <Tab label="Payment Summary" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && <PaymentList />}
      {tabValue === 1 && <PaymentSummary />}
    </Box>
  );
};

export default PaymentsPage;
