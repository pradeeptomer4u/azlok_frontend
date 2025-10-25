'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* SEO Meta Tags */}
            {/* Metadata now handled by layout.tsx */}
      
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
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Shipping Information</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
              <p className="text-gray-600 mb-6">
                We&apos;re committed to delivering your orders quickly and safely. Here&apos;s everything you need to know about our shipping policies and delivery options.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Shipping Coverage</h2>
              <p className="text-gray-700 mb-4">
                Currently, we ship to all locations within India. We&apos;re working on expanding our shipping to international destinations in the near future.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Delivery Options</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">🚚</span>
                    Standard Delivery
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Delivery Time: 3-7 business days
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Cost: Free for orders above ₹999
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Cost: ₹99 for orders below ₹999
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Tracking included
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">⚡</span>
                    Express Delivery
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Delivery Time: 1-3 business days
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Cost: ₹199 (all orders)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Priority handling
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Real-time tracking
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Delivery Zones & Timeframes</h2>
              <div className="overflow-x-auto mb-6 border border-green-200/50 rounded-lg shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-green-100/70">
                      <th className="border-b border-green-200/50 px-4 py-2 text-left font-['Playfair_Display',serif]">Zone</th>
                      <th className="border-b border-green-200/50 px-4 py-2 text-left font-['Playfair_Display',serif]">Cities/Areas</th>
                      <th className="border-b border-green-200/50 px-4 py-2 text-left font-['Playfair_Display',serif]">Standard Delivery</th>
                      <th className="border-b border-green-200/50 px-4 py-2 text-left font-['Playfair_Display',serif]">Express Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50/30 transition-colors duration-150">
                      <td className="border-b border-green-200/50 px-4 py-2 font-medium">Zone 1</td>
                      <td className="border-b border-green-200/50 px-4 py-2">Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata</td>
                      <td className="border-b border-green-200/50 px-4 py-2">2-4 days</td>
                      <td className="border-b border-green-200/50 px-4 py-2">1-2 days</td>
                    </tr>
                    <tr className="hover:bg-green-50/30 transition-colors duration-150">
                      <td className="border-b border-green-200/50 px-4 py-2 font-medium">Zone 2</td>
                      <td className="border-b border-green-200/50 px-4 py-2">Other major cities and state capitals</td>
                      <td className="border-b border-green-200/50 px-4 py-2">3-5 days</td>
                      <td className="border-b border-green-200/50 px-4 py-2">2-3 days</td>
                    </tr>
                    <tr className="hover:bg-green-50/30 transition-colors duration-150">
                      <td className="border-b border-green-200/50 px-4 py-2 font-medium">Zone 3</td>
                      <td className="border-b border-green-200/50 px-4 py-2">Tier 2 & Tier 3 cities, rural areas</td>
                      <td className="border-b border-green-200/50 px-4 py-2">4-7 days</td>
                      <td className="border-b border-green-200/50 px-4 py-2">3-5 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Order Processing</h2>
              <p className="text-gray-700 mb-4">
                Orders are processed Monday through Friday (excluding holidays). Orders placed before 2:00 PM IST are typically processed the same day, while orders placed after 2:00 PM are processed the next business day.
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">1</span>
                  Order confirmation: Immediate email confirmation
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">2</span>
                  Processing time: 1-2 business days
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">3</span>
                  Shipping notification: Email with tracking details
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">4</span>
                  Delivery confirmation: SMS and email notification
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Tracking Your Order</h2>
              <p className="text-gray-700 mb-4">
                Once your order ships, you&apos;ll receive a tracking number via email and SMS. You can track your package using:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Your Azlok account dashboard
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The tracking link in your shipping confirmation email
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Our customer support team
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Special Shipping Considerations</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Large Items</h3>
                  <p className="text-gray-700 text-sm">
                    Furniture and large appliances may require special delivery arrangements and additional time. We&apos;ll contact you to schedule delivery for these items.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Fragile Items</h3>
                  <p className="text-gray-700 text-sm">
                    Electronics, glassware, and other fragile items are packed with extra care using protective materials and may take additional processing time.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Perishable Items</h3>
                  <p className="text-gray-700 text-sm">
                    Fresh food items and perishables are shipped via express delivery only and may have limited delivery areas.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Delivery Attempts</h2>
              <p className="text-gray-700 mb-4">
                Our delivery partners will make up to 3 delivery attempts. If delivery is unsuccessful after 3 attempts, the package will be returned to our warehouse, and you&apos;ll be contacted for further instructions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Address Changes</h2>
              <p className="text-gray-700 mb-4">
                Address changes can be made within 1 hour of placing your order. After that, please contact our customer support team. Address changes may not be possible once the item has shipped.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Shipping Restrictions</h2>
              <p className="text-gray-700 mb-4">
                Some items cannot be shipped to certain locations due to legal restrictions or safety concerns. These restrictions will be clearly mentioned on the product page.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Contact Us</h2>
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <p className="text-gray-700 mb-4 relative z-10">
                  For shipping-related questions or concerns, please contact us:
                </p>
                <ul className="list-none pl-6 mb-4 text-gray-700 relative z-10">
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">📧</span>
                    Email: hello@azlok.com
                  </li>
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">📞</span>
                    Phone: 8800412138
                  </li>
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">💬</span>
                    Live Chat: Available 24/7 on our website
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
