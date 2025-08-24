'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { calculateProductTax, TaxCalculationRequest, TaxCalculationResponse, formatCurrency, formatTaxPercentage } from '../../utils/taxService';
import productService, { Product as ApiProduct } from '../../services/productService';

// Define the enhanced product type for UI with additional fields
interface EnhancedProduct extends ApiProduct {
  images: string[];
  minOrder: number;
  seller: {
    name: string;
    logo: string;
    location: string;
    memberSince: string;
    responseRate: string;
    responseTime: string;
    verified: boolean;
    rating: number;
    id?: number;
  };
  category: string;
  subcategory: string;
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
        // Try to find the product by searching for the slug
        const searchResponse = await productService.searchProducts(slug, 1);
        
        if (searchResponse && searchResponse.length > 0) {
          // Found a product matching the slug
          const apiProduct = searchResponse[0];
          
          // Transform API product to enhanced product with UI-specific fields
          const enhancedProduct: EnhancedProduct = {
            ...apiProduct,
            // Generate multiple images or use placeholder if none available
            images: apiProduct.image_url ? 
              [apiProduct.image_url, apiProduct.image_url, apiProduct.image_url] : 
              ['/globe.svg', '/globe.svg', '/globe.svg'],
            minOrder: 1, // Default minimum order
            seller: {
              name: 'Azlok Enterprises',
              logo: '/logo.png',
              location: 'Mumbai, India',
              memberSince: '2020',
              responseRate: '98%',
              responseTime: '< 24 hours',
              verified: true,
              rating: apiProduct.rating || 4.5,
              id: 1
            },
            category: apiProduct.category_name || 'Uncategorized',
            subcategory: 'General',
            // Generate specifications from available data
            specifications: [
              { name: 'SKU', value: apiProduct.sku || 'N/A' },
              { name: 'Weight', value: apiProduct.weight ? `${apiProduct.weight} kg` : 'N/A' },
              { name: 'Dimensions', value: apiProduct.dimensions || 'N/A' },
              { name: 'HSN Code', value: apiProduct.hsn_code || 'N/A' },
              { name: 'Country of Origin', value: 'India' },
              { name: 'Brand', value: apiProduct.brand || 'Azlok' }
            ],
            // Default features and applications
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
            moq: 1,
            leadTime: '7-10 days',
            paymentTerms: 'T/T, L/C, Western Union, PayPal',
            packaging: 'Standard export packaging',
            relatedProducts: []
          };
          
          setProduct(enhancedProduct);
        } else {
          // If no product found, create a default product with the slug as name
          const defaultProduct: EnhancedProduct = {
            id: 0,
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: 'Product details not available.',
            price: 0,
            stock_quantity: 0,
            sku: 'N/A',
            category_id: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: ['/globe.svg', '/globe.svg', '/globe.svg'],
            minOrder: 1,
            seller: {
              name: 'Azlok Enterprises',
              logo: '/logo.png',
              location: 'Mumbai, India',
              memberSince: '2020',
              responseRate: '98%',
              responseTime: '< 24 hours',
              verified: true,
              rating: 4.5
            },
            category: 'Uncategorized',
            subcategory: 'General',
            specifications: [
              { name: 'SKU', value: 'N/A' },
              { name: 'Country of Origin', value: 'India' }
            ],
            features: ['Information not available'],
            applications: ['Information not available'],
            moq: 1,
            leadTime: '7-10 days',
            paymentTerms: 'T/T, L/C',
            packaging: 'Standard packaging',
            relatedProducts: []
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
          stock_quantity: 0,
          sku: 'ERROR',
          category_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          images: ['/globe.svg'],
          minOrder: 1,
          seller: {
            name: 'Azlok Enterprises',
            logo: '/logo.png',
            location: 'Mumbai, India',
            memberSince: '2020',
            responseRate: '98%',
            responseTime: '< 24 hours',
            verified: true,
            rating: 4.5
          },
          category: 'Error',
          subcategory: 'Error',
          specifications: [],
          features: [],
          applications: [],
          moq: 1,
          leadTime: 'N/A',
          paymentTerms: 'N/A',
          packaging: 'N/A',
          relatedProducts: []
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
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Images */}
          <div>
            <div className="relative h-64 xs:h-72 sm:h-80 bg-gray-100 rounded-lg mb-3 sm:mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {product.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`relative h-16 sm:h-20 bg-gray-100 rounded cursor-pointer border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
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
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{product.name}</h1>
            
            <div className="flex flex-wrap items-center mb-3 sm:mb-4">
              <div className="flex items-center text-yellow-500 mr-3 sm:mr-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(product.seller.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-gray-700 text-sm sm:text-base" aria-label={`Rating: ${product.seller.rating} out of 5 stars`}>{product.seller.rating}</span>
              </div>
              <span className="text-gray-500 hidden xs:inline">|</span>
              <span className="ml-0 xs:ml-3 sm:ml-4 text-gray-600 text-sm sm:text-base w-full xs:w-auto mt-1 xs:mt-0">Category: {product.category} / {product.subcategory}</span>
            </div>
            
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                <span className="ml-1 sm:ml-2 text-gray-600 text-sm sm:text-base">/ unit</span>
              </div>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Minimum Order: {product.minOrder} units</p>
              
              {/* Tax Information */}
              {taxInfo && (
                <div className="mt-2 border-t border-gray-100 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm font-medium">Tax Information:</span>
                    {taxLoading ? (
                      <span className="text-xs text-gray-500">Calculating...</span>
                    ) : taxError ? (
                      <span className="text-xs text-red-500">{taxError}</span>
                    ) : null}
                  </div>
                  
                  {!taxLoading && !taxError && (
                    <div className="mt-1 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Tax Rate:</span>
                        <span>{formatTaxPercentage(taxInfo.tax_percentage)}</span>
                      </div>
                      
                      {taxInfo.hsn_code && (
                        <div className="flex justify-between text-gray-600">
                          <span>HSN Code:</span>
                          <span>{taxInfo.hsn_code}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Price {taxInfo.is_tax_inclusive ? '(incl. tax)' : '(excl. tax)'}:</span>
                        <span>{formatCurrency(taxInfo.is_tax_inclusive ? taxInfo.price_with_tax : taxInfo.price_without_tax)}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Tax Amount:</span>
                        <span>{formatCurrency(taxInfo.tax_amount)}</span>
                      </div>
                      
                      {taxInfo.cgst_amount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>CGST:</span>
                          <span>{formatCurrency(taxInfo.cgst_amount)}</span>
                        </div>
                      )}
                      
                      {taxInfo.sgst_amount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>SGST:</span>
                          <span>{formatCurrency(taxInfo.sgst_amount)}</span>
                        </div>
                      )}
                      
                      {taxInfo.igst_amount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>IGST:</span>
                          <span>{formatCurrency(taxInfo.igst_amount)}</span>
                        </div>
                      )}
                      
                      <div className="mt-1 text-xs italic text-gray-500">
                        {taxInfo.is_tax_inclusive ? 'Price is inclusive of all taxes' : 'Price is exclusive of taxes'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col xs:flex-row xs:items-center mb-3 sm:mb-4">
                <div className="w-full xs:w-1/3 mb-1 xs:mb-0">
                  <label htmlFor="quantity" className="block text-gray-700 text-sm sm:text-base">Quantity:</label>
                </div>
                <div className="w-full xs:w-2/3 flex items-center">
                  <input
                    type="number"
                    id="quantity"
                    min={product.minOrder}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 w-20 sm:w-24 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    aria-label="Product quantity"
                  />
                  <span className="ml-2 text-gray-600 text-sm sm:text-base">units</span>
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row xs:items-center mb-3 sm:mb-4">
                <div className="w-full xs:w-1/3 mb-1 xs:mb-0">
                  <span className="block text-gray-700 text-sm sm:text-base">Total Price:</span>
                </div>
                <div className="w-full xs:w-2/3">
                  <span className="font-bold text-primary text-sm sm:text-base">
                    {taxInfo ? formatCurrency(taxInfo.is_tax_inclusive ? 
                      taxInfo.price_with_tax * quantity : 
                      (taxInfo.price_without_tax + taxInfo.tax_amount) * quantity) : 
                      formatCurrency(product.price * quantity)}
                  </span>
                </div>
              </div>
              
              {/* State Selection for Tax Calculation */}
              <div className="mb-4 border-t border-gray-100 pt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Tax Calculation Settings:</div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Your State:</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={buyerState}
                      onChange={handleBuyerStateChange}
                    >
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CG">Chhattisgarh</option>
                      <option value="GA">Goa</option>
                      <option value="GJ">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OD">Odisha</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TS">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UK">Uttarakhand</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="WB">West Bengal</option>
                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="CH">Chandigarh</option>
                      <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                      <option value="DL">Delhi</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="LA">Ladakh</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="PY">Puducherry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Seller State:</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={sellerState}
                      onChange={handleSellerStateChange}
                      disabled
                    >
                      <option value="MH">Maharashtra</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Based on seller location</p>
                  </div>
                </div>
                
                <button
                  onClick={calculateTax}
                  className="w-full bg-gray-100 text-gray-700 text-xs py-1 rounded hover:bg-gray-200 transition-colors"
                  disabled={taxLoading}
                >
                  {taxLoading ? 'Calculating...' : 'Recalculate Taxes'}
                </button>
              </div>
              
              <div className="flex flex-col xs:flex-row xs:items-center mb-3 sm:mb-4">
                <div className="w-full xs:w-1/3 mb-1 xs:mb-0">
                  <span className="block text-gray-700 text-sm sm:text-base">Lead Time:</span>
                </div>
                <div className="w-full xs:w-2/3">
                  <span className="text-sm sm:text-base">{product.leadTime}</span>
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row xs:items-center">
                <div className="w-full xs:w-1/3 mb-1 xs:mb-0">
                  <span className="block text-gray-700 text-sm sm:text-base">Payment Terms:</span>
                </div>
                <div className="w-full xs:w-2/3">
                  <span className="text-sm sm:text-base">{product.paymentTerms}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3 xs:space-x-4">
              <button 
                onClick={() => setShowContactForm(true)}
                className="flex-1 bg-primary bg-opacity-20 text-gray-800 py-2 sm:py-3 rounded-md hover:bg-primary-dark hover:bg-opacity-30 transition-colors flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Contact supplier about this product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Supplier
              </button>
              <button 
                onClick={() => {
                  setAddingToCart(true);
                  // Simulate API call delay
                  setTimeout(() => {
                    addItem({
                      id: product.id,
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
                className="flex-1 border border-primary text-primary py-2 sm:py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Add product to cart"
              >
                {addingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : addedToCart ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
      <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="border-b">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <button
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:ring-offset-2 ${
                activeTab === 'description'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
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
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:ring-offset-2 ${
                activeTab === 'specifications'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
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
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:ring-offset-2 ${
                activeTab === 'features'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
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
              className={`px-3 xs:px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:ring-offset-2 ${
                activeTab === 'packaging'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
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

        <div className="p-4 sm:p-6">
          {activeTab === 'description' && (
            <div
              role="tabpanel"
              id="description-panel"
              aria-labelledby="description-tab"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product Description</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div
              role="tabpanel"
              id="specifications-panel"
              aria-labelledby="specifications-tab"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product Specifications</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full">
                  <tbody>
                    {product.specifications.map((spec: { name: string; value: string }, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 font-medium w-1/3 text-sm sm:text-base">{spec.name}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 text-sm sm:text-base">{spec.value}</td>
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
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Features</h3>
              <ul className="list-disc pl-4 sm:pl-5 mb-5 sm:mb-6 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm sm:text-base">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="ml-1">{feature}</li>
                ))}
              </ul>

              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Applications</h3>
              <ul className="list-disc pl-4 sm:pl-5 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm sm:text-base">
                {product.applications.map((application: string, index: number) => (
                  <li key={index} className="ml-1">{application}</li>
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
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Packaging & Shipping</h3>
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Packaging Details:</h4>
                <p className="text-gray-700 text-sm sm:text-base">{product.packaging}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Shipping Information:</h4>
                <ul className="list-disc pl-4 sm:pl-5 text-gray-700 text-sm sm:text-base">
                  <li className="ml-1 mb-1">Delivery Time: {product.leadTime} after payment confirmation</li>
                  <li className="ml-1 mb-1">Shipping available across India and internationally</li>
                  <li className="ml-1">Custom packaging available for bulk orders</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Supplier Information</h3>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="relative h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <Image
                  src={product.seller.logo}
                  alt={product.seller.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">{product.seller.name}</h4>
                <div className="flex flex-wrap items-center mt-1">
                  {product.seller.verified && (
                    <span className="bg-primary bg-opacity-20 text-gray-800 text-xs px-2 py-0.5 sm:py-1 rounded-full flex items-center mr-2 mb-1 sm:mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-2xs sm:text-xs">Verified</span>
                    </span>
                  )}
                  <span className="text-gray-600 text-xs sm:text-sm">{product.seller.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-2 sm:p-3 rounded">
              <p className="text-gray-600 text-xs sm:text-sm">Member Since</p>
              <p className="font-medium text-sm sm:text-base">{product.seller.memberSince}</p>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded">
              <p className="text-gray-600 text-xs sm:text-sm">Response Rate</p>
              <p className="font-medium text-sm sm:text-base">{product.seller.responseRate}</p>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded">
              <p className="text-gray-600 text-xs sm:text-sm">Response Time</p>
              <p className="font-medium text-sm sm:text-base">{product.seller.responseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base sm:text-lg font-semibold" id="contact-form-title">Contact Supplier</h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close contact form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleContactFormSubmit} className="p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  aria-required="true"
                />
              </div>
              <div className="mb-3 sm:mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  aria-required="true"
                />
              </div>
              <div className="mb-3 sm:mb-4">
                <label htmlFor="phone" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleContactFormChange}
                  required
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  aria-required="true"
                />
              </div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleContactFormChange}
                  required
                  rows={4}
                  className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={`I'm interested in ${product.name}. Please send more information.`}
                  aria-required="true"
                ></textarea>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-end gap-2 xs:gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="order-2 xs:order-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="order-1 xs:order-2 px-4 py-2 bg-primary bg-opacity-20 text-gray-800 rounded-md hover:bg-primary-dark hover:bg-opacity-30 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
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
