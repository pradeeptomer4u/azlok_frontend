'use client';

import { useState } from 'react';
import { ShippingAddress } from '../../services/checkoutService';
import { Button } from '../../components/ui/Button';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

interface ShippingAddressSectionProps {
  addresses: ShippingAddress[];
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number) => void;
  onAddAddress: (address: ShippingAddress) => Promise<void>;
  error: string | null;
}

export default function ShippingAddressSection({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
  error
}: ShippingAddressSectionProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<ShippingAddress>>({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    phone_number: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newAddress.full_name || !newAddress.address_line1 || !newAddress.city || 
        !newAddress.state || !newAddress.country || !newAddress.zip_code || !newAddress.phone_number) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      await onAddAddress(newAddress as ShippingAddress);
      setShowAddressForm(false);
      setNewAddress({
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        phone_number: ''
      });
    } catch (err) {
      console.error('Error submitting address:', err);
      setFormError('Failed to add address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Shipping Address</h3>
        <p className="text-sm text-gray-500">Select a shipping address or add a new one</p>
      </div>
      
      <div className="p-4">
        {error && <ErrorAlert message={error} />}
        
        {addresses.length > 0 ? (
          <div className="space-y-4 mb-6">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`flex items-start p-4 border rounded-md cursor-pointer ${
                  selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <input 
                  type="radio" 
                  name="shipping-address"
                  value={address.id.toString()}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mr-3 mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{address.full_name}</p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.city}, {address.state} {address.zip_code}</p>
                  <p>{address.country}</p>
                  <p>{address.phone_number}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No saved addresses. Please add a new address.
          </div>
        )}
        
        {showAddressForm ? (
          <div className="border rounded-md p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Add New Address</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddressForm(false)}
              >
                ✕
              </button>
            </div>
            
            {formError && <ErrorAlert message={formError} />}
            
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="full_name" className="text-sm font-medium">Full Name *</label>
                <input 
                  id="full_name" 
                  className="w-full p-2 border rounded"
                  value={newAddress.full_name || ''} 
                  onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address_line1" className="text-sm font-medium">Address Line 1 *</label>
                <input 
                  id="address_line1" 
                  className="w-full p-2 border rounded"
                  value={newAddress.address_line1 || ''} 
                  onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address_line2" className="text-sm font-medium">Address Line 2</label>
                <input 
                  id="address_line2" 
                  className="w-full p-2 border rounded"
                  value={newAddress.address_line2 || ''} 
                  onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="city" className="text-sm font-medium">City *</label>
                  <input 
                    id="city" 
                    className="w-full p-2 border rounded"
                    value={newAddress.city || ''} 
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="state" className="text-sm font-medium">State/Province *</label>
                  <input 
                    id="state" 
                    className="w-full p-2 border rounded"
                    value={newAddress.state || ''} 
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="country" className="text-sm font-medium">Country *</label>
                  <input 
                    id="country" 
                    className="w-full p-2 border rounded"
                    value={newAddress.country || ''} 
                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="zip_code" className="text-sm font-medium">ZIP/Postal Code *</label>
                  <input 
                    id="zip_code" 
                    className="w-full p-2 border rounded"
                    value={newAddress.zip_code || ''} 
                    onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone_number" className="text-sm font-medium">Phone Number *</label>
                <input 
                  id="phone_number" 
                  className="w-full p-2 border rounded"
                  value={newAddress.phone_number || ''} 
                  onChange={(e) => setNewAddress({...newAddress, phone_number: e.target.value})}
                  type="tel"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Address'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAddressForm(true)}
            className="w-full mt-4"
          >
            Add New Address
          </Button>
        )}
      </div>
    </div>
  );
}
