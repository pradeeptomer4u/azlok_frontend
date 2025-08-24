'use client';

import React from 'react';
import { Container, Box, Tabs, Tab, Paper } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();

  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (pathname === '/payments') return 0;
    if (pathname === '/payments/methods') return 1;
    if (pathname === '/payments/installment-plans') return 2;
    return 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push('/payments');
        break;
      case 1:
        router.push('/payments/methods');
        break;
      case 2:
        router.push('/payments/installment-plans');
        break;
      default:
        router.push('/payments');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={getActiveTab()} 
            onChange={handleTabChange} 
            aria-label="payment navigation tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Payments" />
            <Tab label="Payment Methods" />
            <Tab label="Installment Plans" />
          </Tabs>
        </Paper>
        {children}
      </Box>
    </Container>
  );
}
