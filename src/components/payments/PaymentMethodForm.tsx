import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { PaymentMethod, PaymentMethodType, PaymentMethodCreate, PaymentMethodUpdate } from '../../types/payment';
import { createPaymentMethod, updatePaymentMethod } from '../../services/paymentService';

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod | null;
  onSave: () => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ paymentMethod, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PaymentMethodCreate | PaymentMethodUpdate>({
    method_type: PaymentMethodType.CREDIT_CARD,
    provider: '',
    is_default: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        method_type: paymentMethod.method_type,
        provider: paymentMethod.provider,
        is_default: paymentMethod.is_default,
        card_last_four: paymentMethod.card_last_four,
        card_expiry_month: paymentMethod.card_expiry_month,
        card_expiry_year: paymentMethod.card_expiry_year,
        card_holder_name: paymentMethod.card_holder_name,
        upi_id: paymentMethod.upi_id,
        bank_name: paymentMethod.bank_name,
        account_last_four: paymentMethod.account_last_four,
        account_holder_name: paymentMethod.account_holder_name,
        wallet_provider: paymentMethod.wallet_provider,
        wallet_id: paymentMethod.wallet_id
      });
    }
  }, [paymentMethod]);

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
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if (!formData.provider) {
      newErrors.provider = 'Provider is required';
    }
    
    // Type-specific validations
    if (formData.method_type === PaymentMethodType.CREDIT_CARD || 
        formData.method_type === PaymentMethodType.DEBIT_CARD) {
      if (!formData.card_last_four) {
        newErrors.card_last_four = 'Last 4 digits are required';
      } else if (!/^\d{4}$/.test(formData.card_last_four)) {
        newErrors.card_last_four = 'Must be 4 digits';
      }
      
      if (!formData.card_expiry_month) {
        newErrors.card_expiry_month = 'Month is required';
      } else if (!/^(0[1-9]|1[0-2])$/.test(formData.card_expiry_month)) {
        newErrors.card_expiry_month = 'Must be 01-12';
      }
      
      if (!formData.card_expiry_year) {
        newErrors.card_expiry_year = 'Year is required';
      } else if (!/^\d{4}$/.test(formData.card_expiry_year)) {
        newErrors.card_expiry_year = 'Must be 4 digits';
      }
      
      if (!formData.card_holder_name) {
        newErrors.card_holder_name = 'Cardholder name is required';
      }
    } else if (formData.method_type === PaymentMethodType.UPI) {
      if (!formData.upi_id) {
        newErrors.upi_id = 'UPI ID is required';
      }
    } else if (formData.method_type === PaymentMethodType.BANK_TRANSFER) {
      if (!formData.bank_name) {
        newErrors.bank_name = 'Bank name is required';
      }
      
      if (!formData.account_last_four) {
        newErrors.account_last_four = 'Last 4 digits are required';
      } else if (!/^\d{4}$/.test(formData.account_last_four)) {
        newErrors.account_last_four = 'Must be 4 digits';
      }
      
      if (!formData.account_holder_name) {
        newErrors.account_holder_name = 'Account holder name is required';
      }
    } else if (formData.method_type === PaymentMethodType.WALLET) {
      if (!formData.wallet_provider) {
        newErrors.wallet_provider = 'Wallet provider is required';
      }
      
      if (!formData.wallet_id) {
        newErrors.wallet_id = 'Wallet ID is required';
      }
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
      
      if (paymentMethod) {
        // Update existing payment method
        await updatePaymentMethod(paymentMethod.id, formData as PaymentMethodUpdate);
      } else {
        // Create new payment method
        await createPaymentMethod(formData as PaymentMethodCreate);
      }
      
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save payment method');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMethodSpecificFields = () => {
    switch (formData.method_type) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last 4 Digits"
                name="card_last_four"
                value={formData.card_last_four || ''}
                onChange={handleChange}
                error={!!errors.card_last_four}
                helperText={errors.card_last_four}
                inputProps={{ maxLength: 4 }}
                disabled={!!paymentMethod}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="card_holder_name"
                value={formData.card_holder_name || ''}
                onChange={handleChange}
                error={!!errors.card_holder_name}
                helperText={errors.card_holder_name}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Expiry Month"
                name="card_expiry_month"
                placeholder="MM"
                value={formData.card_expiry_month || ''}
                onChange={handleChange}
                error={!!errors.card_expiry_month}
                helperText={errors.card_expiry_month}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Expiry Year"
                name="card_expiry_year"
                placeholder="YYYY"
                value={formData.card_expiry_year || ''}
                onChange={handleChange}
                error={!!errors.card_expiry_year}
                helperText={errors.card_expiry_year}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
          </>
        );
      
      case PaymentMethodType.UPI:
        return (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="UPI ID"
              name="upi_id"
              value={formData.upi_id || ''}
              onChange={handleChange}
              error={!!errors.upi_id}
              helperText={errors.upi_id}
            />
          </Grid>
        );
      
      case PaymentMethodType.BANK_TRANSFER:
        return (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bank_name"
                value={formData.bank_name || ''}
                onChange={handleChange}
                error={!!errors.bank_name}
                helperText={errors.bank_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last 4 Digits of Account"
                name="account_last_four"
                value={formData.account_last_four || ''}
                onChange={handleChange}
                error={!!errors.account_last_four}
                helperText={errors.account_last_four}
                inputProps={{ maxLength: 4 }}
                disabled={!!paymentMethod}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="account_holder_name"
                value={formData.account_holder_name || ''}
                onChange={handleChange}
                error={!!errors.account_holder_name}
                helperText={errors.account_holder_name}
              />
            </Grid>
          </>
        );
      
      case PaymentMethodType.WALLET:
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wallet Provider"
                name="wallet_provider"
                value={formData.wallet_provider || ''}
                onChange={handleChange}
                error={!!errors.wallet_provider}
                helperText={errors.wallet_provider}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wallet ID"
                name="wallet_id"
                value={formData.wallet_id || ''}
                onChange={handleChange}
                error={!!errors.wallet_id}
                helperText={errors.wallet_id}
              />
            </Grid>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.method_type}>
            <InputLabel id="method-type-label">Payment Method Type</InputLabel>
            <Select
              labelId="method-type-label"
              id="method-type"
              name="method_type"
              value={formData.method_type}
              label="Payment Method Type"
              onChange={handleChange}
              disabled={!!paymentMethod}
            >
              <MenuItem value={PaymentMethodType.CREDIT_CARD}>Credit Card</MenuItem>
              <MenuItem value={PaymentMethodType.DEBIT_CARD}>Debit Card</MenuItem>
              <MenuItem value={PaymentMethodType.UPI}>UPI</MenuItem>
              <MenuItem value={PaymentMethodType.NET_BANKING}>Net Banking</MenuItem>
              <MenuItem value={PaymentMethodType.WALLET}>Wallet</MenuItem>
              <MenuItem value={PaymentMethodType.BANK_TRANSFER}>Bank Transfer</MenuItem>
            </Select>
            {errors.method_type && <FormHelperText>{errors.method_type}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            error={!!errors.provider}
            helperText={errors.provider || 'E.g., Visa, Mastercard, PayTM, PhonePe'}
          />
        </Grid>
        
        {renderMethodSpecificFields()}
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.is_default}
                onChange={handleCheckboxChange}
                name="is_default"
                color="primary"
              />
            }
            label="Set as default payment method"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : paymentMethod ? 'Update' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethodForm;
