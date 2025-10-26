import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Import metadata from separate file
import { metadata } from "./layout-metadata";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import KeepAliveInitializer from "../components/utils/KeepAliveInitializer";
import ErrorBoundary from "../components/utils/ErrorBoundary";
import WhatsAppChat from "../components/WhatsAppChat";
import { WebsiteSchema, OrganizationSchema } from "../components/SEO";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Export the metadata
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization data for schema
  const organizationData = {
    name: "Azlok",
    alternateName: "Azlok",
    url: "https://www.azlok.com",
    logo: "https://www.azlok.com/logo.png",
    description: "India's leading B2C marketplace connecting verified suppliers with businesses",
    foundingDate: "2024",
    priceRange: "₹₹",
    founders: [
      {
        "@type": "Person",
        "name": "Azlok Team"
      }
    ],
    address: {
      "@type": "PostalAddress",
      "streetAddress": "26-Chandresh Godavari, Station Road Nilje, Dombivli",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "421204",
      "addressCountry": "IN"
    },
    contactPoint: {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+91 8800412138",
      "email": "hello@azlok.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.facebook.com/azl.ok/",
      "https://x.com/Azlok_Pvt_Ltd",
      "https://www.linkedin.com/in/azlok/",
      "https://www.instagram.com/azlok.pvt.ltd"
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
  };
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="sitemap" type="application/xml" href="https://www.azlok.com/sitemap.xml" />
      {/* Hreflang tags */}
      <link rel="alternate" hrefLang="en" href="https://www.azlok.com" />
      <link rel="alternate" hrefLang="en-us" href="https://www.azlok.com" />
      <link rel="alternate" hrefLang="en-in" href="https://www.azlok.com" />
      <link rel="alternate" hrefLang="x-default" href="https://www.azlok.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Organization Schema is now added in the body */}
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <LanguageProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              {/* Keep-alive service to prevent Render from spinning down due to inactivity */}
              <KeepAliveInitializer />
              
              {/* WhatsApp Chat Widget */}
              <WhatsAppChat 
                phoneNumber="918800412138"
                welcomeMessage="Hello! I'm interested in Azlok products and would like more information."
                buttonStyle="floating"
                position="bottom-right"
                companyName="Azlok Pvt Ltd"
              />
              
              {/* Website Schema JSON-LD */}
              <WebsiteSchema 
                siteUrl="https://www.azlok.com"
                siteName="Azlok"
                description="India's leading B2C marketplace connecting verified suppliers with businesses. Quality products, competitive pricing, fast delivery."
                searchUrl="https://www.azlok.com/search?q={search_term_string}"
              />
              
              {/* Organization Schema JSON-LD */}
              <OrganizationSchema 
                name={organizationData.name}
                alternateName={organizationData.alternateName}
                url={organizationData.url}
                logo={organizationData.logo}
                description={organizationData.description}
                foundingDate={organizationData.foundingDate}
                priceRange={organizationData.priceRange}
                sameAs={organizationData.sameAs}
              />
              </LanguageProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
