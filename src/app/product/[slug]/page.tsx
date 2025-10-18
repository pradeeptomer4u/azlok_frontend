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
        title={`${product.name} | Marketplace`}
        description={product.description.substring(0, 160)}
        keywords={`${product.name}, ${product.category.name}, marketplace, online shopping`}
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
        {/* Breadcrumb Navigation */}
        <nav className="text-sm mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="text-blue-500 hover:text-blue-700">Home</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link href={`/category/${product.category.slug}`} className="text-blue-500 hover:text-blue-700">
                {product.category.name}
              </Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4 mb-6 md:mb-0">
            <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
              {product.image_url ? (
                <div className="relative h-full w-full">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <span className="text-gray-400">No image available</span>
              )}
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Sold by <span className="font-semibold">{product.seller.full_name}</span>
            </p>
            <div className="flex flex-col mb-4">
              <div className="flex items-center mb-2">
                <div className="mr-4">
                  {taxInfo ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-xl">{formatCurrency(taxInfo.price_with_tax)}</span>
                      {taxInfo.price_without_tax !== taxInfo.price_with_tax && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(taxInfo.price_without_tax)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="font-bold text-xl">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              {/* Tax Information */}
              {taxInfo && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <h4 className="text-sm font-semibold mb-1">Tax Information</h4>
                  <div className="text-xs space-y-1">
                    <p>Tax Rate: {formatTaxPercentage(taxInfo.tax_percentage)}</p>
                    <p>Tax Amount: {formatCurrency(taxInfo.tax_amount)}</p>
                    {taxInfo.cgst_amount > 0 && <p>CGST: {formatCurrency(taxInfo.cgst_amount)}</p>}
                    {taxInfo.sgst_amount > 0 && <p>SGST: {formatCurrency(taxInfo.sgst_amount)}</p>}
                    {taxInfo.igst_amount > 0 && <p>IGST: {formatCurrency(taxInfo.igst_amount)}</p>}
                    {taxInfo.hsn_code && <p>HSN Code: {taxInfo.hsn_code}</p>}
                    <p className="font-medium">
                      {taxInfo.is_tax_inclusive ? 'Price is inclusive of all taxes' : 'Price is exclusive of taxes'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* State Selection for Tax Calculation */}
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="buyerState">
                  Your State (for tax calculation)
                </label>
                <select
                  id="buyerState"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
                {taxLoading && <p className="text-xs text-gray-500 mt-1">Calculating taxes...</p>}
                {taxError && <p className="text-xs text-red-500 mt-1">{taxError}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  className="bg-gray-200 px-3 py-1 rounded-l"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  className="w-16 text-center border-t border-b border-gray-200 py-1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <button
                  className="bg-gray-200 px-3 py-1 rounded-r"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Product Description</h3>
              <div className="text-gray-600 text-sm">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
