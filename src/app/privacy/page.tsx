'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* SEO Meta Tags */}
      <MetaTags
        title="Privacy Policy - Azlok"
        description="Learn about Azlok's privacy policy, how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, personal information, cookies, GDPR, privacy rights"
        ogType="website"
        ogUrl="/privacy"
        ogImage="/logo.png"
        canonicalUrl="/privacy"
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
                Welcome to Azlok (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website azlok.com, including any other media form, media channel, mobile website, or mobile application related or connected to it (collectively, the &quot;Site&quot;).
              </p>
              <p className="text-gray-700 mb-4">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3 font-['Playfair_Display',serif]">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, participate in activities on the Site, or otherwise contact us. The personal information we collect may include:
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
                When you visit our Site, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
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
                  We use cookies and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
                </p>
                <p className="text-gray-700 mb-0 relative z-10">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
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
                You have the right to request deletion of your account and associated personal data. To exercise this right:
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
                Upon receiving your request, we will verify your identity and process your account deletion within 30 days. You will receive a confirmation email once the process is complete. Please note that some information may be retained as required by law or for legitimate business purposes.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">8. Children&quot;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this Privacy Policy.
              </p>
              <p className="text-gray-700 mb-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
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
