'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-10">
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

      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last Updated: September 1, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Azlok (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website azlok.com, including any other media form, media channel, mobile website, or mobile application related or connected to it (collectively, the &quot;Site&quot;).
            </p>
            <p className="text-gray-700 mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect personal information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, participate in activities on the Site, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Name</li>
              <li className="mb-2">Email address</li>
              <li className="mb-2">Phone number</li>
              <li className="mb-2">Billing address</li>
              <li className="mb-2">Shipping address</li>
              <li className="mb-2">Payment information</li>
              <li className="mb-2">Account credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our Site, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">Provide, operate, and maintain our website</li>
              <li className="mb-2">Improve, personalize, and expand our website</li>
              <li className="mb-2">Understand and analyze how you use our website</li>
              <li className="mb-2">Develop new products, services, features, and functionality</li>
              <li className="mb-2">Process transactions and send related information including confirmations and invoices</li>
              <li className="mb-2">Send you technical notices, updates, security alerts, and support and administrative messages</li>
              <li className="mb-2">Respond to your comments, questions, and requests</li>
              <li className="mb-2">Communicate with you about products, services, offers, promotions, and events</li>
              <li className="mb-2">Monitor and analyze trends, usage, and activities in connection with our website</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">4. Cookies and Web Beacons</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
            </p>
            <p className="text-gray-700 mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li className="mb-2">The right to access personal information we hold about you</li>
              <li className="mb-2">The right to request that we correct any inaccurate personal information</li>
              <li className="mb-2">The right to request that we delete your personal information</li>
              <li className="mb-2">The right to withdraw consent</li>
              <li className="mb-2">The right to data portability</li>
              <li className="mb-2">The right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">8. Children&quot;s Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-700 mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-6 mb-4 text-gray-700">
              <li className="mb-2">By email: hello@azlok.com</li>
              <li className="mb-2">By phone: 8800412138</li>
              <li className="mb-2">By mail: Shamli, Uttar Pradesh, India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
