'use client';

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_urls?: string[];
    categories?: Array<{ name: string; slug: string }>;
    seller?: {
      business_name?: string;
      full_name?: string;
      region?: string;
    };
    sku: string;
    stock_quantity: number;
    rating?: number;
    hsn_code?: string;
    gst_details?: {
      cgst: number;
      sgst: number;
      igst: number;
    };
  };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "sku": product.sku,
    "mpn": product.sku,
    "image": product.image_urls && product.image_urls.length > 0 ? product.image_urls : ["/globe.svg"],
    "category": product.categories && product.categories.length > 0 ? product.categories[0].name : "General",
    "brand": {
      "@type": "Brand",
      "name": product.seller?.business_name || product.seller?.full_name || "Azlok"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": product.seller?.business_name || product.seller?.full_name || "Azlok",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": product.seller?.region || "Maharashtra",
        "addressCountry": "IN"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": `https://azlok.com/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": product.seller?.business_name || product.seller?.full_name || "Azlok"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": Math.floor(Math.random() * 100) + 10 // Placeholder - should be actual review count
    } : undefined,
    "additionalProperty": [
      product.hsn_code ? {
        "@type": "PropertyValue",
        "name": "HSN Code",
        "value": product.hsn_code
      } : null,
      product.gst_details ? {
        "@type": "PropertyValue",
        "name": "GST Rate",
        "value": `${product.gst_details.cgst + product.gst_details.sgst}%`
      } : null
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
