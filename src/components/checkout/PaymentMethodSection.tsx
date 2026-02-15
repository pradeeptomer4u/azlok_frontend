'use client';

import { PaymentMethod } from '../../services/checkoutService';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: number | null;
  setSelectedPaymentMethodId: (id: number) => void;
  error: string | null;
}

export default function PaymentMethodSection({
  paymentMethods,
  selectedPaymentMethodId,
  setSelectedPaymentMethodId,
  error
}: PaymentMethodSectionProps) {
  const getPaymentIcon = (methodType: string): string => {
    switch (methodType.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return 'CC';
      case 'upi':
        return 'UPI';
      case 'wallet':
        return 'W';
      case 'razorpay':
        return 'RZ';
      case 'cod':
        return 'cash';
      default:
        return 'P';
    }
  };

  const getPaymentDescription = (method: PaymentMethod) => {
    switch (method.method_type.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return `${method.provider} •••• ${method.card_last_four || '****'}`;
      case 'upi':
        return `UPI: ${method.upi_id || ''}`;
      case 'wallet':
        return `${method.wallet_provider || method.provider}`;
      case 'razorpay':
        return 'Pay securely with Razorpay';
      case 'cod':
        return 'Pay with cash when your order is delivered';
      default:
        return method.provider;
    }
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <p className="text-sm text-gray-500">Select how you&apos;d like to pay</p>
      </div>
      
      <div className="p-4">
        {error && <ErrorAlert message={error} />}
        
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`flex items-center p-4 border rounded-md cursor-pointer ${
                  selectedPaymentMethodId === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPaymentMethodId(method.id)}
              >
                <input 
                  type="radio" 
                  name="payment-method"
                  value={method.id.toString()}
                  checked={selectedPaymentMethodId === method.id}
                  onChange={() => setSelectedPaymentMethodId(method.id)}
                  className="mr-3"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <span className="font-bold text-sm">
                      {getPaymentIcon(method.method_type)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{method.provider}</p>
                    <p className="text-sm text-gray-500">{getPaymentDescription(method)}</p>
                  </div>
                </div>
                {method.is_default && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No payment methods available. Please contact customer support.
          </div>
        )}
      </div>
    </div>
  );
}
