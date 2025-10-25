import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Track Your Shipment - Azlok Enterprises",
  description: "Track your shipment in real-time with Azlok's shipment tracking system. Get the latest updates on your delivery status.",
  keywords: "shipment tracking, delivery tracking, package tracking, order status",
  alternates: {
    canonical: '/track',
  },
  openGraph: {
    title: "Track Your Shipment - Azlok Enterprises",
    description: "Track your shipment in real-time with Azlok's shipment tracking system. Get the latest updates on your delivery status.",
    url: '/track',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}