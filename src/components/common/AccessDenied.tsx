import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { LockOutlined as LockIcon } from '@mui/icons-material';

interface AccessDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'You do not have permission to access this page',
  redirectPath = '/login',
  redirectLabel = 'Go to Login'
}) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <LockIcon
          sx={{
            fontSize: 60,
            color: 'error.main',
            mb: 2
          }}
        />
        <Typography variant="h5" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(redirectPath)}
          sx={{ mt: 2 }}
        >
          {redirectLabel}
        </Button>
      </Paper>
    </Box>
  );
};

export default AccessDenied;
