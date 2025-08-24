'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PaymentDetail from '@/components/payments/PaymentDetail';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/common/AccessDenied';

interface PaymentDetailPageProps {
  params: {
    id: string;
  };
}

const PaymentDetailPage: React.FC<PaymentDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const paymentId = parseInt(params.id, 10);

  if (!isAuthenticated) {
    return <AccessDenied message="You must be logged in to view this page" />;
  }

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
          Payment Details
        </Typography>
      </Box>
      
      <PaymentDetail paymentId={paymentId} />
    </Box>
  );
};

export default PaymentDetailPage;
