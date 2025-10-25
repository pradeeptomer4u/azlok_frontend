import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Azlok",
  description: "Find answers to common questions about shopping, shipping, returns, and more at Azlok.",
  keywords: "FAQ, frequently asked questions, help, support, shipping, returns, orders, customer service",
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: "Frequently Asked Questions - Azlok",
    description: "Find answers to common questions about shopping, shipping, returns, and more at Azlok.",
    url: '/faq',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}