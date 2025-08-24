import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | Azlok Enterprises',
  description: 'Browse our wide range of products from verified suppliers across India',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
