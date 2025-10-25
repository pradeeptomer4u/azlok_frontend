import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Returns & Refunds - Azlok",
  description: "Learn about Azlok's return policy, refund process, and how to return or exchange items with easy step-by-step instructions.",
  keywords: "returns, refunds, return policy, exchange, money back guarantee, return process, refund policy",
  alternates: {
    canonical: '/returns',
  },
  openGraph: {
    title: "Returns & Refunds - Azlok",
    description: "Learn about Azlok's return policy, refund process, and how to return or exchange items with easy step-by-step instructions.",
    url: '/returns',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function ReturnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}