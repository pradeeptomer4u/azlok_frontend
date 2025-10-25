'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* SEO Meta Tags */}
      <MetaTags
        title="About Us - Azlok"
        description="Learn about Azlok's mission, values, and commitment to providing premium online shopping experiences with quality products and exceptional service."
        keywords="about azlok, company, mission, vision, values, team, premium shopping, e-commerce"
        ogType="website"
        ogUrl="/about"
        ogImage="/logo.png"
        canonicalUrl="/about"
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
      
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-orange-200/5 rounded-full blur-3xl animate-float2"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"></div>
      </div>

      <div className="container-custom mx-auto relative z-10 py-8">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50">
          <div className="px-6 py-8 relative group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">About Azlok</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-8 rounded-lg mb-8 border border-green-200/50 relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif] relative z-10">Redefining Online Shopping</h2>
              <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                At Azlok, we believe shopping should be more than just a transaction—it should be an experience. 
                We&apos;re committed to bringing you premium products, exceptional service, and a seamless shopping journey 
                that exceeds your expectations every time.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded with a vision to transform the e-commerce landscape in India, Azlok started as a small team 
              passionate about connecting customers with quality products from trusted sellers. What began as a 
              simple idea has grown into a comprehensive platform serving thousands of satisfied customers across the country.
            </p>
            <p className="text-gray-700 mb-6">
              Our journey has been driven by one core belief: every customer deserves access to premium products, 
              reliable service, and a shopping experience that brings joy and convenience to their lives.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Our Mission</h2>
            <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg mb-6 border border-green-200/50 relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
              
              <p className="text-gray-700 text-lg font-medium italic relative z-10">
                &quot;To democratize access to premium products while building lasting relationships with our customers 
                through trust, quality, and exceptional service.&quot;
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3">🛡️</span>
                  Trust & Security
                </h3>
                <p className="text-gray-700 relative z-10">
                  We prioritize your security with industry-standard encryption, secure payment processing, 
                  and transparent policies that protect your personal information.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3">⭐</span>
                  Quality First
                </h3>
                <p className="text-gray-700 relative z-10">
                  Every product undergoes rigorous quality checks. We partner only with verified sellers 
                  who share our commitment to excellence.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3">🚀</span>
                  Innovation
                </h3>
                <p className="text-gray-700 relative z-10">
                  We continuously evolve our platform with cutting-edge technology to provide you with 
                  the most intuitive and efficient shopping experience.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3">🤝</span>
                  Customer-Centric
                </h3>
                <p className="text-gray-700 relative z-10">
                  Your satisfaction is our success. We listen to your feedback and constantly improve 
                  our services to better serve your needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">What Makes Us Different</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Curated Product Selection</h3>
                  <p className="text-gray-700">We handpick every product and seller to ensure you get only the best quality items.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Lightning-Fast Delivery</h3>
                  <p className="text-gray-700">Our efficient logistics network ensures your orders reach you quickly and safely.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">24/7 Customer Support</h3>
                  <p className="text-gray-700">Our dedicated support team is always ready to help you with any questions or concerns.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Hassle-Free Returns</h3>
                  <p className="text-gray-700">Not satisfied? Our 30-day return policy makes it easy to return or exchange items.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Our Commitment to Sustainability</h2>
            <p className="text-gray-700 mb-4">
              We believe in responsible business practices that benefit not just our customers, but our planet too. 
              Our sustainability initiatives include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Eco-friendly packaging materials</li>
              <li className="mb-2">Carbon-neutral shipping options</li>
              <li className="mb-2">Partnerships with environmentally conscious brands</li>
              <li className="mb-2">Waste reduction programs in our operations</li>
              <li className="mb-2">Supporting local artisans and sustainable products</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Our Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-gray-700">Happy Customers</div>
              </div>
              <div className="text-center bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
                <div className="text-gray-700">Products</div>
              </div>
              <div className="text-center bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-700">Trusted Sellers</div>
              </div>
              <div className="text-center bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-700">Cities Served</div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Looking Ahead</h2>
            <p className="text-gray-700 mb-4">
              As we continue to grow, our focus remains unchanged: providing you with the best online shopping 
              experience possible. We&apos;re constantly working on new features, expanding our product range, 
              and improving our services based on your valuable feedback.
            </p>
            <p className="text-gray-700 mb-6">
              Our roadmap includes expanding to international markets, introducing more sustainable products, 
              and leveraging AI technology to personalize your shopping experience even further.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              We&apos;d love to hear from you! Whether you have questions, suggestions, or just want to say hello, 
              our team is always here to connect.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
              
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">📧 Email Us</h4>
                  <p className="text-gray-700">hello@azlok.com</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">📞 Call Us</h4>
                  <p className="text-gray-700">8800412138</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">📍 Visit Us</h4>
                  <p className="text-gray-700">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
              
              <h3 className="text-xl font-semibold mb-3 font-['Playfair_Display',serif] relative z-10">Thank you for choosing Azlok!</h3>
              <p className="text-green-100 relative z-10">
                Your trust in us drives everything we do. We&apos;re honored to be part of your shopping journey 
                and look forward to serving you for years to come.
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
