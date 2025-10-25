'use client';

import React from 'react';
import LogisticsPage from '../../pages/LogisticsPage';
import MetaTags from '../../components/SEO/MetaTags';

export default function Logistics() {
  return (
    <div className="min-h-screen">
            {/* Metadata now handled by layout.tsx */}
      
      <LogisticsPage />
    </div>
  );
}
