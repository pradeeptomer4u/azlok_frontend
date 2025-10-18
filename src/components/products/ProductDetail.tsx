'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { calculateProductTax, TaxCalculationRequest, TaxCalculationResponse, formatCurrency, formatTaxPercentage } from '../../utils/taxService';
import productService, { Product as ApiProduct } from '../../services/productService';

// Define the enhanced product type for UI with additional fields
interface EnhancedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  rating: number;
  isVerified: boolean;
  slug: string;
  image: string;
  images: string[];
  minOrder: number;
  seller: {
    id: number;
    name: string;
    logo: string;
    location: string;
    memberSince: string;
    responseRate: number;
    responseTime: string;
    verified: boolean;
    rating: number;
  };
  specifications: Array<{ name: string; value: string }>;
  features: string[];
  applications: string[];
  moq: number;
  leadTime: string;
  paymentTerms: string;
  packaging: string;
  relatedProducts: number[];
}

interface ProductDetailProps {
  slug: string;
}

const ProductDetail = ({ slug }: ProductDetailProps) => {
  interface DetailedProduct {
    id: number;
    name: string;
    image: string;
    slug: string;
    price: number;
    minOrder: number;
    seller: {
      id: number;
      name: string;
      rating: number;
      verified: boolean;
      logo?: string;
      location?: string;
      memberSince?: string;
      responseRate?: number;
      responseTime?: string;
    };
    location: string;
    category: string;
    subcategory?: string;
    rating: number;
    isVerified: boolean;
    description: string;
    specifications: { name: string; value: string }[];
    images: string[];
    features?: string[];
    applications?: string[];
    packaging: string;
    leadTime: string;
    paymentTerms: string;
    tax_info?: {
      tax_percentage: number;
      tax_amount: number;
      total_price: number;
      is_tax_inclusive: boolean;
      hsn_code?: string;
    };
  }

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Tax calculation states
  const [taxInfo, setTaxInfo] = useState<TaxCalculationResponse | null>(null);
  const [taxLoading, setTaxLoading] = useState(false);
  const [taxError, setTaxError] = useState<string | null>(null);
  const [buyerState, setBuyerState] = useState<string>('MH'); // Default to Maharashtra
  const [sellerState, setSellerState] = useState<string>('MH'); // Default to Maharashtra

  // Fetch product data from the API
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Get all products and find the one matching the slug
        let apiProduct = null;
        
        // First try to get all products and find by slug or ID
        const productsResponse = await productService.getProducts({}, 1, 100);
        const allProducts = productsResponse.items || [];
        
        // Check if slug is numeric (product ID)
        const productId = parseInt(slug);
        if (!isNaN(productId)) {
          apiProduct = allProducts.find(p => p.id === productId);
        }
        
        // If not found by ID, search by slug or name
        if (!apiProduct) {
          apiProduct = allProducts.find(p => 
            p.slug === slug || 
            p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
            p.sku === slug.toUpperCase()
          );
        }
        
        if (apiProduct) {
          
          // Transform API product to detailed product with UI-specific fields
          const detailedProduct: DetailedProduct = {
            id: apiProduct.id,
            name: apiProduct.name,
            image: apiProduct.image_urls && Array.isArray(apiProduct.image_urls) ? 
              apiProduct.image_urls[0] : 
              apiProduct.image_urls ? 
                JSON.parse(apiProduct.image_urls)[0] : 
                apiProduct.image_url || '/globe.svg',
            slug: slug, // Use the slug from props
            price: apiProduct.price,
            minOrder: 1, // Default minimum order
            seller: {
              id: apiProduct.seller?.id || 1,
              name: apiProduct.seller?.business_name || apiProduct.seller?.full_name || 'Azlok Enterprises',
              logo: '/logo.png',
              location: apiProduct.seller?.region || 'Mumbai, India',
              memberSince: '2020',
              responseRate: 98,
              responseTime: '< 24 hours',
              verified: true,
              rating: apiProduct.rating || 4.5
            },
            location: apiProduct.seller?.region || 'Mumbai, India',
            category: apiProduct.categories && apiProduct.categories.length > 0 ? 
              apiProduct.categories[0].name : 'Uncategorized',
            subcategory: 'General',
            rating: apiProduct.rating || 4.5,
            isVerified: true,
            description: apiProduct.description || 'No description available',
            // Generate specifications from available data
            specifications: [
              { name: 'SKU', value: apiProduct.sku || 'N/A' },
              { name: 'Weight', value: apiProduct.weight ? `${apiProduct.weight} kg` : 'N/A' },
              { name: 'Dimensions', value: apiProduct.dimensions || 'N/A' },
              { name: 'HSN Code', value: apiProduct.hsn_code || 'N/A' },
              { name: 'Country of Origin', value: 'India' },
              { name: 'Brand', value: apiProduct.brand || 'Azlok' }
            ],
            // Parse image URLs from API response
            images: apiProduct.image_urls && Array.isArray(apiProduct.image_urls) ? 
              apiProduct.image_urls : 
              apiProduct.image_urls ? 
                JSON.parse(apiProduct.image_urls) : 
                ['/globe.svg', '/globe.svg', '/globe.svg'],
            features: [
              'Premium quality',
              'Durable construction',
              'Reliable performance',
              'Industry standard compliance',
              'Competitive pricing'
            ],
            applications: [
              'Commercial use',
              'Industrial applications',
              'Residential projects',
              'Institutional settings',
              'General purpose'
            ],
            packaging: 'Standard export packaging',
            leadTime: '7-10 days',
            paymentTerms: 'T/T, L/C, Western Union, PayPal'
          };
          
          setProduct(detailedProduct);
        } else {
          // If no product found, create a default product with the slug as name
          const defaultProduct: DetailedProduct = {
            id: 0,
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: 'Product details not available.',
            price: 0,
            image: '/globe.svg',
            slug: slug,
            minOrder: 1,
            seller: {
              id: 0,
              name: 'Azlok Enterprises',
              logo: '/logo.png',
              location: 'Mumbai, India',
              memberSince: '2020',
              responseRate: 98,
              responseTime: '< 24 hours',
              verified: true,
              rating: 4.5
            },
            location: 'Mumbai, India',
            category: 'Uncategorized',
            subcategory: 'General',
            rating: 4.5,
            isVerified: true,
            specifications: [
              { name: 'SKU', value: 'N/A' },
              { name: 'Country of Origin', value: 'India' }
            ],
            images: ['/globe.svg', '/globe.svg', '/globe.svg'],
            features: ['Information not available'],
            applications: ['Information not available'],
            packaging: 'Standard packaging',
            leadTime: '7-10 days',
            paymentTerms: 'T/T, L/C'
          };
          
          setProduct(defaultProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Create a fallback product on error
        setProduct({
          id: 0,
          name: 'Product Not Found',
          description: 'Unable to load product details. Please try again later.',
          price: 0,
          image: '/globe.svg',
          slug: slug,
          minOrder: 1,
          seller: {
            id: 0,
            name: 'Azlok Enterprises',
            logo: '/logo.png',
            location: 'Mumbai, India',
            memberSince: '2020',
            responseRate: 98,
            responseTime: '< 24 hours',
            verified: true,
            rating: 4.5
          },
          location: 'Error',
          category: 'Error',
          subcategory: 'Error',
          rating: 0,
          isVerified: false,
          specifications: [],
          images: ['/globe.svg'],
          features: [],
          applications: [],
          packaging: 'N/A',
          leadTime: 'N/A',
          paymentTerms: 'N/A'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);
  
  // Calculate tax when product, quantity, or states change
  useEffect(() => {
    if (product && product.id) {
      calculateTax();
    }
  }, [product, quantity, buyerState, sellerState]);
  
  // Function to calculate tax for the product
  const calculateTax = async () => {
    if (!product) return;
    
    setTaxLoading(true);
    setTaxError(null);
    
    try {
      const request: TaxCalculationRequest = {
        product_id: product.id,
        quantity: quantity,
        buyer_state: buyerState,
        seller_state: sellerState
      };
      
      const response = await calculateProductTax(request);
      setTaxInfo(response);
    } catch (error) {
      console.error('Error calculating tax:', error);
      setTaxError('Failed to calculate tax information');
    } finally {
      setTaxLoading(false);
    }
  };
  
  // Handle state selection for tax calculation
  const handleBuyerStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuyerState(e.target.value);
  };
  
  const handleSellerStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSellerState(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this data to an API
    console.log('Contact form submitted:', formData);
    alert('Your message has been sent to the supplier. They will contact you shortly.');
    setShowContactForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold mt-4">Product not found</h3>
        <p className="text-gray-600 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex flex-wrap mb-4 sm:mb-6 text-xs sm:text-sm" aria-label="Breadcrumb">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="mx-1 sm:mx-2 text-gray-500">/</span>
        <Link href="/products" className="text-gray-500 hover:text-primary">Products</Link>
        <span className="mx-1 sm:mx-2 text-gray-500">/</span>
        <Link href={`/products?category=${product.category.toLowerCase()}`} className="text-gray-500 hover:text-primary">{product.category}</Link>
        <span className="mx-1 sm:mx-2 text-gray-500">/</span>
        <span className="text-gray-800 truncate max-w-[180px] xs:max-w-none" title={product.name}>{product.name}</span>
      </nav>

      {/* Product Overview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-green-100/50 relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-200/0 via-green-300/50 to-green-200/0"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Images */}
          <div>
            <div className="relative h-64 xs:h-72 sm:h-80 bg-white rounded-lg mb-3 sm:mb-4 shadow-sm overflow-hidden group/image border border-green-100/50">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-300/30 rounded-tl-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-300/30 rounded-br-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
              
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover/image:scale-105"
                priority
              />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100/0 via-green-100/10 to-green-100/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {product.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`relative h-16 sm:h-20 bg-white rounded cursor-pointer border-2 ${selectedImage === index ? 'border-green-500 shadow-md shadow-green-100' : 'border-transparent'} hover:border-green-300 transition-all duration-300 overflow-hidden`}
                  onClick={() => setSelectedImage(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-contain p-2 transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="relative">
            {/* Subtle decorative element */}
            <div className="absolute -top-6 right-4 w-12 h-12 bg-green-100/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h1 className="text-xl xs:text-2xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-3 sm:mb-4 relative z-10">{product.name}</h1>
            
            <div className="flex flex-wrap items-center mb-3 sm:mb-4">
              <div className="flex items-center text-yellow-500 mr-3 sm:mr-4 relative group/stars">
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-yellow-100/30 blur-md rounded-full opacity-0 group-hover/stars:opacity-100 transition-opacity duration-300"></div>
                
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(product.seller.rating) ? 'text-yellow-500' : 'text-gray-300'} transition-transform duration-300 hover:scale-110`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium" aria-label={`Rating: ${product.seller.rating} out of 5 stars`}>{product.seller.rating}</span>
              </div>
              <span className="text-gray-500 hidden xs:inline">|</span>
              <span className="ml-0 xs:ml-3 sm:ml-4 text-gray-600 text-sm sm:text-base w-full xs:w-auto mt-1 xs:mt-0 font-['Montserrat',sans-serif] font-light tracking-wide">Category: <span className="font-medium text-green-700">{product.category}</span> / <span className="font-medium text-green-700">{product.subcategory}</span></span>
            </div>
            
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-green-100/50 relative">
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-green-300/0 via-green-400/30 to-green-300/0 rounded-full"></div>
              
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-primary font-['Montserrat',sans-serif] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-green-700">{formatCurrency(product.price)}</span>
                <span className="ml-1 sm:ml-2 text-gray-600 text-sm sm:text-base font-['Montserrat',sans-serif] font-light">/ unit</span>
              </div>
              
              <p className="text-gray-600 mt-1 text-sm sm:text-base font-['Montserrat',sans-serif] font-light tracking-wide">
                <span className="font-medium">Minimum Order:</span> {product.minOrder} units
              </p>
              
            </div>
            
            <div className="mb-4 sm:mb-6 bg-[#defce8]/30 p-4 rounded-lg border border-green-100/50 shadow-sm">
              <div className="flex flex-col xs:flex-row xs:items-center mb-3 sm:mb-4">
                <div className="w-full xs:w-1/3 mb-1 xs:mb-0">
                  <label htmlFor="quantity" className="block text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">Quantity:</label>
                </div>
                <div className="w-full xs:w-2/3 flex items-center">
                  <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="number"
                      id="quantity"
                      min={product.minOrder}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="relative border border-green-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 w-20 sm:w-24 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif]"
                      aria-label="Product quantity"
                    />
                  </div>
                  <span className="ml-2 text-gray-600 text-sm sm:text-base font-['Montserrat',sans-serif] font-light">units</span>
                </div>
              </div>
              

              {/* Decorative element */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-green-300/0 via-green-400/30 to-green-300/0 rounded-full"></div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3 xs:space-x-4">
              <a 
                href={`https://wa.me/8800412138?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-gray-800 py-2 sm:py-3 rounded-md hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 shadow-sm hover:shadow group relative overflow-hidden font-['Montserrat',sans-serif] font-medium"
                aria-label="Contact supplier via WhatsApp about this product"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
              <button 
                onClick={() => {
                  setAddingToCart(true);
                  // Simulate API call delay
                  setTimeout(() => {
                    addItem({
                      id: product.id,
                      product_id: product.id, // Add product_id field
                      name: product.name,
                      image: product.images[0],
                      price: product.price,
                      quantity: quantity,
                      seller: product.seller.name,
                      seller_id: product.seller.id,
                      minOrder: product.minOrder,
                      tax_amount: taxInfo?.tax_amount,
                      cgst_amount: taxInfo?.cgst_amount,
                      sgst_amount: taxInfo?.sgst_amount,
                      igst_amount: taxInfo?.igst_amount,
                      is_tax_inclusive: taxInfo?.is_tax_inclusive,
                      hsn_code: taxInfo?.hsn_code
                    });
                    setAddingToCart(false);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 3000);
                  }, 500);
                }}
                disabled={addingToCart}
                className={`flex-1 py-2 sm:py-3 rounded-md transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow relative overflow-hidden font-['Montserrat',sans-serif] font-medium ${addedToCart ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-primary/20 to-primary/20 text-gray-800 hover:from-primary/30 hover:to-primary/30'} focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50`}
                aria-label="Add product to cart"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {addingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : addedToCart ? (
                  <>
                    <svg className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-6 sm:mb-8 border border-[#dbf9e1]/60 relative overflow-hidden group/tabs">
        <div className="border-b border-[#dbf9e1]/70">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#5dc285]/50 scrollbar-track-transparent">
            <button
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-['Montserrat',sans-serif] font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-opacity-50 focus:ring-offset-2 relative transition-all duration-300 ${
                activeTab === 'description'
                  ? 'text-green-700 border-b-2 border-[#5dc285] font-semibold'
                  : 'text-gray-600 hover:text-[#5dc285]'
              }`}
              onClick={() => setActiveTab('description')}
              aria-selected={activeTab === 'description'}
              role="tab"
              aria-controls="description-panel"
              id="description-tab"
            >
              Description
            </button>
            <button
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-['Montserrat',sans-serif] font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-opacity-50 focus:ring-offset-2 relative transition-all duration-300 ${
                activeTab === 'specifications'
                  ? 'text-green-700 border-b-2 border-[#5dc285] font-semibold'
                  : 'text-gray-600 hover:text-[#5dc285]'
              }`}
              onClick={() => setActiveTab('specifications')}
              aria-selected={activeTab === 'specifications'}
              role="tab"
              aria-controls="specifications-panel"
              id="specifications-tab"
            >
              Specifications
            </button>
            <button
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-['Montserrat',sans-serif] font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-opacity-50 focus:ring-offset-2 relative transition-all duration-300 ${
                activeTab === 'features'
                  ? 'text-green-700 border-b-2 border-[#5dc285] font-semibold'
                  : 'text-gray-600 hover:text-[#5dc285]'
              }`}
              onClick={() => setActiveTab('features')}
              aria-selected={activeTab === 'features'}
              role="tab"
              aria-controls="features-panel"
              id="features-tab"
            >
              Features & Apps
            </button>
            <button
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-['Montserrat',sans-serif] font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#5dc285] focus:ring-opacity-50 focus:ring-offset-2 relative transition-all duration-300 ${
                activeTab === 'packaging'
                  ? 'text-green-700 border-b-2 border-[#5dc285] font-semibold'
                  : 'text-gray-600 hover:text-[#5dc285]'
              }`}
              onClick={() => setActiveTab('packaging')}
              aria-selected={activeTab === 'packaging'}
              role="tab"
              aria-controls="packaging-panel"
              id="packaging-tab"
            >
              Packaging
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#dbf9e1]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover/tabs:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#dbf9e1]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover/tabs:opacity-100 transition-opacity duration-700 delay-100"></div>
          {activeTab === 'description' && (
            <div
              role="tabpanel"
              id="description-panel"
              aria-labelledby="description-tab"
            >
              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold mb-3 sm:mb-4 text-[#5dc285] relative inline-block">
                Product Description
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-['Montserrat',sans-serif] font-light tracking-wide">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div
              role="tabpanel"
              id="specifications-panel"
              aria-labelledby="specifications-tab"
            >
              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold mb-3 sm:mb-4 text-[#5dc285] relative inline-block">
                Product Specifications
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
              </h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full">
                  <tbody>
                    {product.specifications.map((spec: { name: string; value: string }, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#dbf9e1]/30' : 'bg-white/80'}>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 font-medium w-1/3 text-sm sm:text-base font-['Montserrat',sans-serif]">{spec.name}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-light tracking-wide">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div
              role="tabpanel"
              id="features-panel"
              aria-labelledby="features-tab"
            >
              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold mb-3 sm:mb-4 text-[#5dc285] relative inline-block">
                Features
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 mb-5 sm:mb-6 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
                {product.features?.map((feature: string, index: number) => (
                  <li key={index} className="ml-1 font-['Montserrat',sans-serif] font-light tracking-wide py-1 group">
                    <span className="relative">
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#5dc285]/50 group-hover:w-full transition-all duration-300"></span>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold mb-3 sm:mb-4 text-[#5dc285] relative inline-block">
                Applications
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
                {product.applications?.map((application: string, index: number) => (
                  <li key={index} className="ml-1 font-['Montserrat',sans-serif] font-light tracking-wide py-1 group">
                    <span className="relative">
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#5dc285]/50 group-hover:w-full transition-all duration-300"></span>
                      {application}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'packaging' && (
            <div
              role="tabpanel"
              id="packaging-panel"
              aria-labelledby="packaging-tab"
            >
              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold mb-3 sm:mb-4 text-[#5dc285] relative inline-block">
                Packaging & Shipping
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#dbf9e1] via-[#5dc285] to-[#dbf9e1]"></div>
              </h3>
              <div className="mb-5 bg-[#dbf9e1]/30 p-4 rounded-lg border border-[#dbf9e1]/60">
                <h4 className="font-['Montserrat',sans-serif] font-medium text-[#5dc285] mb-2 text-sm sm:text-base">Packaging Details:</h4>
                <p className="text-gray-700 text-sm sm:text-base font-['Montserrat',sans-serif] font-light tracking-wide">{product.packaging}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg border border-[#dbf9e1]/60">
                <h4 className="font-['Montserrat',sans-serif] font-medium text-[#5dc285] mb-2 text-sm sm:text-base">Shipping Information:</h4>
                <ul className="list-disc pl-4 sm:pl-5 text-gray-700 text-sm sm:text-base">
                  <li className="ml-1 mb-2 font-['Montserrat',sans-serif] font-light tracking-wide">Delivery Time: <span className="font-medium text-gray-800">{product.leadTime}</span> after payment confirmation</li>
                  <li className="ml-1 mb-2 font-['Montserrat',sans-serif] font-light tracking-wide">Shipping available across India and internationally</li>
                  <li className="ml-1 font-['Montserrat',sans-serif] font-light tracking-wide">Custom packaging available for bulk orders</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-gray-800/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-green-100/50 relative group/modal">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-green-100/50 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <h3 className="text-base sm:text-lg font-['Playfair_Display',serif] font-semibold text-green-800 relative" id="contact-form-title">
                Contact Supplier
                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
              </h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition-all duration-300 group/close"
                aria-label="Close contact form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleContactFormSubmit} className="p-4 sm:p-6 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover/modal:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full blur-2xl opacity-0 group-hover/modal:opacity-100 transition-opacity duration-700 delay-100"></div>
              <div className="mb-3 sm:mb-4 relative z-10">
                <label htmlFor="name" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">Your Name *</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleContactFormChange}
                    required
                    className="relative w-full border border-green-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="mb-3 sm:mb-4 relative z-10">
                <label htmlFor="email" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">Email Address *</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleContactFormChange}
                    required
                    className="relative w-full border border-green-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="mb-3 sm:mb-4 relative z-10">
                <label htmlFor="phone" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">Phone Number *</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleContactFormChange}
                    required
                    className="relative w-full border border-green-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="mb-4 sm:mb-6 relative z-10">
                <label htmlFor="message" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base font-['Montserrat',sans-serif] font-medium">Message *</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/30 via-green-500/30 to-green-600/30 rounded-md blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleContactFormChange}
                    required
                    rows={4}
                    className="relative w-full border border-green-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-white/90 font-['Montserrat',sans-serif] font-light"
                    placeholder={`I'm interested in ${product.name}. Please send more information.`}
                    aria-required="true"
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-end gap-2 xs:gap-3 relative z-10">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="order-2 xs:order-1 px-4 py-2 border border-green-200 rounded-md text-gray-700 hover:bg-green-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 font-['Montserrat',sans-serif] font-medium transition-all duration-300 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="order-1 xs:order-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 text-gray-800 rounded-md hover:from-green-500/30 hover:to-green-600/30 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-['Montserrat',sans-serif] font-medium transition-all duration-300 shadow-sm hover:shadow relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-300/0 via-green-300/10 to-green-300/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
