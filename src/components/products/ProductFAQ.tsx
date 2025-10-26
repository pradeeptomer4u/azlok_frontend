'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQSchema } from '../SEO';
import { useLanguage } from '@/context/LanguageContext';
import productDetailContentService, { ProductFAQ as ProductFAQData } from '@/services/productDetailContentService';
import LanguageToggle from '@/components/ui/LanguageToggle';

// Define the FAQ data structure
interface FAQ {
  question: string;
  answer: string;
}

// No mock data needed as we'll use API data

// Default product category for styling
const DEFAULT_CATEGORY = 'spice';

// Product background patterns
const backgroundPatterns: Record<string, string> = {
  'spice': "bg-[url('/images/spice-pattern.svg')]",
  'chemical': "bg-[url('/images/chemical-pattern.svg')]"
};

// Product accent colors
const accentColors: Record<string, { light: string, medium: string, dark: string }> = {
  'spice': {
    light: 'from-amber-100 to-amber-50',
    medium: 'from-amber-500 to-amber-600',
    dark: 'from-amber-700 to-amber-800'
  },
  'chemical': {
    light: 'from-blue-100 to-blue-50',
    medium: 'from-blue-500 to-blue-600',
    dark: 'from-blue-700 to-blue-800'
  }
};

interface ProductFAQProps {
  product: string;
  slug?: string;
  showSchema?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ 
  product, 
  slug, 
  showSchema = true,
  className = '',
  title,
  subtitle,
  showLanguageToggle = true
}) => {
  // All questions are open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3, 4]);
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<ProductFAQData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchProductContent = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await productDetailContentService.getProductDetailContent(slug);
        setApiData(data);
      } catch (err) {
        console.error('Failed to fetch product FAQ data:', err);
        setError('Failed to load FAQ data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductContent();
  }, [slug]);
  
  // Generate FAQs from API data or fallback to static data
  const generateFaqsFromApi = (): FAQ[] => {
    if (!apiData) return [];
    
    const faqs: FAQ[] = [];
    
    // Helper function to add FAQ if both question and answer exist
    const addFaq = (questionKey: string, answerKey: string) => {
      const question = language === 'en' ? apiData[questionKey] : apiData[`${questionKey}_hi`];
      const answer = language === 'en' ? apiData[answerKey] : apiData[`${answerKey}_hi`];
      
      if (question && answer) {
        faqs.push({
          question: question as string,
          answer: answer as string
        });
      }
    };
    
    // Add all available FAQs
    for (let i = 1; i <= 5; i++) {
      addFaq(`questions${i}`, `answer${i}`);
    }
    
    return faqs;
  };
  
  // Get FAQs from API
  const faqs = generateFaqsFromApi();
  
  // Get product title from API data
  const getProductTitle = (): string => {
    if (apiData) {
      const apiTitle = apiData.title as string;
      const apiTitleHi = apiData.title_hi as string | undefined;
      return language === 'en' ? apiTitle : (apiTitleHi || apiTitle);
    }
    return title || 'Product FAQ';
  };
  
  // Get product category and styling
  const category = DEFAULT_CATEGORY;
  const bgPattern = backgroundPatterns[category];
  const colors = accentColors[category];
  
  // For schema generation
  const productUrl = slug 
    ? `https://www.azlok.com/products/${slug}`
    : `https://www.azlok.com/products/${product}`;
    
  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  // If no FAQs found
  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background to match tabs section exactly */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Language toggle and title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          {showLanguageToggle && apiData && (
            <div className="mt-2 sm:mt-0">
              <LanguageToggle />
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {/* Header - only shown if title is provided */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-green-800">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* FAQ List - Styled to match the tab section exactly */}
        <div className="space-y-6 px-6 py-4">
          {faqs.map((faq: FAQ, index: number) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="mb-10 last:mb-0"
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-green-600 font-['Montserrat',sans-serif]">
                    {faq.question}
                  </h3>
                  <div className="mt-2">
                    <p className="text-gray-700 font-['Montserrat',sans-serif] font-light text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Add JSON-LD Schema */}
      {showSchema && faqs.length > 0 && (
        <FAQSchema 
          faqs={faqs.map((faq: FAQ) => ({
            question: faq.question,
            answer: faq.answer
          }))}
          url={productUrl}
        />
      )}
    </div>
  );
};

export default ProductFAQ;
