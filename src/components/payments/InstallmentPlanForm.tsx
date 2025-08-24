import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
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
    const numberOfInstallments = Number(formData.number_of_installments);
    const interestRate = Number(formData.interest_rate) / 100; // Convert to decimal
    const processingFee = Number(formData.processing_fee);
    
    // Calculate total amount with interest
    const totalWithInterest = totalAmount * (1 + interestRate) + processingFee;
    const installmentAmount = totalWithInterest / numberOfInstallments;
    
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
    
    if (formData.interest_rate < 0) {
      newErrors.interest_rate = 'Interest rate cannot be negative';
    }
    
    if (formData.processing_fee < 0) {
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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create installment plan');
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
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Order #{orderId} - Total Amount: {formatCurrency(totalAmount)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.installment_frequency}>
            <InputLabel id="frequency-label">Installment Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              id="installment_frequency"
              name="installment_frequency"
              value={formData.installment_frequency}
              label="Installment Frequency"
              onChange={handleChange}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="biweekly">Bi-weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
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
        </Grid>
      </Grid>
      
      {/* Installment Preview */}
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Installment Preview
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Due Date
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Amount
            </Typography>
          </Grid>
          
          {installmentPreview.map((installment, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Typography>
                  {format(installment.date, 'PP')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {formatCurrency(installment.amount)}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
          
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              {formatCurrency(
                installmentPreview.reduce((sum, item) => sum + item.amount, 0)
              )}
            </Typography>
          </Grid>
        </Grid>
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
