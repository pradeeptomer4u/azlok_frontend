import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Brands - Azlok",
  description: "Discover all the premium brands available on Azlok. Find quality products from verified sellers.",
  keywords: "brands, sellers, online shopping, e-commerce, verified sellers",
  alternates: {
    canonical: '/brands',
  },
  openGraph: {
    title: "Brands - Azlok",
    description: "Discover all the premium brands available on Azlok. Find quality products from verified sellers.",
    url: '/brands',
    images: ['/logo.png'],
    type: 'website',
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}