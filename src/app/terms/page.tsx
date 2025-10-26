'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function TermsOfServicePage() {
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
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-green-100/50">
          <div className="px-6 py-8 relative group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Terms of Service</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
              <p className="text-gray-600 mb-4">
                Last Updated: September 6, 2025
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Azlok (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials on Azlok&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">modify or copy the materials</li>
                <li className="mb-2">use the materials for any commercial purpose or for any public display</li>
                <li className="mb-2">attempt to reverse engineer any software contained on the website</li>
                <li className="mb-2">remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">4. Purchases and Payment</h2>
              <p className="text-gray-700 mb-4">
                If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
              </p>
              <p className="text-gray-700 mb-4">
                You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">5. Products and Services</h2>
              <p className="text-gray-700 mb-4">
                All products and services are subject to availability. We reserve the right to discontinue any product or service at any time. Prices for our products are subject to change without notice.
              </p>
              <p className="text-gray-700 mb-4">
                We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">6. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                We offer a 30-day return policy for most products. Items must be returned in their original condition and packaging. Custom or personalized items may not be eligible for returns unless they arrive damaged or defective.
              </p>
              <p className="text-gray-700 mb-4">
                Refunds will be processed to the original payment method within 5-7 business days after we receive and inspect the returned item.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">7. Shipping</h2>
              <p className="text-gray-700 mb-4">
                We currently ship within India only. Shipping costs and delivery times vary based on location and selected shipping method. We are not responsible for delays caused by customs, weather, or other factors beyond our control.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">8. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li className="mb-2">For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li className="mb-2">To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li className="mb-2">To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li className="mb-2">To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li className="mb-2">To submit false or misleading information</li>
                <li className="mb-2">To upload or transmit viruses or any other type of malicious code</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">9. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information on this website is provided on an &apos;as is&apos; basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms related to our website and the use of this website.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">10. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Azlok or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Azlok&apos;s website.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">11. Accuracy of Materials</h2>
              <p className="text-gray-700 mb-4">
                The materials appearing on Azlok&apos;s website could include technical, typographical, or photographic errors. Azlok does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">12. Modifications</h2>
              <p className="text-gray-700 mb-4">
                Azlok may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <ul className="list-none pl-6 mb-4 text-gray-700 relative z-10">
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs">📧</span>
                    By email: hello@azlok.com
                  </li>
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs">📞</span>
                    By phone: 8800412138
                  </li>
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs">📍</span>
                    By mail: 26-Chandresh Godavari, Station Road Nilje, Dombivli, Maharashtra-421204, India
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
