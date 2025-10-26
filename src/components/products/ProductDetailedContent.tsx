'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import productDetailContentService, { ProductDetailContent as ProductDetailContentData } from '@/services/productDetailContentService';
import LanguageToggle from '@/components/ui/LanguageToggle';

interface ProductDetailedContentProps {
  productSlug: string;
  showLanguageToggle?: boolean;
}

interface ProductContent {
  title: string;
  history: string;
  science: string;
  ayurveda: string;
  modern: string;
  brand: string;
  category: 'spice' | 'chemical';
}

// Default category for products when API doesn't provide one
const DEFAULT_CATEGORY = 'spice';

export default function ProductDetailedContent({ productSlug, showLanguageToggle = true }: ProductDetailedContentProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<ProductDetailContentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchProductContent = async () => {
      if (!productSlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await productDetailContentService.getProductDetailContent(productSlug);
        setApiData(data);
      } catch (err) {
        console.error('Failed to fetch product detailed content:', err);
        setError('Failed to load product content');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductContent();
  }, [productSlug]);
  
  // Create content from API data
  const getApiContent = (): ProductContent | null => {
    if (!apiData) return null;
    
    return {
      title: language === 'en' ? apiData.title : (apiData.title_hi || apiData.title),
      history: language === 'en' ? apiData.history : (apiData.history_hi || apiData.history),
      science: language === 'en' ? apiData.science : (apiData.science_hi || apiData.science),
      ayurveda: language === 'en' ? apiData.ayurveda : (apiData.ayurveda_hi || apiData.ayurveda),
      modern: language === 'en' ? apiData.modern : (apiData.modern_hi || apiData.modern),
      brand: language === 'en' ? apiData.brand : (apiData.brand_hi || apiData.brand),
      category: DEFAULT_CATEGORY
    };
  };
  
  const content = getApiContent();
  
  // If no content found for this product and not loading
  if (!content && !isLoading) {
    return (
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600 italic">Detailed product information coming soon.</p>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  const categoryColors = {
    spice: {
      light: 'bg-amber-50',
      border: 'border-amber-200',
      title: 'text-amber-800',
      icon: 'bg-amber-100 text-amber-700'
    },
    chemical: {
      light: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-800',
      icon: 'bg-blue-100 text-blue-700'
    }
  };
  
  // Default to 'spice' category if content is null
  const category = content?.category || DEFAULT_CATEGORY;
  const colors = categoryColors[category];
  
  // Section titles in both languages
  const sectionTitles: Record<string, Record<'en' | 'hi', string>> = {
    history: {
      en: "History & Discovery",
      hi: "इतिहास और खोज"
    },
    science: {
      en: "Scientific & Medicinal Importance",
      hi: "वैज्ञानिक और औषधीय महत्व"
    },
    ayurveda: {
      en: "Ayurvedic and Traditional Uses",
      hi: "आयुर्वेदिक और पारंपरिक उपयोग"
    },
    modern: {
      en: "Modern-Day Applications & Benefits",
      hi: "आधुनिक उपयोग और लाभ"
    },
    brand: {
      en: "Why Azlok's Version is Trusted Today",
      hi: "आज एज़लोक का संस्करण क्यों विश्वसनीय है"
    }
  };
  
  return (
    <div className="mt-8 space-y-6">
      {/* Language toggle and title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          {content?.title || 'Product Details'}
        </h2>
        {showLanguageToggle && apiData && (
          <LanguageToggle />
        )}
      </div>
      
      {/* History & Discovery */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🕰️</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>{sectionTitles.history[language]}</h3>
        </div>
        <p className="text-gray-700">{content?.history || ''}</p>
      </div>
      
      {/* Scientific & Medicinal Importance */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🔬</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>{sectionTitles.science[language]}</h3>
        </div>
        <p className="text-gray-700">{content?.science || ''}</p>
      </div>
      
      {/* Ayurvedic and Traditional Uses */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🧘</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>{sectionTitles.ayurveda[language]}</h3>
        </div>
        <p className="text-gray-700">{content?.ayurveda || ''}</p>
      </div>
      
      {/* Modern-Day Applications & Benefits */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🏠</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>{sectionTitles.modern[language]}</h3>
        </div>
        <p className="text-gray-700">{content?.modern || ''}</p>
      </div>
      
      {/* Why Azlok's Version is Trusted Today */}
      <div className={`p-4 rounded-lg ${colors.light} border ${colors.border}`}>
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">🧴</span>
          <h3 className={`text-lg font-medium ${colors.title}`}>{sectionTitles.brand[language]}</h3>
        </div>
        <p className="text-gray-700">{content?.brand || ''}</p>
      </div>
    </div>
  );
}
