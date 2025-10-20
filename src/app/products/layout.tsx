import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | Azlok Enterprises',
  description: 'Browse our wide range of products from verified suppliers across India'.substring(0, 160),
  keywords: 'products, online shopping, verified suppliers, India, marketplace, wholesale, retail, organic products',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Products | Azlok Enterprises',
    description: 'Browse our wide range of products from verified suppliers across India'.substring(0, 160),
    url: '/products',
    siteName: 'Azlok Enterprises',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Azlok Products',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Azlok Enterprises',
    description: 'Browse our wide range of products from verified suppliers across India'.substring(0, 160),
    images: ['/logo.png'],
    creator: '@azlok',
    site: '@azlok',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
