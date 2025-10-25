'use client';

import React from 'react';
import WhatsAppChatButton from '../../../components/WhatsAppChatButton';
import MetaTags from '../../../components/SEO/MetaTags';
import AzlokLogo from '../../../components/icons/AzlokLogo';

export default function WhatsAppChatExample() {
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* SEO Meta Tags */}
      <MetaTags
        title="WhatsApp Chat Example - Azlok"
        description="Example page demonstrating WhatsApp Chat integration with Azlok"
        keywords="whatsapp chat, customer support, contact us, azlok"
        ogType="website"
        ogUrl="/examples/whatsapp-chat"
        ogImage="/logo.png"
        canonicalUrl="/examples/whatsapp-chat"
      />
      
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300/25 to-green-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -left-24 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-green-300/10 rounded-full blur-3xl animate-float1"></div>
      </div>

      <div className="container-custom mx-auto relative z-10 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <AzlokLogo width={40} height={40} className="mr-3" />
            <h1 className="text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 text-center">WhatsApp Chat Example</h1>
          </div>
          
          {/* Product Card Example */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50 mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Image */}
                <div className="md:w-1/3">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="/images/product-placeholder.jpg" 
                      alt="Kerala Spices" 
                      className="object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x400?text=Kerala+Spices';
                      }}
                    />
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-['Playfair_Display',serif] font-semibold text-gray-800 mb-2">Kerala Spices Bundle</h2>
                  <p className="text-green-600 font-semibold mb-2">₹1,299.00</p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">(42 reviews)</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Authentic Kerala spices bundle including premium cardamom, cloves, cinnamon, black pepper, and turmeric. Directly sourced from Kerala farms for maximum freshness and flavor.
                  </p>
                  
                  <div className="flex flex-col space-y-4">
                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300">
                      Add to Cart
                    </button>
                    
                    {/* WhatsApp Chat Button */}
                    <WhatsAppChatButton 
                      phoneNumber="918800412138"
                      welcomeMessage="Hello! I'm interested in the Kerala Spices Bundle (₹1,299.00) and would like more information."
                      buttonText="Ask about this product"
                      companyName="Azlok Pvt Ltd"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form Example */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50">
            <div className="p-6">
              <h2 className="text-2xl font-['Playfair_Display',serif] font-semibold text-gray-800 mb-6">Contact Us</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Send Message
                      </button>
                      
                      <div className="text-gray-500 text-sm">or</div>
                      
                      {/* WhatsApp Chat Button */}
                      <WhatsAppChatButton 
                        phoneNumber="918800412138"
                        welcomeMessage="Hello! I have a question about Azlok products."
                        buttonText="Chat with us"
                        companyName="Azlok Pvt Ltd"
                        buttonClassName="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative overflow-hidden group"
                      />
                    </div>
                  </form>
                </div>
                
                {/* Contact Information */}
                <div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden h-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif]">Contact Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📍</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Address</h4>
                          <p className="text-gray-700">
                            26-Chandresh Godavari, Station Road Nilje<br />
                            Dombivli, Maharashtra-421204<br />
                            India
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📞</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Phone</h4>
                          <p className="text-gray-700">+91 8800412138</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📧</div>
                        <div>
                          <h4 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Email</h4>
                          <p className="text-gray-700">hello@azlok.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
