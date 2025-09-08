import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import KeepAliveInitializer from "../components/utils/KeepAliveInitializer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azlok - Premium B2C Marketplace & E-commerce Platform in India",
  description: "Azlok is India's leading B2C marketplace connecting verified suppliers with businesses. Shop quality products including organic compounds, spices, chemicals, and industrial supplies with competitive pricing and fast delivery across India.",
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
    description: "India's leading B2C marketplace connecting verified suppliers with businesses. Quality products, competitive pricing, fast delivery.",
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
    description: "India's leading B2C marketplace for verified suppliers and quality products.",
    images: ['/home_page_banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Azlok",
              "alternateName": "Azlok Enterprises",
              "url": "https://azlok.com",
              "logo": "https://azlok.com/logo.png",
              "description": "India's leading B2C marketplace connecting verified suppliers with businesses",
              "foundingDate": "2024",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Azlok Team"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "Maharashtra",
                "addressLocality": "Mumbai"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://www.facebook.com/azlok",
                "https://www.twitter.com/azlok",
                "https://www.linkedin.com/company/azlok",
                "https://www.instagram.com/azlok"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Azlok Product Catalog",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Organic Compounds",
                    "description": "High-quality organic compounds for industrial and research use"
                  },
                  {
                    "@type": "OfferCatalog", 
                    "name": "Industrial Chemicals",
                    "description": "Premium industrial chemicals from verified suppliers"
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Spices & Food Products",
                    "description": "Authentic spices and food products for wholesale"
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            {/* Keep-alive service to prevent Render from spinning down due to inactivity */}
            <KeepAliveInitializer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
