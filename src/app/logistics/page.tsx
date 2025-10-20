'use client';

import React from 'react';
import LogisticsPage from '../../pages/LogisticsPage';
import MetaTags from '../../components/SEO/MetaTags';

export const runtime = "edge";

export default function Logistics() {
  return (
    <div className="min-h-screen">
      <MetaTags
        title="Logistics Management - Azlok Enterprises"
        description="Manage shipments, logistics providers, and track deliveries with Azlok's comprehensive logistics management system."
        keywords="logistics, shipments, tracking, delivery, management, e-commerce"
        ogType="website"
        ogUrl="/logistics"
        ogImage="/logo.png"
        canonicalUrl="/logistics"
      />
      
      <LogisticsPage />
    </div>
  );
}
