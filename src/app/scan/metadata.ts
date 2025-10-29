import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Scan Information | Azlok',
  description: 'View information from your QR code scan',
  openGraph: {
    title: 'QR Scan Information | Azlok',
    description: 'View information from your QR code scan',
    url: '/scan',
    siteName: 'Azlok',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Azlok',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Scan Information | Azlok',
    description: 'View information from your QR code scan',
    images: ['/logo.png'],
    creator: '@azlok',
    site: '@azlok',
  },
};
