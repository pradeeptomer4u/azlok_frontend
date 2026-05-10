import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Azlok | Premium B2C Online Marketplace India",
  description: "Shop verified Indian suppliers on Azlok — organic compounds, spices, essential oils & industrial chemicals. GST-compliant pricing, free shipping, fast delivery.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    // Apple touch icon falls back to the logo PNG until a dedicated 180x180
    // file is added to /public. Avoids the prior 404 on every page.
    apple: '/logo.png',
  },
  keywords: [
    "B2C marketplace India", "wholesale suppliers", "bulk products", "organic compounds", 
    "industrial chemicals", "spices wholesale", "verified suppliers", "business procurement",
    "GST compliant", "tax inclusive pricing", "bulk orders", "manufacturer direct",
    "chemical suppliers India", "organic compounds supplier", "industrial supplies",
    "wholesale marketplace", "B2C e-commerce", "supplier network India"
  ],
  authors: [{ name: "Azlok Team" }],
  creator: "Azlok",
  publisher: "Azlok",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.azlok.com'),
  // Set canonical URL for the root/home page
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: "Azlok | Premium B2C Online Marketplace India",
    description: "Shop verified Indian suppliers — organic compounds, spices, essential oils & industrial chemicals. GST-compliant, free shipping, fast delivery.",
    url: 'https://www.azlok.com',
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
    title: "Azlok | Premium B2C Online Marketplace India",
    description: "India's leading B2C marketplace for verified suppliers and quality products.",
    images: ['/home_page_banner.png'],
    creator: '@azlok',
    site: '@azlok',
  },
  // Robots meta tag is handled directly in layout.tsx

};
