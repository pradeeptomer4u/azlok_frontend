import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Logistics Management - Azlok",
  description: "Manage shipments, logistics providers, and track deliveries with Azlok's comprehensive logistics management system.",
  keywords: "logistics, shipments, tracking, delivery, management, e-commerce",
  alternates: {
    canonical: '/logistics',
  },
  openGraph: {
    title: "Logistics Management - Azlok",
    description: "Manage shipments, logistics providers, and track deliveries with Azlok's comprehensive logistics management system.",
    url: '/logistics',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}