'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for demonstration
const information = {
  type: 'information',
  title: 'Azlok Product Information',
  description: 'Thank you for scanning our QR code. This page provides detailed information about our products, certifications, and quality standards.',
  imageUrl: '/logo.png',
  details: [
    { label: 'Company', value: 'Azlok' },
    { label: 'Established', value: '2020' },
    { label: 'Location', value: 'Mumbai, India' },
    { label: 'Quality Standards', value: 'ISO 9001, FSSAI Certified' },
    { label: 'Product Categories', value: 'Spices, Chemicals, Household Products' },
  ],
  sections: [
    {
      title: 'Our Commitment to Quality',
      content: 'At Azlok, we are committed to providing the highest quality products. All our products undergo rigorous quality checks to ensure they meet international standards. We source our raw materials from trusted suppliers and follow strict manufacturing processes.',
    },
    {
      title: 'Sustainability Practices',
      content: 'We believe in sustainable business practices. Our packaging is eco-friendly and we continuously work to reduce our carbon footprint. We also support local farmers and communities through fair trade practices.',
    },
    {
      title: 'Product Authenticity',
      content: 'Each Azlok product comes with a unique QR code that can be scanned to verify its authenticity. This helps customers ensure they are purchasing genuine Azlok products and not counterfeits.',
    },
  ],
  additionalInfo: 'For more detailed information about specific products, please scan the QR code on the product packaging.'
};

export default function ScanPage() {
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="Azlok" 
              width={120} 
              height={40} 
              className="h-10 w-auto"
            />
          </Link>
        </div>
        
        {/* Main content card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-green-100/50 overflow-hidden max-w-4xl mx-auto">
          {/* Header section with type badge */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-green-100 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-green-800">{information.title}</h1>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-green-700 border border-green-200 shadow-sm">
              {information.type.charAt(0).toUpperCase() + information.type.slice(1)}
            </span>
          </div>
          
          {/* Image section */}
          <div className="relative h-48 sm:h-64 bg-gray-100 border-b border-gray-200">
            <Image 
              src={information.imageUrl} 
              alt={information.title} 
              fill 
              className="object-contain p-4"
            />
          </div>
          
          {/* Description */}
          <div className="p-4 sm:p-6">
            <p className="text-gray-700 mb-6">{information.description}</p>
            
            {/* Details list */}
            <div className="space-y-3 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Company Details</h2>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                {information.details.map((detail, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col sm:flex-row sm:items-center p-3 ${index !== information.details.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <span className="font-medium text-gray-700 sm:w-1/3">{detail.label}:</span>
                    <span className="text-gray-600 sm:w-2/3">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Information sections */}
            <div className="space-y-6 mb-8">
              {information.sections.map((section, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-medium text-green-700 mb-2">{section.title}</h3>
                  <p className="text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>
            
            {/* Additional information */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
              <p className="text-green-700 text-sm">{information.additionalInfo}</p>
            </div>
            
            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                href="/products" 
                className="flex-1 bg-white border border-green-300 text-green-700 hover:bg-green-50 py-2 px-4 rounded-md text-center font-medium transition-colors duration-300"
              >
                Browse Products
              </Link>
              <Link 
                href="/contact" 
                className="flex-1 bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-md text-center font-medium transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Azlok. All rights reserved.</p>
          <p className="mt-1">For any queries, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
