'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Shipping Information - Azlok"
        description="Learn about Azlok's shipping policies, delivery options, costs, and estimated delivery times across India."
        keywords="shipping, delivery, shipping policy, delivery time, shipping cost, express delivery, standard shipping"
        ogType="website"
        ogUrl="/shipping"
        ogImage="/logo.png"
        canonicalUrl="/shipping"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shipping Information</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              We&apos;re committed to delivering your orders quickly and safely. Here&apos;s everything you need to know about our shipping policies and delivery options.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Shipping Coverage</h2>
            <p className="text-gray-700 mb-4">
              Currently, we ship to all locations within India. We&apos;re working on expanding our shipping to international destinations in the near future.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Delivery Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Standard Delivery</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Delivery Time: 3-7 business days</li>
                  <li>• Cost: Free for orders above ₹999</li>
                  <li>• Cost: ₹99 for orders below ₹999</li>
                  <li>• Tracking included</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Express Delivery</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Delivery Time: 1-3 business days</li>
                  <li>• Cost: ₹199 (all orders)</li>
                  <li>• Priority handling</li>
                  <li>• Real-time tracking</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Delivery Zones & Timeframes</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Zone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cities/Areas</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Standard Delivery</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Zone 1</td>
                    <td className="border border-gray-300 px-4 py-2">Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata</td>
                    <td className="border border-gray-300 px-4 py-2">2-4 days</td>
                    <td className="border border-gray-300 px-4 py-2">1-2 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Zone 2</td>
                    <td className="border border-gray-300 px-4 py-2">Other major cities and state capitals</td>
                    <td className="border border-gray-300 px-4 py-2">3-5 days</td>
                    <td className="border border-gray-300 px-4 py-2">2-3 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Zone 3</td>
                    <td className="border border-gray-300 px-4 py-2">Tier 2 & Tier 3 cities, rural areas</td>
                    <td className="border border-gray-300 px-4 py-2">4-7 days</td>
                    <td className="border border-gray-300 px-4 py-2">3-5 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Order Processing</h2>
            <p className="text-gray-700 mb-4">
              Orders are processed Monday through Friday (excluding holidays). Orders placed before 2:00 PM IST are typically processed the same day, while orders placed after 2:00 PM are processed the next business day.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Order confirmation: Immediate email confirmation</li>
              <li className="mb-2">Processing time: 1-2 business days</li>
              <li className="mb-2">Shipping notification: Email with tracking details</li>
              <li className="mb-2">Delivery confirmation: SMS and email notification</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Tracking Your Order</h2>
            <p className="text-gray-700 mb-4">
              Once your order ships, you&apos;ll receive a tracking number via email and SMS. You can track your package using:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Your Azlok account dashboard</li>
              <li className="mb-2">The tracking link in your shipping confirmation email</li>
              <li className="mb-2">Our customer support team</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Special Shipping Considerations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">Large Items</h3>
            <p className="text-gray-700 mb-4">
              Furniture and large appliances may require special delivery arrangements and additional time. We&apos;ll contact you to schedule delivery for these items.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">Fragile Items</h3>
            <p className="text-gray-700 mb-4">
              Electronics, glassware, and other fragile items are packed with extra care using protective materials and may take additional processing time.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">Perishable Items</h3>
            <p className="text-gray-700 mb-4">
              Fresh food items and perishables are shipped via express delivery only and may have limited delivery areas.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Delivery Attempts</h2>
            <p className="text-gray-700 mb-4">
              Our delivery partners will make up to 3 delivery attempts. If delivery is unsuccessful after 3 attempts, the package will be returned to our warehouse, and you&apos;ll be contacted for further instructions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Address Changes</h2>
            <p className="text-gray-700 mb-4">
              Address changes can be made within 1 hour of placing your order. After that, please contact our customer support team. Address changes may not be possible once the item has shipped.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Shipping Restrictions</h2>
            <p className="text-gray-700 mb-4">
              Some items cannot be shipped to certain locations due to legal restrictions or safety concerns. These restrictions will be clearly mentioned on the product page.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For shipping-related questions or concerns, please contact us:
            </p>
            <ul className="list-none pl-6 mb-4 text-gray-700">
              <li className="mb-2">Email: hello@azlok.com</li>
              <li className="mb-2">Phone: 8800412138</li>
              <li className="mb-2">Live Chat: Available 24/7 on our website</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
