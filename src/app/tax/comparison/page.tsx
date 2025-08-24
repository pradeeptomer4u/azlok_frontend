'use client';

import TaxRateComparison from '../../../components/tax/TaxRateComparison';

export default function TaxRateComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tax Rate Comparison Tool</h1>
      <p className="text-gray-600 mb-6">
        Compare GST tax rates and calculations across different product categories and regions to understand tax implications for your business.
      </p>
      <TaxRateComparison />
    </div>
  );
}
