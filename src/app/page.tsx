'use client';

import Image from "next/image";
import Link from "next/link";
import HeroSection from "../components/home/HeroSection";
import CategoryCarousel from "../components/home/CategoryCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrendingProducts from "../components/home/TrendingProducts";
import SellerShowcase from "../components/home/SellerShowcase";
import TestimonialSection from "../components/home/TestimonialSection";
import MetaTags from "../components/SEO/MetaTags";
import { OrganizationStructuredData } from "../components/SEO/StructuredData";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Azlok - Premium Online Shopping"
        description="Discover a wide range of quality products at Azlok. Enjoy fast delivery, secure payments, and exceptional customer service."
        keywords="online shopping, e-commerce, retail, fashion, electronics, home decor, beauty products"
        ogType="website"
        ogUrl="/"
        ogImage="/logo.png"
        canonicalUrl="/"
      />
      
      {/* Organization Structured Data */}
      <OrganizationStructuredData
        name="Azlok"
        url="https://azlok.com"
        logo="/logo.png"
        sameAs={[
          "https://facebook.com/azlok",
          "https://twitter.com/azlok",
          "https://instagram.com/azlok"
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

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Azlok?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Transactions</h3>
              <p className="text-gray-600 leading-relaxed">Your transactions are protected with industry-standard security measures.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">All products undergo rigorous quality checks before approval.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">Our customer support team is available round the clock to assist you.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Enjoy quick and reliable delivery to your doorstep across the country.</p>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Brands</h2>
            <Link href="/brands" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          <SellerShowcase />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Customers Say</h2>
          <TestimonialSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Start Shopping Today!</h2>
          <p className="text-xl mb-10 text-blue-100 leading-relaxed">Join thousands of satisfied customers who love shopping at Azlok.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Create Account
            </Link>
            <Link href="/products" className="bg-orange-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
