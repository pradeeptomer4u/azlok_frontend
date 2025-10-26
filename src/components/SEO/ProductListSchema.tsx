'use client';

import React from 'react';
import { Product } from '../../services/productService';

interface ProductListSchemaProps {
  products: Product[];
  listType?: 'ItemList' | 'CollectionPage';
  listName?: string;
}

const ProductListSchema: React.FC<ProductListSchemaProps> = ({ 
  products, 
  listType = 'ItemList',
  listName = 'Product List'
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  // Create the structured data based on the list type
  let structuredData;

  if (listType === 'ItemList') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': listName,
      'itemListElement': products.map((product, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          'name': product.name,
          'description': product.description ? 
            (product.description.length > 160 ? product.description.substring(0, 157) + '...' : product.description) : 
            `${product.name} - Quality product from Azlok`,
          'image': product.image_url || product.image_urls || '/globe.svg',
          'sku': product.sku,
          'mpn': product.id.toString(),
          'brand': {
            '@type': 'Brand',
            'name': product.brand || 'Azlok'
          },
          'offers': {
            '@type': 'Offer',
            'url': `https://www.azlok.com/products/${product.slug || product.id}`,
            'price': product.price,
            'priceCurrency': 'INR',
            'availability': product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'seller': {
              '@type': 'Organization',
              'name': product.seller?.business_name || product.seller?.full_name || 'Azlok'
            }
          }
        }
      }))
    };
  } else {
    // CollectionPage type
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': listName,
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': products.map((product, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Product',
            'name': product.name,
            'description': product.description ? 
              (product.description.length > 160 ? product.description.substring(0, 157) + '...' : product.description) : 
              `${product.name} - Quality product from Azlok`,
            'image': product.image_url || product.image_urls || '/globe.svg',
            'sku': product.sku,
            'mpn': product.id.toString(),
            'brand': {
              '@type': 'Brand',
              'name': product.brand || 'Azlok'
            },
            'offers': {
              '@type': 'Offer',
              'url': `https://www.azlok.com/products/${product.slug || product.id}`,
              'price': product.price,
              'priceCurrency': 'INR',
              'availability': product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              'seller': {
                '@type': 'Organization',
                'name': product.seller?.business_name || product.seller?.full_name || 'Azlok'
              }
            }
          }
        }))
      }
    };
  }

  // Handle image URLs that might be stored as JSON strings
  const safeStructuredData = JSON.stringify(structuredData, (key, value) => {
    if (key === 'image' && typeof value === 'string' && value.startsWith('[')) {
      try {
        const parsedImages = JSON.parse(value);
        return Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : '/globe.svg';
      } catch {
        return '/globe.svg';
      }
    }
    return value;
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStructuredData }}
    />
  );
};

export default ProductListSchema;
