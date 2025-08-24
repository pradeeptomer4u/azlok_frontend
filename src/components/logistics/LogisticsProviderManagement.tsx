import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface LogisticsProvider {
  id: number;
  name: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  service_areas?: string[];
  service_types?: string[];
  created_at: string;
  updated_at?: string;
}

interface LogisticsProviderFormData {
  name: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  service_areas?: string[];
  service_types?: string[];
  api_key?: string;
  api_secret?: string;
  api_endpoint?: string;
}

const LogisticsProviderManagement: React.FC = () => {
  const { token } = useAuth();
  const [providers, setProviders] = useState<LogisticsProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingProvider, setEditingProvider] = useState<LogisticsProvider | null>(null);
  const [formData, setFormData] = useState<LogisticsProviderFormData>({
    name: '',
    code: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    status: 'active',
    service_areas: [],
    service_types: [],
    api_key: '',
    api_secret: '',
    api_endpoint: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [serviceArea, setServiceArea] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');

  useEffect(() => {
    fetchProviders();
  }, [token]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logistics/providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch logistics providers');
      }
      
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching logistics providers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load logistics providers',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (provider?: LogisticsProvider) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name,
        code: provider.code,
        contact_email: provider.contact_email,
        contact_phone: provider.contact_phone,
        website: provider.website || '',
        status: provider.status,
        service_areas: provider.service_areas || [],
        service_types: provider.service_types || [],
        api_key: '',
        api_secret: '',
        api_endpoint: '',
      });
    } else {
      setEditingProvider(null);
      setFormData({
        name: '',
        code: '',
        contact_email: '',
        contact_phone: '',
        website: '',
        status: 'active',
        service_areas: [],
        service_types: [],
        api_key: '',
        api_secret: '',
        api_endpoint: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProvider(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    const value = e.target.value as 'active' | 'inactive' | 'suspended';
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleAddServiceArea = () => {
    if (serviceArea && !formData.service_areas?.includes(serviceArea)) {
      setFormData({
        ...formData,
        service_areas: [...(formData.service_areas || []), serviceArea],
      });
      setServiceArea('');
    }
  };

  const handleRemoveServiceArea = (area: string) => {
    setFormData({
      ...formData,
      service_areas: formData.service_areas?.filter(a => a !== area),
    });
  };

  const handleAddServiceType = () => {
    if (serviceType && !formData.service_types?.includes(serviceType)) {
      setFormData({
        ...formData,
        service_types: [...(formData.service_types || []), serviceType],
      });
      setServiceType('');
    }
  };

  const handleRemoveServiceType = (type: string) => {
    setFormData({
      ...formData,
      service_types: formData.service_types?.filter(t => t !== type),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingProvider) {
        // Update existing provider
        response = await fetch(`/api/logistics/providers/${editingProvider.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new provider
        response = await fetch('/api/logistics/providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save logistics provider');
      }
      
      setSnackbar({
        open: true,
        message: editingProvider 
          ? 'Logistics provider updated successfully' 
          : 'Logistics provider created successfully',
        severity: 'success',
      });
      
      handleCloseDialog();
      fetchProviders();
    } catch (error) {
      console.error('Error saving logistics provider:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save logistics provider',
        severity: 'error',
      });
    }
  };

  const handleDeleteProvider = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this logistics provider?')) {
      try {
        const response = await fetch(`/api/logistics/providers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete logistics provider');
        }
        
        setSnackbar({
          open: true,
          message: 'Logistics provider deleted successfully',
          severity: 'success',
        });
        
        fetchProviders();
      } catch (error) {
        console.error('Error deleting logistics provider:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete logistics provider',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Logistics Providers Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchProviders}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Provider
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Contact Email</TableCell>
                  <TableCell>Contact Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Service Areas</TableCell>
                  <TableCell>Service Types</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No logistics providers found
                    </TableCell>
                  </TableRow>
                ) : (
                  providers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell>{provider.name}</TableCell>
                        <TableCell>{provider.code}</TableCell>
                        <TableCell>{provider.contact_email}</TableCell>
                        <TableCell>{provider.contact_phone}</TableCell>
                        <TableCell>
                          <Chip
                            label={provider.status}
                            color={
                              provider.status === 'active'
                                ? 'success'
                                : provider.status === 'inactive'
                                ? 'default'
                                : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {provider.service_areas?.length ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {provider.service_areas.map((area) => (
                                <Chip key={area} label={area} size="small" />
                              ))}
                            </Box>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {provider.service_types?.length ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {provider.service_types.map((type) => (
                                <Chip key={type} label={type} size="small" />
                              ))}
                            </Box>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(provider)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProvider(provider.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={providers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Provider Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProvider ? 'Edit Logistics Provider' : 'Add Logistics Provider'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="name"
                  label="Provider Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="code"
                  label="Provider Code"
                  value={formData.code}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  helperText="Short code for tracking numbers (e.g., DHL, FDX)"
                  inputProps={{ maxLength: 10 }}
                  disabled={!!editingProvider}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="contact_email"
                  label="Contact Email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="contact_phone"
                  label="Contact Phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="website"
                  label="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="api_key"
                  label="API Key"
                  value={formData.api_key}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <TextField
                  name="api_secret"
                  label="API Secret"
                  value={formData.api_secret}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  type="password"
                />
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <TextField
                  name="api_endpoint"
                  label="API Endpoint"
                  value={formData.api_endpoint}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Service Areas
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      label="Add Service Area"
                      value={serviceArea}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServiceArea(e.target.value)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddServiceArea}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.service_areas?.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        onDelete={() => handleRemoveServiceArea(area)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Service Types
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      label="Add Service Type"
                      value={serviceType}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServiceType(e.target.value)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddServiceType}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.service_types?.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        onDelete={() => handleRemoveServiceType(type)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingProvider ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LogisticsProviderManagement;
