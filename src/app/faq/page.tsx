'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets like Paytm and PhonePe."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-7 business days. Express shipping is available for 1-3 business days. Delivery times may vary based on your location and product availability."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in resalable condition. Some items like personalized products may not be eligible for returns."
    },
    {
      question: "How do I return an item?",
      answer: "To return an item, log into your account, go to 'My Orders', select the item you want to return, and follow the return process. We'll provide a prepaid return label for eligible returns."
    },
    {
      question: "When will I receive my refund?",
      answer: "Refunds are processed within 5-7 business days after we receive and inspect your returned item. The refund will be credited to your original payment method."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working on expanding our shipping to international destinations in the future."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via email at hello@azlok.com, phone at 8800412138, or through our live chat feature available on the website 24/7."
    },
    {
      question: "Are my personal details secure?",
      answer: "Yes, we use industry-standard SSL encryption to protect your personal and payment information. We never store your complete credit card details on our servers."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 1 hour of placing it if it hasn't been processed yet. After that, you may need to return the item once received."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer bulk discounts for large orders. Please contact our sales team at hello@azlok.com for custom pricing on bulk purchases."
    }
  ];

  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* SEO Meta Tags */}
            {/* Metadata now handled by layout.tsx */}
      
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
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50">
          <div className="px-6 py-8 relative group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Frequently Asked Questions</h1>
            
            <p className="text-gray-600 mb-8 font-['Montserrat',sans-serif] text-center">
              Find answers to the most common questions about shopping at Azlok. If you can&apos;t find what you&apos;re looking for, feel free to contact our customer support team.
            </p>

          <div className="space-y-6 font-['Montserrat',sans-serif]">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-green-100 pb-6 last:border-b-0 last:pb-0 group hover:bg-green-50/30 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center mr-3 text-xs font-bold">{index + 1}</span>
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed pl-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100/70 rounded-lg border border-green-200/50 relative overflow-hidden group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10">Still have questions?</h3>
            <p className="text-gray-700 mb-4 font-['Montserrat',sans-serif] relative z-10">
              Our customer support team is available round the clock to assist you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <a 
                href="mailto:hello@azlok.com" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md text-center font-['Montserrat',sans-serif] font-medium relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                Email Support
              </a>
              <a 
                href="tel:8800412138" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md text-center font-['Montserrat',sans-serif] font-medium relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                Call Support
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
