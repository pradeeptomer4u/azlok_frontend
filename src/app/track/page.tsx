'use client';

import React from 'react';
import PublicShipmentTracker from '../../components/logistics/PublicShipmentTracker';
import MetaTags from '../../components/SEO/MetaTags';

export default function TrackShipment() {
  return (
    <div className="min-h-screen py-10">
            {/* Metadata now handled by layout.tsx */}
      
      <PublicShipmentTracker />
    </div>
  );
}
