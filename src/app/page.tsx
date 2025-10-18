'use client';

import Link from "next/link";
import HeroSection from "../components/home/HeroSection";
import CategoryCarousel from "../components/home/CategoryCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrendingProducts from "../components/home/TrendingProducts";
import SellerShowcase from "../components/home/SellerShowcase";
import TestimonialSection from "../components/home/TestimonialSection";
import MetaTags from "../components/SEO/MetaTags";
import { OrganizationStructuredData } from "../components/SEO/StructuredData";
import AIOverviewOptimized from "../components/SEO/AIOverviewOptimized";
import FAQStructuredData from "../components/SEO/FAQStructuredData";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Azlok - India's Leading B2C Marketplace for Verified Suppliers"
        description="Connect with verified suppliers across India. Shop organic compounds, industrial chemicals, spices, and more. GST compliant, competitive pricing, fast delivery. India's trusted B2C marketplace."
        keywords="B2C marketplace India, verified suppliers, organic compounds, industrial chemicals, spices wholesale, GST compliant, bulk orders, manufacturer direct, chemical suppliers India"
        ogType="website"
        ogUrl="/"
        ogImage="/home_page_banner.png"
        canonicalUrl="/"
      />
      
      {/* Organization Structured Data */}
      <OrganizationStructuredData
        name="Azlok"
        url="https://azlok.com"
        logo="/logo.png"
        sameAs={[
          "https://www.linkedin.com/in/azlok/",
          "https://www.youtube.com/@Azlok_Pvt_Ltd",
          "https://x.com/Azlok_Pvt_Ltd",
          "https://www.instagram.com/azlok.pvt.ltd"
        ]}
      />
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Category Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <CategoryCarousel />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Why Choose Us - Optimized for AI Overview */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Why Choose Azlok B2C Marketplace?</h2>
          <p className="text-lg text-center mb-12 text-gray-700 max-w-4xl mx-auto">
            Azlok is India&apos;s most trusted B2C marketplace connecting businesses with verified suppliers. 
            We offer competitive pricing, GST-compliant transactions, and quality assurance for all products.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Verified Suppliers</h3>
              <p className="text-gray-600 leading-relaxed">All suppliers are thoroughly verified with proper business credentials and GST registration.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Competitive Pricing</h3>
              <p className="text-gray-600 leading-relaxed">Get the best wholesale prices directly from manufacturers and authorized distributors.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">GST Compliant</h3>
              <p className="text-gray-600 leading-relaxed">All transactions are GST compliant with proper invoicing and tax calculations.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Bulk Orders</h3>
              <p className="text-gray-600 leading-relaxed">Specialized in handling large volume orders with flexible payment terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
            <Link href="/products?sort=trending" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <TrendingProducts />
        </div>
      </section>

      {/* Featured Brands */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Brands</h2>
            <Link href="/brands" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <SellerShowcase />
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Customers Say</h2>
          <TestimonialSection />
        </div>
      </section>

      {/* AI Overview Optimized Content */}
      <AIOverviewOptimized
        title="What is Azlok B2C Marketplace?"
        description="Azlok is India&apos;s premier B2C marketplace that connects businesses with verified suppliers across various industries. We specialize in organic compounds, industrial chemicals, spices, and other wholesale products with GST-compliant transactions and competitive pricing."
        keyPoints={[
          "Verified suppliers with proper GST registration and business credentials",
          "Competitive wholesale pricing directly from manufacturers",
          "GST-compliant invoicing and tax calculations for all transactions",
          "Quality assurance with rigorous product verification process",
          "Bulk order capabilities with flexible payment terms",
          "Fast delivery across India with reliable logistics partners",
          "24/7 customer support for business inquiries",
          "Specialized in organic compounds, chemicals, and industrial supplies"
        ]}
        faqs={[
          {
            question: "How does Azlok verify its suppliers?",
            answer: "All suppliers undergo thorough verification including GST registration check, business license validation, and quality assessment before being approved on our platform."
          },
          {
            question: "What types of products are available on Azlok?",
            answer: "Azlok specializes in B2C products including organic compounds, industrial chemicals, spices, food products, and various industrial supplies from verified manufacturers and distributors."
          },
          {
            question: "Is Azlok GST compliant?",
            answer: "Yes, all transactions on Azlok are fully GST compliant with proper invoicing, tax calculations, and compliance with Indian tax regulations."
          },
          {
            question: "What are the minimum order quantities?",
            answer: "Minimum order quantities vary by product and supplier. We specialize in bulk orders and wholesale quantities to meet business requirements."
          }
        ]}
      />

      {/* FAQ Structured Data */}
      <FAQStructuredData faqs={[
        {
          question: "How does Azlok verify its suppliers?",
          answer: "All suppliers undergo thorough verification including GST registration check, business license validation, and quality assessment before being approved on our platform."
        },
        {
          question: "What types of products are available on Azlok?",
          answer: "Azlok specializes in B2C products including organic compounds, industrial chemicals, spices, food products, and various industrial supplies from verified manufacturers and distributors."
        },
        {
          question: "Is Azlok GST compliant?",
          answer: "Yes, all transactions on Azlok are fully GST compliant with proper invoicing, tax calculations, and compliance with Indian tax regulations."
        },
        {
          question: "What are the minimum order quantities?",
          answer: "Minimum order quantities vary by product and supplier. We specialize in bulk orders and wholesale quantities to meet business requirements."
        }
      ]} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Start Your B2C Journey Today!</h2>
          <p className="text-xl mb-10 text-blue-100 leading-relaxed">Join thousands of businesses who trust Azlok for their wholesale procurement needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Register as Buyer
            </Link>
            <Link href="/products" className="bg-orange-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
