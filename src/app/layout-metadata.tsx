import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Azlok - Premium B2C Marketplace & E-commerce Platform in India",
  description: "Azlok is India's leading B2C marketplace connecting verified suppliers with businesses. Shop quality products including organic compounds, spices, chemicals, and industrial supplies with competitive pricing and fast delivery across India.".substring(0, 160),
  keywords: [
    "B2C marketplace India", "wholesale suppliers", "bulk products", "organic compounds", 
    "industrial chemicals", "spices wholesale", "verified suppliers", "business procurement",
    "GST compliant", "tax inclusive pricing", "bulk orders", "manufacturer direct",
    "chemical suppliers India", "organic compounds supplier", "industrial supplies",
    "wholesale marketplace", "B2C e-commerce", "supplier network India"
  ],
  authors: [{ name: "Azlok Team" }],
  creator: "Azlok Enterprises",
  publisher: "Azlok",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://azlok.com'),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: "Azlok - Premium B2C Marketplace & E-commerce Platform in India",
    description: "India's leading B2C marketplace connecting verified suppliers with businesses. Quality products, competitive pricing, fast delivery.".substring(0, 160),
    url: 'https://azlok.com',
    siteName: 'Azlok',
    images: [
      {
        url: '/home_page_banner.png',
        width: 1200,
        height: 630,
        alt: 'Azlok B2C Marketplace',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Azlok - Premium B2C Marketplace India",
    description: "India's leading B2C marketplace for verified suppliers and quality products.".substring(0, 160),
    images: ['/home_page_banner.png'],
    creator: '@azlok',
    site: '@azlok',
  },
  // Robots meta tag is handled directly in layout.tsx

};
