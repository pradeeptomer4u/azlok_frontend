'use client';

import React from 'react';
import Script from 'next/script';

interface ProductSchemaProps {
  product: {
    id: string | number;
    name: string;
    description: string;
    price: number;
    currency?: string;
    image: string | string[];
    url: string;
    sku?: string;
    brand?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder' | 'SoldOut';
    reviewCount?: number;
    reviewRating?: number;
    category?: string;
    nutrition?: {
      servingSize: string;
      calories?: { value: string; unitText: string };
      fatContent?: { value: string; unitText: string };
      saturatedFatContent?: { value: string; unitText: string };
      transFatContent?: { value: string; unitText: string };
      cholesterolContent?: { value: string; unitText: string };
      sodiumContent?: { value: string; unitText: string };
      carbohydrateContent?: { value: string; unitText: string };
      fiberContent?: { value: string; unitText: string };
      sugarContent?: { value: string; unitText: string };
      proteinContent?: { value: string; unitText: string };
    };
    weight?: {
      value: number;
      unit: string;
    };
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
    gtin?: string; // Global Trade Item Number (UPC, EAN, etc.)
    mpn?: string; // Manufacturer Part Number
    condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition' | 'DamagedCondition';
    offers?: {
      price: number;
      priceCurrency: string;
      priceValidUntil?: string;
      url?: string;
      availability?: string;
      itemCondition?: string;
      seller?: {
        name: string;
        url?: string;
      };
    }[];
  };
  siteUrl?: string;
}

/**
 * ProductSchema component that adds JSON-LD structured data for products
 * This helps search engines understand product details and improves rich results
 */
export default function ProductSchema({
  product,
  siteUrl = 'https://www.azlok.com'
}: ProductSchemaProps) {
  
  // Ensure image is an array
  const images = Array.isArray(product.image) ? product.image : [product.image];
  
  // Ensure all images have absolute URLs
  const processedImages = images.map(image => 
    image.startsWith('http') ? image : `${siteUrl}${image}`
  );
  
  // Format the product URL
  const productUrl = product.url.startsWith('http') 
    ? product.url 
    : `${siteUrl}${product.url}`;
  
  // Create a default offer if none provided
  const offers = product.offers || [{
    price: product.price,
    priceCurrency: product.currency || 'INR',
    availability: `https://schema.org/${product.availability || 'InStock'}`,
    url: productUrl,
    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  }];
  
  // Process offers to ensure they have schema.org URLs for availability
  const processedOffers = offers.map(offer => ({
    '@type': 'Offer',
    ...offer,
    availability: offer.availability?.startsWith('http') 
      ? offer.availability 
      : `https://schema.org/${offer.availability || product.availability || 'InStock'}`,
    url: offer.url || productUrl,
    ...(offer.itemCondition && {
      itemCondition: offer.itemCondition.startsWith('http') 
        ? offer.itemCondition 
        : `https://schema.org/${offer.itemCondition}`
    }),
    ...(offer.seller && {
      seller: {
        '@type': 'Organization',
        name: offer.seller.name,
        ...(offer.seller.url && { url: offer.seller.url })
      }
    })
  }));
  
  // Build the schema object
  const productSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.description,
    image: processedImages,
    sku: product.sku || `SKU-${product.id}`,
    ...(product.mpn && { mpn: product.mpn }),
    ...(product.gtin && { gtin: product.gtin }),
    url: productUrl,
    ...(product.brand && {
      brand: {
        '@type': 'Brand',
        name: product.brand
      }
    }),
    offers: processedOffers.length > 1 
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency || 'INR',
          lowPrice: Math.min(...processedOffers.map(o => o.price)),
          highPrice: Math.max(...processedOffers.map(o => o.price)),
          offerCount: processedOffers.length,
          offers: processedOffers
        }
      : processedOffers[0],
    ...(product.category && { category: product.category }),
    ...(product.condition && { 
      itemCondition: `https://schema.org/${product.condition}` 
    })
  };
  
  // Add dimensions if provided
  if (product.dimensions) {
    productSchema.width = {
      '@type': 'QuantitativeValue',
      value: product.dimensions.width,
      unitCode: product.dimensions.unit
    };
    productSchema.height = {
      '@type': 'QuantitativeValue',
      value: product.dimensions.height,
      unitCode: product.dimensions.unit
    };
    productSchema.depth = {
      '@type': 'QuantitativeValue',
      value: product.dimensions.depth,
      unitCode: product.dimensions.unit
    };
  }
  
  // Add weight if provided
  if (product.weight) {
    productSchema.weight = {
      '@type': 'QuantitativeValue',
      value: product.weight.value,
      unitCode: product.weight.unit
    };
  }
  
  // Add review data if available
  if (product.reviewCount && product.reviewRating) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.reviewRating,
      reviewCount: product.reviewCount,
    };
  }
  
  // Add nutrition information if available AND product is a spice
  const isSpiceProduct = (() => {
    // Check if category is spice or product name contains spice terms
    const spiceTerms = ['kali', 'saunf', 'fennel', 'laung', 'cloves', 'badi', 'pepper', 'mirch', 'dal', 'chini', 'cinnamon', 'cardamom', 'elaichi', 'patta', 'turmeric', 'haldi', 'coriander', 'dhaniya', 'cumin', 'jeera', 'cardamom', 'cinnamon', 'clove', 'pepper'];
    const exclusionTerms = ['alum', 'fitkari', 'soap', 'detergent', 'cleaner', 'chemical'];
    
    // Check category
    const categoryIsSpice = product.category?.toLowerCase() === 'spice' || product.category?.toLowerCase() === 'spices';
    
    // Check name for spice terms
    const nameHasSpiceTerm = spiceTerms.some(term => product.name?.toLowerCase().includes(term));
    
    // Check name for exclusion terms
    const nameHasExclusionTerm = exclusionTerms.some(term => product.name?.toLowerCase().includes(term));
    
    return (categoryIsSpice || nameHasSpiceTerm) && !nameHasExclusionTerm;
  })();

  
  if (product.nutrition && isSpiceProduct) {
    productSchema.nutrition = {
      '@type': 'NutritionInformation',
      servingSize: product.nutrition.servingSize,
      // Format nutrition values according to schema.org standards
      // Each value should be formatted as "value unitText" (e.g., "5 g")
      ...(product.nutrition.calories && {
        calories: `${product.nutrition.calories.value} ${product.nutrition.calories.unitText}`
      }),
      ...(product.nutrition.fatContent && {
        fatContent: `${product.nutrition.fatContent.value} ${product.nutrition.fatContent.unitText}`
      }),
      ...(product.nutrition.saturatedFatContent && {
        saturatedFatContent: `${product.nutrition.saturatedFatContent.value} ${product.nutrition.saturatedFatContent.unitText}`
      }),
      ...(product.nutrition.transFatContent && {
        transFatContent: `${product.nutrition.transFatContent.value} ${product.nutrition.transFatContent.unitText}`
      }),
      ...(product.nutrition.cholesterolContent && {
        cholesterolContent: `${product.nutrition.cholesterolContent.value} ${product.nutrition.cholesterolContent.unitText}`
      }),
      ...(product.nutrition.sodiumContent && {
        sodiumContent: `${product.nutrition.sodiumContent.value} ${product.nutrition.sodiumContent.unitText}`
      }),
      ...(product.nutrition.carbohydrateContent && {
        carbohydrateContent: `${product.nutrition.carbohydrateContent.value} ${product.nutrition.carbohydrateContent.unitText}`
      }),
      ...(product.nutrition.fiberContent && {
        fiberContent: `${product.nutrition.fiberContent.value} ${product.nutrition.fiberContent.unitText}`
      }),
      ...(product.nutrition.sugarContent && {
        sugarContent: `${product.nutrition.sugarContent.value} ${product.nutrition.sugarContent.unitText}`
      }),
      ...(product.nutrition.proteinContent && {
        proteinContent: `${product.nutrition.proteinContent.value} ${product.nutrition.proteinContent.unitText}`
      })
    };
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}
