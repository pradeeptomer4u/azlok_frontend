'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';

const NatureGoodnessCTA = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };
  
  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0, 0.71, 0.2, 1.01] as [number, number, number, number]
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 128, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    tap: {
      scale: 0.95
    }
  };
  
  const badgeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1.2
      }
    }
  };
  
  const leafVariants = {
    hidden: { opacity: 0, rotate: -20, x: -20 },
    visible: {
      opacity: 1,
      rotate: 0,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a5d1a 0%, #0c390c 100%)"
      }}
    >
      {/* Advanced background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/90 to-green-900/90"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/leaf-pattern.png')] opacity-10 bg-repeat mix-blend-overlay"></div>
        
        {/* Animated particles */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-400/40 rounded-full shadow-lg shadow-green-400/20"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/2 w-3 h-3 bg-green-300/30 rounded-full shadow-lg shadow-green-300/20"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-2/3 w-2 h-2 bg-yellow-400/30 rounded-full shadow-lg shadow-yellow-400/20"
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Light rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform opacity-20 animate-slowPan"></div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-16 -right-16 w-64 h-64 border border-green-500/10 rounded-full opacity-30"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 border border-green-500/10 rounded-full opacity-30"
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Decorative leaves */}
      
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="space-y-8"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-['Playfair_Display',serif] font-bold mb-2 text-white"
          >
            <span className="relative inline-block">
              Experience 
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-100 via-white to-green-100 animate-shimmer bg-[length:200%_100%]">
              Nature&apos;s Goodness!
            </span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl mb-10 text-green-100/90 leading-relaxed font-['Montserrat',sans-serif] font-light tracking-wide"
          >
            Discover our range of <span className="font-medium italic">100% natural products</span> made with ingredients sourced directly from farmers.
          </motion.p>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link 
              href="/products" 
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all transform"
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="tracking-wide">Shop Natural Products</span>
              </div>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={badgeVariants}
            className="mt-8 flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <p className="text-white text-sm font-light">No artificial colors</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <p className="text-white text-sm font-light">Direct from farmers</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <p className="text-white text-sm font-light">100% natural</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated wave overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 md:h-16"
          style={{ fill: '#f9fafb' }}
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          />
        </svg>
      </div>
    </section>
  );
};

export default NatureGoodnessCTA;
