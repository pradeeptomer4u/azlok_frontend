'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10">
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

      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">About Azlok</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="prose max-w-none">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Redefining Online Shopping</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                At Azlok, we believe shopping should be more than just a transaction—it should be an experience. 
                We&apos;re committed to bringing you premium products, exceptional service, and a seamless shopping journey 
                that exceeds your expectations every time.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded with a vision to transform the e-commerce landscape in India, Azlok started as a small team 
              passionate about connecting customers with quality products from trusted sellers. What began as a 
              simple idea has grown into a comprehensive platform serving thousands of satisfied customers across the country.
            </p>
            <p className="text-gray-700 mb-6">
              Our journey has been driven by one core belief: every customer deserves access to premium products, 
              reliable service, and a shopping experience that brings joy and convenience to their lives.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Mission</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 text-lg font-medium">
                &quot;To democratize access to premium products while building lasting relationships with our customers 
                through trust, quality, and exceptional service.&quot;
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🛡️ Trust & Security</h3>
                <p className="text-gray-700">
                  We prioritize your security with industry-standard encryption, secure payment processing, 
                  and transparent policies that protect your personal information.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">⭐ Quality First</h3>
                <p className="text-gray-700">
                  Every product undergoes rigorous quality checks. We partner only with verified sellers 
                  who share our commitment to excellence.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🚀 Innovation</h3>
                <p className="text-gray-700">
                  We continuously evolve our platform with cutting-edge technology to provide you with 
                  the most intuitive and efficient shopping experience.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🤝 Customer-Centric</h3>
                <p className="text-gray-700">
                  Your satisfaction is our success. We listen to your feedback and constantly improve 
                  our services to better serve your needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">What Makes Us Different</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Curated Product Selection</h3>
                  <p className="text-gray-700">We handpick every product and seller to ensure you get only the best quality items.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Lightning-Fast Delivery</h3>
                  <p className="text-gray-700">Our efficient logistics network ensures your orders reach you quickly and safely.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800">24/7 Customer Support</h3>
                  <p className="text-gray-700">Our dedicated support team is always ready to help you with any questions or concerns.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Hassle-Free Returns</h3>
                  <p className="text-gray-700">Not satisfied? Our 30-day return policy makes it easy to return or exchange items.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Commitment to Sustainability</h2>
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

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-700">Happy Customers</div>
              </div>
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
                <div className="text-gray-700">Products</div>
              </div>
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-700">Trusted Sellers</div>
              </div>
              <div className="text-center bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-700">Cities Served</div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Looking Ahead</h2>
            <p className="text-gray-700 mb-4">
              As we continue to grow, our focus remains unchanged: providing you with the best online shopping 
              experience possible. We&apos;re constantly working on new features, expanding our product range, 
              and improving our services based on your valuable feedback.
            </p>
            <p className="text-gray-700 mb-6">
              Our roadmap includes expanding to international markets, introducing more sustainable products, 
              and leveraging AI technology to personalize your shopping experience even further.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              We&apos;d love to hear from you! Whether you have questions, suggestions, or just want to say hello, 
              our team is always here to connect.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">📧 Email Us</h4>
                  <p className="text-gray-700">hello@azlok.com</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">📞 Call Us</h4>
                  <p className="text-gray-700">8800412138</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">📍 Visit Us</h4>
                  <p className="text-gray-700">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 p-6 bg-blue-600 text-white rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Thank you for choosing Azlok!</h3>
              <p className="text-blue-100">
                Your trust in us drives everything we do. We&apos;re honored to be part of your shopping journey 
                and look forward to serving you for years to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
