'use client';

import React from 'react';
import PublicShipmentTracker from '../../components/logistics/PublicShipmentTracker';
import MetaTags from '../../components/SEO/MetaTags';

export default function TrackShipment() {
  return (
    <div className="min-h-screen py-10">
      <MetaTags
        title="Track Your Shipment - Azlok Enterprises"
        description="Track your shipment in real-time with Azlok's shipment tracking system. Get the latest updates on your delivery status."
        keywords="shipment tracking, delivery tracking, package tracking, order status"
        ogType="website"
        ogUrl="/track"
        ogImage="/logo.png"
        canonicalUrl="/track"
      />
      
      <PublicShipmentTracker />
    </div>
  );
}
