import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { InstallmentPlanCreate } from '../../types/payment';
import { createInstallmentPlan } from '../../services/paymentService';

interface InstallmentPlanFormProps {
  orderId: number;
  totalAmount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const InstallmentPlanForm: React.FC<InstallmentPlanFormProps> = ({
  orderId,
  totalAmount,
  currency,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<InstallmentPlanCreate>({
    order_id: orderId,
    total_amount: totalAmount,
    number_of_installments: 3,
    installment_frequency: 'monthly',
    interest_rate: 0,
    processing_fee: 0,
    start_date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [installmentPreview, setInstallmentPreview] = useState<Array<{date: Date, amount: number}>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
      
      // Update preview when relevant fields change
      if (['number_of_installments', 'installment_frequency', 'interest_rate', 'processing_fee'].includes(name)) {
        updateInstallmentPreview();
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      setFormData({
        ...formData,
        start_date: format(date, 'yyyy-MM-dd')
      });
      updateInstallmentPreview(date);
    }
  };

  const updateInstallmentPreview = (startDateValue: Date = startDate) => {
    const calculateInstallmentAmount = () => {
      const principal = totalAmount;
      const numberOfInstallments = parseInt(String(formData.number_of_installments || '1'), 10);
      const interestRate = parseFloat(String(formData.interest_rate || '0')) / 100;
      const processingFee = parseFloat(String(formData.processing_fee || '0')) || 0;
      
      // Simple interest calculation
      const totalInterest = principal * interestRate;
      const totalWithInterest = principal + totalInterest + processingFee;
      const installmentAmount = totalWithInterest / numberOfInstallments;
      
      return installmentAmount;
    };

    const numberOfInstallments = parseInt(String(formData.number_of_installments || '1'), 10);
    const installmentAmount = calculateInstallmentAmount();
    
    const preview: Array<{date: Date, amount: number}> = [];
    
    for (let i = 0; i < numberOfInstallments; i++) {
      const date = new Date(startDateValue);
      
      if (formData.installment_frequency === 'weekly') {
        date.setDate(date.getDate() + (i * 7));
      } else if (formData.installment_frequency === 'biweekly') {
        date.setDate(date.getDate() + (i * 14));
      } else if (formData.installment_frequency === 'monthly') {
        date.setMonth(date.getMonth() + i);
      }
      
      preview.push({
        date,
        amount: installmentAmount
      });
    }
    
    setInstallmentPreview(preview);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.number_of_installments || formData.number_of_installments < 2) {
      newErrors.number_of_installments = 'Must be at least 2 installments';
    }
    
    if (!formData.installment_frequency) {
      newErrors.installment_frequency = 'Frequency is required';
    }
    
    if ((formData.interest_rate || 0) < 0) {
      newErrors.interest_rate = 'Interest rate cannot be negative';
    }
    
    if ((formData.processing_fee || 0) < 0) {
      newErrors.processing_fee = 'Processing fee cannot be negative';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createInstallmentPlan(formData);
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create installment plan';
      const apiError = (err as { response?: { data?: { detail?: string } } });
      setError(apiError.response?.data?.detail || errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  // Initialize installment preview on component mount
  React.useEffect(() => {
    updateInstallmentPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // We're using an empty dependency array with eslint-disable comment because we only want to run this once on mount
  // Adding updateInstallmentPreview to dependencies would cause an infinite loop as it's recreated on each render

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Stack spacing={3}>
        <Stack width="100%">
          <Typography variant="subtitle1">
            Order #{orderId} - Total Amount: {formatCurrency(totalAmount)}
          </Typography>
        </Stack>
        
        <Stack width="100%" sx={{ maxWidth: { sm: '50%' } }}>
          <TextField
            fullWidth
            label="Number of Installments"
            name="number_of_installments"
            type="number"
            value={formData.number_of_installments}
            onChange={handleChange}
            error={!!errors.number_of_installments}
            helperText={errors.number_of_installments}
            InputProps={{ inputProps: { min: 2, max: 24 } }}
          />
        </Stack>
        
        <Stack width="100%" sx={{ maxWidth: { sm: '50%' } }}>
          <FormControl fullWidth error={!!errors.installment_frequency}>
            <InputLabel id="frequency-label">Installment Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              id="installment_frequency"
              name="installment_frequency"
              value={formData.installment_frequency}
              label="Installment Frequency"
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="biweekly">Bi-weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        
        <Stack width="100%" sx={{ maxWidth: { sm: '50%' } }}>
          <TextField
            fullWidth
            label="Interest Rate (%)"
            name="interest_rate"
            type="number"
            value={formData.interest_rate}
            onChange={handleChange}
            error={!!errors.interest_rate}
            helperText={errors.interest_rate}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Stack>
        
        <Stack width="100%" sx={{ maxWidth: { sm: '50%' } }}>
          <TextField
            fullWidth
            label="Processing Fee"
            name="processing_fee"
            type="number"
            value={formData.processing_fee}
            onChange={handleChange}
            error={!!errors.processing_fee}
            helperText={errors.processing_fee}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Stack>
        
        <Stack width="100%" sx={{ maxWidth: { sm: '50%' } }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleDateChange}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  error: !!errors.start_date,
                  helperText: errors.start_date
                } 
              }}
            />
          </LocalizationProvider>
        </Stack>
      </Stack>
      
      {/* Installment Preview */}
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Installment Preview
        </Typography>
        
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack width="50%">
              <Typography variant="subtitle2" color="text.secondary">
                Due Date
              </Typography>
            </Stack>
            
            <Stack width="50%">
              <Typography variant="subtitle2" color="text.secondary">
                Amount
              </Typography>
            </Stack>
          </Stack>
          
          {installmentPreview.map((installment, index) => (
            <Stack key={index} direction="row" spacing={2}>
              <Stack width="50%">
                <Typography>
                  {format(installment.date, 'PP')}
                </Typography>
              </Stack>
              
              <Stack width="50%">
                <Typography>
                  {formatCurrency(installment.amount)}
                </Typography>
              </Stack>
            </Stack>
          ))}
          
          <Stack direction="row" spacing={2}>
            <Stack width="50%">
              <Typography variant="subtitle1" fontWeight="bold">
                Total
              </Typography>
            </Stack>
            
            <Stack width="50%">
              <Typography variant="subtitle1" fontWeight="bold">
                {formatCurrency(
                  installmentPreview.reduce((sum, item) => sum + item.amount, 0)
                )}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Installment Plan'}
        </Button>
      </Box>
    </Box>
  );
};

export default InstallmentPlanForm;
