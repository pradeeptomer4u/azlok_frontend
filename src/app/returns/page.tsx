'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Returns & Refunds - Azlok"
        description="Learn about Azlok's return policy, refund process, and how to return or exchange items with easy step-by-step instructions."
        keywords="returns, refunds, return policy, exchange, money back guarantee, return process, refund policy"
        ogType="website"
        ogUrl="/returns"
        ogImage="/logo.png"
        canonicalUrl="/returns"
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

      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Returns & Refunds</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, we&apos;re here to help with our hassle-free return policy.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">30-Day Return Policy</h3>
              <p className="text-gray-700">
                We offer a 30-day return window from the date of delivery for most items. Items must be unused, in original packaging, and in resalable condition.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">What Can Be Returned?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-3">✓ Returnable Items</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Clothing and accessories</li>
                  <li>• Electronics (unopened)</li>
                  <li>• Home decor items</li>
                  <li>• Books and media</li>
                  <li>• Beauty products (unopened)</li>
                  <li>• Sports and fitness equipment</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-700 mb-3">✗ Non-Returnable Items</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Personalized/custom items</li>
                  <li>• Perishable goods</li>
                  <li>• Intimate apparel</li>
                  <li>• Opened beauty products</li>
                  <li>• Digital downloads</li>
                  <li>• Gift cards</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">How to Return an Item</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Log into Your Account</h3>
                  <p className="text-gray-700">Go to &quot;My Orders&quot; and find the item you want to return.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Select Return Reason</h3>
                  <p className="text-gray-700">Choose the reason for return and provide any additional details.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Print Return Label</h3>
                  <p className="text-gray-700">We&apos;ll provide a prepaid return shipping label for eligible returns.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Package & Ship</h3>
                  <p className="text-gray-700">Pack the item securely in its original packaging and ship it back to us.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">5</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Receive Refund</h3>
                  <p className="text-gray-700">Once we receive and inspect your return, we&apos;ll process your refund.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Return Conditions</h2>
            <p className="text-gray-700 mb-4">
              To ensure a smooth return process, please make sure your items meet these conditions:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Items must be returned within 30 days of delivery</li>
              <li className="mb-2">Items must be unused and in original condition</li>
              <li className="mb-2">Original packaging and tags must be included</li>
              <li className="mb-2">Include all accessories and documentation</li>
              <li className="mb-2">Items must be in resalable condition</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Refund Process</h2>
            
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Refund Timeline</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• <strong>Processing:</strong> 1-2 business days after we receive your return</li>
                <li>• <strong>Credit Card:</strong> 3-5 business days</li>
                <li>• <strong>Debit Card:</strong> 5-7 business days</li>
                <li>• <strong>UPI/Digital Wallet:</strong> 1-3 business days</li>
                <li>• <strong>Net Banking:</strong> 3-5 business days</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">Refund Methods</h3>
            <p className="text-gray-700 mb-4">
              Refunds are processed to your original payment method. If the original payment method is no longer available, we&apos;ll work with you to find an alternative solution.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Exchanges</h2>
            <p className="text-gray-700 mb-4">
              We currently don&apos;t offer direct exchanges. If you need a different size, color, or model, please return the original item and place a new order for the desired product.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-700 mb-4">
              If you receive a damaged or defective item, please contact us immediately. We&apos;ll provide a prepaid return label and expedite your refund or replacement.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Report damaged items within 48 hours of delivery</li>
              <li className="mb-2">Provide photos of the damage when possible</li>
              <li className="mb-2">Keep all original packaging</li>
              <li className="mb-2">We&apos;ll cover all return shipping costs</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Return Shipping</h2>
            <p className="text-gray-700 mb-4">
              Return shipping costs depend on the reason for return:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2"><strong>Our fault:</strong> We cover all return shipping costs</li>
              <li className="mb-2"><strong>Change of mind:</strong> Customer covers return shipping (₹99)</li>
              <li className="mb-2"><strong>Wrong size/color:</strong> Customer covers return shipping (₹99)</li>
              <li className="mb-2"><strong>Defective items:</strong> We cover all return shipping costs</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">International Returns</h2>
            <p className="text-gray-700 mb-4">
              Currently, we only accept returns from within India. International return options will be available as we expand our shipping coverage.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              Our customer service team is here to help with any return-related questions:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
                  <p className="text-gray-700">hello@azlok.com</p>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
                  <p className="text-gray-700">8800412138</p>
                  <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 mb-2">Live Chat</h4>
                  <p className="text-gray-700">Available 24/7</p>
                  <p className="text-sm text-gray-600">Instant support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
