'use client';

import SellerDashboard from '../../../components/dashboard/SellerDashboard';

export const runtime = "edge";

export default function SellerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SellerDashboard />
    </div>
  );
}
