'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import LogisticsProviderManagement from './LogisticsProviderManagement';
import ShipmentManagement from './ShipmentManagement';
import PublicShipmentTracker from './PublicShipmentTracker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logistics-tabpanel-${index}`}
      aria-labelledby={`logistics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `logistics-tab-${index}`,
    'aria-controls': `logistics-tabpanel-${index}`,
  };
}

const LogisticsPageClient: React.FC = () => {
  const { userRole } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logistics Management
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="logistics tabs"
        >
          <Tab label="Shipments" {...a11yProps(0)} />
          {userRole === 'admin' && (
            <Tab label="Logistics Providers" {...a11yProps(1)} />
          )}
          <Tab label="Track Shipment" {...a11yProps(userRole === 'admin' ? 2 : 1)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <ShipmentManagement />
        </TabPanel>
        
        {userRole === 'admin' && (
          <TabPanel value={tabValue} index={1}>
            <LogisticsProviderManagement />
          </TabPanel>
        )}
        
        <TabPanel value={tabValue} index={userRole === 'admin' ? 2 : 1}>
          <PublicShipmentTracker />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default LogisticsPageClient;
