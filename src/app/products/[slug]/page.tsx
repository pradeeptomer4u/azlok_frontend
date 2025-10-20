import ProductDetail from '@/components/products/ProductDetail';
import productService from '@/services/productService';

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params;
  
  // Format the product name from slug for use in both main and fallback paths
  const formattedProductName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  
  try {
    // Fetch all products and find the one matching the slug
    const productsResponse = await productService.getProducts({}, 1, 100);
    const allProducts = productsResponse.items || [];
    
    // Check if slug is numeric (product ID)
    const productId = parseInt(slug);
    let product = null;
    
    if (!isNaN(productId)) {
      product = allProducts.find(p => p.id === productId);
    }
    
    // If not found by ID, search by slug or name
    if (!product) {
      product = allProducts.find(p => 
        p.slug === slug || 
        p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
        p.sku === slug.toUpperCase()
      );
    }
    
    if (product) {
      // Extract keywords from product data
      const extractKeywords = (text: string): string[] => {
        if (!text) return [];
        
        // Remove common words and keep meaningful terms
        const commonWords = ['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of'];
        
        // Split text into words, filter out common words, and take unique words
        return text.toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .split(/\s+/) // Split by whitespace
          .filter(word => word.length > 2 && !commonWords.includes(word)) // Remove short and common words
          .slice(0, 15); // Limit to 15 keywords
      };
      
      // Get category and subcategory
      const category = product.category_name || '';
      const subcategory = product.categories && product.categories.length > 1 ? 
        product.categories[1].name : '';
      
      // Extract keywords from description
      const descriptionKeywords = extractKeywords(product.description);
      
      // Combine all keywords
      const allKeywords = [
        product.name,
        category,
        subcategory,
        product.brand || 'Azlok',
        ...descriptionKeywords
      ].filter(Boolean); // Remove empty values
      
      // Remove duplicates and join with commas
      const uniqueKeywords = [...new Set(allKeywords)].join(', ');
      
      // Get product image URL - with safe fallbacks at each step
      let productImage = '/globe.svg'; // Default fallback image
      
      try {
        if (product.image_url) {
          productImage = product.image_url;
        } else if (product.image_urls) {
          if (typeof product.image_urls === 'string') {
            try {
              const parsedImages = JSON.parse(product.image_urls);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                productImage = parsedImages[0];
              }
            } catch {
              // Keep default if parsing fails
            }
          } else if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
            productImage = product.image_urls[0];
          }
        }
        
        // Ensure image URL is absolute and valid
        if (productImage && productImage !== '/globe.svg' && !productImage.startsWith('http')) {
          // Make sure we have a valid base URL
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://azlok.com';
          // Ensure proper path joining
          productImage = `${baseUrl}${productImage.startsWith('/') ? '' : '/'}${productImage}`;
        }
      } catch (error) {
        console.error('Error processing product image:', error);
        productImage = '/globe.svg'; // Fallback on any error
      }
      
      // Format price for display with safe fallback
      let formattedPrice = '';
      try {
        if (typeof product.price === 'number') {
          formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
          }).format(product.price);
        }
      } catch (error) {
        console.error('Error formatting price:', error);
      }
      
      // Use real product data for metadata
      return {
        title: `${product.name} | Azlok Enterprises`,
        description: (product.description ? product.description.substring(0, 160) : 'View detailed product specifications, pricing, and supplier information').substring(0, 160),
        keywords: uniqueKeywords,
        alternates: {
          canonical: `/products/${slug}`,
        },
        openGraph: {
          title: product.name || formattedProductName,
          description: ((product.description || 'View detailed product specifications, pricing, and supplier information').substring(0, 160)),
          url: `/products/${slug}`,
          siteName: 'Azlok Enterprises',
          images: [
            {
              url: productImage,
              width: 1200,
              height: 630,
              alt: product.name || formattedProductName,
            }
          ],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: product.name || formattedProductName,
          description: ((product.description || 'View detailed product specifications, pricing, and supplier information').substring(0, 160)),
          images: [productImage],
          creator: '@azlok',
          site: '@azlok',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }
  
  // Use the formattedProductName for fallback (already defined at the top of the function)
  
  // Fallback metadata if product not found or error occurs
  return {
    title: `${formattedProductName} | Azlok Enterprises`,
    description: 'View detailed product specifications, pricing, and supplier information'.substring(0, 160),
    keywords: `${slug.replace(/-/g, ' ')}, product, Azlok, marketplace`,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${formattedProductName} | Azlok Enterprises`,
      description: 'View detailed product specifications, pricing, and supplier information'.substring(0, 160),
      url: `/products/${slug}`,
      siteName: 'Azlok Enterprises',
      images: [
        {
          url: '/globe.svg',
          width: 1200,
          height: 630,
          alt: formattedProductName,
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedProductName} | Azlok Enterprises`,
      description: 'View detailed product specifications, pricing, and supplier information'.substring(0, 160),
      images: ['/globe.svg'],
      creator: '@azlok',
      site: '@azlok',
    },
  };
}

export default async function ProductPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  
  return (
    <div className="min-h-screen py-8 bg-[#dbf9e1]/50 relative overflow-hidden">
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
      
      <div className="container-custom mx-auto relative z-10">
        <ProductDetail slug={slug} />
      </div>
    </div>
  );
}
