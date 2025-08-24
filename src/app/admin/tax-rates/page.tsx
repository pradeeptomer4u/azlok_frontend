'use client';

import BulkTaxRateUpdate from '../../../components/admin/BulkTaxRateUpdate';

export default function AdminTaxRatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tax Rate Management</h1>
      <BulkTaxRateUpdate />
    </div>
  );
}
