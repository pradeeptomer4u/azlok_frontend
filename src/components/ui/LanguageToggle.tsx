'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-green-100/50 hover:shadow-md transition-all duration-300"
        aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'} language`}
      >
        <div className="relative w-12 h-6 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 flex"
            animate={{ x: language === 'en' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="w-1/2 h-full bg-green-500 flex items-center justify-center text-white font-medium text-xs">
              EN
            </div>
            <div className="w-1/2 h-full bg-amber-500 flex items-center justify-center text-white font-medium text-xs">
              हि
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md z-10"
            animate={{ x: language === 'en' ? 0 : 24 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {language === 'en' ? 'English' : 'हिन्दी'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
