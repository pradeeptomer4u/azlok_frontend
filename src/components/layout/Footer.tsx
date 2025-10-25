'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };
  // Animation controls
  const controls = useAnimation();
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: true });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <footer ref={footerRef} className="bg-gradient-to-b from-[#defce8]/90 to-[#defce8]/70 text-gray-800 relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400 animate-shimmer bg-[length:200%_100%]"></div>
      
      {/* Enhanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-200/30 to-green-400/20 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 -left-24 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-blue-300/10 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-bl from-yellow-200/20 to-orange-300/10 rounded-full blur-3xl"
        ></motion.div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-3 bg-repeat mix-blend-overlay"></div>
        
        {/* Decorative geometric shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-200/10 rounded-lg opacity-20"
        ></motion.div>
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-200/10 rounded-full opacity-10"
        ></motion.div>
        
        {/* Grid pattern */}
        <div className="grid grid-cols-12 gap-4 h-full w-full opacity-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-r border-t border-gray-400/30"></div>
          ))}
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container-custom mx-auto py-8 relative z-10 gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="col-span-1">
            <Link href="/" className="inline-block mb-4 group transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-200/0 via-green-300/20 to-green-200/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl group-hover:duration-500"></div>
                <Image 
                  src="/logo.png" 
                  alt="Azlok Enterprises" 
                  width={140} 
                  height={50} 
                  className="object-contain relative z-10 drop-shadow-sm"
                />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:w-full transition-all duration-500 ease-in-out shadow-sm"></div>
              </div>
            </Link>
            <p className="text-gray-600 mb-4 leading-relaxed font-['Montserrat',sans-serif] font-light tracking-wide">
              <span className="font-medium tracking-wider text-gray-700 font-['Playfair_Display',serif]">Azlok</span> is your premium online shopping destination for quality products and exceptional customer experience.
            </p>
            
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <div className="relative inline-block mb-4">
              <h3 className="text-base font-['Playfair_Display',serif] font-bold text-green-700 tracking-wide uppercase text-xs">Quick Links</h3>
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span className="relative overflow-hidden">
                    <span className="relative inline-block transform group-hover:translate-y-0 transition-transform duration-300">About Us</span>
                    <span className="absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-green-600">About Us</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span className="relative overflow-hidden">
                    <span className="relative inline-block transform group-hover:translate-y-0 transition-transform duration-300">Contact Us</span>
                    <span className="absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-green-600">Contact Us</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span className="relative overflow-hidden">
                    <span className="relative inline-block transform group-hover:translate-y-0 transition-transform duration-300">Products</span>
                    <span className="absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-green-600">Products</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span className="relative overflow-hidden">
                    <span className="relative inline-block transform group-hover:translate-y-0 transition-transform duration-300">Categories</span>
                    <span className="absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-green-600">Categories</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span className="relative overflow-hidden">
                    <span className="relative inline-block transform group-hover:translate-y-0 transition-transform duration-300">Blog</span>
                    <span className="absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-green-600">Blog</span>
                  </span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants} className="col-span-1">
            <div className="relative inline-block mb-4">
              <h3 className="text-base font-['Playfair_Display',serif] font-bold text-green-700 tracking-wide uppercase text-xs">Customer Service</h3>
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <ul className="space-y-4">
              <li>
                <Link href="/faq" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span>Shipping Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/returns" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span>Returns & Refunds</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group flex items-center text-gray-600 hover:text-green-700 transition-all duration-300 font-light tracking-wide">
                  <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-green-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="col-span-1">
            <div className="relative inline-block mb-4">
              <h3 className="text-base font-['Playfair_Display',serif] font-bold text-green-700 tracking-wide uppercase text-xs">Newsletter</h3>
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <p className="text-gray-600 mb-3 text-xs font-['Montserrat',sans-serif] tracking-wide">
              Subscribe for updates and exclusive offers.
            </p>
            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-1.5 px-3 pr-10 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-200 text-xs shadow-sm hover:border-green-300 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="absolute right-0 top-0 h-full px-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-r-md hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm flex items-center justify-center overflow-hidden"
                >
                  <span className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                    Subscribe
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 absolute transform transition-transform duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              {isSubmitted && (
                <div className="mt-2 text-green-600 text-xs flex items-center animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thank you for subscribing!
                </div>
              )}
            </form>
            
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Follow Us</div>
              <div className="flex space-x-3">
                <a href="https://www.facebook.com/azl.ok/" className="group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </div>
                </a>
                <a href="https://x.com/Azlok_Pvt_Ltd" className="group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                </a>
                <a href="https://www.instagram.com/azlok.pvt.ltd/" className="group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-pink-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-pink-600 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/azlok/" className="group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-blue-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Copyright section with enhanced advanced styling */}
      <div className="relative overflow-hidden">
        {/* Enhanced decorative wave with animation */}
        <div className="absolute top-0 left-0 w-full">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 48" 
            className="w-full h-8 fill-green-700/10 transform rotate-180"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.path 
              d="M0,32L60,26.7C120,21,240,11,360,16C480,21,600,43,720,42.7C840,43,960,21,1080,16C1200,11,1320,21,1380,26.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
            ></motion.path>
          </motion.svg>
        </div>
        
        <motion.div 
          className="bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 py-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="container-custom mx-auto">
            <div className="flex flex-wrap items-center justify-between">
              {/* Left side - Copyright and links */}
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
                <p className="text-gray-300 text-sm whitespace-nowrap font-light tracking-wide font-['Montserrat',sans-serif]">
                  &copy; {new Date().getFullYear()} <span className="font-semibold text-white tracking-wider font-['Playfair_Display',serif]">Azlok</span>. All rights reserved.
                </p>
                
                <div className="hidden md:flex space-x-6">
                  <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 font-light tracking-wide">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 font-light tracking-wide">
                    Terms of Service
                  </Link>
                </div>
              </div>
              
              {/* Right side - Contact Information */}
              <div className="flex items-center space-x-4 flex-wrap justify-center">
                <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
                  <div className="mr-2 p-1 bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-md text-white shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-light tracking-wide">8800412138</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
                  <div className="mr-2 p-1 bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-md text-white shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-light tracking-wide">hello@azlok.com</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
                  <div className="mr-2 p-1 bg-gradient-to-br from-orange-400/80 to-orange-500/80 rounded-md text-white shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-light tracking-wide">26-Chandresh Godavari, Station Road Nilje, Dombivli, Maharashtra-421204, India</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
