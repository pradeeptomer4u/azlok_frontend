'use client';

import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function ReturnsPage() {
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
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Returns & Refunds</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
              <p className="text-gray-600 mb-6">
                We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, we&apos;re here to help with our hassle-free return policy.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg mb-6 border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10">30-Day Return Policy</h3>
                <p className="text-gray-700 relative z-10">
                  We offer a 30-day return window from the date of delivery for most items. Items must be unused, in original packaging, and in resalable condition.
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">What Can Be Returned?</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <h3 className="text-xl font-semibold text-green-700 mb-3 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-sm font-bold">✓</span>
                    Returnable Items
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Sealed household and cosmetic chemicals (e.g., Stearic Acid, Borax Powder, Glycerine)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Unopened lab-grade solvents and reagents like Isopropyl Alcohol (IPA)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Packaged whole spices (Turmeric, Coriander Seeds, Elaichi, Tej Patta, etc.)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Packaged ground spice powders (Red Chilli, Coriander Powder, Garam Masala)
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Sealed spice blends and combo packs in original condition
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                      Unopened mineral salts such as Alum (Fitkari)
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 p-6 rounded-lg border border-red-200/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <h3 className="text-xl font-semibold text-red-700 mb-3 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white mr-3 text-sm font-bold">✗</span>
                    Non-Returnable Items
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Opened or partially used chemicals, solvents, or cosmetic bases
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Custom-blended or repackaged chemical orders
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Opened spice packets or products with broken seals
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Moisture-sensitive or perishable items exposed to air
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Products past their stated shelf life or without original packaging
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                      Free gifts, samples, or promotional add-ons
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">How to Return an Item</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-all duration-300">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Log into Your Account</h3>
                    <p className="text-gray-700">Go to &quot;My Orders&quot; and find the item you want to return.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-all duration-300">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Select Return Reason</h3>
                    <p className="text-gray-700">Choose the reason for return and provide any additional details.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-all duration-300">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Print Return Label</h3>
                    <p className="text-gray-700">We&apos;ll provide a prepaid return shipping label for eligible returns.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-all duration-300">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Package & Ship</h3>
                    <p className="text-gray-700">Pack the item securely in its original packaging and ship it back to us.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-green-50/30 transition-colors duration-300 group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shadow-sm group-hover:shadow-md transition-all duration-300">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Receive Refund</h3>
                    <p className="text-gray-700">Once we receive and inspect your return, we&apos;ll process your refund.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Return Conditions</h2>
              <p className="text-gray-700 mb-4">
                To ensure a smooth return process, please make sure your items meet these conditions:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Items must be returned within 30 days of delivery
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Items must be unused and in original condition
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Original packaging and tags must be included
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Include all accessories and documentation
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Items must be in resalable condition
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Refund Process</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg mb-6 border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif] relative z-10">Refund Timeline</h3>
                <ul className="text-gray-700 space-y-2 relative z-10">
                  <li className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    <strong>Processing:</strong> 1-2 business days after we receive your return
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    <strong>Credit Card:</strong> 3-5 business days
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    <strong>Debit Card:</strong> 5-7 business days
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    <strong>UPI/Digital Wallet:</strong> 1-3 business days
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                    <strong>Net Banking:</strong> 3-5 business days
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3 font-['Playfair_Display',serif]">Refund Methods</h3>
              <p className="text-gray-700 mb-4">
                Refunds are processed to your original payment method. If the original payment method is no longer available, we&apos;ll work with you to find an alternative solution.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Exchanges</h2>
              <p className="text-gray-700 mb-4">
                We currently don&apos;t offer direct exchanges. If you need a different size, color, or model, please return the original item and place a new order for the desired product.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Damaged or Defective Items</h2>
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective item, please contact us immediately. We&apos;ll provide a prepaid return label and expedite your refund or replacement.
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Report damaged items within 48 hours of delivery
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Provide photos of the damage when possible
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  Keep all original packaging
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                  We&apos;ll cover all return shipping costs
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Return Shipping</h2>
              <p className="text-gray-700 mb-4">
                Return shipping costs depend on the reason for return:
              </p>
              <ul className="list-none pl-6 mb-4 text-gray-700">
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">1</span>
                  <strong>Our fault:</strong> We cover all return shipping costs
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">2</span>
                  <strong>Change of mind:</strong> Customer covers return shipping (₹99)
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">3</span>
                  <strong>Wrong size/color:</strong> Customer covers return shipping (₹99)
                </li>
                <li className="mb-2 flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">4</span>
                  <strong>Defective items:</strong> We cover all return shipping costs
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">International Returns</h2>
              <p className="text-gray-700 mb-4">
                Currently, we only accept returns from within India. International return options will be available as we expand our shipping coverage.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help with any return-related questions:
              </p>
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg border border-green-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                <div className="grid md:grid-cols-3 gap-4 relative z-10">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Email Support</h4>
                    <p className="text-gray-700">hello@azlok.com</p>
                    <p className="text-sm text-gray-600">Response within 24 hours</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Phone Support</h4>
                    <p className="text-gray-700">8800412138</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-2 font-['Playfair_Display',serif]">Live Chat</h4>
                    <p className="text-gray-700">Available 24/7</p>
                    <p className="text-sm text-gray-600">Instant support</p>
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
