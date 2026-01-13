'use client';

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SearchAutocomplete from "../components/search/SearchAutocomplete";
import MetaTags from "../components/SEO/MetaTags";
import { OrganizationStructuredData } from "../components/SEO/StructuredData";
import FAQStructuredData from "../components/SEO/FAQStructuredData";
import { CanonicalUrl } from "../components/SEO";
import { ArrowRight, BadgeCheck } from 'lucide-react';

// Lazy load below-fold components for better LCP
const CategoryCarousel = dynamic(() => import("../components/home/CategoryCarousel"), { ssr: true });
const FeaturedProducts = dynamic(() => import("../components/home/FeaturedProducts"), { ssr: false });
const TrendingProducts = dynamic(() => import("../components/home/TrendingProducts"), { ssr: false });
const TestimonialSection = dynamic(() => import("../components/home/TestimonialSection"), { ssr: false });
const WhyChooseUs = dynamic(() => import("../components/home/WhyChooseUs"), { ssr: false });
const NatureGoodnessCTA = dynamic(() => import("../components/home/NatureGoodnessCTA"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Azlok - Farm-to-Consumer Natural Products | Direct from Manufacturers"
        description="Discover 100% natural products directly from manufacturers with farmer connections. No artificial colors or additives. Organic spices, natural ingredients, and authentic products at wholesale prices."
        keywords="natural products India, organic spices, direct from farmers, no artificial colors, manufacturer direct, farm to consumer, authentic spices, organic ingredients, natural food products"
        ogType="website"
        ogUrl="/"
        ogImage="/home_page_banner.png"
        canonicalUrl="/"
      />
      
      {/* Explicit Canonical URL */}
      <CanonicalUrl url="/" />
      
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
        address={{
          streetAddress: "26-Chandresh Godavari, Station Road Nilje, Dombivli",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "421204",
          addressCountry: "IN"
        }}
        contactPoint={{
          telephone: "+91 8800412138",
          email: "info@azlok.com",
          contactType: "customer service"
        }}
        priceRange="₹₹"
      />
      {/* Hero Banner with Search - Modern Style */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
        </div>
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-3 md:mb-0 md:pr-12">
              <h1 className="text-xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-6 leading-tight font-['Playfair_Display',serif]">
                <span className="block drop-shadow-sm">100% Natural Products <span className="hidden md:inline"><br /></span><span className="md:hidden">from </span><span className="text-yellow-400 font-extrabold">Farmers</span></span>
              </h1>
              <p className="hidden md:block text-xl text-green-100 mb-8 max-w-lg font-['Montserrat',sans-serif] font-light leading-relaxed">
                We make authentic products. Our ingredients come directly from farmers. We use no artificial colors. We add no additives. Just pure, natural goodness.
              </p>
              
              {/* Search Bar with Autocomplete - Hidden on mobile for better LCP */}
              <div className="hidden md:block max-w-xl w-full">
                <SearchAutocomplete />
              </div>
              
              {/* Trust Badges - Single badge on mobile */}
              <div className="flex flex-wrap gap-3 mt-2 md:mt-8">
                <div className="flex items-center text-white text-xs md:text-base">
                  <BadgeCheck className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                  <span>100% Natural</span>
                </div>
                <div className="hidden md:flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Farm Direct</span>
                </div>
                <div className="hidden md:flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>No Artificial Colors</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              {/* Mobile version - optimized image for LCP */}
              <div className="block md:hidden relative h-36 w-full rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="https://pub-4f4e78fc0ec74271a702caabd7e4e13d.r2.dev/images/hero-side-bg.jpg" 
                  alt="Natural Organic Products" 
                  width={480}
                  height={144}
                  style={{objectFit: 'cover', width: '100%', height: '100%'}}
                  className="rounded-lg"
                  priority
                  fetchPriority="high"
                  quality={40}
                  sizes="100vw"
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                />
              </div>
              
              {/* Desktop version with Next.js Image */}
              <div className="hidden md:block relative h-96 w-full rounded-lg overflow-hidden shadow-2xl transform md:translate-x-8">
                <Image 
                  src="https://pub-4f4e78fc0ec74271a702caabd7e4e13d.r2.dev/images/hero-side-bg.jpg" 
                  alt="Natural Organic Products" 
                  fill 
                  style={{objectFit: 'cover'}} 
                  className="rounded-lg"
                  priority
                  fetchPriority="high"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  onError={(e) => {
                    console.error('Desktop hero image failed to load:', e);
                    const imgElement = e.currentTarget as HTMLImageElement;
                    imgElement.src = '/globe.svg';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-green-900 font-bold py-2 px-4 rounded-lg shadow-lg">
                <span>100% Organic</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Showcase - Grid Style with Enhanced Graphics */}
      <section className="py-16 bg-[#defce8] relative overflow-hidden">
        {/* Advanced background graphics */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-3 bg-repeat mix-blend-overlay"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-100/20 to-green-200/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-gradient-to-tr from-green-100/10 to-blue-100/5 rounded-full blur-3xl"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-green-200/10 rounded-lg rotate-45 transform opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 border border-green-200/10 rounded-full opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="relative">
              <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full w-0 md:w-[40%] md:animate-[width_0.8s_0.2s_forwards]" />
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-gray-900 mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-700 to-green-800 md:animate-shimmer bg-[length:200%_100%]">
                  Categories
                </span>
              </h2>
              <p className="text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide leading-relaxed max-w-2xl">
                Explore our range of <span className="font-medium italic">100% natural products</span> sourced directly from farmers & manufacturers
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="mt-4 md:mt-0"
            >
              <Link href="/categories" className="group flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-200/40">
                <span>View All</span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </div>
          
          {/* Category Cards */}
          <CategoryCarousel />
        </div>
      </section>

      {/* Featured Products - Enhanced with Advanced Graphics */}
      <section className="py-16 bg-[#defce8]/70 relative overflow-hidden">
        {/* Advanced background graphics */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-3 bg-repeat mix-blend-overlay"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-green-200/10 to-green-300/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-gradient-to-tr from-green-200/5 to-blue-200/5 rounded-full blur-3xl animate-float1"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 right-1/5 w-20 h-20 border border-green-200/10 rounded-lg rotate-12 transform opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-green-200/10 rounded-full opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-4 md:mb-0 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full"
              />
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold mb-3"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-green-700 animate-shimmer bg-[length:200%_100%]">
                  Our Natural Products
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide leading-relaxed max-w-2xl"
              >
                <span className="italic">Handcrafted with care</span> using ingredients sourced directly from farmers
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="mt-4 md:mt-0"
            >
              <Link href="/products" className="group flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-full font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-200/40">
                <span>View All Products</span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </div>
          
          {/* Product Cards with Enhanced UI */}
          <div className="relative">
            {/* Optional: Add navigation arrows for desktop */}
            <button className="hidden md:block absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="overflow-hidden">
              <FeaturedProducts />
            </div>
            
            <button className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - With Advanced Graphics and Typography */}
      <WhyChooseUs />

      {/* Trending Products - With Enhanced UI */}
      <section className="py-16 bg-[#defce8]/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              />
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold font-['Playfair_Display',serif] mb-2"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-green-700 animate-shimmer bg-[length:200%_100%]">
                  Customer Favorites
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide leading-relaxed"
              >
                Our most loved natural products - straight from the farm to your home
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="mt-4 md:mt-0"
            >
              <Link href="/products?sort=trending" className="group flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-full font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-200/40 font-['Montserrat',sans-serif]">
                <span>View All Favorites</span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </div>
          
          {/* Enhanced Trending Products Display */}
          <div className="bg-[#defce8]/95 p-6 rounded-xl shadow-md">
            <TrendingProducts />
            
            {/* Mobile View - Scroll Indicator */}
            <div className="flex justify-center mt-6 md:hidden">
              <div className="flex space-x-2">
                <div className="h-1 w-8 bg-green-600 rounded-full"></div>
                <div className="h-1 w-2 bg-green-300 rounded-full"></div>
                <div className="h-1 w-2 bg-green-300 rounded-full"></div>
              </div>
            </div>
          </div>
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

      {/* Testimonials - With Advanced Graphics and Typography */}
      <section className="py-16 bg-[#defce8]/60 relative overflow-hidden">
        {/* Advanced background graphics */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-3 bg-repeat mix-blend-overlay"></div>
          
          {/* Animated gradient orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-200/20 to-green-300/10 rounded-full blur-3xl"
          ></motion.div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.2, 0.15]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-blue-200/10 to-blue-300/5 rounded-full blur-3xl"
          ></motion.div>
          
          {/* Decorative geometric shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"
          ></motion.div>
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"
          ></motion.div>
          
          {/* Decorative quotes */}
          <div className="absolute top-12 left-12 text-9xl text-green-100/20 font-serif">&quot;</div>
          <div className="absolute bottom-12 right-12 text-9xl text-green-100/20 font-serif">&quot;</div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center mb-12 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-full animate-shimmer bg-[length:200%_100%]"
            />
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold mb-3"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-700 to-green-800 animate-shimmer bg-[length:200%_100%]">
                What Our Customers Say
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 font-['Montserrat',sans-serif] font-light tracking-wide leading-relaxed max-w-2xl mx-auto"
            >
              Discover why our customers love our natural products and exceptional service
            </motion.p>
          </div>
          <TestimonialSection />
        </div>
      </section>


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

      {/* Enhanced CTA Section with Advanced Graphics */}
      <NatureGoodnessCTA />
    </div>
  );
}
