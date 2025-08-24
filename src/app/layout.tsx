import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azlok - Modern E-commerce Store",
  description: "Azlok is a premium online shopping destination offering a wide range of products with fast delivery and exceptional customer service",
  keywords: ["online shopping", "e-commerce", "retail", "products", "fast delivery", "India", "Azlok"],
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
