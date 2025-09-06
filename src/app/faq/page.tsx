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
    <div className="min-h-screen py-10">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Frequently Asked Questions - Azlok"
        description="Find answers to common questions about shopping, shipping, returns, and more at Azlok."
        keywords="FAQ, frequently asked questions, help, support, shipping, returns, orders, customer service"
        ogType="website"
        ogUrl="/faq"
        ogImage="/logo.png"
        canonicalUrl="/faq"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-600 mb-8">
            Find answers to the most common questions about shopping at Azlok. If you can&apos;t find what you&apos;re looking for, feel free to contact our customer support team.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Still have questions?</h3>
            <p className="text-gray-700 mb-4">
              Our customer support team is available round the clock to assist you. 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:hello@azlok.com" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Email Support
              </a>
              <a 
                href="tel:8800412138" 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
