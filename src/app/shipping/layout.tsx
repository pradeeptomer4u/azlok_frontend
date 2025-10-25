import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shipping Information - Azlok",
  description: "Learn about Azlok's shipping policies, delivery options, costs, and estimated delivery times across India.",
  keywords: "shipping, delivery, shipping policy, delivery time, shipping cost, express delivery, standard shipping",
  alternates: {
    canonical: '/shipping',
  },
  openGraph: {
    title: "Shipping Information - Azlok",
    description: "Learn about Azlok's shipping policies, delivery options, costs, and estimated delivery times across India.",
    url: '/shipping',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}