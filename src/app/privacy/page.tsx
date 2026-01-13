'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function PrivacyPolicyPage() {
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
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Privacy Policy</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
              <p className="text-gray-600 mb-4">
                Last Updated: September 1, 2025
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Azlok. We protect your privacy. We protect your personal information. This Privacy Policy explains our practices. We tell you how we collect your information. We tell you how we use it. We tell you how we safeguard it. This applies to our website azlok.com. It applies to our mobile apps. It applies to all our platforms.
              </p>
              <p className="text-gray-700 mb-4">
                Please read this policy carefully. Do you disagree with these terms? Then please do not use our site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3 font-['Playfair_Display',serif]">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect personal information you provide. You give us this when you register. You give us this when you contact us. You give us this when you use our site. The information we collect may include:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Name
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Email address
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Phone number
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Billing address
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Shipping address
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Payment information
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Account credentials
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3 font-['Playfair_Display',serif]">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                We collect some information automatically. This happens when you visit our site. We collect device information. We collect browser information. We collect your IP address. We collect your time zone. We collect cookie data. We also track your browsing. We see which pages you view. We see how you found us. We see how you interact with our site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Provide, operate, and maintain our website
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Improve, personalize, and expand our website
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Understand and analyze how you use our website
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Develop new products, services, features, and functionality
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Process transactions and send related information including confirmations and invoices
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Send you technical notices, updates, security alerts, and support and administrative messages
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Respond to your comments, questions, and requests
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Communicate with you about products, services, offers, promotions, and events
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Monitor and analyze trends, usage, and activities in connection with our website
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">4. Cookies and Web Beacons</h2>
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg mb-6 border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <p className="text-gray-700 mb-4 relative z-10">
                  We use cookies. We use similar tracking technologies. Cookies track your activity. They hold certain information. Cookies are small data files. They may include a unique identifier. Your browser receives them from our website. They are stored on your device.
                </p>
                <p className="text-gray-700 mb-0 relative z-10">
                  You can refuse cookies. You can set your browser to block them. You can set it to alert you. However, some features need cookies. Without cookies, some parts may not work.
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use third-party service providers. They help us run our business. They help us run our site. They send newsletters. They send surveys. We share your information with them. We only share for these specific purposes.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We protect your information. We use technical security measures. We use organizational security measures. We work hard to keep your data safe. However, no system is perfect. Internet transmission is not 100% secure. Storage technology is not 100% secure. We cannot guarantee complete security.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">7. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to access personal information we hold about you
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to request that we correct any inaccurate personal information
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to request that we delete your personal information
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to withdraw consent
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to data portability
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  The right to lodge a complaint with a supervisory authority
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3 font-['Playfair_Display',serif]">7.1 Account Deletion</h3>
              <p className="text-gray-700 mb-4">
                You can delete your account. You can delete your personal data. Here is how:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">1</span>
                  <strong>Mobile App:</strong> Go to Profile → Request Account Deletion, enter your reason and confirm with your password.
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">2</span>
                  <strong>Website:</strong> Go to Account Settings → Privacy & Data → Delete Account, or visit our <a href="/account/delete" className="text-green-600 hover:underline">Account Deletion page</a>.
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">3</span>
                  <strong>Customer Support:</strong> Contact our support team at privacy@azlok.com with the subject &quot;Account Deletion Request&quot;.
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                We receive your request. We verify your identity. We process your deletion within 30 days. You get a confirmation email. We complete the process. Note: Some information may stay. Law may require this. Business purposes may require this.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">8. Children&quot;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our site is not for children under 13. We do not collect data from children under 13. Are you a parent? Did your child give us information? Please contact us.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this policy. We will post changes here. We will update the date at the top.
              </p>
              <p className="text-gray-700 mb-4">
                Please check this policy regularly. Look for changes. Changes take effect when posted.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">10. Contact Us</h2>
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <p className="text-gray-700 mb-4 relative z-10">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none pl-6 mb-0 text-gray-700 relative z-10">
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">📧</span>
                    By email: hello@azlok.com
                  </li>
                  <li className="mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">📞</span>
                    By phone: 8800412138
                  </li>
                  <li className="mb-0 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">📍</span>
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
