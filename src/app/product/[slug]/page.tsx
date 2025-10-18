'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import MetaTags from '@/components/SEO/MetaTags';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/SEO/StructuredData';
import { calculateProductTax, TaxCalculationResponse, formatCurrency, formatTaxPercentage } from '@/utils/taxService';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  seller: {
    id: number;
    full_name: string;
    state?: string;
  };
  slug: string;
  hsn_code?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [taxInfo, setTaxInfo] = useState<TaxCalculationResponse | null>(null);
  const [taxLoading, setTaxLoading] = useState<boolean>(false);
  const [taxError, setTaxError] = useState<string | null>(null);
  const [buyerState, setBuyerState] = useState<string>('');
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/slug/${slug}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);
  
  // Fetch tax information when product is loaded or quantity changes
  useEffect(() => {
    const fetchTaxInfo = async () => {
      if (!product) return;
      
      try {
        setTaxLoading(true);
        const taxResponse = await calculateProductTax({
          product_id: product.id,
          quantity: quantity,
          buyer_state: buyerState,
          seller_state: product.seller.state
        });
        setTaxInfo(taxResponse);
        setTaxLoading(false);
      } catch (err) {
        console.error('Error fetching tax information:', err);
        setTaxError('Failed to load tax information');
        setTaxLoading(false);
      }
    };
    
    if (product) {
      fetchTaxInfo();
    }
  }, [product, quantity, buyerState]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        product_id: product.id, // Add product_id field
        name: product.name,
        image: product.image_url,
        price: taxInfo?.price_with_tax || product.price,
        quantity,
        seller: product.seller.full_name,
        seller_id: product.seller.id,
        minOrder: 1,
        tax_amount: taxInfo?.tax_amount,
        cgst_amount: taxInfo?.cgst_amount,
        sgst_amount: taxInfo?.sgst_amount,
        igst_amount: taxInfo?.igst_amount,
        is_tax_inclusive: taxInfo?.is_tax_inclusive,
        hsn_code: taxInfo?.hsn_code || product.hsn_code
      });
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  // Prepare breadcrumb data for structured data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: product.category.name, url: `/category/${product.category.slug}` },
    { name: product.name, url: `/product/${product.slug}` },
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <MetaTags
        title={`${product.name} | 100% Natural Farm-Direct Products`}
        description={`${product.description.substring(0, 120)} - Made with natural ingredients sourced directly from farmers. No artificial colors or additives.`}
        keywords={`${product.name}, ${product.category.name}, natural products, farm direct, no artificial colors, organic, pure ingredients`}
        ogType="product"
        ogUrl={`/product/${product.slug}`}
        ogImage={product.image_url}
        canonicalUrl={`/product/${product.slug}`}
      />
      
      {/* Structured Data for Product */}
      <ProductStructuredData
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image_url,
          url: `/product/${product.slug}`,
          availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
          brand: product.seller.full_name,
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation with Green Theme */}
        <nav className="text-sm mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="text-green-600 hover:text-green-800">Home</Link>
              <svg className="fill-current w-3 h-3 mx-2 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link href={`/category/${product.category.slug}`} className="text-green-600 hover:text-green-800">
                {product.category.name}
              </Link>
              <svg className="fill-current w-3 h-3 mx-2 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-green-800 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4 mb-6 md:mb-0">
            <div className="relative">
              <div className="h-64 md:h-80 rounded-lg bg-green-50 border border-green-100 mb-4 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">No image available</span>
                )}
              </div>
              <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                100% Natural
              </div>
              <div className="absolute top-3 right-3 bg-yellow-500 text-green-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                Farm Direct
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 mt-2">
              <div className="w-16 h-16 border-2 border-green-500 rounded-md overflow-hidden">
                {product.image_url && (
                  <div className="relative h-full w-full">
                    <Image
                      src={product.image_url}
                      alt={`${product.name} thumbnail 1`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-green-50">
                <div className="flex items-center justify-center h-full text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">100% Natural</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Farm Direct</span>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">No Artificial Colors</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Made by <span className="font-semibold">{product.seller.full_name}</span> with ingredients sourced directly from farmers
            </p>
            <div className="flex flex-col mb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  {taxInfo ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl text-green-700">{formatCurrency(taxInfo.price_with_tax)}</span>
                      {taxInfo.price_without_tax !== taxInfo.price_with_tax && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(taxInfo.price_without_tax)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="font-bold text-2xl text-green-700">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <div>
                  {product.stock > 0 ? (
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs font-medium text-green-800">In Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-red-100 px-3 py-1 rounded-full">
                      <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-xs font-medium text-red-800">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
              
              
              {/* State Selection for Tax Calculation */}
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <label className="block text-green-700 text-sm font-bold" htmlFor="buyerState">
                    Your State (for tax calculation)
                  </label>
                </div>
                <div className="relative">
                  <select
                    id="buyerState"
                    className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    value={buyerState}
                    onChange={(e) => setBuyerState(e.target.value)}
                  >
                    <option value="">Select State</option>
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-600">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {taxLoading && (
                  <div className="flex items-center mt-1">
                    <div className="animate-spin h-3 w-3 border-2 border-green-500 rounded-full border-t-transparent mr-2"></div>
                    <p className="text-xs text-green-600">Calculating taxes...</p>
                  </div>
                )}
                {taxError && <p className="text-xs text-red-500 mt-1">{taxError}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-green-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-l-lg transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  id="quantity"
                  type="number"
                  className="w-16 text-center border-t border-b border-green-200 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <button
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-r-lg transition-colors"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-green-600 mt-1">Available: {product.stock} units</p>
            </div>
            <div className="mb-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg w-full flex items-center justify-center transition-all"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add Natural Product to Cart
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Out of Stock
                  </>
                )}
              </button>
              {product.stock > 0 && (
                <p className="text-xs text-center mt-2 text-green-700">Farm fresh - Limited stock available</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Product Description</h3>
              <div className="text-gray-600 text-sm mb-4">
                <p>{product.description}</p>
              </div>
              
              {/* Natural Product Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-green-800 mb-2">Natural Product Information</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Made with 100% natural ingredients</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sourced directly from farmers</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No artificial colors or preservatives</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Processed with care to maintain natural goodness</span>
                  </li>
                </ul>
              </div>
              
              {/* Farm Connection */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Our Farm Connection</h4>
                <p className="mb-2">We work directly with farmers to ensure the highest quality ingredients for our products.</p>
                <p>By cutting out middlemen, we ensure farmers get fair prices while you get the freshest, most authentic products.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
