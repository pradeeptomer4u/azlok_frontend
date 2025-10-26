import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';
import CategoryListClient from '../../components/categories/CategoryListClient';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'All Categories - Azlok',
    description: 'Browse all product categories available at Azlok. Find electronics, clothing, furniture, and more.'.substring(0, 160),
    keywords: 'categories, product categories, shopping categories, electronics, clothing, furniture',
    alternates: {
      canonical: '/categories',
    },
    openGraph: {
      title: 'All Categories - Azlok',
      description: 'Browse all product categories available at Azlok. Find electronics, clothing, furniture, and more.'.substring(0, 160),
      url: '/categories',
      siteName: 'Azlok',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Azlok Categories',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'All Categories - Azlok',
      description: 'Browse all product categories available at Azlok. Find electronics, clothing, furniture, and more.'.substring(0, 160),
      images: ['/logo.png'],
      creator: '@azlok',
      site: '@azlok',
    },
  };
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fdfb] py-10">
      {/* Organization Structured Data */}
      <OrganizationStructuredData
        name="Azlok"
        url="https://www.azlok.com"
        logo="/logo.png"
        sameAs={[
          "https://www.linkedin.com/in/azlok/",
          "https://www.youtube.com/@Azlok_Pvt_Ltd",
          "https://x.com/Azlok_Pvt_Ltd",
          "https://www.instagram.com/azlok.pvt.ltd"
        ]}
      />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4ade80]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#38bdf8]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-tr from-[#f472b6]/10 to-transparent rounded-full blur-2xl"></div>

      {/* Animated Floating Shapes */}
      <div className="absolute top-20 right-1/4 w-8 h-8 border border-[#4ade80]/30 rounded-full opacity-60 animate-float-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 border border-[#38bdf8]/30 rounded-md rotate-45 opacity-40 animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/5 w-6 h-6 border border-[#f472b6]/30 rounded-md rotate-12 opacity-50 animate-float-fast"></div>

      <div className="container-custom mx-auto relative z-10">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4ade80]/20 to-[#38bdf8]/20 p-8 shadow-lg">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4ade80]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#38bdf8]/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Playfair_Display',serif]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2c7a4c] to-[#1d6fb8]">From Earth to Your Home</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl font-['Montserrat',sans-serif]">
              Browse authentic products sourced directly from local farmers and artisanal manufacturers. Experience the difference that comes from supporting real people and their craft.
            </p>
            <div className="mt-4 italic text-sm text-gray-500 border-l-2 border-[#4ade80] pl-3 max-w-xl">
              <span className="font-medium text-[#2c7a4c]">&quot;</span> I&apos;ve been using Azlok products for years. Knowing that my purchase supports local farmers and craftspeople makes every item special. The quality speaks for itself! <span className="font-medium text-[#2c7a4c]">&quot;</span>
              <span className="block mt-1 text-right font-medium">— Priya S., Loyal Customer</span>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
              <circle cx="40" cy="40" r="30" stroke="#4ade80" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="40" cy="40" r="20" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="40" cy="40" r="10" fill="#f472b6" fillOpacity="0.2" />
            </svg>
          </div>
        </div>
        
        {/* Category List Client Component */}
        <CategoryListClient />
      </div>
    </div>
  );
}
