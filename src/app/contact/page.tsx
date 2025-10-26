'use client';

import React, { useState } from 'react';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields.'
      });
      setIsSubmitting(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        success: false,
        message: 'Please enter a valid email address.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real app, you would send the form data to your API here
      // For now, we'll simulate a successful submission after a delay
      setTimeout(() => {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
      {/* Organization Structured Data is now handled separately */}
      
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
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 text-center relative z-10">Contact Us</h1>
            
            <div className="prose max-w-none font-['Montserrat',sans-serif] relative z-10">
              
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-8 rounded-lg mb-8 border border-green-200/50 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif] relative z-10">We&apos;d Love to Hear From You</h2>
                <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                  Have questions, suggestions, or need assistance? Our team is here to help! 
                  Fill out the form below or use our direct contact information to get in touch with us.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif]">Send Us a Message</h2>
                  
                  {submitStatus && (
                    <div className={`p-4 mb-4 rounded-md ${submitStatus.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="relative bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="relative bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="relative bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="relative bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="relative bg-white shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                </div>
                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-['Playfair_Display',serif]">Contact Information</h2>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-6 rounded-lg mb-6 border border-green-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📍</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Address</h3>
                          <p className="text-gray-700">
                            Azlok Pvt Ltd<br />
                            26-Chandresh Godavari, Station Road Nilje<br />
                            Dombivli, Maharashtra-421204<br />
                            India
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📞</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Phone</h3>
                          <p className="text-gray-700">+91 8800412138</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">📧</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Email</h3>
                          <p className="text-gray-700">hello@azlok.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">⏰</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif]">Business Hours</h3>
                          <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                          <p className="text-gray-700">Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Playfair_Display',serif]">Connect With Us</h3>
                  <div className="flex space-x-4 mb-6">
                    <a href="https://www.linkedin.com/in/azlok/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-50 to-green-100/70 p-2 rounded-full border border-green-200/50 text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/@Azlok_Pvt_Ltd" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-50 to-green-100/70 p-2 rounded-full border border-green-200/50 text-red-600 hover:text-red-800 transition-colors duration-300 hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/Azlok_Pvt_Ltd" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-50 to-green-100/70 p-2 rounded-full border border-green-200/50 text-gray-800 hover:text-gray-600 transition-colors duration-300 hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/azlok.pvt.ltd" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-50 to-green-100/70 p-2 rounded-full border border-green-200/50 text-pink-600 hover:text-pink-800 transition-colors duration-300 hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {/* Map Section */}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Find Us</h2>
              <div className="w-full h-96 bg-gray-200 rounded-lg mb-8 overflow-hidden border border-green-200/50 shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.91872485829!2d73.07388648201197!3d19.155034635823935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bff984a49f61%3A0x7eb636656e964daf!2sChandresh%20Godavari%2C%20Nilje%20Gaon%2C%20Maharashtra%20421204!5e0!3m2!1sen!2sin!4v1760933782551!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* FAQ Section */}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 font-['Playfair_Display',serif]">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300 group">
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">1</span>
                    What are your shipping times?
                  </h3>
                  <p className="text-gray-700 mt-2 pl-9">We typically process orders within 24-48 hours. Shipping times vary by location, but most domestic orders are delivered within 3-5 business days.</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300 group">
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">2</span>
                    How can I track my order?
                  </h3>
                  <p className="text-gray-700 mt-2 pl-9">Once your order ships, you&apos;ll receive a tracking number via email. You can also track your order by logging into your account on our website.</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300 group">
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">3</span>
                    What is your return policy?
                  </h3>
                  <p className="text-gray-700 mt-2 pl-9">We offer a 30-day return policy for most items. Products must be in their original condition with all tags and packaging intact.</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100/70 p-4 rounded-lg border border-green-200/50 hover:shadow-md transition-all duration-300 group">
                  <h3 className="font-semibold text-gray-800 font-['Playfair_Display',serif] flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 text-xs font-bold">4</span>
                    Do you offer international shipping?
                  </h3>
                  <p className="text-gray-700 mt-2 pl-9">Yes, we ship to select international destinations. International shipping times and fees vary by location.</p>
                </div>
              </div>

              <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                
                <h3 className="text-xl font-semibold mb-3 font-['Playfair_Display',serif] relative z-10">We Value Your Feedback</h3>
                <p className="text-green-100 relative z-10">
                  Your opinions and suggestions help us improve our services. 
                  We&apos;re committed to providing the best shopping experience possible 
                  and appreciate your input in helping us achieve that goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
