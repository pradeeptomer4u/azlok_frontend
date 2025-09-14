'use client';

import { ShippingMethod } from '../../services/checkoutService';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

interface ShippingMethodSectionProps {
  shippingMethods: ShippingMethod[];
  selectedShippingMethodId: number | null;
  setSelectedShippingMethodId: (id: number) => void;
  error: string | null;
}

export default function ShippingMethodSection({
  shippingMethods,
  selectedShippingMethodId,
  setSelectedShippingMethodId,
  error
}: ShippingMethodSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Shipping Method</h3>
        <p className="text-sm text-gray-500">Select how you&apos;d like your order delivered</p>
      </div>
      
      <div className="p-4">
        {error && <ErrorAlert message={error} />}
        
        {shippingMethods.length > 0 ? (
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <div 
                key={method.id} 
                className={`flex flex-col p-4 border rounded-md cursor-pointer ${
                  selectedShippingMethodId === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedShippingMethodId(method.id)}
              >
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="shipping-method"
                    value={method.id.toString()}
                    checked={selectedShippingMethodId === method.id}
                    onChange={() => setSelectedShippingMethodId(method.id)}
                    className="mr-3"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <span className="font-bold">📦</span>
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatPrice(method.price)}</p>
                  </div>
                </div>
                
                <div className="pl-8 mt-2">
                  <p className="text-sm text-gray-500">{method.description}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="mr-1">⏱️</span>
                    <span>Estimated delivery: {method.estimated_days}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No shipping methods available. Please contact customer support.
          </div>
        )}
      </div>
    </div>
  );
}
