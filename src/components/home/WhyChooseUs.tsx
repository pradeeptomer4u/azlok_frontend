'use client';

import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Feature data
  const features = [
    {
      id: 1,
      title: "100% Natural",
      description: "All our products are made with 100% natural ingredients without any artificial colors or additives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Direct from Farmers",
      description: "We source our ingredients directly from farmers, ensuring freshness and supporting local agriculture.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "No Artificial Colors",
      description: "We never use artificial colors or preservatives in our products, ensuring they're as natural as possible.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Quality Guaranteed",
      description: "We rigorously test all our products to ensure they meet the highest standards of quality and purity.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-[#defce8]">
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#defce8]/90 via-white/80 to-[#defce8]/90"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-5 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-green-300/10 to-green-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-green-400/10 to-blue-300/5 rounded-full blur-3xl animate-float1"></div>
        
        {/* Light rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform opacity-30 animate-slowPan"></div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-0 left-1/4 w-20 h-20 border border-green-200/20 rounded-lg rotate-45 transform opacity-20 animate-spin-slow"></div>
        <div className="absolute bottom-0 right-1/3 w-16 h-16 border border-green-300/20 rounded-full opacity-10 animate-pulse-slow"></div>
      </div>
      
      <div className="container-custom mx-auto px-4 relative z-10">
        {/* Section heading with advanced typography */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-600 to-green-800 animate-shimmer bg-[length:200%_100%]">
              Why Choose Our Products?
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-600 font-light tracking-wide leading-relaxed text-lg italic"
          >
            We are manufacturers with direct connections to farmers, ensuring the highest quality natural products
          </motion.p>
          
          {/* Decorative underline */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 mx-auto mt-4 rounded-full"
          ></motion.div>
        </div>
        
        {/* Features grid with advanced styling */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              variants={itemVariants}
              className="relative group"
            >
              {/* Card with advanced styling */}
              <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 h-full">
                {/* Background decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400/5 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute -top-2 -left-2 w-16 h-16 border border-green-300/10 rounded-full opacity-50 animate-spin-slow"></div>
                
                {/* Icon with advanced styling */}
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-300/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-lg inline-block">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                {/* Text with enhanced typography and animations */}
                {feature.id === 1 && (
                  <>
                    <motion.h3 
                      className="text-xl font-['Playfair_Display',serif] font-black tracking-wide text-green-800 mb-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.05, color: '#166534' }}
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-green-700 animate-shimmer bg-[length:200%_100%]">
                        100% Natural
                      </span>
                    </motion.h3>
                    <p className="text-gray-600 font-light tracking-wide text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </>
                )}
                
                {feature.id === 2 && (
                  <>
                    <motion.h3 
                      className="text-xl font-['Montserrat',sans-serif] font-extrabold tracking-tight text-green-800 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ x: 5, color: '#166534' }}
                    >
                      <span className="relative">
                        Farm Direct
                        <motion.span 
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        />
                      </span>
                    </motion.h3>
                    <p className="text-gray-600 font-light tracking-wide text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </>
                )}
                
                {feature.id === 3 && (
                  <>
                    <motion.h3 
                      className="text-xl font-['Roboto_Slab',serif] font-bold tracking-tight text-green-800 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover={{ y: -5, color: '#166534' }}
                    >
                      <span className="relative inline-block">
                        No Artificial Colors
                        <motion.span 
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500/50 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                        />
                      </span>
                    </motion.h3>
                    <p className="text-gray-600 font-light tracking-wide text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </>
                )}
                
                {feature.id === 4 && (
                  <>
                    <h3 className="text-xl font-bold tracking-tight text-green-800 mb-2 font-sans">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-light tracking-wide text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
